import React, { useState, useEffect } from 'react';
import { ColorOption, ShopMode, RgrsSubBrand } from '../types';
import { 
  SHELL_COLORS, 
  LENS_COLORS, 
  FUNNYPLAYING_SHELL_COLORS, 
  FUNNYPLAYING_BUTTON_COLORS, 
  FUNNYPLAYING_MEMBRANE_COLORS, 
  RGRS_FUNNYPLAYING_SHELL_COLORS, 
  RGRS_FUNNYPLAYING_BUTTON_COLORS, 
  RGRS_FUNNYPLAYING_MEMBRANE_COLORS,
  RGRS_HISPEEDIDO_SHELL_COLORS,
  HISPEEDIDO_DEFAULT_BTN,
  HISPEEDIDO_DEFAULT_MEM
} from '../constants';
import { ChevronDown, ChevronRight, SlidersHorizontal, Palette, Shuffle, ToggleLeft, ToggleRight, ShoppingBag, Lock, Unlock, Info } from 'lucide-react';

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
  onSelectAllButtonsColor: (color: ColorOption) => void;
  lensColor: ColorOption;
  onSelectLensColor: (color: ColorOption) => void;
  onRandomize: () => void;
  isClearShell: boolean;
  onToggleClearShell: () => void;
  isClearButtons: boolean;
  onToggleClearButtons: () => void;
  isScreenOn: boolean;
  onToggleScreenOn: () => void;
  shopMode: ShopMode;
  rgrsSubBrand: RgrsSubBrand;
  useCustomButtonsInHiMode: boolean;
  onToggleCustomButtonsInHiMode: (val: boolean) => void;
}

const areColorsEqual = (a: ColorOption, b: ColorOption) => {
  if (a.id === 'custom' || b.id === 'custom') {
    return a.hex.toLowerCase() === b.hex.toLowerCase();
  }
  return a.id === b.id;
};

const HexInput = ({ color, onColorChange }: { color: ColorOption, onColorChange: (c: ColorOption) => void }) => {
  const [value, setValue] = useState(color.hex);

  useEffect(() => {
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
      className="w-16 text-[10px] font-bold uppercase tracking-wider text-center border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800"
      spellCheck={false}
    />
  );
};

interface ColorButtonProps {
  color?: ColorOption;
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
    const widthVal = parseInt(sizeClass.split(' ')[0].replace(/\D/g, '') || '12');
    const iconSize = widthVal * 2;

    return (
      <div 
        className={`relative group flex flex-col items-center gap-2 ${className}`}
        title="Custom Color"
      >
        <div 
          className={`
            ${sizeClass} rounded-full shadow-sm flex items-center justify-center transition-all duration-300 overflow-hidden relative
            ${isSelected ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-slate-300 scale-110' : 'border border-slate-200 dark:border-slate-700 hover:scale-105'}
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
        {isSelected && color ? (
            <HexInput color={color} onColorChange={onSelect} />
        ) : (
            showLabel && (
              <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                Custom
              </span>
            )
        )}
      </div>
    );
  }

  if (!color) return null;

  // Handle mixed set backgrounds
  let backgroundStyle: React.CSSProperties = { backgroundColor: color.hex };
  if (color.id.includes('snes-set')) {
    backgroundStyle = { 
        background: 'linear-gradient(135deg, #6e707c 0%, #6e707c 33%, #8161b1 33%, #8161b1 66%, #cdc5e6 66%, #cdc5e6 100%)' 
    };
  } else if (color.id.includes('dmg-set')) {
    backgroundStyle = { 
        background: 'linear-gradient(135deg, #343434 0%, #343434 50%, #e1316a 50%, #e1316a 100%)' 
    };
  } else if (color.id.includes('sfc-set')) {
    backgroundStyle = {
        background: 'conic-gradient(#6e707c 0deg 90deg, #3cb6ab 90deg 180deg, #4a83df 180deg 270deg, #fa5949 270deg 360deg)'
    };
  }

  return (
    <button
      onClick={() => onSelect(color)}
      className={`group relative flex flex-col items-center gap-2 ${className}`}
      title={color.name}
    >
      <div 
        className={`
          ${sizeClass} rounded-full shadow-sm flex items-center justify-center transition-all duration-300 relative
          ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'border border-slate-200 dark:border-slate-700 hover:scale-105'}
        `}
        style={backgroundStyle}
      >
        {color.shopUrl && (
          <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <ShoppingBag size={8} className="text-blue-500" />
          </div>
        )}
      </div>
      
      {showLabel && (
        <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
          {color.name}
        </span>
      )}
    </button>
  );
};

interface ColorSectionProps {
  label: string;
  selectedColor: ColorOption;
  onSelect: (color: ColorOption) => void;
  idPrefix: string;
  options: ColorOption[];
  shopMode: ShopMode;
  disabled?: boolean;
}

const ColorSection: React.FC<ColorSectionProps> = ({ label, selectedColor, onSelect, idPrefix, options, shopMode, disabled }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
      {label}
    </h3>
    <div className={`grid ${(shopMode === 'funnyplaying' || shopMode === 'rgrs') ? 'grid-cols-5' : 'grid-cols-6'} gap-2 ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
      {options.map((color) => (
        <ColorButton 
          key={`${idPrefix}-${color.id}`}
          color={color}
          isSelected={selectedColor.id === color.id}
          onSelect={disabled ? () => {} : onSelect}
          sizeClass="w-8 h-8"
          className="!gap-0"
          showLabel={false}
        />
      ))}
      {!shopMode && (
        <ColorButton 
          isCustom
          isSelected={selectedColor.id === 'custom'}
          color={selectedColor}
          onSelect={disabled ? () => {} : onSelect}
          sizeClass="w-8 h-8"
          className="!gap-0"
          showLabel={false}
        />
      )}
    </div>
    {disabled && (
      <p className="mt-2 text-[10px] text-slate-400 italic">Individual selection locked in Shop Mode (sold as sets).</p>
    )}
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
  onSelectAllButtonsColor,
  lensColor,
  onSelectLensColor,
  onRandomize,
  isClearShell,
  onToggleClearShell,
  isClearButtons,
  onToggleClearButtons,
  isScreenOn,
  onToggleScreenOn,
  shopMode,
  rgrsSubBrand,
  useCustomButtonsInHiMode,
  onToggleCustomButtonsInHiMode
}) => {
  const [showIndividualControls, setShowIndividualControls] = useState(false);

  const isDirectFunny = shopMode === 'funnyplaying';
  const isRgrsFunny = shopMode === 'rgrs' && rgrsSubBrand === 'funnyplaying';
  const isRgrsHi = shopMode === 'rgrs' && rgrsSubBrand === 'hispeedido';

  const shellOptions = isDirectFunny 
    ? FUNNYPLAYING_SHELL_COLORS 
    : isRgrsFunny 
      ? RGRS_FUNNYPLAYING_SHELL_COLORS 
      : isRgrsHi
        ? RGRS_HISPEEDIDO_SHELL_COLORS
        : SHELL_COLORS;

  const buttonOptions = (isRgrsHi && !useCustomButtonsInHiMode)
    ? (selectedColor.id === 'hi-sfc-grey' ? [{ id: 'hi-sfc-mix', name: 'SFC Mix', hex: '#fa5949' }] : [HISPEEDIDO_DEFAULT_BTN])
    : isDirectFunny 
      ? FUNNYPLAYING_BUTTON_COLORS 
      : (isRgrsFunny || (isRgrsHi && useCustomButtonsInHiMode))
        ? RGRS_FUNNYPLAYING_BUTTON_COLORS 
        : SHELL_COLORS;
      
  const membraneOptions = (isRgrsHi && !useCustomButtonsInHiMode)
    ? [HISPEEDIDO_DEFAULT_MEM]
    : isDirectFunny 
      ? FUNNYPLAYING_MEMBRANE_COLORS 
      : (isRgrsFunny || (isRgrsHi && useCustomButtonsInHiMode))
        ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS 
        : SHELL_COLORS;

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
    if (isRgrsHi && !useCustomButtonsInHiMode) return;
    onSelectAllButtonsColor(color);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
      
      {/* Shell Color Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
            Shell Color
            </h2>
            <button
                onClick={onToggleClearShell}
                disabled={!!shopMode}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${shopMode ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${isClearShell ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                title={shopMode ? "Transparency is fixed by selection in Shop Mode" : "Toggle Clear/Transparent Shell"}
            >
                {isClearShell ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                Clear Shell
            </button>
        </div>
        
        <div className={`grid ${(isDirectFunny || isRgrsFunny || isRgrsHi) ? 'grid-cols-5' : 'grid-cols-5'} gap-4`}>
          {shellOptions.map((color) => (
            <ColorButton 
              key={color.id}
              color={color}
              isSelected={selectedColor.id === color.id}
              onSelect={onSelectColor}
            />
          ))}
          {!shopMode && (
            <ColorButton 
              isCustom
              isSelected={selectedColor.id === 'custom'}
              color={selectedColor} 
              onSelect={onSelectColor}
            />
          )}
        </div>
        {shopMode && (
          <div className="mt-4 p-2.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg flex items-center gap-2 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
            <ShoppingBag size={14} />
            Showing {shopMode} {shopMode === 'rgrs' ? `(${rgrsSubBrand})` : ''} shell inventory.
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

      {/* Screen Lens Color Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-500 rounded-full inline-block"></span>
            Screen Lens
          </h2>
          <button
              onClick={onToggleScreenOn}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${isScreenOn ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              title="Toggle Screen On/Off"
          >
              {isScreenOn ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              Screen Power
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {LENS_COLORS.map((color) => {
             const isSelected = lensColor.id === color.id;
             return (
              <button
                key={color.id}
                onClick={() => onSelectLensColor(color)}
                className={`
                  py-2.5 px-2 rounded-lg border-2 flex items-center justify-center gap-1.5 transition-all duration-200
                  ${isSelected ? 'border-slate-800 dark:border-slate-300 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-slate-800/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'}
                `}
              >
                <span 
                  className="w-3 h-3 shrink-0 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm" 
                  style={{ backgroundColor: color.hex }}
                ></span>
                <span className="text-[11px] sm:text-sm font-bold truncate">{color.name}</span>
              </button>
             );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

      {/* Buttons & Bumpers (Master Control) */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-800 rounded-full inline-block"></span>
            Buttons
          </h2>
          <div className="flex items-center gap-2">
              <button
                  onClick={onToggleClearButtons}
                  disabled={!!shopMode && (!isRgrsHi || !useCustomButtonsInHiMode)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${(shopMode && (!isRgrsHi || !useCustomButtonsInHiMode)) ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${isClearButtons ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  title={shopMode ? "Transparency is fixed by selection in Shop Mode" : "Toggle Clear/Transparent Buttons"}
              >
                  {isClearButtons ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  Clear Buttons
              </button>
          </div>
        </div>
       
        {isRgrsHi && !useCustomButtonsInHiMode ? (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
               <div 
                  className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: buttonOptions[0].hex }}
               >
                  <Lock size={16} className="text-slate-400/50" />
               </div>
               <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-0.5">
                     Locked Set
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                     {selectedColor.id === 'hi-sfc-grey' ? 'SFC Mix Set' : 'Hispeedido Light Grey'}
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-0.5">Shell kits include fixed color buttons.</p>
               </div>
            </div>
            
            <button
                onClick={() => onToggleCustomButtonsInHiMode(true)}
                className="w-full text-[10px] font-bold px-3 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 uppercase tracking-tight bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
            >
                <Unlock size={14} />
                Use Funnyplaying buttons
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {isRgrsHi && useCustomButtonsInHiMode && (
              <button
                  onClick={() => onToggleCustomButtonsInHiMode(false)}
                  className="mb-4 w-full text-[10px] font-bold px-3 py-2 rounded-lg border transition-all flex items-center justify-center gap-2 uppercase tracking-tight bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400 shadow-sm"
              >
                  <Lock size={14} />
                  Switch back to Shell Kit buttons
              </button>
            )}

            <div className={`grid ${(isDirectFunny || isRgrsFunny || isRgrsHi) ? 'grid-cols-5' : 'grid-cols-6'} gap-3 mb-6`}>
              {buttonOptions.map((color) => (
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
              {!shopMode && (
                <ColorButton 
                   isCustom
                   isSelected={unifiedControlColor?.id === 'custom'}
                   color={unifiedControlColor || { id: 'custom', name: 'Custom', hex: '#000000' }}
                   onSelect={handleMasterControlColorSelect}
                   sizeClass="w-10 h-10"
                   className="!gap-0"
                   showLabel={false}
                />
              )}
            </div>

            <button 
              onClick={() => setShowIndividualControls(!showIndividualControls)}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
            >
              {showIndividualControls ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <SlidersHorizontal size={14} />
              <span>Customize Individually</span>
            </button>

            {showIndividualControls && (
              <div className="mt-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800 mb-2">
                  <Info size={14} className="text-blue-500 shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {shopMode 
                      ? "Individual plastic buttons are locked to sets in Shop Mode. Start/Select membranes are separate parts." 
                      : "Fine-tune individual colors for a unique custom look."}
                  </p>
                </div>
                
                <ColorSection label="D-Pad" selectedColor={dpadColor} onSelect={onSelectDpadColor} idPrefix="dpad" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                <ColorSection label="Button A" selectedColor={aButtonColor} onSelect={onSelectAButtonColor} idPrefix="btn-a" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                <ColorSection label="Button B" selectedColor={bButtonColor} onSelect={onSelectBButtonColor} idPrefix="btn-b" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                <ColorSection label="Start / Select" selectedColor={startSelectColor} onSelect={onSelectStartSelectColor} idPrefix="ss" options={membraneOptions} shopMode={shopMode} />
                <ColorSection label="L Button (Trigger)" selectedColor={lButtonColor} onSelect={onSelectLButtonColor} idPrefix="l-btn" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                <ColorSection label="R Button (Trigger)" selectedColor={rightBumperColor} onSelect={onSelectRButtonColor} idPrefix="r-btn" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                <ColorSection label="Left Bumper (Side)" selectedColor={leftBumperColor} onSelect={onSelectLeftBumperColor} idPrefix="l-bump" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                <ColorSection label="Right Bumper (Side)" selectedColor={rightBumperColor} onSelect={onSelectRightBumperColor} idPrefix="r-bump" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
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