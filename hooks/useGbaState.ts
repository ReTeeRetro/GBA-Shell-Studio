import { useState, useCallback, useEffect } from 'react';
import { ColorOption, GbaConfig, ShopMode, RgrsSubBrand, ConsoleType } from '../types';
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
import { deserializeConfig } from '../utils/urlUtils';

// --- COLOR MATCHING HELPERS ---

const hexToRgb = (hex: string) => {
  if (hex.startsWith('url')) return { r: 128, g: 128, b: 128 }; // Dummy for gradient
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return { r, g, b };
};

const colorDistance = (hex1: string, hex2: string) => {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  // Using weighted distance for better visual matching
  return Math.sqrt(
    Math.pow((c1.r - c2.r) * 0.3, 2) +
    Math.pow((c1.g - c2.g) * 0.59, 2) +
    Math.pow((c1.b - c2.b) * 0.11, 2)
  );
};

const findClosestColor = (targetHex: string, options: ColorOption[]): ColorOption => {
  if (!options.length) return options[0];
  return options.reduce((prev, curr) => {
    return colorDistance(targetHex, curr.hex) < colorDistance(targetHex, prev.hex) ? curr : prev;
  });
};

// --- HELPERS FOR CONSTRAINT SOLVER ---

const getMembraneList = (config: GbaConfig) => {
    const isRgrs = config.shopMode === 'rgrs';
    const isSilent = config.shopMode === 'silentmodding';
    
    if (isSilent) return SILENTMODDING_FUNNYPLAYING_MEMBRANE_COLORS;
    if (isRgrs) return RGRS_FUNNYPLAYING_MEMBRANE_COLORS;
    if (config.shopMode === 'funnyplaying') return FUNNYPLAYING_MEMBRANE_COLORS;
    return FUNNYPLAYING_MEMBRANE_COLORS; // Default fallback
};

const getButtonList = (config: GbaConfig) => {
    const isRgrs = config.shopMode === 'rgrs';
    const isSilent = config.shopMode === 'silentmodding';
    
    if (isSilent) return SILENTMODDING_FUNNYPLAYING_BUTTON_COLORS;
    if (isRgrs) return RGRS_FUNNYPLAYING_BUTTON_COLORS;
    if (config.shopMode === 'funnyplaying') return FUNNYPLAYING_BUTTON_COLORS;
    return FUNNYPLAYING_BUTTON_COLORS;
};

const getDefaultMembrane = (list: ColorOption[]) => {
    return list.find(m => m.name.toLowerCase() === 'light grey') || 
           list.find(m => m.name.toLowerCase() === 'grey') || 
           list.find(m => m.name.toLowerCase() === 'dark grey') || 
           list[0];
};

// --- CONSTRAINT SOLVER ---

const deriveValidConfig = (config: GbaConfig): GbaConfig => {
  let next = { ...config };

  // 1. Shop Mode Rules & Defaults
  const isRgrs = next.shopMode === 'rgrs';
  const isSilent = next.shopMode === 'silentmodding';
  const isRgrsHi = isRgrs && next.rgrsSubBrand === 'hispeedido';

  // 2. Transparency Logic
  if (next.shopMode) {
    next.isClearShell = !!next.selectedColor.forcedClear;
  } else {
    if (next.selectedColor.forcedClear) {
        next.isClearShell = true;
    }
  }

  // 3. Button Locking Logic (Hispeedido Kits)
  const isHiLocked = (isRgrsHi || isSilent) && !next.useCustomButtonsInHiMode;

  if (isHiLocked) {
    if (next.selectedColor.id.includes('sfc-grey')) {
       const sfcGrey = next.selectedColor;
       next.dpadColor = { ...sfcGrey, id: 'hi-sfc-set-dpad', name: 'SFC Mix', hex: '#6e707c' };
       next.aButtonColor = { ...sfcGrey, id: 'hi-sfc-set-a', name: 'SFC Mix', hex: '#fa5949' };
       next.bButtonColor = { ...sfcGrey, id: 'hi-sfc-set-b', name: 'SFC Mix', hex: '#fbf265' };
       next.lButtonColor = { ...sfcGrey, id: 'hi-sfc-set-l', name: 'SFC Mix', hex: '#3cb6ab' };
       next.rButtonColor = { ...sfcGrey, id: 'hi-sfc-set-r', name: 'SFC Mix', hex: '#4a83df' };
       next.leftBumperColor = { ...sfcGrey, id: 'hi-sfc-set-lbump', name: 'SFC Mix', hex: '#6e707c' };
       next.rightBumperColor = { ...sfcGrey, id: 'hi-sfc-set-rbump', name: 'SFC Mix', hex: '#6e707c' };
       next.powerSwitchColor = DARK_GREY_BTN;
       next.startSelectColor = HISPEEDIDO_DEFAULT_MEM;
       next.isClearButtons = false;
    } else {
       next.dpadColor = HISPEEDIDO_DEFAULT_BTN;
       next.aButtonColor = HISPEEDIDO_DEFAULT_BTN;
       next.bButtonColor = HISPEEDIDO_DEFAULT_BTN;
       next.lButtonColor = HISPEEDIDO_DEFAULT_BTN;
       next.rButtonColor = HISPEEDIDO_DEFAULT_BTN;
       next.leftBumperColor = HISPEEDIDO_DEFAULT_BTN;
       next.rightBumperColor = HISPEEDIDO_DEFAULT_BTN;
       next.powerSwitchColor = DARK_GREY_BTN;
       next.startSelectColor = HISPEEDIDO_DEFAULT_MEM;
       next.isClearButtons = false;
    }
  } else if (next.shopMode) {
      // 4. Shop Inventory Validation
      const btnList = getButtonList(next);
      const isCurrentBtnValid = (id: string) => btnList.some(b => b.id === id);
      
      const fixButton = (color: ColorOption) => isCurrentBtnValid(color.id) ? color : findClosestColor(color.hex, btnList);

      next.dpadColor = fixButton(next.dpadColor);
      next.aButtonColor = fixButton(next.aButtonColor);
      next.bButtonColor = fixButton(next.bButtonColor);
      next.lButtonColor = fixButton(next.lButtonColor);
      next.rButtonColor = fixButton(next.rButtonColor);
      next.leftBumperColor = fixButton(next.leftBumperColor);
      next.rightBumperColor = fixButton(next.rightBumperColor);
      next.powerSwitchColor = fixButton(next.powerSwitchColor);

      // Check Membranes
      const memList = getMembraneList(next);
      const isCurrentMemValid = memList.some(m => m.id === next.startSelectColor.id);
      
      if (!isCurrentMemValid) {
          next.startSelectColor = findClosestColor(next.startSelectColor.hex, memList);
      }
      
      next.isClearButtons = !!next.startSelectColor.forcedClear;

      // Lens validation for Shop Mode (ensure no custom lens colors)
      const isCurrentLensValid = LENS_COLORS.some(l => l.id === next.lensColor.id);
      if (!isCurrentLensValid) {
          next.lensColor = findClosestColor(next.lensColor.hex, LENS_COLORS);
      }
  }

  // 5. GBC Rules - Handled implicitly by components/GbcPreview.tsx which supports transparency now.

  return next;
};

// --- HOOK ---

export interface GbaStateResult {
    config: GbaConfig;
    setters: {
        setConsoleType: (val: ConsoleType) => void;
        setSelectedColor: (val: ColorOption) => void;
        setDpadColor: (val: ColorOption) => void;
        setAButtonColor: (val: ColorOption) => void;
        setBButtonColor: (val: ColorOption) => void;
        setStartSelectColor: (val: ColorOption) => void;
        setPowerSwitchColor: (val: ColorOption) => void;
        setLButtonColor: (val: ColorOption) => void;
        setRButtonColor: (val: ColorOption) => void;
        setLeftBumperColor: (val: ColorOption) => void;
        setRightBumperColor: (val: ColorOption) => void;
        setAllButtonsColor: (val: ColorOption) => void;
        setLensColor: (val: ColorOption) => void;
        setGbcLogoGameBoyColor: (val: ColorOption) => void;
        setGbcLogoColorWordColor: (val: ColorOption) => void;
        setGbcLogoColor: (val: ColorOption) => void;
        setIsClearShell: (val: boolean) => void;
        setIsClearButtons: (val: boolean) => void;
        setIsScreenOn: (val: boolean) => void;
        setShopMode: (val: ShopMode) => void;
        setRgrsSubBrand: (val: RgrsSubBrand) => void;
        setUseCustomButtonsInHiMode: (val: boolean) => void;
        setGbcLensOffset: (val: { x: number; y: number }) => void;
        setGbcScreenOffset: (val: { x: number; y: number }) => void;
        setGbcSpeakerOffset: (val: { x: number; y: number }) => void;
    };
    randomize: () => void;
    reset: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const useGbaState = (): GbaStateResult => {
  // GBA Defaults
  const defaultGbaShell = SHELL_COLORS[1]; // Indigo
  const defaultGbaButtons = SHELL_COLORS[4]; // Grey
  
  // GBC Defaults
  const defaultGbcShell = GBC_SHELL_COLORS[1]; // Berry
  const defaultGbcButtons = GBC_BUTTON_GREY; // Dark Dark Grey
  
  const defaultLens = LENS_COLORS[0]; // Black
  const defaultGbcLogoGameBoy = GBC_LOGO_COLORS[5]; // Standard Grey
  const defaultGbcLogoColor = GBC_LOGO_COLORS[0]; // Multi

  // Internal flag to track if we should apply the "First Switch" signature theme
  const [hasSeenGbc, setHasSeenGbc] = useState(false);

  const getInitialConfig = (): GbaConfig => {
    const initialData = typeof window !== 'undefined' ? deserializeConfig(window.location.search) : {};
    const sMode = initialData.shopMode || null;
    const cType = initialData.consoleType || 'gba';
    
    // Choose base defaults based on the initial console type
    const shellDefault = cType === 'gbc' ? defaultGbcShell : defaultGbaShell;
    const buttonDefault = cType === 'gbc' ? defaultGbcButtons : defaultGbaButtons;

    return deriveValidConfig({
      consoleType: cType,
      selectedColor: initialData.selectedColor || shellDefault,
      dpadColor: initialData.dpadColor || buttonDefault,
      aButtonColor: initialData.aButtonColor || buttonDefault,
      bButtonColor: initialData.bButtonColor || buttonDefault,
      startSelectColor: initialData.startSelectColor || buttonDefault,
      powerSwitchColor: initialData.powerSwitchColor || (cType === 'gba' ? DARK_GREY_BTN : defaultGbcButtons),
      lButtonColor: initialData.lButtonColor || buttonDefault,
      rButtonColor: initialData.rButtonColor || buttonDefault,
      leftBumperColor: initialData.leftBumperColor || buttonDefault,
      rightBumperColor: initialData.rightBumperColor || buttonDefault,
      lensColor: initialData.lensColor || defaultLens,
      gbcLogoGameBoyColor: initialData.gbcLogoGameBoyColor || defaultGbcLogoGameBoy,
      gbcLogoColorWordColor: initialData.gbcLogoColorWordColor || defaultGbcLogoColor,
      isClearShell: initialData.isClearShell ?? false,
      isClearButtons: initialData.isClearButtons ?? false,
      shopMode: sMode,
      rgrsSubBrand: (initialData as any).rgrsSubBrand || 'funnyplaying',
      useCustomButtonsInHiMode: initialData.useCustomButtonsInHiMode ?? false,
      isScreenOn: initialData.isScreenOn ?? (sMode ? false : true),
      gbcLensOffset: (initialData as any).gbcLensOffset || { x: 31, y: 39 },
      gbcScreenOffset: (initialData as any).gbcScreenOffset || { x: 0, y: 0 },
      gbcSpeakerOffset: (initialData as any).gbcSpeakerOffset || { x: 485, y: 880 },
    });
  };

  const [config, setConfig] = useState<GbaConfig>(getInitialConfig);
  const [past, setPast] = useState<GbaConfig[]>([]);
  const [future, setFuture] = useState<GbaConfig[]>([]);

  // If we start as GBC, we've effectively already "seen" it
  useEffect(() => {
    if (config.consoleType === 'gbc' || window.location.search.length > 0) {
      setHasSeenGbc(true);
    }
  }, []);

  const updateConfig = useCallback((partialNext: Partial<GbaConfig>) => {
    const proposed = { ...config, ...partialNext };
    const validated = deriveValidConfig(proposed);

    setPast((p) => [...p.slice(-49), config]);
    setFuture([]);
    setConfig(validated);
  }, [config]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture((f) => [config, ...f]);
    setPast(newPast);
    setConfig(previous);
  }, [config, past]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast((p) => [...p, config]);
    setFuture(newFuture);
    setConfig(next);
  }, [config, future]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const setters = {
    setConsoleType: (val: ConsoleType) => {
        const updates: Partial<GbaConfig> = { 
            consoleType: val, 
            shopMode: val === 'gbc' ? null : config.shopMode 
        };

        // Signature Start Logic:
        // If this is the FIRST time switching to GBC, and the colors currently match the GBA defaults
        // (Indigo/Grey), then switch to the GBC defaults (Berry/DarkDarkGrey).
        if (val === 'gbc' && !hasSeenGbc) {
            const isDefaultGbaColors = 
                config.selectedColor.id === defaultGbaShell.id && 
                config.dpadColor.id === defaultGbaButtons.id;
            
            if (isDefaultGbaColors) {
                updates.selectedColor = defaultGbcShell;
                updates.dpadColor = defaultGbcButtons;
                updates.aButtonColor = defaultGbcButtons;
                updates.bButtonColor = defaultGbcButtons;
                updates.startSelectColor = defaultGbcButtons;
                updates.powerSwitchColor = defaultGbcButtons;
            }
            setHasSeenGbc(true);
        }
        
        updateConfig(updates);
    },
    setSelectedColor: (val: ColorOption) => updateConfig({ selectedColor: val }),
    setDpadColor: (val: ColorOption) => updateConfig({ dpadColor: val }),
    setAButtonColor: (val: ColorOption) => updateConfig({ aButtonColor: val }),
    setBButtonColor: (val: ColorOption) => updateConfig({ bButtonColor: val }),
    setStartSelectColor: (val: ColorOption) => updateConfig({ startSelectColor: val }),
    setPowerSwitchColor: (val: ColorOption) => updateConfig({ powerSwitchColor: val }),
    setLButtonColor: (val: ColorOption) => updateConfig({ lButtonColor: val }),
    setRButtonColor: (val: ColorOption) => updateConfig({ rButtonColor: val }),
    setLeftBumperColor: (val: ColorOption) => updateConfig({ leftBumperColor: val }),
    setRightBumperColor: (val: ColorOption) => updateConfig({ rightBumperColor: val }),
    setAllButtonsColor: (val: ColorOption) => {
        const updates: Partial<GbaConfig> = {
            dpadColor: val,
            aButtonColor: val,
            bButtonColor: val,
            lButtonColor: val,
            rButtonColor: val,
            leftBumperColor: val,
            rightBumperColor: val,
            startSelectColor: val,
            powerSwitchColor: val,
        };

        if (val.id.includes('snes-set')) {
            updates.dpadColor = { ...val, hex: '#6e707c' };
            updates.leftBumperColor = { ...val, hex: '#6e707c' };
            updates.rightBumperColor = { ...val, hex: '#6e707c' };
            updates.powerSwitchColor = { ...val, hex: '#6e707c' };
            updates.aButtonColor = { ...val, hex: '#8161b1' };
            updates.bButtonColor = { ...val, hex: '#8161b1' };
            updates.lButtonColor = { ...val, hex: '#cdc5e6' };
            updates.rButtonColor = { ...val, hex: '#cdc5e6' };
            
            const memList = getMembraneList({ ...config, ...updates });
            updates.startSelectColor = getDefaultMembrane(memList);
        } else if (val.id.includes('dmg-set')) {
            updates.dpadColor = { ...val, hex: '#343434' };
            updates.lButtonColor = { ...val, hex: '#343434' };
            updates.rButtonColor = { ...val, hex: '#343434' };
            updates.leftBumperColor = { ...val, hex: '#343434' };
            updates.rightBumperColor = { ...val, hex: '#343434' };
            updates.powerSwitchColor = { ...val, hex: '#343434' };
            updates.aButtonColor = { ...val, hex: '#e1316a' };
            updates.bButtonColor = { ...val, hex: '#e1316a' };
            
            const memList = getMembraneList({ ...config, ...updates });
            updates.startSelectColor = getDefaultMembrane(memList);
        } else if (val.id.includes('sfc-set')) {
            updates.dpadColor = { ...val, hex: '#6e707c' };
            updates.leftBumperColor = { ...val, hex: '#6e707c' };
            updates.rightBumperColor = { ...val, hex: '#6e707c' };
            updates.powerSwitchColor = { ...val, hex: '#6e707c' };
            updates.aButtonColor = { ...val, hex: '#fa5949' };
            updates.bButtonColor = { ...val, hex: '#fbf265' };
            updates.lButtonColor = { ...val, hex: '#3cb6ab' };
            updates.rButtonColor = { ...val, hex: '#4a83df' };
            
            const memList = getMembraneList({ ...config, ...updates });
            updates.startSelectColor = getDefaultMembrane(memList);
        } else {
            if (config.shopMode) {
               const memList = getMembraneList(config);
               const match = memList.find(m => m.name.toLowerCase() === val.name.toLowerCase());
               if (match) {
                   updates.startSelectColor = match;
               } else {
                   updates.startSelectColor = findClosestColor(val.hex, memList);
               }
            }
        }
        
        updateConfig(updates);
    },
    setLensColor: (val: ColorOption) => updateConfig({ lensColor: val }),
    setGbcLogoGameBoyColor: (val: ColorOption) => updateConfig({ gbcLogoGameBoyColor: val }),
    setGbcLogoColorWordColor: (val: ColorOption) => updateConfig({ gbcLogoColorWordColor: val }),
    setGbcLogoColor: (val: ColorOption) => {
      if (val.id === 'gbc-logo-multi') {
        updateConfig({
          gbcLogoGameBoyColor: GBC_LOGO_COLORS[5], // Standard Grey
          gbcLogoColorWordColor: GBC_LOGO_COLORS[0], // Multi
        });
      } else {
        updateConfig({
          gbcLogoGameBoyColor: val,
          gbcLogoColorWordColor: val,
        });
      }
    },
    setIsClearShell: (val: boolean) => updateConfig({ isClearShell: val }),
    setIsClearButtons: (val: boolean) => updateConfig({ isClearButtons: val }),
    setIsScreenOn: (val: boolean) => updateConfig({ isScreenOn: val }),
    setShopMode: (val: ShopMode) => {
        const updates: Partial<GbaConfig> = { shopMode: val, isScreenOn: false };
        if (val === 'rgrs') {
            updates.rgrsSubBrand = 'funnyplaying';
        } else if (val === 'silentmodding') {
            updates.useCustomButtonsInHiMode = false;
        }
        
        let targetShells = SHELL_COLORS;
        if (val === 'funnyplaying') targetShells = FUNNYPLAYING_SHELL_COLORS;
        else if (val === 'rgrs') targetShells = RGRS_FUNNYPLAYING_SHELL_COLORS;
        else if (val === 'silentmodding') targetShells = SILENTMODDING_HISPEEDIDO_SHELL_COLORS;

        // Smart color matching for shell
        updates.selectedColor = findClosestColor(config.selectedColor.hex, targetShells);

        // Smart color matching for buttons and membranes if exiting custom mode
        if (val) {
            const tempConfig = { ...config, ...updates };
            const targetBtns = getButtonList(tempConfig);
            const targetMems = getMembraneList(tempConfig);

            updates.dpadColor = findClosestColor(config.dpadColor.hex, targetBtns);
            updates.aButtonColor = findClosestColor(config.aButtonColor.hex, targetBtns);
            updates.bButtonColor = findClosestColor(config.bButtonColor.hex, targetBtns);
            updates.lButtonColor = findClosestColor(config.lButtonColor.hex, targetBtns);
            updates.rButtonColor = findClosestColor(config.rButtonColor.hex, targetBtns);
            updates.leftBumperColor = findClosestColor(config.leftBumperColor.hex, targetBtns);
            updates.rightBumperColor = findClosestColor(config.rightBumperColor.hex, targetBtns);
            updates.powerSwitchColor = findClosestColor(config.powerSwitchColor.hex, targetBtns);
            updates.startSelectColor = findClosestColor(config.startSelectColor.hex, targetMems);
            updates.lensColor = findClosestColor(config.lensColor.hex, LENS_COLORS);
        }

        updateConfig(updates);
    },
    setRgrsSubBrand: (val: RgrsSubBrand) => {
        const updates: Partial<GbaConfig> = { rgrsSubBrand: val };
        
        let targetShells = val === 'hispeedido' ? RGRS_HISPEEDIDO_SHELL_COLORS : RGRS_FUNNYPLAYING_SHELL_COLORS;
        updates.selectedColor = findClosestColor(config.selectedColor.hex, targetShells);

        updateConfig(updates);
    },
    setUseCustomButtonsInHiMode: (val: boolean) => updateConfig({ useCustomButtonsInHiMode: val }),
    setGbcLensOffset: (val: { x: number; y: number }) => updateConfig({ gbcLensOffset: val }),
    setGbcScreenOffset: (val: { x: number; y: number }) => updateConfig({ gbcScreenOffset: val }),
    setGbcSpeakerOffset: (val: { x: number; y: number }) => updateConfig({ gbcSpeakerOffset: val }),
  };

  const randomize = () => {
    const getRandomHex = () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const getRandomOption = (options: ColorOption[]) => {
      if (!config.shopMode && Math.random() < 0.25) {
        return { id: 'custom', name: 'Custom', hex: getRandomHex() };
      }
      return options[Math.floor(Math.random() * options.length)];
    };

    const isDirectFunny = config.shopMode === 'funnyplaying';
    const isRgrsFp = config.shopMode === 'rgrs' && config.rgrsSubBrand === 'funnyplaying';
    const isRgrsHi = config.shopMode === 'rgrs' && config.rgrsSubBrand === 'hispeedido';
    const isSilent = config.shopMode === 'silentmodding';
    
    let shellOptions = config.consoleType === 'gbc' ? GBC_SHELL_COLORS : SHELL_COLORS;
    if (isDirectFunny) shellOptions = FUNNYPLAYING_SHELL_COLORS;
    else if (isRgrsFp) shellOptions = RGRS_FUNNYPLAYING_SHELL_COLORS;
    else if (isRgrsHi) shellOptions = RGRS_HISPEEDIDO_SHELL_COLORS;
    else if (isSilent) shellOptions = SILENTMODDING_HISPEEDIDO_SHELL_COLORS;

    let btnOptions = getButtonList(config);
    let memOptions = getMembraneList(config);

    if (!config.shopMode) {
        btnOptions = SHELL_COLORS;
        memOptions = SHELL_COLORS;
    }

    const randomShell = getRandomOption(shellOptions);
    const randomBtn = getRandomOption(btnOptions);
    const randomMem = getRandomOption(memOptions);
    
    const updates: Partial<GbaConfig> = {
        selectedColor: randomShell,
        dpadColor: randomBtn,
        aButtonColor: randomBtn,
        bButtonColor: randomBtn,
        powerSwitchColor: randomBtn,
        startSelectColor: randomMem,
        lButtonColor: randomBtn,
        rButtonColor: randomBtn,
        leftBumperColor: randomBtn,
        rightBumperColor: randomBtn,
        lensColor: LENS_COLORS[Math.floor(Math.random() * LENS_COLORS.length)],
        gbcLogoGameBoyColor: getRandomOption(GBC_LOGO_COLORS.filter(c => c.id !== 'gbc-logo-multi')),
        gbcLogoColorWordColor: GBC_LOGO_COLORS[Math.floor(Math.random() * GBC_LOGO_COLORS.length)],
        isClearShell: randomShell.id !== 'custom' ? !!randomShell.forcedClear : config.isClearShell,
        isClearButtons: randomMem.id !== 'custom' ? !!randomMem.forcedClear : config.isClearButtons,
    };

    updateConfig(updates);
  };

  const reset = () => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.pushState({}, '', url);
      } catch (e) {
        console.warn('Unable to reset URL history', e);
      }
    }

    // Default back to GBA state on reset
    setHasSeenGbc(false); // Allow signature transition again if they reset
    updateConfig({
      consoleType: 'gba',
      selectedColor: defaultGbaShell,
      dpadColor: defaultGbaButtons,
      aButtonColor: defaultGbaButtons,
      bButtonColor: defaultGbaButtons,
      startSelectColor: defaultGbaButtons,
      powerSwitchColor: DARK_GREY_BTN,
      lButtonColor: defaultGbaButtons,
      rButtonColor: defaultGbaButtons,
      leftBumperColor: defaultGbaButtons,
      rightBumperColor: defaultGbaButtons,
      lensColor: LENS_COLORS[0],
      gbcLogoGameBoyColor: defaultGbcLogoGameBoy,
      gbcLogoColorWordColor: defaultGbcLogoColor,
      isClearShell: false,
      isClearButtons: false,
      isScreenOn: true,
      shopMode: null,
      rgrsSubBrand: 'funnyplaying',
      useCustomButtonsInHiMode: false,
      gbcLensOffset: { x: 31, y: 39 },
      gbcScreenOffset: { x: 0, y: 0 },
      gbcSpeakerOffset: { x: 485, y: 880 },
    });
  };

  return {
    config,
    setters,
    randomize,
    reset,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
};