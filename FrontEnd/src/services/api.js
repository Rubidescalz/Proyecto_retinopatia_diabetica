const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  /**
   * Analiza imagen con el nuevo endpoint /predict
   * @param {File} file - Archivo de imagen
   * @param {boolean} useTTA - Usar Test-Time Augmentation (default: true)
   * @param {number} nAug - Número de augmentations (default: 15)
   */
  async analyzeImage(file, useTTA = true, nAug = 15) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Nuevo endpoint con query params
      const url = `${API_BASE_URL}/predict?use_tta=${useTTA}&n_aug=${nAug}`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al analizar la imagen');
      }
      
      const data = await response.json();
      
      // Adaptar respuesta al formato que espera el frontend
      return this.transformResponse(data);
      
    } catch (error) {
      console.error('Error en análisis:', error);
      throw error;
    }
  }

  /**
   * Transforma la respuesta del backend al formato esperado por el frontend
   */
  transformResponse(backendResponse) {
    return {
      // Mantener compatibilidad con el frontend actual
      predicted_class: backendResponse.prediction.class_name,
      confidence: backendResponse.prediction.confidence / 100, // Backend envía 0-100, frontend espera 0-1
      precision_percentage: backendResponse.prediction.confidence,
      
      // Transformar probabilidades
      all_probabilities: Object.fromEntries(
        Object.entries(backendResponse.prediction.probabilities).map(
          ([key, value]) => [key, value / 100] // Convertir de % a decimal
        )
      ),
      
      // Imágenes (ya vienen en formato correcto)
      images: backendResponse.images,
      
      // Datos adicionales del nuevo backend
      metrics: backendResponse.metrics,
      gradcam_status: backendResponse.gradcam_status,
      
      // Para debugging
      _raw: backendResponse
    };
  }

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error('API no disponible');
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error('API no disponible');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting API status:', error);
      throw error;
    }
  }
}

export default new ApiService();