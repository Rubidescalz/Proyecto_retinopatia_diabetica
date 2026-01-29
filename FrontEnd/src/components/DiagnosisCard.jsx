import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { SEVERITY_CONFIG } from '../utils/constants';

const DiagnosisCard = ({ result }) => {
  const config = SEVERITY_CONFIG[result.predicted_class] || SEVERITY_CONFIG['Sin RD'];
  
  const getIcon = () => {
    switch (config.icon) {
      case 'CheckCircle':
        return <CheckCircle className="w-6 h-6" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getPulseColor = () => {
    switch (result.predicted_class) {
      case 'Sin RD': return 'animate-pulse bg-green-400';
      case 'RD Temprana': return 'animate-pulse bg-yellow-400';
      case 'RD Avanzada': return 'animate-pulse bg-red-400';
      default: return 'animate-pulse bg-green-400';
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${config.color} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full rounded-full ${getPulseColor()}`} />
      </div>
      
      <div className="flex items-center justify-between relative">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-white/80 mr-4">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-bold text-xl mb-1">{result.predicted_class}</h3>
            <p className="text-sm opacity-80 font-medium">
              Confianza: {result.precision_percentage?.toFixed(2)}%
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DiagnosisCard;