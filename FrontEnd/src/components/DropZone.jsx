import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { FILE_CONSTRAINTS } from '../utils/constants';
import Button from './ui/Button';

const DropZone = ({ file, preview, onFileSelect, onReset }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(1);
  };

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl border border-gray-200"
          />
          <button
            onClick={onReset}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600 truncate mr-4">{file?.name}</span>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {formatFileSize(file?.size)} MB
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-blue-400 bg-blue-100/50'
            : 'border-blue-300 bg-blue-50/50 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="flex flex-col items-center">
          <Camera className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {dragOver ? 'Suelta la imagen aquí' : 'Arrastra una imagen aquí'}
          </h3>
          <p className="text-gray-500 mb-4">o haz clic para seleccionar</p>
          <div className="text-sm text-gray-400">
            Formatos: JPG, PNG • Máximo: {FILE_CONSTRAINTS.MAX_SIZE_MB}MB
          </div>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default DropZone;