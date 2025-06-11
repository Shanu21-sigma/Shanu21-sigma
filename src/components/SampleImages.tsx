import React from 'react';
import { Download } from 'lucide-react';

interface SampleImageProps {
  title: string;
  originalUrl: string;
  processedUrl: string;
  onTryThis: () => void;
}

const SampleImage: React.FC<SampleImageProps> = ({ 
  title, 
  originalUrl, 
  processedUrl, 
  onTryThis 
}) => {
  return (
    <div className="glass-card p-6 group hover:scale-105 transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-2">Before</p>
          <img
            src={originalUrl}
            alt={`${title} - Original`}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-2">After</p>
          <img
            src={processedUrl}
            alt={`${title} - Processed`}
            className="w-full h-32 object-cover rounded-lg"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
      </div>
      
      <button
        onClick={onTryThis}
        className="w-full btn-secondary text-sm py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        Try Similar Image
      </button>
    </div>
  );
};

const SampleImages: React.FC = () => {
  const samples = [
    {
      title: 'Portrait',
      originalUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      processedUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Product',
      originalUrl: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
      processedUrl: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Object',
      originalUrl: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400',
      processedUrl: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const handleTryThis = () => {
    const element = document.getElementById('image-processor');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="samples" className="py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Check out these sample results to see the quality of our AI background removal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {samples.map((sample, index) => (
            <SampleImage
              key={index}
              title={sample.title}
              originalUrl={sample.originalUrl}
              processedUrl={sample.processedUrl}
              onTryThis={handleTryThis}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleTryThis}
            className="btn-primary text-lg px-8 py-4"
          >
            Try Your Own Image
          </button>
        </div>
      </div>
    </section>
  );
};

export default SampleImages;