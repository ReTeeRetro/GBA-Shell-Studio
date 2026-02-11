
import React, { useState, useEffect } from 'react';
import { ColorOption, ShopMode } from '../types';
// Fixed: Import useGba from GbaContext instead of hooks/useGbaState
import { useGba } from '../contexts/GbaContext';
// Fixed: Removed unused icon imports
import { 
  SHELL_COLORS, 
  GBC_SHELL_COLORS,
  LENS_COLORS, 
  GBC_LOGO_COLORS,
  FUNNYPLAYING_SHELL_COLORS, 
  FUNNYPLAYING_BUTTON_COLORS, 
  FUNNYPLAYING_MEMBRANE_COLORS, 
  RGRS_FUNNYPLAYING_SHELL_COLORS, 
  RGRS_FUNNYPLAYING_BUTTON_COLORS, 
  RGRS_FUNNYPLAYING_MEMBRANE_COLORS,
  RGRS_HISPEEDIDO_SHELL_COLORS,
  SILENTMODDING_HISPEEDIDO_SHELL_COLORS,
  SILENTMODDING_FUNNYPLAYING_BUTTON_COLORS,
  SILENTMODDING_FUNNYPLAYING_MEMBRANE_COLORS,
  HISPEEDIDO_DEFAULT_BTN,
  HISPEEDIDO_DEFAULT_MEM,
  DARK_GREY_BTN,
  GBC_BUTTON_GREY
} from '../constants';
import { getButtonColorStyle } from '../utils/shopUtils';
import { ChevronDown, ChevronRight, SlidersHorizontal, Palette, Shuffle, ToggleLeft, ToggleRight, ShoppingBag, Lock, Unlock, Info } from 'lucide-react';

const areColorsEqual = (a: ColorOption, b: ColorOption) => {
  if (a.id === 'custom' || b.id === 'custom') {
    return a.hex.toLowerCase() === b.hex.toLowerCase();
  }
  return a.id === b.id;
};

const HexInput = ({ color, onColorChange, className = "" }: { color: ColorOption, onColorChange: (c: ColorOption) => void, className?: string }) => {
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
      className={`w-16 text-[10px] font-bold uppercase tracking-wider text-center border border-slate-200 dark:border-slate-600 rounded px-1 py-0.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white dark:bg-slate-800 transition-colors shadow-sm ${className}`}
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
            ${isSelected ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110 shadow-md' : 'border border-slate-200 dark:border-slate-600 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-400'}
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

  const style = color.hex.startsWith('url') ? { background: 'conic-gradient(#33268E 0deg 72deg, #09826D 72deg 144deg, #DAB10F 144deg 216deg, #BA0E39 216deg 288deg, #71AA21 288deg 360deg)' } : getButtonColorStyle(color);

  return (
    <button
      onClick={() => onSelect(color)}
      className={`group relative flex flex-col items-center gap-2 ${className}`}
      title={color.name}
    >
      <div 
        className={`
          ${sizeClass} rounded-full shadow-sm flex items-center justify-center transition-all duration-300 relative
          ${isSelected ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110 shadow-md' : 'border border-slate-200 dark:border-slate-600 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-400'}
        `}
        style={style}
      >
        {color.shopUrl && (
          <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border border-slate-200 dark:border-slate-600 shadow-sm">
            <ShoppingBag size={8} className="text-slate-500 dark:text-slate-300" />
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
    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
      {label}
    </h3>
    <div className={`grid ${(shopMode === 'funnyplaying' || shopMode === 'rgrs' || shopMode === 'silentmodding') ? 'grid-cols-5' : 'grid-cols-6'} gap-2 ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
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

export const ColorPicker: React.FC = () => {
  const { config, setters, randomize } = useGba();
  const [showIndividualControls, setShowIndividualControls] = useState(false);
  const [showLogoControls, setShowLogoControls] = useState(false);

  const { shopMode, rgrsSubBrand, useCustomButtonsInHiMode, consoleType } = config;

  const isDirectFunny = shopMode === 'funnyplaying';
  const isRgrsFunny = shopMode === 'rgrs' && rgrsSubBrand === 'funnyplaying';
  const isRgrsHi = shopMode === 'rgrs' && rgrsSubBrand === 'hispeedido';
  const isSilent = shopMode === 'silentmodding';

  const shellOptions = consoleType === 'gbc' 
    ? GBC_SHELL_COLORS
    : isDirectFunny 
      ? FUNNYPLAYING_SHELL_COLORS 
      : isRgrsFunny 
        ? RGRS_FUNNYPLAYING_SHELL_COLORS 
        : isRgrsHi
          ? RGRS_HISPEEDIDO_SHELL_COLORS
          : isSilent
            ? SILENTMODDING_HISPEEDIDO_SHELL_COLORS
            : SHELL_COLORS;

  const isLockedMode = ((isRgrsHi || isSilent) && !useCustomButtonsInHiMode);

  const buttonOptions = isLockedMode
    ? (config.selectedColor.id.includes('sfc-grey') ? [{ id: 'hi-sfc-mix', name: 'SFC Mix', hex: '#fa5949' }] : [HISPEEDIDO_DEFAULT_BTN])
    : isDirectFunny 
      ? FUNNYPLAYING_BUTTON_COLORS 
      : (isRgrsFunny || isRgrsHi)
        ? RGRS_FUNNYPLAYING_BUTTON_COLORS 
        : isSilent
          ? SILENTMODDING_FUNNYPLAYING_BUTTON_COLORS
          : consoleType === 'gbc'
            ? [...SHELL_COLORS, GBC_BUTTON_GREY]
            : [...SHELL_COLORS, DARK_GREY_BTN];
      
  const membraneOptions = isLockedMode
    ? [HISPEEDIDO_DEFAULT_MEM]
    : isDirectFunny 
      ? FUNNYPLAYING_MEMBRANE_COLORS 
      : (isRgrsFunny || isRgrsHi)
        ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS 
        : isSilent
          ? SILENTMODDING_FUNNYPLAYING_MEMBRANE_COLORS
          : consoleType === 'gbc'
            ? [...SHELL_COLORS, GBC_BUTTON_GREY]
            : [...SHELL_COLORS, DARK_GREY_BTN];

  // Check if relevant buttons match for master control
  const relevantButtons = consoleType === 'gba' 
    ? [config.dpadColor, config.aButtonColor, config.bButtonColor, config.startSelectColor, config.powerSwitchColor, config.lButtonColor, config.rButtonColor, config.leftBumperColor, config.rightBumperColor]
    : [config.dpadColor, config.aButtonColor, config.bButtonColor, config.startSelectColor];

  const allRelevantMatch = relevantButtons.every(btn => areColorsEqual(btn, relevantButtons[0]));
  const unifiedControlColor = allRelevantMatch ? relevantButtons[0] : null;

  const handleMasterControlColorSelect = (color: ColorOption) => {
    if (isLockedMode) return;
    setters.setAllButtonsColor(color);
  };

  const handleMasterLogoPresetSelect = (color: ColorOption) => {
    setters.setGbcLogoColor(color);
  };

  const isLensCustom = config.lensColor.id === 'custom';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
      
      {/* Shell Color Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-800 dark:bg-white rounded-full inline-block"></span>
            Shell Color
            </h2>
            <button
                onClick={() => setters.setIsClearShell(!config.isClearShell)}
                disabled={!!shopMode || consoleType === 'gbc'}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${ (shopMode || consoleType === 'gbc') ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${config.isClearShell ? 'bg-slate-800 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                title={consoleType === 'gbc' ? "Clear shells not yet available for GBC" : shopMode ? "Transparency is fixed by selection in Shop Mode" : "Toggle Clear/Transparent Shell"}
            >
                {config.isClearShell ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                Clear Shell
            </button>
        </div>
        
        <div className={`grid ${(isDirectFunny || isRgrsFunny || isRgrsHi || isSilent) ? 'grid-cols-5' : 'grid-cols-5'} gap-4`}>
          {shellOptions.map((color) => (
            <ColorButton 
              key={color.id}
              color={color}
              isSelected={config.selectedColor.id === color.id}
              onSelect={setters.setSelectedColor}
            />
          ))}
          {!shopMode && (
            <ColorButton 
              isCustom
              isSelected={config.selectedColor.id === 'custom'}
              color={config.selectedColor} 
              onSelect={setters.setSelectedColor}
            />
          )}
        </div>
        {shopMode && (
          <div className="mt-4 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
            <ShoppingBag size={14} className="text-slate-500 dark:text-slate-400" />
            Showing {shopMode === 'silentmodding' ? 'SilentModding (EU)' : shopMode} {shopMode === 'rgrs' ? `(${rgrsSubBrand})` : ''} shell inventory.
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

      {/* Screen Lens Color Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-50 rounded-full inline-block"></span>
            Screen Lens
          </h2>
          <button
              onClick={() => setters.setIsScreenOn(!config.isScreenOn)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${config.isScreenOn ? 'bg-slate-800 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
              title="Toggle Screen On/Off"
          >
              {config.isScreenOn ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              Screen Power
          </button>
        </div>
        
        {/* Responsive grid for Lens */}
        <div className={`grid ${shopMode ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mb-4`}>
          {LENS_COLORS.map((color) => {
             const isSelected = config.lensColor.id === color.id;
             return (
              <button
                key={color.id}
                onClick={() => setters.setLensColor(color)}
                className={`
                  py-2.5 px-2 rounded-lg border-2 flex items-center justify-center gap-2 transition-all duration-200
                  ${isSelected ? 'border-slate-800 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-slate-800/10 dark:ring-white/10' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-400 text-slate-600 dark:text-slate-300'}
                `}
              >
                <span 
                  className="w-5 h-5 shrink-0 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm" 
                  style={{ backgroundColor: color.hex }}
                ></span>
                <span className="text-xs sm:text-sm font-bold truncate">{color.name}</span>
              </button>
             );
          })}
          
          {/* Custom Lens Button - Visible only in Default Mode */}
          {!shopMode && (
            <div className="relative group h-full">
              <button
                className={`
                  w-full h-full py-2.5 px-2 rounded-lg border-2 flex items-center justify-center gap-2 transition-all duration-200 relative overflow-hidden
                  ${isLensCustom ? 'border-slate-800 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-slate-800/10 dark:ring-white/10' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-400 text-slate-600 dark:text-slate-300'}
                `}
                style={isLensCustom ? {} : { background: 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FF8A00 51.43deg, #FFE500 102.86deg, #00FF00 154.29deg, #00A3FF 205.71deg, #0500FF 257.14deg, #AD00FF 308.57deg, #FF00C7 360deg)' }}
              >
                <input 
                  type="color" 
                  className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 opacity-0 cursor-pointer"
                  value={isLensCustom ? config.lensColor.hex : '#ffffff'}
                  onChange={(e) => setters.setLensColor({ id: 'custom', name: 'Custom', hex: e.target.value })}
                />
                
                <div className="pointer-events-none flex items-center justify-center gap-2 w-full">
                  {isLensCustom ? (
                     <>
                      <span 
                        className="w-5 h-5 shrink-0 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm" 
                        style={{ backgroundColor: config.lensColor.hex }}
                      ></span>
                      <HexInput color={config.lensColor} onColorChange={setters.setLensColor} className="!w-14 !px-0" />
                     </>
                  ) : (
                    <>
                      <Palette size={18} className="text-white drop-shadow-md shrink-0" strokeWidth={2.5} />
                      <span className="text-xs sm:text-sm font-bold truncate text-white drop-shadow-sm uppercase">Custom</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Logo Color Controls - GBC ONLY */}
        {consoleType === 'gbc' && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-300">
            <button 
              onClick={() => setShowLogoControls(!showLogoControls)}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
            >
              {showLogoControls ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <SlidersHorizontal size={14} />
              <span>Logo color</span>
            </button>

            {showLogoControls && (
              <div className="mt-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-6 animate-in slide-in-from-top-2 duration-200">
                <div className={`grid grid-cols-6 gap-3 mb-6`}>
                  {GBC_LOGO_COLORS.map((color) => {
                    // Logic to determine if a preset is selected
                    let isSelected = false;
                    if (color.id === 'gbc-logo-multi') {
                      isSelected = areColorsEqual(config.gbcLogoGameBoyColor, GBC_LOGO_COLORS[5]) && areColorsEqual(config.gbcLogoColorWordColor, GBC_LOGO_COLORS[0]);
                    } else {
                      isSelected = areColorsEqual(config.gbcLogoGameBoyColor, color) && areColorsEqual(config.gbcLogoColorWordColor, color);
                    }

                    return (
                      <ColorButton 
                        key={`logo-master-preset-${color.id}`}
                        color={color}
                        isSelected={isSelected}
                        onSelect={handleMasterLogoPresetSelect}
                        sizeClass="w-8 h-8"
                        className="!gap-0"
                        showLabel={false}
                      />
                    );
                  })}
                  {!shopMode && (
                    <ColorButton 
                       isCustom
                       isSelected={config.gbcLogoGameBoyColor.id === 'custom' && areColorsEqual(config.gbcLogoGameBoyColor, config.gbcLogoColorWordColor)}
                       color={config.gbcLogoGameBoyColor.id === 'custom' ? config.gbcLogoGameBoyColor : { id: 'custom', name: 'Custom', hex: '#000000' }}
                       onSelect={handleMasterLogoPresetSelect}
                       sizeClass="w-8 h-8"
                       className="!gap-0"
                       showLabel={false}
                    />
                  )}
                </div>

                <ColorSection 
                  label="GAME BOY" 
                  selectedColor={config.gbcLogoGameBoyColor} 
                  onSelect={setters.setGbcLogoGameBoyColor} 
                  idPrefix="logo-gb" 
                  options={GBC_LOGO_COLORS.filter(c => c.id !== 'gbc-logo-multi')} 
                  shopMode={shopMode} 
                />
                <ColorSection 
                  label="COLOR" 
                  selectedColor={config.gbcLogoColorWordColor} 
                  onSelect={setters.setGbcLogoColorWordColor} 
                  idPrefix="logo-c" 
                  options={GBC_LOGO_COLORS} 
                  shopMode={shopMode} 
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

      {/* Buttons & Bumpers (Master Control) */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-slate-800 dark:bg-slate-400 rounded-full inline-block"></span>
            Buttons
          </h2>
          <div className="flex items-center gap-2">
              <button
                  onClick={() => setters.setIsClearButtons(!config.isClearButtons)}
                  disabled={(!!shopMode && isLockedMode) || consoleType === 'gbc'}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${((shopMode && isLockedMode) || consoleType === 'gbc') ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${config.isClearButtons ? 'bg-slate-800 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                  title={consoleType === 'gbc' ? "Clear buttons not yet available for GBC" : shopMode ? "Transparency is fixed by selection in Shop Mode" : "Toggle Clear/Transparent Buttons"}
              >
                  {config.isClearButtons ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  Clear Buttons
              </button>
          </div>
        </div>
       
        {isLockedMode ? (
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
                     {config.selectedColor.id.includes('sfc-grey') ? 'SFC Mix Set' : 'Hispeedido Dark Grey'}
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-0.5">Shell kits include fixed color buttons.</p>
               </div>
            </div>
            
            <button
                onClick={() => setters.setUseCustomButtonsInHiMode(true)}
                className="w-full text-[10px] font-bold px-3 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 uppercase tracking-tight bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
            >
                <Unlock size={14} />
                Use Funnyplaying buttons
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {((isRgrsHi || isSilent) && useCustomButtonsInHiMode) && (
              <button
                  onClick={() => setters.setUseCustomButtonsInHiMode(false)}
                  className="mb-4 w-full text-[10px] font-bold px-3 py-2 rounded-lg border transition-all flex items-center justify-center gap-2 uppercase tracking-tight bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                  <Lock size={14} />
                  Switch back to Shell Kit buttons
              </button>
            )}

            <div className={`grid ${(isDirectFunny || isRgrsFunny || isRgrsHi || isSilent) ? 'grid-cols-5' : 'grid-cols-6'} gap-3 mb-6`}>
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
                  <Info size={14} className="text-slate-500 shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {shopMode 
                      ? "Individual plastic buttons are locked to sets in Shop Mode. Start/Select membranes are separate parts." 
                      : "Fine-tune individual colors for a unique custom look."}
                  </p>
                </div>
                
                <ColorSection label="D-Pad" selectedColor={config.dpadColor} onSelect={setters.setDpadColor} idPrefix="dpad" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                <ColorSection label="Button A" selectedColor={config.aButtonColor} onSelect={setters.setAButtonColor} idPrefix="btn-a" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                <ColorSection label="Button B" selectedColor={config.bButtonColor} onSelect={setters.setBButtonColor} idPrefix="btn-b" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                {consoleType === 'gba' && <ColorSection label="Power Switch" selectedColor={config.powerSwitchColor} onSelect={setters.setPowerSwitchColor} idPrefix="pwr" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />}
                <ColorSection label="Start / Select" selectedColor={config.startSelectColor} onSelect={setters.setStartSelectColor} idPrefix="ss" options={membraneOptions} shopMode={shopMode} />
                
                {consoleType === 'gba' && (
                  <>
                    <ColorSection label="L Button (Trigger)" selectedColor={config.lButtonColor} onSelect={setters.setLButtonColor} idPrefix="l-btn" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                    <ColorSection label="R Button (Trigger)" selectedColor={config.rButtonColor} onSelect={setters.setRButtonColor} idPrefix="r-btn" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                    <ColorSection label="Left Bumper (Side)" selectedColor={config.leftBumperColor} onSelect={setters.setLeftBumperColor} idPrefix="l-bump" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                    <ColorSection label="Right Bumper (Side)" selectedColor={config.rightBumperColor} onSelect={setters.setRightBumperColor} idPrefix="r-bump" options={buttonOptions} shopMode={shopMode} disabled={!!shopMode} />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={randomize}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all duration-200 group shadow-md hover:shadow-lg border border-transparent dark:shadow-orange-900/20"
        >
          <Shuffle size={18} className="transition-transform group-hover:rotate-180" />
          Randomize Colors
        </button>
      </div>
    </div>
  );
};
