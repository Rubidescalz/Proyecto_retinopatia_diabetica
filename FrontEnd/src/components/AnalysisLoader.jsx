import React, { useState, useEffect } from 'react';
import { Brain, Zap, Eye, Activity } from 'lucide-react';

const AnalysisLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { 
      icon: Brain, 
      text: 'Inicializando modelo de IA...', 
      color: 'from-blue-500 to-purple-500',
      bg: 'from-blue-50 to-purple-50' 
    },
    { 
      icon: Eye, 
      text: 'Procesando imagen retinal...', 
      color: 'from-purple-500 to-pink-500',
      bg: 'from-purple-50 to-pink-50' 
    },
    { 
      icon: Zap, 
      text: 'Aplicando algoritmo CLAHE...', 
      color: 'from-pink-500 to-red-500',
      bg: 'from-pink-50 to-red-50' 
    },
    { 
      icon: Activity, 
      text: 'Generando mapa Grad-CAM...', 
      color: 'from-red-500 to-orange-500',
      bg: 'from-red-50 to-orange-50' 
    },
    { 
      icon: Brain, 
      text: 'Finalizando análisis...', 
      color: 'from-orange-500 to-yellow-500',
      bg: 'from-orange-50 to-yellow-50' 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [steps.length]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Animated Icon */}
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${steps[currentStep].bg} flex items-center justify-center relative`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping" />
            <CurrentIcon className={`w-10 h-10 bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent animate-pulse`} />
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index === currentStep
                      ? `bg-gradient-to-r ${steps[currentStep].color}`
                      : index < currentStep
                      ? 'bg-green-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Analizando Imagen
            </h3>
            <p className={`text-sm bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent font-medium`}>
              {steps[currentStep].text}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${steps[currentStep].color} transition-all duration-1500`}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Fun Fact */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-600">
              💡 <strong>¿Sabías que?</strong> Grad-CAM resalta las regiones más importantes 
              para el diagnóstico, ayudando a los médicos a entender las decisiones de la IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoader;