import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
        isDragOver 
          ? 'border-blue-500 bg-blue-500/10 scale-105' 
          : 'border-gray-600 hover:border-gray-500'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-gray-700/50 rounded-full">
          <Upload className="w-12 h-12 text-gray-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Drop your image here</h3>
          <p className="text-gray-400 mb-4">
            or click to browse files
          </p>
          
          <label className="btn-primary cursor-pointer inline-flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Choose Image
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>Supports: JPG, PNG</p>
          <p>Max size: 10MB • Max resolution: 25MP</p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;