import { useState, useCallback, useEffect } from 'react';
import { ColorOption, GbaConfig, ShopMode, RgrsSubBrand } from '../types';
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
  SILENTMODDING_HISPEEDIDO_SHELL_COLORS,
  SILENTMODDING_FUNNYPLAYING_BUTTON_COLORS,
  SILENTMODDING_FUNNYPLAYING_MEMBRANE_COLORS,
  HISPEEDIDO_DEFAULT_BTN,
  HISPEEDIDO_DEFAULT_MEM,
  DARK_GREY_BTN
} from '../constants';
import { deserializeConfig } from '../utils/urlUtils';

// --- HELPERS FOR CONSTRAINT SOLVER ---

const getMembraneList = (config: GbaConfig) => {
    const isRgrsFp = config.shopMode === 'rgrs' && (config.rgrsSubBrand === 'funnyplaying' || config.rgrsSubBrand === 'hispeedido');
    const isSilent = config.shopMode === 'silentmodding';
    
    if (isSilent) return SILENTMODDING_FUNNYPLAYING_MEMBRANE_COLORS;
    if (isRgrsFp) return RGRS_FUNNYPLAYING_MEMBRANE_COLORS;
    if (config.shopMode === 'funnyplaying') return FUNNYPLAYING_MEMBRANE_COLORS;
    return FUNNYPLAYING_MEMBRANE_COLORS; // Default fallback
};

const getButtonList = (config: GbaConfig) => {
    const isRgrsFp = config.shopMode === 'rgrs' && (config.rgrsSubBrand === 'funnyplaying' || config.rgrsSubBrand === 'hispeedido');
    const isSilent = config.shopMode === 'silentmodding';
    
    if (isSilent) return SILENTMODDING_FUNNYPLAYING_BUTTON_COLORS;
    if (isRgrsFp) return RGRS_FUNNYPLAYING_BUTTON_COLORS;
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
       // Lock to SFC Mix
       const sfcGrey = next.selectedColor; // Just need a ref object
       next.dpadColor = { ...sfcGrey, id: 'hi-sfc-set-dpad', name: 'SFC Mix', hex: '#6e707c' };
       next.aButtonColor = { ...sfcGrey, id: 'hi-sfc-set-a', name: 'SFC Mix', hex: '#fa5949' };
       next.bButtonColor = { ...sfcGrey, id: 'hi-sfc-set-b', name: 'SFC Mix', hex: '#fbf265' };
       next.lButtonColor = { ...sfcGrey, id: 'hi-sfc-set-l', name: 'SFC Mix', hex: '#3cb6ab' };
       next.rButtonColor = { ...sfcGrey, id: 'hi-sfc-set-r', name: 'SFC Mix', hex: '#4a83df' };
       next.leftBumperColor = { ...sfcGrey, id: 'hi-sfc-set-lbump', name: 'SFC Mix', hex: '#6e707c' };
       next.rightBumperColor = { ...sfcGrey, id: 'hi-sfc-set-rbump', name: 'SFC Mix', hex: '#6e707c' };
       next.powerSwitchColor = DARK_GREY_BTN; // SPECIFIC EXCEPTION
       next.startSelectColor = HISPEEDIDO_DEFAULT_MEM;
       next.isClearButtons = false;
    } else {
       // Lock to Default: Regular buttons Light Grey, Power Switch Dark Grey
       next.dpadColor = HISPEEDIDO_DEFAULT_BTN;
       next.aButtonColor = HISPEEDIDO_DEFAULT_BTN;
       next.bButtonColor = HISPEEDIDO_DEFAULT_BTN;
       next.lButtonColor = HISPEEDIDO_DEFAULT_BTN;
       next.rButtonColor = HISPEEDIDO_DEFAULT_BTN;
       next.leftBumperColor = HISPEEDIDO_DEFAULT_BTN;
       next.rightBumperColor = HISPEEDIDO_DEFAULT_BTN;
       next.powerSwitchColor = DARK_GREY_BTN; // SPECIFIC EXCEPTION
       next.startSelectColor = HISPEEDIDO_DEFAULT_MEM;
       next.isClearButtons = false;
    }
  } else if (next.shopMode) {
      // 4. Shop Inventory Validation
      const btnList = getButtonList(next);
      const isCurrentBtnValid = btnList.some(b => b.id === next.dpadColor.id);
      
      if (!isCurrentBtnValid) {
          const defaultBtn = btnList.find(c => c.name.toLowerCase() === 'original grey') || btnList[2];
          next.dpadColor = defaultBtn;
          next.aButtonColor = defaultBtn;
          next.bButtonColor = defaultBtn;
          next.lButtonColor = defaultBtn;
          next.rButtonColor = defaultBtn;
          next.leftBumperColor = defaultBtn;
          next.rightBumperColor = defaultBtn;
          next.powerSwitchColor = defaultBtn;
      }

      // Check Membranes
      const memList = getMembraneList(next);
      const isCurrentMemValid = memList.some(m => m.id === next.startSelectColor.id);
      
      if (!isCurrentMemValid) {
          next.startSelectColor = getDefaultMembrane(memList);
      }
      
      next.isClearButtons = !!next.startSelectColor.forcedClear;
  }

  return next;
};

// --- HOOK ---

export interface GbaStateResult {
    config: GbaConfig;
    setters: {
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
        setIsClearShell: (val: boolean) => void;
        setIsClearButtons: (val: boolean) => void;
        setIsScreenOn: (val: boolean) => void;
        setShopMode: (val: ShopMode) => void;
        setRgrsSubBrand: (val: RgrsSubBrand) => void;
        setUseCustomButtonsInHiMode: (val: boolean) => void;
    };
    randomize: () => void;
    reset: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const useGbaState = (): GbaStateResult => {
  // Defaults
  const defaultShell = SHELL_COLORS[1]; // Indigo
  const defaultButtons = SHELL_COLORS[4]; // Grey
  const defaultLens = LENS_COLORS[0]; // Black

  const getInitialConfig = (): GbaConfig => {
    const initialData = typeof window !== 'undefined' ? deserializeConfig(window.location.search) : {};
    const sMode = initialData.shopMode || null;
    
    return deriveValidConfig({
      selectedColor: initialData.selectedColor || defaultShell,
      dpadColor: initialData.dpadColor || defaultButtons,
      aButtonColor: initialData.aButtonColor || defaultButtons,
      bButtonColor: initialData.bButtonColor || defaultButtons,
      startSelectColor: initialData.startSelectColor || defaultButtons,
      powerSwitchColor: initialData.powerSwitchColor || DARK_GREY_BTN,
      lButtonColor: initialData.lButtonColor || defaultButtons,
      rButtonColor: initialData.rButtonColor || defaultButtons,
      leftBumperColor: initialData.leftBumperColor || defaultButtons,
      rightBumperColor: initialData.rightBumperColor || defaultButtons,
      lensColor: initialData.lensColor || defaultLens,
      isClearShell: initialData.isClearShell ?? false,
      isClearButtons: initialData.isClearButtons ?? false,
      shopMode: sMode,
      rgrsSubBrand: (initialData as any).rgrsSubBrand || 'funnyplaying',
      useCustomButtonsInHiMode: initialData.useCustomButtonsInHiMode ?? false,
      isScreenOn: initialData.isScreenOn ?? (sMode ? false : true),
    });
  };

  const [config, setConfig] = useState<GbaConfig>(getInitialConfig);
  const [past, setPast] = useState<GbaConfig[]>([]);
  const [future, setFuture] = useState<GbaConfig[]>([]);

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
                   updates.startSelectColor = getDefaultMembrane(memList);
               }
            }
        }
        
        updateConfig(updates);
    },
    setLensColor: (val: ColorOption) => updateConfig({ lensColor: val }),
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

        const currentHex = config.selectedColor.hex;
        const matchingShell = targetShells.find(s => s.hex === currentHex) || targetShells[0];
        updates.selectedColor = matchingShell;

        updateConfig(updates);
    },
    setRgrsSubBrand: (val: RgrsSubBrand) => {
        const updates: Partial<GbaConfig> = { rgrsSubBrand: val };
        
        let targetShells = val === 'hispeedido' ? RGRS_HISPEEDIDO_SHELL_COLORS : RGRS_FUNNYPLAYING_SHELL_COLORS;
        const currentHex = config.selectedColor.hex;
        const matchingShell = targetShells.find(s => s.hex === currentHex) || targetShells[0];
        updates.selectedColor = matchingShell;

        updateConfig(updates);
    },
    setUseCustomButtonsInHiMode: (val: boolean) => updateConfig({ useCustomButtonsInHiMode: val })
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
    
    let shellOptions = SHELL_COLORS;
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

    updateConfig({
      selectedColor: SHELL_COLORS[1],
      dpadColor: SHELL_COLORS[4],
      aButtonColor: SHELL_COLORS[4],
      bButtonColor: SHELL_COLORS[4],
      startSelectColor: SHELL_COLORS[4],
      powerSwitchColor: DARK_GREY_BTN,
      lButtonColor: SHELL_COLORS[4],
      rButtonColor: SHELL_COLORS[4],
      leftBumperColor: SHELL_COLORS[4],
      rightBumperColor: SHELL_COLORS[4],
      lensColor: LENS_COLORS[0],
      isClearShell: false,
      isClearButtons: false,
      isScreenOn: true,
      shopMode: null,
      rgrsSubBrand: 'funnyplaying',
      useCustomButtonsInHiMode: false,
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