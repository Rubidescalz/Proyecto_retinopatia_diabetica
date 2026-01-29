
// Backend devuelve: 'Sin RD', 'RD Temprana', 'RD Avanzada'

export const SEVERITY_CONFIG = {
  'Sin RD': {
    color: 'text-green-600 bg-green-50 border-green-200',
    bgGradient: 'from-green-50 to-emerald-50',
    icon: 'CheckCircle',
    priority: 'low',
    description: 'No se detectaron signos de retinopatía diabética'
  },
  'RD Temprana': {
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    bgGradient: 'from-yellow-50 to-amber-50',
    icon: 'AlertTriangle',
    priority: 'medium',
    description: 'Retinopatía diabética en etapa temprana/moderada'
  },
  'RD Avanzada': {
    color: 'text-red-600 bg-red-50 border-red-200',
    bgGradient: 'from-red-50 to-rose-50',
    icon: 'AlertTriangle',
    priority: 'high',
    description: 'Retinopatía diabética severa o proliferativa'
  }
};

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  MAX_SIZE_MB: 10
};

export const IMAGE_LABELS = {
  original: 'Imagen Original',
  preprocessed: 'Imagen Preprocesada',
  processed: 'Imagen Preprocesada',  
  gradcam: 'Grad-CAM (Mapa de Atención)'
};

export const ATTENTION_THRESHOLDS = {
  HIGH: 0.7,
  MEDIUM: 0.4,
  LOW: 0.0
};

// Configuración de TTA
export const TTA_CONFIG = {
  ENABLED_DEFAULT: true,
  N_AUGMENTATIONS: 15,
  DESCRIPTION: 'Test-Time Augmentation mejora la precisión (+1-2%) pero toma más tiempo'
};