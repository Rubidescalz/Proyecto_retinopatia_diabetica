import numpy as np
import time
import psutil
import os
from services.preprocessing import preprocess_retina_image_from_bytes
from services.gradcam import make_gradcam_heatmap, overlay_heatmap
from config import CLASS_NAMES

# PREDICCIÓN CON Y SIN TTA

def predict_with_metrics(image_bytes: bytes, model, use_tta=False, n_aug=15):
    
    
    # Métricas inicio
    process = psutil.Process(os.getpid())
    ram_before = process.memory_info().rss / 1024**2
    cpu_before = psutil.cpu_percent(interval=0.1)
    start_time = time.time()

    # Preprocesar
    processed_img, original_img = preprocess_retina_image_from_bytes(image_bytes)

    if processed_img is None:
        raise ValueError("No se pudo procesar la imagen")

    # Preparar para visualización
    preprocessed_vis = (processed_img - processed_img.min()) / (processed_img.max() - processed_img.min())
    preprocessed_vis = (preprocessed_vis * 255).astype(np.uint8)

    img_array = np.expand_dims(processed_img, axis=0)

    # Predicción con o sin TTA
    if use_tta:
        print(f"Usando TTA con {n_aug} augmentations...")
        predictions = []
        for _ in range(n_aug):
            pred = model.predict(img_array, verbose=0)
            predictions.append(pred[0])
        prediction = np.mean(predictions, axis=0)
    else:
        prediction = model.predict(img_array, verbose=0)[0]

    predicted_class = np.argmax(prediction)
    confidence = prediction[predicted_class] * 100

    # Métricas finales
    inference_time = (time.time() - start_time) * 1000
    ram_after = process.memory_info().rss / 1024**2
    cpu_after = psutil.cpu_percent(interval=0.1)
    ram_used = ram_after - ram_before
    cpu_used = (cpu_before + cpu_after) / 2

    # Grad-CAM
    print("Generando Grad-CAM...")
    try:
        heatmap = make_gradcam_heatmap(img_array, model, predicted_class)
        gradcam_img = overlay_heatmap(preprocessed_vis, heatmap)
        grad_cam_success = True
        print("Grad-CAM generado exitosamente")
    except Exception as e:
        print(f"ERROR en Grad-CAM: {e}")
        gradcam_img = preprocessed_vis
        grad_cam_success = False

    # Resultados
    return {
        'predicted_class': int(predicted_class),
        'class_name': CLASS_NAMES[predicted_class],
        'confidence': float(confidence),
        'probabilities': prediction.tolist(),
        'inference_time_ms': float(inference_time),
        'ram_used_mb': float(ram_used),
        'cpu_usage_percent': float(cpu_used),
        'original_image': original_img,
        'preprocessed_image': preprocessed_vis,
        'gradcam_image': gradcam_img,
        'gradcam_success': grad_cam_success
    }