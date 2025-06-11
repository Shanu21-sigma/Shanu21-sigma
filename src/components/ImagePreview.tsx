import React from 'react';
import { Loader2 } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  processedImage?: string | null;
  isProcessing?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  file, 
  processedImage, 
  isProcessing = false 
}) => {
  const originalImageUrl = React.useMemo(() => {
    return URL.createObjectURL(file);
  }, [file]);

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(originalImageUrl);
    };
  }, [originalImageUrl]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Original Image */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">Original</h3>
        <div className="glass-card p-4">
          <img
            src={originalImageUrl}
            alt="Original"
            className="w-full h-64 object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Processed Image */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">
          {isProcessing ? 'Processing...' : 'Result'}
        </h3>
        <div className="glass-card p-4 relative">
          {isProcessing ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-gray-400">Removing background...</p>
              </div>
            </div>
          ) : processedImage ? (
            <img
              src={processedImage}
              alt="Processed"
              className="w-full h-64 object-contain rounded-lg"
              style={{ backgroundColor: 'transparent' }}
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <p className="text-gray-500">Processed image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;