import cv2
import numpy as np
import tensorflow as tf
from config import IMG_SIZE

# PREPROCESAMIENTO 

def preprocess_retina_image_from_bytes(image_bytes: bytes):
    
    # Decodificar bytes a array numpy
    img_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    if img is None:
        return None, None

    img_original = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_rgb = img_original.copy()

    # CLAHE en cada canal
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_rgb = np.zeros_like(img_rgb)
    for i in range(3):
        enhanced_rgb[:, :, i] = clahe.apply(img_rgb[:, :, i])

    # Segmentación
    green_channel = enhanced_rgb[:, :, 1]
    _, mask = cv2.threshold(green_channel, 15, 255, cv2.THRESH_BINARY)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        mask_final = np.zeros_like(green_channel)
        cv2.fillPoly(mask_final, [largest_contour], 255)

        for i in range(3):
            enhanced_rgb[:, :, i] = cv2.bitwise_and(enhanced_rgb[:, :, i], mask_final)

        x, y, w, h = cv2.boundingRect(largest_contour)
        size = max(w, h)
        center_x = x + w // 2
        center_y = y + h // 2
        half_size = size // 2

        x_start = max(0, center_x - half_size)
        y_start = max(0, center_y - half_size)
        x_end = min(enhanced_rgb.shape[1], center_x + half_size)
        y_end = min(enhanced_rgb.shape[0], center_y + half_size)

        cropped = enhanced_rgb[y_start:y_end, x_start:x_end]
    else:
        cropped = enhanced_rgb

    resized = cv2.resize(cropped, (IMG_SIZE, IMG_SIZE))
    processed = tf.keras.applications.efficientnet.preprocess_input(resized.astype(np.float32))

    return processed, img_original