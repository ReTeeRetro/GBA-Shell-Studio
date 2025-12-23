import React from 'react';
import { ShoppingBag, Info, CheckCircle2, Monitor, Layers, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { GbaConfig, ShopMode, RgrsSubBrand } from '../types';

interface ShopModeCardProps {
  config: GbaConfig;
  onSetShopMode: (mode: ShopMode) => void;
  onSetRgrsSubBrand?: (brand: RgrsSubBrand) => void;
}

export const ShopModeCard: React.FC<ShopModeCardProps> = ({ config, onSetShopMode, onSetRgrsSubBrand }) => {
  const { shopMode, rgrsSubBrand, selectedColor, lensColor, dpadColor, aButtonColor, bButtonColor, startSelectColor, useCustomButtonsInHiMode } = config;
  const isFunnyplaying = shopMode === 'funnyplaying';
  const isRgrs = shopMode === 'rgrs';
  const isRgrsFp = isRgrs && rgrsSubBrand === 'funnyplaying';
  const isRgrsHi = isRgrs && rgrsSubBrand === 'hispeedido';
  const isHiSfc = isRgrsHi && selectedColor.id === 'hi-sfc-grey' && !useCustomButtonsInHiMode;
  
  const utmSource = 'utm_source=gba-shell-studio';

  const appendUtm = (url: string) => {
    return url.includes('?') ? `${url}&${utmSource}` : `${url}?${utmSource}`;
  };

  const getScreenUrl = () => {
    if (isRgrs) {
      if (isRgrsHi) {
        // Specific variant links for RGRS + Hispeedido
        if (lensColor.id === 'white') {
          return 'https://retrogamerepairshop.com/collections/gba-displays/products/game-boy-advance-laminated-720x480-ips-backlight-with-osd?variant=43205883855020';
        }
        if (lensColor.id === 'grey') {
          return 'https://retrogamerepairshop.com/collections/gba-displays/products/game-boy-advance-laminated-720x480-ips-backlight-with-osd?variant=43205883887788';
        }
        return 'https://retrogamerepairshop.com/collections/gba-displays/products/game-boy-advance-laminated-720x480-ips-backlight-with-osd?variant=43205883822252';
      }
      
      // Specific variant links for RGRS + Funnyplaying
      if (lensColor.id === 'white') {
        return 'https://retrogamerepairshop.com/collections/gba-displays/products/funnyplaying-game-boy-advance-3-0-m2-kit-1?variant=44202716922028';
      }
      if (lensColor.id === 'grey') {
        return 'https://retrogamerepairshop.com/collections/gba-displays/products/funnyplaying-game-boy-advance-3-0-m2-kit-1?variant=44202716987564';
      }
      return 'https://retrogamerepairshop.com/collections/gba-displays/products/funnyplaying-game-boy-advance-3-0-m2-kit-1?variant=44202716889260';
    }
    
    if (lensColor.id === 'white') {
      return 'https://funnyplaying.com/products/3-0-inch-ips-gba-backlight-kit-m2?variant=41746177753149';
    }
    if (lensColor.id === 'grey') {
      return 'https://funnyplaying.com/products/3-0-inch-ips-gba-backlight-kit-m2?variant=41754683932733';
    }
    return 'https://funnyplaying.com/products/3-0-inch-ips-gba-backlight-kit-m2?variant=41674027139133';
  };

  const getButtonUrl = () => {
    if (isRgrs) {
      if (isRgrsHi && !useCustomButtonsInHiMode) {
        // For Hispeedido at RGRS, buttons are included with the shell kit
        return selectedColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-shells?filter.p.vendor=Hispeedido';
      }
      
      const isMatched = dpadColor.id === aButtonColor.id && aButtonColor.id === bButtonColor.id;
      if (isMatched && dpadColor.shopUrl) {
        return dpadColor.shopUrl;
      }
      return 'https://retrogamerepairshop.com/collections/gba-buttons?filter.p.vendor=FunnyPlaying';
    }
    
    if (dpadColor.id === 'fp-btn-snes-set') return 'https://funnyplaying.com/products/agb-custom-buttons?variant=32905308110909';
    if (dpadColor.id === 'fp-btn-dmg-set') return 'https://funnyplaying.com/products/agb-custom-buttons?variant=40576180322365';
    
    const isMatched = dpadColor.id === aButtonColor.id && aButtonColor.id === bButtonColor.id;
    if (isMatched && dpadColor.shopUrl) {
      return dpadColor.shopUrl;
    }
    return "https://funnyplaying.com/products/gba-custom-buttons";
  };

  const getButtonLabel = () => {
    if (dpadColor.id.includes('snes-set')) return 'SNES Style Mix';
    if (dpadColor.id.includes('dmg-set')) return 'DMG Style Mix';
    if (dpadColor.id.includes('sfc-set')) return 'SFC Style Mix';
    
    if (isHiSfc) return 'SFC Style Mix';

    const isMatched = dpadColor.id === aButtonColor.id && aButtonColor.id === bButtonColor.id;
    return isMatched ? dpadColor.name : 'Mixed Colors';
  };

  const getContrastingIconClass = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'text-slate-900/40' : 'text-white/60';
  };

  return (
    <div 
      className={`rounded-2xl border transition-all duration-300 overflow-hidden mt-6 
        ${shopMode 
          ? 'bg-white dark:bg-slate-900 border-blue-500/30 shadow-xl ring-1 ring-blue-500/10' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
    >
      {/* Header Section */}
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wide flex items-center gap-2">
                <ShoppingBag size={16} className="text-blue-600 dark:text-blue-400" />
                Shop Mode
              </h3>
            </div>
            
            <p className="text-sm text-blue-700/80 dark:text-slate-400 max-w-xl leading-relaxed">
              Restrict colors to specific inventory available at online stores. 
              Directly link your design to real parts.
            </p>
          </div>

          {/* Toggle Group */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => onSetShopMode(isFunnyplaying ? null : 'funnyplaying')}
              className={`flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${isFunnyplaying ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🇨🇳</span>
                <span>Funnyplaying</span>
              </div>
              {isFunnyplaying ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            </button>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onSetShopMode(isRgrs ? null : 'rgrs')}
                className={`flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${isRgrs ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <span>Retro Game Repair Shop</span>
                </div>
                {isRgrs ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              </button>
              
              {/* RGRS Sub-Toggles */}
              {isRgrs && onSetRgrsSubBrand && (
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
                  <button 
                    onClick={() => onSetRgrsSubBrand('funnyplaying')}
                    className={`flex-1 px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${isRgrsFp ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Funnyplaying
                  </button>
                  <button 
                    onClick={() => onSetRgrsSubBrand('hispeedido')}
                    className={`flex-1 px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${isRgrsHi ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Hispeedido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {shopMode && (
          <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <Info size={14} className="text-blue-500" />
                {isFunnyplaying ? 'Funnyplaying' : isRgrsHi ? 'RGRS (Hispeedido)' : 'RGRS (Funnyplaying)'} Parts List
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {isRgrsHi ? '(Hispeedido V5 variants)' : (isFunnyplaying || isRgrsFp) ? '(based on m2 variants)' : '(inventory check recommended)'}
              </span>
            </div>
            
            <div className="grid gap-2">
              {[
                {
                  label: 'Housing Shell',
                  value: selectedColor.name,
                  suffix: config.isClearShell ? '(Clear)' : '',
                  color: selectedColor.hex,
                  url: isFunnyplaying ? (selectedColor.shopUrl || 'https://funnyplaying.com/products/housing-for-gba-laminated-screen-kit') : isRgrsHi ? (selectedColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-shells?filter.p.vendor=Hispeedido') : (selectedColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-shells?filter.p.vendor=FunnyPlaying'),
                  btnLabel: 'Buy Shell',
                  icon: null as React.ReactElement | null
                },
                {
                  label: 'IPS Screen Kit',
                  value: isFunnyplaying ? `3.0" Backlight M2 (${lensColor.name})` : isRgrsHi ? `Hispeedido V5 720x480 (${lensColor.name})` : `FP Backlight Kit`,
                  color: lensColor.hex,
                  url: getScreenUrl(),
                  btnLabel: 'Buy Screen',
                  icon: <Monitor size={14} />
                },
                {
                  label: 'Button Kit',
                  value: (isFunnyplaying || isRgrsFp || isHiSfc || (isRgrsHi && useCustomButtonsInHiMode)) ? getButtonLabel() : 'GBA Custom Buttons',
                  color: dpadColor.hex,
                  url: getButtonUrl(),
                  btnLabel: 'Buy Buttons',
                  icon: <CheckCircle2 size={14} />
                },
                {
                  label: 'Silicone Pads',
                  value: startSelectColor.name,
                  suffix: config.isClearButtons ? '(Clear)' : '',
                  color: startSelectColor.hex,
                  url: isFunnyplaying ? (startSelectColor.shopUrl || 'https://funnyplaying.com/products/replacement-silicone-pads-for-gameboy-advance') : (isRgrsHi && !useCustomButtonsInHiMode) ? (selectedColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-membranes?filter.p.vendor=Hispeedido') : (startSelectColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-membranes?filter.p.vendor=FunnyPlaying'),
                  btnLabel: 'Buy Membranes',
                  icon: <Layers size={14} />
                }
              ].map((part, idx) => {
                let backgroundStyle: string;
                const isDpadSfcSet = dpadColor.id.includes('sfc-set');
                
                if (part.label === 'Button Kit' && (isFunnyplaying || isRgrsFp || (isRgrsHi && useCustomButtonsInHiMode)) && dpadColor.id.includes('snes-set')) {
                  backgroundStyle = 'linear-gradient(135deg, #6e707c 0%, #6e707c 33%, #8161b1 33%, #8161b1 66%, #cdc5e6 66%, #cdc5e6 100%)';
                } else if (part.label === 'Button Kit' && (isFunnyplaying || isRgrsFp || (isRgrsHi && useCustomButtonsInHiMode)) && dpadColor.id.includes('dmg-set')) {
                  backgroundStyle = 'linear-gradient(135deg, #343434 0%, #343434 50%, #e1316a 50%, #e1316a 100%)';
                } else if (part.label === 'Button Kit' && ((isFunnyplaying || isRgrsFp || (isRgrsHi && useCustomButtonsInHiMode)) && isDpadSfcSet || isHiSfc)) {
                  backgroundStyle = 'conic-gradient(#6e707c 0deg 90deg, #3cb6ab 90deg 180deg, #4a83df 180deg 270deg, #fa5949 270deg 360deg)';
                } else {
                  backgroundStyle = part.color;
                }

                return (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 group hover:border-blue-500/20 transition-all">
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-9 h-9 rounded-full border border-white dark:border-slate-700 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden" 
                        style={{ background: backgroundStyle }}
                      >
                        {part.icon && React.cloneElement(part.icon as React.ReactElement<any>, { className: getContrastingIconClass(part.color) })}
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-0.5">
                          {part.label}
                        </div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {part.value}
                          {part.suffix && <span className="text-[10px] text-slate-400 italic font-normal">{part.suffix}</span>}
                        </div>
                      </div>
                    </div>
                    <a 
                      href={appendUtm(part.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      {part.btnLabel}
                      <ExternalLink size={11} className="opacity-50" />
                    </a>
                  </div>
                );
              })}
            </div>
            
            <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic font-medium pt-1 space-y-1">
              <p>This site is not affiliated with any of the brands mentioned.</p>
              <p>Color matches and availability are subject to change on store websites.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};