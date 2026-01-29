import tensorflow as tf
from tensorflow import keras
import os
import logging

logger = logging.getLogger(__name__)


# CARGADOR DE MODELO

class ModelLoader:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
    
    def load(self):
        """Carga el modelo al iniciar"""
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Modelo no encontrado en: {self.model_path}")
            
            logger.info(f"Cargando modelo desde: {self.model_path}")
            self.model = keras.models.load_model(self.model_path)
            logger.info("✓ Modelo cargado exitosamente")
            
            return self.model
        
        except Exception as e:
            logger.error(f"Error cargando modelo: {str(e)}")
            raise
    
    def get_model(self):
        """Retorna el modelo cargado"""
        if self.model is None:
            raise RuntimeError("Modelo no cargado. Ejecuta load() primero.")
        return self.model