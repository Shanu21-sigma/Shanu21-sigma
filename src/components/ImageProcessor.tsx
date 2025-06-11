import React, { useState, useCallback } from 'react';
import { Download, Loader2, RotateCcw, Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import { processImage } from '../services/clipdropApi';
import { checkRateLimit } from '../utils/rateLimit';
import DropZone from './DropZone';
import ImagePreview from './ImagePreview';
import ProgressBar from './ProgressBar';

const ImageProcessor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast.error('Please select a JPG or PNG image');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate image dimensions (25MP limit)
    const img = new Image();
    img.onload = () => {
      const megapixels = (img.width * img.height) / 1000000;
      if (megapixels > 25) {
        toast.error('Image must be less than 25 megapixels');
        return;
      }
      
      setSelectedFile(file);
      setProcessedImage(null);
      setProgress(0);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    // Check rate limit
    if (!checkRateLimit()) {
      toast.error('Rate limit exceeded. You can process up to 20 images per day. Please try again tomorrow.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const result = await processImage(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setProcessedImage(result);
        setIsProcessing(false);
        toast.success('Background removed successfully!');
      }, 500);

    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          toast.error('API rate limit exceeded. Please try again later.');
        } else if (error.message.includes('quota')) {
          toast.error('API quota exceeded. Please try again tomorrow.');
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error('Failed to process image. Please try again.');
      }
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `backsnap-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully!');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setProcessedImage(null);
    setProgress(0);
    setIsProcessing(false);
  };

  return (
    <section id="image-processor" className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Upload Your Image
          </h2>

          {!selectedFile ? (
            <DropZone onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-6">
              <ImagePreview 
                file={selectedFile} 
                processedImage={processedImage}
                isProcessing={isProcessing}
              />

              {isProcessing && (
                <ProgressBar progress={progress} />
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!processedImage && !isProcessing && (
                  <button
                    onClick={handleRemoveBackground}
                    className="btn-primary flex items-center justify-center"
                  >
                    <Scissors className="w-5 h-5 mr-2" />
                    Remove Background
                  </button>
                )}

                {processedImage && (
                  <button
                    onClick={handleDownload}
                    className="btn-primary flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PNG
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Start Over
                </button>
              </div>

              <div className="text-center text-sm text-gray-400">
                <p>File: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageProcessor;