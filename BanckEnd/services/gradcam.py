import tensorflow as tf
import numpy as np
import cv2

# GRAD-CAM

def build_gradcam_model(original_model):
    try:
        print("Construyendo modelo Grad-CAM...")

        # Buscar EfficientNet
        efficientnet_layer = None
        for layer in original_model.layers:
            if 'efficientnet' in layer.name.lower():
                efficientnet_layer = layer
                break

        if efficientnet_layer is None:
            raise ValueError("No se encontró EfficientNet")

        # Crear modelo funcional
        inputs = tf.keras.Input(shape=(224, 224, 3))
        x = efficientnet_layer(inputs)
        features = x  # Output de EfficientNet (última conv)

        # Pasar por las demás capas
        for layer in original_model.layers[1:]:
            if 'efficientnet' not in layer.name.lower():
                x = layer(x)

        gradcam_model = tf.keras.Model(inputs=inputs, outputs=[features, x])
        print("Modelo Grad-CAM construido exitosamente")

        return gradcam_model

    except Exception as e:
        print(f"Error construyendo modelo Grad-CAM: {e}")
        return None


def make_gradcam_heatmap(img_array, original_model, pred_index=None):
    
    try:
        # Construir modelo
        gradcam_model = build_gradcam_model(original_model)
        if gradcam_model is None:
            raise ValueError("No se pudo construir modelo Grad-CAM")

        # Predecir si no se especifica clase
        if pred_index is None:
            predictions = original_model.predict(img_array, verbose=0)
            pred_index = tf.argmax(predictions[0])

        # Calcular gradientes
        with tf.GradientTape() as tape:
            features, preds = gradcam_model(img_array)
            class_channel = preds[:, pred_index]

        grads = tape.gradient(class_channel, features)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        # Generar heatmap
        features = features[0]
        heatmap = features @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # Normalizar
        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)

        return heatmap.numpy()

    except Exception as e:
        print(f"Error generando Grad-CAM: {e}")
        raise


def overlay_heatmap(img, heatmap, alpha=0.5):
    """Superpone heatmap sobre imagen"""
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    superimposed = cv2.addWeighted(img, 1-alpha, heatmap, alpha, 0)
    return superimposed