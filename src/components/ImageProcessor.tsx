import React, { useState, useCallback } from 'react';
import { Download, RotateCcw, Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import { processImage } from '../services/clipdropApi';
import { useAuth } from '../hooks/useAuth';
import { useImages } from '../hooks/useImages';
import { useRateLimit } from '../hooks/useRateLimit';
import DropZone from './DropZone';
import ImagePreview from './ImagePreview';
import ProgressBar from './ProgressBar';
import AuthModal from './AuthModal';

const ImageProcessor: React.FC = () => {
  const { user } = useAuth();
  const { createImageRecord, updateImageRecord, uploadToStorage } = useImages();
  const { checkRateLimit } = useRateLimit();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [, setCurrentImageRecord] = useState<any>(null);

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
      setCurrentImageRecord(null);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check rate limit
    const canProceed = await checkRateLimit();
    if (!canProceed) {
      toast.error('You have reached your daily limit of 20 background removals. Please try again tomorrow.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Upload original image to storage
      const originalUrl = await uploadToStorage(selectedFile, 'originals');
      
      // Create image record in database
      const imageRecord = await createImageRecord(originalUrl);
      setCurrentImageRecord(imageRecord);

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

      // Process image with Clipdrop
      const processedBlob = await processImage(selectedFile);
      
      // Convert blob to file for upload
      const processedFile = new File([processedBlob], 'processed.png', { type: 'image/png' });
      const processedUrl = await uploadToStorage(processedFile, 'processed');
      
      // Update image record with processed URL
      await updateImageRecord(imageRecord.id, processedUrl);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setProcessedImage(processedUrl);
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
    setCurrentImageRecord(null);
  };

  return (
    <>
      <section id="image-processor" className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Upload Your Image
            </h2>

            {!user && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-center text-blue-300">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="underline hover:no-underline"
                  >
                    Sign in
                  </button>
                  {' '}to remove backgrounds and save your processed images
                </p>
              </div>
            )}

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

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default ImageProcessor;