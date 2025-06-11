import React from 'react';
import { Sparkles, Zap, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProcessor = () => {
    const element = document.getElementById('image-processor');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="text-center py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Remove Backgrounds
          <br />
          <span className="text-4xl md:text-6xl">Instantly</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Professional AI-powered background removal in one click. 
          Perfect for e-commerce, social media, and creative projects.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button 
            onClick={scrollToProcessor}
            className="btn-primary text-lg px-8 py-4"
          >
            Try It Free
            <Sparkles className="w-5 h-5 ml-2 inline" />
          </button>
          
          <button className="btn-secondary text-lg px-8 py-4">
            View Samples
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="glass-card p-6 text-center">
            <Zap className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Process images in seconds with advanced AI</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-gray-400 text-sm">Your images are processed securely and never stored</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Professional Quality</h3>
            <p className="text-gray-400 text-sm">Studio-grade results for any image type</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;