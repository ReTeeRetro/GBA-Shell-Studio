import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const ExampleAiImages: React.FC = () => {
  const images = useMemo(() => {
    const allImages = [
      'https://godsaftigochdryg.se/gbashellstudio/1.png',
      'https://godsaftigochdryg.se/gbashellstudio/2.png',
      'https://godsaftigochdryg.se/gbashellstudio/3.png',
      'https://godsaftigochdryg.se/gbashellstudio/4.png',
      'https://godsaftigochdryg.se/gbashellstudio/5.png',
      'https://godsaftigochdryg.se/gbashellstudio/6.png',
      'https://godsaftigochdryg.se/gbashellstudio/7.png',
      'https://godsaftigochdryg.se/gbashellstudio/8.png',
      'https://godsaftigochdryg.se/gbashellstudio/9.png',
      'https://godsaftigochdryg.se/gbashellstudio/10.png'
    ];
    
    // Shuffle array and take 3
    return allImages.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  }, [selectedIndex, images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, nextImage, prevImage]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  return (
    <>
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide flex items-center gap-2">
          <ImageIcon size={16} className="text-purple-600" />
          Example AI images
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="group relative aspect-square rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(index)}
              title="Click to view full size"
            >
              <img
                src={src}
                alt={`AI Generated Example ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-left">
          <p className="text-slate-900 font-medium text-sm">
            Share yours with #gbashellstudio
          </p>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-50"
            title="Close (Esc)"
          >
            <X size={32} />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden sm:flex"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-50 hidden sm:flex"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={40} />
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-full max-h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} 
          >
            <img
              src={images[selectedIndex]}
              alt={`Example ${selectedIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white/60 text-sm mt-4 font-medium tracking-wider">
              {selectedIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};