import React, { useState } from 'react';
import { Eye, Upload, Brain, AlertTriangle } from 'lucide-react';

// Components
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import LoadingSpinner from './components/ui/LoadingSpinner';
import DropZone from './components/DropZone';
import ResultsPanel from './components/ResultsPanel';
import ImageVisualization from './components/ImageVisualization';
import AnalysisLoader from './components/AnalysisLoader';

// Services
import ApiService from './services/api';
import { FILE_CONSTRAINTS } from './utils/constants';

import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (selectedFile) => {
    if (selectedFile.size > FILE_CONSTRAINTS.MAX_SIZE) {
      setError(`El archivo es demasiado grande. Máximo ${FILE_CONSTRAINTS.MAX_SIZE_MB}MB.`);
      return false;
    }
    
    if (!FILE_CONSTRAINTS.ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError('Tipo de archivo no válido. Solo se permiten imágenes JPG y PNG.');
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!validateFile(selectedFile)) {
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setResults(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysisResults = await ApiService.analyzeImage(file);
      setResults(analysisResults);
    } catch (err) {
      setError(err.message || 'Error al analizar la imagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Analysis Loader Overlay */}
      {loading && <AnalysisLoader />}
      
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 animate-float">
          <Eye className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Deteccion Automatica de Retinopatía Diabética
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Detección automática con <span className="font-semibold text-blue-600">Inteligencia Artificial</span> y  <span className="font-semibold text-purple-600">Grad-CAM</span>
        </p>
        
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <Card title="Cargar Imagen" icon={Upload}>
            <DropZone
              file={file}
              preview={preview}
              onFileSelect={handleFileSelect}
              onReset={handleReset}
            />

            {file && (
              <div className="mt-6">
                <Button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Analizar Imagen
                    </>
                  )}
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Results Section */}
          <ResultsPanel results={results} />
        </div>

        {/* Image Visualization */}
        {results?.images && (
          <ImageVisualization images={results.images} />
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Detección automática de Retinopatía Diabética 
            mediante modelos de Deep Learning con 
            interpretación de resultados basada en Grad
            CAM  - JUAN DAVID ANGELES MEDINA 2025 - II  USS</p>
      </footer>
    </div>
  );
}

export default App;