import React from 'react';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClass = sizes[size] || sizes.md;
  
  return (
    <div className={`animate-spin rounded-full border-t-2 border-primary-500 ${sizeClass} ${className}`}>
      <div className="sr-only">Loading...</div>
    </div>
  );
};

export default LoadingSpinner; 