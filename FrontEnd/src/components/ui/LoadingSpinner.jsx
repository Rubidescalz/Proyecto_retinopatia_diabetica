import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = '', 
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader className={`animate-spin ${sizes[size]} text-blue-600 mr-2`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;