import React, { useEffect, useRef } from 'react';
import { ColorOption } from '../types';
import { getButtonColorStyle } from '../utils/shopUtils';
import { Palette } from 'lucide-react';

const HexInput = ({ color, onColorChange, className = "" }: { color: ColorOption, onColorChange: (c: ColorOption) => void, className?: string }) => {
  const [value, setValue] = React.useState(color.hex);

  React.useEffect(() => {
    setValue(color.hex);
  }, [color.hex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    if (/^#[0-9A-Fa-f]{6}$/.test(newVal)) {
      onColorChange({ ...color, hex: newVal });
    }
  };

  const handleBlur = () => {
    let newVal = value;
    if (!newVal.startsWith('#')) {
        if (/^[0-9A-Fa-f]{6}$/.test(newVal) || /^[0-9A-Fa-f]{3}$/.test(newVal)) {
            newVal = '#' + newVal;
        }
    }
    if (/^#[0-9A-Fa-f]{3}$/.test(newVal)) {
        newVal = '#' + newVal[1] + newVal[1] + newVal[2] + newVal[2] + newVal[3] + newVal[3];
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(newVal)) {
       setValue(newVal);
       onColorChange({ ...color, hex: newVal });
    } else {
       setValue(color.hex);
    }
  };

  return (
    <input 
      type="text" 
      value={value} 
      onChange={handleChange}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      className={`w-16 text-[10px] font-bold uppercase tracking-wider text-center border border-slate-200 dark:border-slate-600 rounded px-1 py-0.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white dark:bg-slate-800 transition-colors shadow-sm ${className}`}
      spellCheck={false}
    />
  );
};

interface FloatingColorPickerProps {
  position: { x: number, y: number };
  options: ColorOption[];
  selectedColor: ColorOption;
  onSelect: (color: ColorOption) => void;
  onClose: () => void;
  title: string;
  shopMode: string | null;
}

export const FloatingColorPicker: React.FC<FloatingColorPickerProps> = ({
  position,
  options,
  selectedColor,
  onSelect,
  onClose,
  title,
  shopMode
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const areColorsEqual = (a: ColorOption, b: ColorOption) => {
    if (a.id === 'custom' || b.id === 'custom') {
      return a.hex.toLowerCase() === b.hex.toLowerCase();
    }
    return a.id === b.id;
  };

  return (
    <div 
      ref={ref}
      className="absolute z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 w-72 animate-in fade-in zoom-in-95 duration-200"
      style={{
        left: Math.min(position.x, window.innerWidth - 300),
        top: Math.min(position.y, window.innerHeight - 300)
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title} Color</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {options.map((color) => {
          const isSelected = areColorsEqual(selectedColor, color);
          const style = color.hex.startsWith('url') ? { background: 'conic-gradient(#33268E 0deg 72deg, #09826D 72deg 144deg, #DAB10F 144deg 216deg, #BA0E39 216deg 288deg, #71AA21 288deg 360deg)' } : getButtonColorStyle(color);
          
          return (
            <button
              key={color.id}
              onClick={() => onSelect(color)}
              className="group relative flex flex-col items-center gap-1"
              title={color.name}
            >
              <div 
                className={`
                  w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 relative
                  ${isSelected ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110 shadow-md' : 'border border-slate-200 dark:border-slate-600 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-400'}
                `}
                style={style}
              >
                {color.isTranslucent && (
                  <div className="absolute inset-0 rounded-full bg-white/20 dark:bg-white/10 mix-blend-overlay pointer-events-none" />
                )}
              </div>
            </button>
          );
        })}
        
        {!shopMode && (
          <div className="relative group flex flex-col items-center gap-1" title="Custom Color">
            <div 
              className={`
                w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 overflow-hidden relative
                ${selectedColor.id === 'custom' ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110 shadow-md' : 'border border-slate-200 dark:border-slate-600 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-400'}
              `}
              style={{ 
                background: selectedColor.id === 'custom' 
                  ? selectedColor.hex 
                  : 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FF8A00 51.43deg, #FFE500 102.86deg, #00FF00 154.29deg, #00A3FF 205.71deg, #0500FF 257.14deg, #AD00FF 308.57deg, #FF00C7 360deg)' 
              }}
            >
              <input 
                type="color" 
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 opacity-0 cursor-pointer"
                value={selectedColor.id === 'custom' ? selectedColor.hex : '#ffffff'}
                onChange={(e) => onSelect({ id: 'custom', name: 'Custom', hex: e.target.value })}
              />
              
              <div className="pointer-events-none flex items-center justify-center">
                 {selectedColor.id !== 'custom' && (
                    <Palette size={20} className="text-white drop-shadow-md" strokeWidth={2} />
                 )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {selectedColor.id === 'custom' && !shopMode && (
        <div className="mt-4 flex justify-center">
          <HexInput color={selectedColor} onColorChange={onSelect} />
        </div>
      )}
    </div>
  );
};
