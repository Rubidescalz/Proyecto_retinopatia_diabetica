import React from 'react';
import Card from './ui/Card';
import { IMAGE_LABELS } from '../utils/constants';

const ImageVisualization = ({ images }) => {
  if (!images) return null;

  const renderImage = (src, key) => {
    const imageStyle = key === 'processed' ? {
      filter: 'contrast(1.2) brightness(1.1)',
      backgroundColor: '#f3f4f6' 
    } : {};

    return (
      <div className="relative group overflow-hidden rounded-xl">
        <img
          src={src}
          alt={IMAGE_LABELS[key] || key}
          style={imageStyle}
          className={`w-full h-80 object-contain border border-gray-200 transition-all duration-300 group-hover:scale-105 ${
            key === 'processed' ? 'bg-gray-100' : 'bg-gray-50'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </div>
    );
  };

  return (
    <Card title="Visualizaciones">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(images).map(([key, src]) => (
          <div key={key} className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-center">
              {IMAGE_LABELS[key] || key}
            </h3>
            {renderImage(src, key)}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ImageVisualization;