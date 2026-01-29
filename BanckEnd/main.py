from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import logging

from config import MODEL_PATH, CLASS_NAMES, DEFAULT_TTA, DEFAULT_N_AUG
from models.model_loader import ModelLoader
from services.prediction import predict_with_metrics
from utils.image_utils import numpy_to_base64, add_data_uri_prefix


# CONFIGURACIÓN LOGGING
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# FASTAPI APP
app = FastAPI(
    title="Retinopathy Diabetic Severity API",
    description="API para clasificación de severidad de retinopatía diabética con Grad-CAM",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# CARGA DE MODELO AL INICIAR
model_loader = ModelLoader(MODEL_PATH)

@app.on_event("startup")
async def startup_event():
    """Carga el modelo al iniciar la app"""
    try:
        model_loader.load()
        logger.info("Servidor iniciado correctamente")
    except Exception as e:
        logger.error(f"Error al iniciar servidor: {str(e)}")
        raise



# ENDPOINTS

@app.get("/")
async def root():
    """Endpoint raíz - Info de la API"""
    return {
        "message": "API de Clasificación de Retinopatía Diabética",
        "version": "2.0.0",
        "status": "active",
        "model_loaded": model_loader.model is not None,
        "classes": CLASS_NAMES
    }


@app.get("/health")
async def health_check():
    """Health check"""
    return {
        "status": "healthy",
        "model_status": "loaded" if model_loader.model is not None else "not_loaded"
    }


@app.post("/predict")
async def predict_image(
    file: UploadFile = File(...),
    use_tta: bool = Query(DEFAULT_TTA, description="Usar Test-Time Augmentation"),
    n_aug: int = Query(DEFAULT_N_AUG, description="Número de augmentations (si TTA=True)")
):
    
    
    try:
        # Validar modelo cargado
        if model_loader.model is None:
            raise HTTPException(status_code=503, detail="Modelo no disponible")
        
        # Validar tipo de archivo
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
        
        # Leer imagen
        image_bytes = await file.read()
        
        # Validar tamaño (máx 10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Imagen demasiado grande (máximo 10MB)")
        
        logger.info(f"Procesando imagen: {file.filename} | TTA: {use_tta}")
        
        # Realizar predicción
        result = predict_with_metrics(
            image_bytes,
            model_loader.get_model(),
            use_tta=use_tta,
            n_aug=n_aug
        )
        
        # Convertir imágenes a base64
        original_b64 = add_data_uri_prefix(numpy_to_base64(result['original_image']))
        preprocessed_b64 = add_data_uri_prefix(numpy_to_base64(result['preprocessed_image']))
        gradcam_b64 = add_data_uri_prefix(numpy_to_base64(result['gradcam_image']))
        
        # Construir respuesta
        response = {
            "success": True,
            "prediction": {
                "class_index": result['predicted_class'],
                "class_name": result['class_name'],
                "confidence": result['confidence'],
                "probabilities": {
                    CLASS_NAMES[i]: float(result['probabilities'][i] * 100)
                    for i in range(len(CLASS_NAMES))
                }
            },
            "metrics": {
                "inference_time_ms": result['inference_time_ms'],
                "ram_used_mb": result['ram_used_mb'],
                "cpu_usage_percent": result['cpu_usage_percent'],
                "tta_enabled": use_tta,
                "n_augmentations": n_aug if use_tta else 0
            },
            "images": {
                "original": original_b64,
                "preprocessed": preprocessed_b64,
                "gradcam": gradcam_b64
            },
            "gradcam_status": "success" if result['gradcam_success'] else "failed"
        }
        
        logger.info(f"Predicción exitosa: {result['class_name']} ({result['confidence']:.2f}%)")
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"✗ Error al procesar imagen: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


# EJECUTAR
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)