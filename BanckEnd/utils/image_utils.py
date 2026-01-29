import base64
from io import BytesIO
from PIL import Image
import numpy as np

# UTILIDADES PARA IMÁGENES

def numpy_to_base64(img_array: np.ndarray) -> str:
    """Convierte array numpy a base64"""
    pil_img = Image.fromarray(img_array)
    buf = BytesIO()
    pil_img.save(buf, format="PNG")
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')


def add_data_uri_prefix(base64_str: str) -> str:
    """Agrega prefijo data:image para usar en HTML/React"""
    return f"data:image/png;base64,{base64_str}"