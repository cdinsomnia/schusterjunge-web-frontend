import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

type ImageCategory = 'Live' | 'Studio' | 'Alle';

interface Image {
  id: number;
  src: string;
  alt: string;
  category: Exclude<ImageCategory, 'Alle'>;
}

const images: Image[] = [
  {
    id: 1,
    src: '/upload/juni/1.png',
    alt: 'Schusterjunge – Juni 2025',
    category: 'Studio'
  },
  {
    id: 2,
    src: '/upload/juni/2.png',
    alt: 'Schusterjunge – Juni 2025',
    category: 'Studio'
  },
  {
    id: 3,
    src: '/upload/juni/3.png',
    alt: 'Schusterjunge – Juni 2025',
    category: 'Studio'
  }
];

export function VeranstalterKit() {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>('Alle');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const handleDownload = async (image: Image) => {
    try {
      const response = await fetch(image.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `schusterjunge-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Fehler beim Herunterladen:', error);
    }
  };

  const filteredImages = selectedCategory === 'Alle' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black/50 to-black py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-dela text-4xl sm:text-5xl mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Veranstalter-Kit
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Hier findest du hochwertige Bilder für deine Veranstaltungsankündigungen. 
            Fahre mit der Maus über ein Bild und klicke auf "Herunterladen", um mit dem Herunterladen zu beginnen.
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          {(['Alle', 'Live', 'Studio'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedCategory === category 
                  ? 'bg-white text-black' 
                  : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-400">
                <div className="relative w-full h-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-300
                      ${loadedImages.has(image.id) 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-95'
                      }
                      group-hover:scale-105`}
                    onClick={() => setSelectedImage(image)}
                    onLoad={() => handleImageLoad(image.id)}
                    loading="lazy"
                    decoding="async"
                    fetchPriority={image.id === 1 ? "high" : "low"}
                  />
                  {!loadedImages.has(image.id) && (
                    <div className="absolute inset-0 bg-white/5 animate-pulse" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors transform hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image);
                    }}
                    aria-label="Bild herunterladen"
                  >
                    <FaDownload className="text-white" />
                    <span className="text-white">Herunterladen</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto rounded-lg"
              loading="eager"
              decoding="sync"
            />
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Bild schließen"
            >
              <span className="text-white text-2xl">&times;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 