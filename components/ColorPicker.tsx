import React, { useState, useEffect } from 'react';
import { ColorOption } from '../types';
import { SHELL_COLORS, LENS_COLORS } from '../constants';
import { Check, ChevronDown, ChevronRight, SlidersHorizontal, Palette, Shuffle, ToggleLeft, ToggleRight } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: ColorOption;
  onSelectColor: (color: ColorOption) => void;
  dpadColor: ColorOption;
  onSelectDpadColor: (color: ColorOption) => void;
  aButtonColor: ColorOption;
  onSelectAButtonColor: (color: ColorOption) => void;
  bButtonColor: ColorOption;
  onSelectBButtonColor: (color: ColorOption) => void;
  startSelectColor: ColorOption;
  onSelectStartSelectColor: (color: ColorOption) => void;
  lButtonColor: ColorOption;
  onSelectLButtonColor: (color: ColorOption) => void;
  rButtonColor: ColorOption;
  onSelectRButtonColor: (color: ColorOption) => void;
  leftBumperColor: ColorOption;
  onSelectLeftBumperColor: (color: ColorOption) => void;
  rightBumperColor: ColorOption;
  onSelectRightBumperColor: (color: ColorOption) => void;
  lensColor: ColorOption;
  onSelectLensColor: (color: ColorOption) => void;
  onRandomize: () => void;
  isClearShell: boolean;
  onToggleClearShell: () => void;
  isClearButtons: boolean;
  onToggleClearButtons: () => void;
}

// Helper to compare if two colors are effectively the same (for UI state)
const areColorsEqual = (a: ColorOption, b: ColorOption) => {
  if (a.id === 'custom' || b.id === 'custom') {
    return a.hex.toLowerCase() === b.hex.toLowerCase();
  }
  return a.id === b.id;
};

// Hex Input Component for Custom Colors
const HexInput = ({ color, onColorChange }: { color: ColorOption, onColorChange: (c: ColorOption) => void }) => {
  const [value, setValue] = useState(color.hex);

  useEffect(() => {
    setValue(color.hex);
  }, [color.hex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    
    // If it's a valid 6-digit hex, update live
    if (/^#[0-9A-Fa-f]{6}$/.test(newVal)) {
      onColorChange({ ...color, hex: newVal });
    }
  };

  const handleBlur = () => {
    let newVal = value;
    if (!newVal.startsWith('#')) {
        // Try to fix missing hash if valid hex chars
        if (/^[0-9A-Fa-f]{6}$/.test(newVal) || /^[0-9A-Fa-f]{3}$/.test(newVal)) {
            newVal = '#' + newVal;
        }
    }
    
    // Handle 3 digit hex expansion
    if (/^#[0-9A-Fa-f]{3}$/.test(newVal)) {
        newVal = '#' + newVal[1] + newVal[1] + newVal[2] + newVal[2] + newVal[3] + newVal[3];
    }
    
    if (/^#[0-9A-Fa-f]{6}$/.test(newVal)) {
       setValue(newVal);
       onColorChange({ ...color, hex: newVal });
    } else {
       // Invalid, revert to current color prop
       setValue(color.hex);
    }
  };

  return (
    <input 
      type="text" 
      value={value} 
      onChange={handleChange}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()} // Prevent triggering the color picker click
      className="w-16 text-[10px] font-bold uppercase tracking-wider text-center border border-slate-200 rounded px-1 py-0.5 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
      spellCheck={false}
    />
  );
};

// Reusable Circular Color Button (Standard + Custom)
interface ColorButtonProps {
  color?: ColorOption; // undefined if it's the "placeholder" for custom
  isSelected: boolean;
  onSelect: (color: ColorOption) => void;
  isCustom?: boolean;
  sizeClass?: string;
  className?: string;
  showLabel?: boolean;
}

const ColorButton: React.FC<ColorButtonProps> = ({ 
  color, 
  isSelected, 
  onSelect, 
  isCustom = false,
  sizeClass = "w-12 h-12",
  className = "",
  showLabel = true
}) => {
  if (isCustom) {
    // Extract numeric width value from "w-12" -> 12
    const widthVal = parseInt(sizeClass.split(' ')[0].replace(/\D/g, '') || '12');
    const iconSize = widthVal * 2; // Approximate px size for half-width icon (w-12 = 48px, half = 24px)

    return (
      <div 
        className={`relative group flex flex-col items-center gap-2 ${className}`}
        title="Custom Color"
      >
        <div 
          className={`
            ${sizeClass} rounded-full shadow-sm flex items-center justify-center transition-all duration-300 overflow-hidden relative
            ${isSelected ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'border border-slate-200 hover:scale-105'}
          `}
          style={{ 
            background: isSelected 
              ? color?.hex 
              : 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FF8A00 51.43deg, #FFE500 102.86deg, #00FF00 154.29deg, #00A3FF 205.71deg, #0500FF 257.14deg, #AD00FF 308.57deg, #FF00C7 360deg)' 
          }}
        >
          <input 
            type="color" 
            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 opacity-0 cursor-pointer"
            value={isSelected && color ? color.hex : '#ffffff'}
            onChange={(e) => onSelect({ id: 'custom', name: 'Custom', hex: e.target.value })}
          />
          
          <div className="pointer-events-none flex items-center justify-center">
             {!isSelected && (
                <Palette size={iconSize} className="text-white drop-shadow-md" strokeWidth={2} />
             )}
          </div>
        </div>
        {/* Show Hex Input if selected, otherwise show label if enabled */}
        {isSelected && color ? (
            <HexInput color={color} onColorChange={onSelect} />
        ) : (
            showLabel && (
              <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                Custom
              </span>
            )
        )}
      </div>
    );
  }

  // Standard Preset Button
  if (!color) return null;

  return (
    <button
      onClick={() => onSelect(color)}
      className={`group relative flex flex-col items-center gap-2 ${className}`}
      title={color.name}
    >
      <div 
        className={`
          ${sizeClass} rounded-full shadow-sm flex items-center justify-center transition-all duration-300
          ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'border border-slate-200 hover:scale-105'}
        `}
        style={{ backgroundColor: color.hex }}
      >
      </div>
      
      {showLabel && (
        <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
          {color.name}
        </span>
      )}
    </button>
  );
};

// Reusable Section for Individual Controls
interface ColorSectionProps {
  label: string;
  selectedColor: ColorOption;
  onSelect: (color: ColorOption) => void;
  idPrefix: string;
}

const ColorSection: React.FC<ColorSectionProps> = ({ label, selectedColor, onSelect, idPrefix }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
      {label}
    </h3>
    <div className="grid grid-cols-6 gap-2">
      {SHELL_COLORS.map((color) => (
        <ColorButton 
          key={`${idPrefix}-${color.id}`}
          color={color}
          isSelected={selectedColor.id === color.id}
          onSelect={onSelect}
          sizeClass="w-8 h-8"
          className="!gap-0"
          showLabel={false}
        />
      ))}
      <ColorButton 
         isCustom
         isSelected={selectedColor.id === 'custom'}
         color={selectedColor}
         onSelect={onSelect}
         sizeClass="w-8 h-8"
         className="!gap-0"
         showLabel={false}
      />
    </div>
  </div>
);

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  selectedColor, 
  onSelectColor,
  dpadColor,
  onSelectDpadColor,
  aButtonColor,
  onSelectAButtonColor,
  bButtonColor,
  onSelectBButtonColor,
  startSelectColor,
  onSelectStartSelectColor,
  lButtonColor,
  onSelectLButtonColor,
  rButtonColor,
  onSelectRButtonColor,
  leftBumperColor,
  onSelectLeftBumperColor,
  rightBumperColor,
  onSelectRightBumperColor,
  lensColor,
  onSelectLensColor,
  onRandomize,
  isClearShell,
  onToggleClearShell,
  isClearButtons,
  onToggleClearButtons
}) => {
  const [showIndividualControls, setShowIndividualControls] = useState(false);

  // Determine if all controls share the same color for the "Master" selector
  const unifiedControlColor = (
    areColorsEqual(dpadColor, aButtonColor) &&
    areColorsEqual(aButtonColor, bButtonColor) &&
    areColorsEqual(bButtonColor, startSelectColor) &&
    areColorsEqual(startSelectColor, lButtonColor) &&
    areColorsEqual(lButtonColor, rButtonColor) &&
    areColorsEqual(rButtonColor, leftBumperColor) &&
    areColorsEqual(leftBumperColor, rightBumperColor)
  ) ? dpadColor : null;

  const handleMasterControlColorSelect = (color: ColorOption) => {
    onSelectDpadColor(color);
    onSelectAButtonColor(color);
    onSelectBButtonColor(color);
    onSelectStartSelectColor(color);
    onSelectLButtonColor(color);
    onSelectRButtonColor(color);
    onSelectLeftBumperColor(color);
    onSelectRightBumperColor(color);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-8">
      
      {/* Shell Color Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
            Shell Color
            </h2>
            <button
                onClick={onToggleClearShell}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${isClearShell ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                title="Toggle Clear/Transparent Shell"
            >
                {isClearShell ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                Clear Shell
            </button>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {SHELL_COLORS.map((color) => (
            <ColorButton 
              key={color.id}
              color={color}
              isSelected={selectedColor.id === color.id}
              onSelect={onSelectColor}
            />
          ))}
          {/* Custom Shell Color */}
          <ColorButton 
            isCustom
            isSelected={selectedColor.id === 'custom'}
            color={selectedColor} 
            onSelect={onSelectColor}
          />
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full"></div>

      {/* Screen Lens Color Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-slate-500 rounded-full inline-block"></span>
          Screen Lens
        </h2>
        
        <div className="flex gap-4 flex-wrap">
          {LENS_COLORS.map((color) => {
             const isSelected = lensColor.id === color.id;
             return (
              <button
                key={color.id}
                onClick={() => onSelectLensColor(color)}
                className={`
                  flex-1 min-w-[120px] py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all duration-200
                  ${isSelected ? 'border-slate-800 bg-slate-50 text-slate-900 ring-1 ring-slate-800/10' : 'border-slate-200 hover:border-slate-300 text-slate-600'}
                `}
              >
                <span 
                  className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" 
                  style={{ backgroundColor: color.hex }}
                ></span>
                <span className="text-sm font-semibold">{color.name}</span>
                {isSelected && <Check size={16} className="text-slate-900 ml-auto" strokeWidth={3} />}
              </button>
             );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full"></div>

      {/* Buttons & Bumpers (Master Control) */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-800 rounded-full inline-block"></span>
            Buttons
          </h2>
          <button
              onClick={onToggleClearButtons}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${isClearButtons ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              title="Toggle Clear/Transparent Buttons"
          >
              {isClearButtons ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              Clear Buttons
          </button>
        </div>
       
        <div className="grid grid-cols-6 gap-3 mb-6">
          {SHELL_COLORS.map((color) => (
            <ColorButton 
              key={`master-${color.id}`}
              color={color}
              isSelected={unifiedControlColor?.id === color.id}
              onSelect={handleMasterControlColorSelect}
              sizeClass="w-10 h-10"
              className="!gap-0"
              showLabel={false}
            />
          ))}
          {/* Custom Master Color */}
          <ColorButton 
             isCustom
             isSelected={unifiedControlColor?.id === 'custom'}
             color={unifiedControlColor || { id: 'custom', name: 'Custom', hex: '#000000' }}
             onSelect={handleMasterControlColorSelect}
             sizeClass="w-10 h-10"
             className="!gap-0"
             showLabel={false}
          />
        </div>

        {/* Individual Controls Toggle */}
        <button 
          onClick={() => setShowIndividualControls(!showIndividualControls)}
          className="flex items-center gap-2 text-sm text-slate-500 font-medium hover:text-slate-800 transition-colors w-full p-2 hover:bg-slate-50 rounded-lg"
        >
          {showIndividualControls ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <SlidersHorizontal size={14} />
          <span>Customize Individually</span>
        </button>

        {/* Collapsible Individual Controls */}
        {showIndividualControls && (
          <div className="mt-4 pl-4 border-l-2 border-slate-100 space-y-6 animate-in slide-in-from-top-2 duration-200">
            <ColorSection label="D-Pad" selectedColor={dpadColor} onSelect={onSelectDpadColor} idPrefix="dpad" />
            <ColorSection label="Button A" selectedColor={aButtonColor} onSelect={onSelectAButtonColor} idPrefix="btn-a" />
            <ColorSection label="Button B" selectedColor={bButtonColor} onSelect={onSelectBButtonColor} idPrefix="btn-b" />
            <ColorSection label="Start / Select" selectedColor={startSelectColor} onSelect={onSelectStartSelectColor} idPrefix="ss" />
            <ColorSection label="L Button (Trigger)" selectedColor={lButtonColor} onSelect={onSelectLButtonColor} idPrefix="l-btn" />
            <ColorSection label="R Button (Trigger)" selectedColor={rButtonColor} onSelect={onSelectRButtonColor} idPrefix="r-btn" />
            <ColorSection label="Left Bumper (Side)" selectedColor={leftBumperColor} onSelect={onSelectLeftBumperColor} idPrefix="l-bump" />
            <ColorSection label="Right Bumper (Side)" selectedColor={rightBumperColor} onSelect={onSelectRightBumperColor} idPrefix="r-bump" />
          </div>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100">
        <button
          onClick={onRandomize}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-200 group shadow-md hover:shadow-lg border border-transparent"
        >
          <Shuffle size={18} className="transition-transform group-hover:rotate-180" />
          Randomize Colors
        </button>
      </div>
    </div>
  );
};
