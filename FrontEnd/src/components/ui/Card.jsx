import React from 'react';

const Card = ({ 
  children, 
  title, 
  icon: Icon,
  className = '',
  headerClassName = '',
  bodyClassName = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${className}`}>
      {(title || Icon) && (
        <div className={`flex items-center p-6 pb-4 ${headerClassName}`}>
          {Icon && <Icon className="w-6 h-6 text-blue-600 mr-3" />}
          {title && <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>}
        </div>
      )}
      <div className={`p-6 ${title || Icon ? 'pt-2' : ''} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;