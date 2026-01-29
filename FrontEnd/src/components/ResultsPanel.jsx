import React from 'react';
import { Activity, Zap, FileText, Clock, Cpu, HardDrive } from 'lucide-react';
import Card from './ui/Card';
import DiagnosisCard from './DiagnosisCard';

const ResultsPanel = ({ results }) => {
  if (!results) {
    return (
      <Card title="Resultados" icon={Activity}>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Los resultados aparecerán aquí después del análisis
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Resultados" icon={Activity}>
      <div className="space-y-6">
        <DiagnosisCard result={results} />

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center text-lg">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Probabilidades por Clase
          </h4>
          {Object.entries(results.all_probabilities || {}).map(([className, prob], index) => {
            const isHighest = Math.max(...Object.values(results.all_probabilities || {})) === prob;
            const colors = [
              'from-green-400 to-green-600',
              'from-yellow-400 to-yellow-600',
              'from-red-400 to-red-600'
            ];

            const percentageValue = (prob * 100).toFixed(2); 

            return (
              <div key={className} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isHighest ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>
                    {className}
                  </span>
                  <span className={`text-sm font-bold ${isHighest ? 'text-gray-800' : 'text-gray-600'}`}>
                    {percentageValue}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2 bg-gradient-to-r ${colors[index]} rounded-full transition-all duration-500 ${
                      isHighest ? 'shadow-md' : ''
                    }`}
                    style={{ width: `${prob * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Métricas de rendimiento */}
        {results.metrics && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-700 flex items-center text-sm">
              <Zap className="w-4 h-4 mr-2 text-purple-600" />
              Métricas de Análisis
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-gray-500">Tiempo</p>
                  <p className="font-semibold text-gray-700">
                    {results.metrics.inference_time_ms.toFixed(0)} ms
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <HardDrive className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-gray-500">RAM</p>
                  <p className="font-semibold text-gray-700">
                    {results.metrics.ram_used_mb.toFixed(1)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Cpu className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-gray-500">CPU</p>
                  <p className="font-semibold text-gray-700">
                    {results.metrics.cpu_usage_percent.toFixed(1)}%
                  </p>
                </div>
              </div>
              {results.metrics.tta_enabled && (
                <div className="flex items-center space-x-2 text-xs">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-gray-500">TTA</p>
                    <p className="font-semibold text-gray-700">
                      {results.metrics.n_augmentations} aug
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </Card>
  );
};

export default ResultsPanel;