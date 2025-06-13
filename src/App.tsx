import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageProcessor from './components/ImageProcessor';
import SampleImages from './components/SampleImages';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#374151',
            color: '#fff',
            border: '1px solid #4b5563',
          },
        }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <ImageProcessor />
        <SampleImages />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;