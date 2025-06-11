import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Processing...</span>
        <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full progress-bar transition-all duration-300 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundSize: '200% 100%'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;