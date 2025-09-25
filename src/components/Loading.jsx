import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-10',
    md: 'w-8 h-12',
    lg: 'w-10 h-16',
    xl: 'w-12 h-20'
  };

  const blockSize = sizes[size];

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className="flex space-x-2 items-end">
        {/* Block 1 */}
        <div 
          className={`${blockSize} rounded-xl loading-block loading-block-1 loading-glow loading-shimmer relative overflow-hidden`}
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/30 rounded-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
        </div>

        {/* Block 2 */}
        <div 
          className={`${blockSize} rounded-xl loading-block loading-block-2 loading-glow loading-shimmer relative overflow-hidden`}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/30 rounded-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
        </div>

        {/* Block 3 */}
        <div 
          className={`${blockSize} rounded-xl loading-block loading-block-3 loading-glow loading-shimmer relative overflow-hidden`}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/30 rounded-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

// Loading component with text
const Loading = ({ 
  text = 'Loading...', 
  size = 'md', 
  showText = true,
  className = '',
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center z-50">
        <LoadingSpinner size={size} />
        {showText && (
          <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size={size} />
      {showText && (
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
export { LoadingSpinner };