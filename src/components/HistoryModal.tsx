import React from 'react';
import { X, Download, Trash2, Calendar } from 'lucide-react';
import { useImages } from '../hooks/useImages';
import toast from 'react-hot-toast';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const { images, loading, deleteImage } = useImages();

  if (!isOpen) return null;

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(downloadUrl);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(id);
        toast.success('Image deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Image History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No images processed yet</p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Process Your First Image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="glass-card p-4">
                  <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                    {image.processed_url ? (
                      <img
                        src={image.processed_url}
                        alt="Processed"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={image.original_url}
                        alt="Original"
                        className="w-full h-full object-cover opacity-50"
                      />
                    )}
                    {!image.processed_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <p className="text-sm text-gray-300">Processing...</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-xs text-gray-400 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(image.created_at)}
                  </div>

                  <div className="flex space-x-2">
                    {image.processed_url && (
                      <button
                        onClick={() => handleDownload(
                          image.processed_url!,
                          `backsnap-${image.id}.png`
                        )}
                        className="flex-1 btn-primary py-2 text-sm flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="btn-secondary py-2 px-3 text-sm flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;