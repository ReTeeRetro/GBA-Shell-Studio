import React, { useMemo } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export const ExampleAiImages: React.FC = () => {
  const images = useMemo(() => {
    const allImages = [
      'https://godsaftigochdryg.se/gbashellstudio/1.png',
      'https://godsaftigochdryg.se/gbashellstudio/2.png',
      'https://godsaftigochdryg.se/gbashellstudio/3.png',
      'https://godsaftigochdryg.se/gbashellstudio/4.png',
      'https://godsaftigochdryg.se/gbashellstudio/5.png',
      'https://godsaftigochdryg.se/gbashellstudio/6.png'
    ];
    
    // Shuffle array and take 3
    return allImages.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  return (
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
            onClick={() => window.open(src, '_blank')}
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
  );
};