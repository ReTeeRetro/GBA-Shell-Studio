import { GbaConfig, ColorOption } from '../types';

const UTM_SOURCE = 'utm_source=gba-shell-studio';

const appendUtm = (url: string) => {
  return url.includes('?') ? `${url}&${UTM_SOURCE}` : `${url}?${UTM_SOURCE}`;
};

export const getPartUrl = (
  partType: 'shell' | 'screen' | 'buttons' | 'membranes',
  config: GbaConfig
): string => {
  const { shopMode, rgrsSubBrand, selectedColor, lensColor, dpadColor, aButtonColor, bButtonColor, startSelectColor, useCustomButtonsInHiMode } = config;
  
  const isFunnyplaying = shopMode === 'funnyplaying';
  const isRgrs = shopMode === 'rgrs';
  const isSilent = shopMode === 'silentmodding';
  const isRgrsHi = isRgrs && rgrsSubBrand === 'hispeedido';

  // --- SHELL ---
  if (partType === 'shell') {
    if (isSilent) {
        return appendUtm(selectedColor.shopUrl || 'https://www.silentmodding.com/en/game-boy-advance/shells.html');
    }
    if (isFunnyplaying) {
        return appendUtm(selectedColor.shopUrl || 'https://funnyplaying.com/products/housing-for-gba-laminated-screen-kit');
    }
    if (isRgrsHi) {
        return appendUtm(selectedColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-shells?filter.p.vendor=Hispeedido');
    }
    // Default RGRS FP or others
    return appendUtm(selectedColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-shells?filter.p.vendor=FunnyPlaying');
  }

  // --- SCREEN ---
  if (partType === 'screen') {
    if (isSilent) {
        if (lensColor.id === 'white') return appendUtm('https://www.silentmodding.com/en/game-boy-advance-ips-v5-laminated-ips-kit-black-1.html');
        if (lensColor.id === 'grey') return appendUtm('https://www.silentmodding.com/en/game-boy-advance-ips-v5-laminated-ips-kit-dmg.html');
        return appendUtm('https://www.silentmodding.com/en/game-boy-advance-ips-v5-laminated-ips-kit-black.html');
    }

    if (isRgrs) {
      if (isRgrsHi) {
        if (lensColor.id === 'white') return appendUtm('https://retrogamerepairshop.com/collections/gba-displays/products/game-boy-advance-laminated-720x480-ips-backlight-with-osd?variant=43205883855020');
        if (lensColor.id === 'grey') return appendUtm('https://retrogamerepairshop.com/collections/gba-displays/products/game-boy-advance-laminated-720x480-ips-backlight-with-osd?variant=43205883887788');
        return appendUtm('https://retrogamerepairshop.com/collections/gba-displays/products/game-boy-advance-laminated-720x480-ips-backlight-with-osd?variant=43205883822252');
      }
      // RGRS + Funnyplaying
      if (lensColor.id === 'white') return appendUtm('https://retrogamerepairshop.com/collections/gba-displays/products/funnyplaying-game-boy-advance-3-0-m2-kit-1?variant=44202716922028');
      if (lensColor.id === 'grey') return appendUtm('https://retrogamerepairshop.com/collections/gba-displays/products/funnyplaying-game-boy-advance-3-0-m2-kit-1?variant=44202716987564');
      return appendUtm('https://retrogamerepairshop.com/collections/gba-displays/products/funnyplaying-game-boy-advance-3-0-m2-kit-1?variant=44202716889260');
    }
    
    // Direct Funnyplaying
    if (lensColor.id === 'white') return appendUtm('https://funnyplaying.com/products/3-0-inch-ips-gba-backlight-kit-m2?variant=41746177753149');
    if (lensColor.id === 'grey') return appendUtm('https://funnyplaying.com/products/3-0-inch-ips-gba-backlight-kit-m2?variant=41754683932733');
    return appendUtm('https://funnyplaying.com/products/3-0-inch-ips-gba-backlight-kit-m2?variant=41674027139133');
  }

  // --- BUTTONS ---
  if (partType === 'buttons') {
    if (isRgrs) {
      if (isRgrsHi && !useCustomButtonsInHiMode) {
        return appendUtm(selectedColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-shells?filter.p.vendor=Hispeedido');
      }
      const isMatched = dpadColor.id === aButtonColor.id && aButtonColor.id === bButtonColor.id;
      if (isMatched && dpadColor.shopUrl) return appendUtm(dpadColor.shopUrl);
      return appendUtm('https://retrogamerepairshop.com/collections/gba-buttons?filter.p.vendor=FunnyPlaying');
    }

    if (isSilent) {
        if (!useCustomButtonsInHiMode) {
            return appendUtm(selectedColor.shopUrl || 'https://www.silentmodding.com/en/game-boy-advance/shells.html');
        }
        return appendUtm(dpadColor.shopUrl || 'https://www.silentmodding.com/en/game-boy-advance/buttons.html');
    }
    
    // Direct Funnyplaying
    if (dpadColor.id === 'fp-btn-snes-set') return appendUtm('https://funnyplaying.com/products/agb-custom-buttons?variant=32905308110909');
    if (dpadColor.id === 'fp-btn-dmg-set') return appendUtm('https://funnyplaying.com/products/agb-custom-buttons?variant=40576180322365');
    
    const isMatched = dpadColor.id === aButtonColor.id && aButtonColor.id === bButtonColor.id;
    if (isMatched && dpadColor.shopUrl) return appendUtm(dpadColor.shopUrl);
    return appendUtm("https://funnyplaying.com/products/gba-custom-buttons");
  }

  // --- MEMBRANES ---
  if (partType === 'membranes') {
    if (isSilent) {
        return appendUtm(startSelectColor.shopUrl || 'https://www.silentmodding.com/en/game-boy-advance/buttons.html');
    }
    if (isFunnyplaying) {
        return appendUtm(startSelectColor.shopUrl || 'https://funnyplaying.com/products/replacement-silicone-pads-for-gameboy-advance');
    }
    if (isRgrsHi && !useCustomButtonsInHiMode) {
        return appendUtm(selectedColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-membranes?filter.p.vendor=Hispeedido');
    }
    return appendUtm(startSelectColor.shopUrl || 'https://retrogamerepairshop.com/collections/gba-membranes?filter.p.vendor=FunnyPlaying');
  }

  return '';
};

export const getButtonLabel = (config: GbaConfig): string => {
  const { dpadColor, aButtonColor, bButtonColor, shopMode, rgrsSubBrand, selectedColor, useCustomButtonsInHiMode } = config;
  
  const isRgrsHi = shopMode === 'rgrs' && rgrsSubBrand === 'hispeedido';
  const isSilent = shopMode === 'silentmodding';
  const isHiSfc = (isRgrsHi || isSilent) && selectedColor.id.includes('sfc-grey') && !useCustomButtonsInHiMode;

  if (dpadColor.id.includes('snes-set')) return 'SNES Style Mix';
  if (dpadColor.id.includes('dmg-set')) return 'DMG Style Mix';
  if (dpadColor.id.includes('sfc-set')) return 'SFC Style Mix';
  if (isHiSfc) return 'SFC Style Mix';

  const isMatched = dpadColor.id === aButtonColor.id && aButtonColor.id === bButtonColor.id;
  return isMatched ? dpadColor.name : 'Mixed Colors';
};

export const getScreenLabel = (config: GbaConfig): string => {
    const { shopMode, rgrsSubBrand, lensColor } = config;
    const isFunnyplaying = shopMode === 'funnyplaying';
    const isRgrsHi = shopMode === 'rgrs' && rgrsSubBrand === 'hispeedido';
    const isSilent = shopMode === 'silentmodding';

    if (isFunnyplaying) return `3.0" Backlight M2 (${lensColor.name})`;
    if (isRgrsHi || isSilent) return `Hispeedido V5 720x480 (${lensColor.name})`;
    return `FP Backlight Kit`;
};

export const getButtonColorStyle = (color: ColorOption): React.CSSProperties => {
  if (color.id.includes('snes-set')) {
    return { background: 'linear-gradient(135deg, #6e707c 0%, #6e707c 33%, #8161b1 33%, #8161b1 66%, #cdc5e6 66%, #cdc5e6 100%)' };
  }
  if (color.id.includes('dmg-set')) {
    return { background: 'linear-gradient(135deg, #343434 0%, #343434 50%, #e1316a 50%, #e1316a 100%)' };
  }
  // Matches both 'sfc-set' and 'hi-sfc-mix' (which is the logic for Hispeedido locked sets)
  if (color.id.includes('sfc-set') || color.id.includes('sfc-mix')) {
    return { background: 'conic-gradient(#6e707c 0deg 90deg, #3cb6ab 90deg 180deg, #4a83df 180deg 270deg, #fa5949 270deg 360deg)' };
  }
  return { backgroundColor: color.hex };
};