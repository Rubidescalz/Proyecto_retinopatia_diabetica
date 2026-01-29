import os

# Modelo
MODEL_PATH = os.path.join("modelo", "BEST_retinopathy_AUC_0.9967_ACC_0.9618_FINETUNED.h5")

# Constantes
IMG_SIZE = 224
NUM_CLASSES = 3
CLASS_NAMES = ['Sin RD', 'RD Temprana', 'RD Avanzada']

# TTA
DEFAULT_TTA = False
DEFAULT_N_AUG = 15