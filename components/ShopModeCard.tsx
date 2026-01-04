import React from 'react';
import { ShoppingBag, Info, CheckCircle2, Monitor, Layers, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { useGba } from '../contexts/GbaContext';
import { getPartUrl, getButtonLabel, getScreenLabel, getButtonColorStyle } from '../utils/shopUtils';

export const ShopModeCard: React.FC = () => {
  const { config, setters } = useGba();
  const { shopMode, rgrsSubBrand, selectedColor, lensColor, dpadColor, startSelectColor, useCustomButtonsInHiMode } = config;
  const { setShopMode, setRgrsSubBrand } = setters;

  const isFunnyplaying = shopMode === 'funnyplaying';
  const isRgrs = shopMode === 'rgrs';
  const isSilent = shopMode === 'silentmodding';
  const isRgrsFp = isRgrs && rgrsSubBrand === 'funnyplaying';
  const isRgrsHi = isRgrs && rgrsSubBrand === 'hispeedido';
  
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
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
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

        {/* Toggle Group - Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
              onClick={() => setShopMode(isSilent ? null : 'silentmodding')}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${isSilent ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-lg">🇪🇺</span>
                <span className="truncate">SilentModding</span>
              </div>
              {isSilent ? <ToggleRight size={20} className="shrink-0" /> : <ToggleLeft size={20} className="shrink-0" />}
          </button>

          <button
            onClick={() => setShopMode(isFunnyplaying ? null : 'funnyplaying')}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${isFunnyplaying ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-lg">🇨🇳</span>
              <span className="truncate">Funnyplaying</span>
            </div>
            {isFunnyplaying ? <ToggleRight size={20} className="shrink-0" /> : <ToggleLeft size={20} className="shrink-0" />}
          </button>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShopMode(isRgrs ? null : 'rgrs')}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${isRgrs ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-lg">🇺🇸</span>
                <span className="truncate">Retro Game Repair Shop</span>
              </div>
              {isRgrs ? <ToggleRight size={20} className="shrink-0" /> : <ToggleLeft size={20} className="shrink-0" />}
            </button>
            
            {/* RGRS Sub-Toggles */}
            {isRgrs && (
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
                <button 
                  onClick={() => setRgrsSubBrand('funnyplaying')}
                  className={`flex-1 px-2 py-1.5 text-[10px] font-bold rounded-md transition-all ${isRgrsFp ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Funnyplaying
                </button>
                <button 
                  onClick={() => setRgrsSubBrand('hispeedido')}
                  className={`flex-1 px-2 py-1.5 text-[10px] font-bold rounded-md transition-all ${isRgrsHi ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Hispeedido
                </button>
              </div>
            )}
          </div>
        </div>

        {shopMode && (
          <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <Info size={14} className="text-blue-500" />
                {isFunnyplaying ? 'Funnyplaying' : (isRgrsHi || isSilent) ? `${isSilent ? 'SilentModding' : 'RGRS'} (Hispeedido)` : 'RGRS (Funnyplaying)'} Parts List
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {(isRgrsHi || isSilent) ? '(Hispeedido V5 variants)' : (isFunnyplaying || isRgrsFp) ? '(based on m2 variants)' : '(inventory check recommended)'}
              </span>
            </div>
            
            <div className="grid gap-2">
              {[
                {
                  label: 'Housing Shell',
                  value: selectedColor.name,
                  suffix: config.isClearShell ? '(Clear)' : '',
                  color: selectedColor,
                  url: getPartUrl('shell', config),
                  btnLabel: 'Buy Shell',
                  icon: null as React.ReactElement | null
                },
                {
                  label: 'IPS Screen Kit',
                  value: getScreenLabel(config),
                  color: lensColor,
                  url: getPartUrl('screen', config),
                  btnLabel: 'Buy Screen',
                  icon: <Monitor size={14} />
                },
                {
                  label: 'Button Kit',
                  value: getButtonLabel(config),
                  color: dpadColor,
                  url: getPartUrl('buttons', config),
                  btnLabel: 'Buy Buttons',
                  icon: <CheckCircle2 size={14} />
                },
                {
                  label: 'Silicone Pads',
                  value: startSelectColor.name,
                  suffix: config.isClearButtons ? '(Clear)' : '',
                  color: startSelectColor,
                  url: getPartUrl('membranes', config),
                  btnLabel: 'Buy Membranes',
                  icon: <Layers size={14} />
                }
              ].map((part, idx) => {
                const style = part.label === 'Button Kit' ? getButtonColorStyle(part.color) : { backgroundColor: part.color.hex };

                return (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 group hover:border-blue-500/20 transition-all">
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-9 h-9 rounded-full border border-white dark:border-slate-700 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden" 
                        style={style}
                      >
                        {part.icon && React.cloneElement(part.icon as React.ReactElement<any>, { className: getContrastingIconClass(part.color.hex) })}
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
                      href={part.url}
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