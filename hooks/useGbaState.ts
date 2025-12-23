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
  HISPEEDIDO_DEFAULT_BTN,
  HISPEEDIDO_DEFAULT_MEM
} from '../constants';
import { deserializeConfig } from '../utils/urlUtils';

export const useGbaState = () => {
  // Defaults
  const defaultShell = SHELL_COLORS[1]; // Indigo
  const defaultButtons = SHELL_COLORS[4]; // Grey
  const defaultLens = LENS_COLORS[0]; // Black

  // Compute initial state once by checking URL parameters
  const getInitialConfig = (): GbaConfig => {
    const initialData = typeof window !== 'undefined' ? deserializeConfig(window.location.search) : {};
    const sMode = initialData.shopMode || null;
    
    return {
      selectedColor: initialData.selectedColor || defaultShell,
      dpadColor: initialData.dpadColor || defaultButtons,
      aButtonColor: initialData.aButtonColor || defaultButtons,
      bButtonColor: initialData.bButtonColor || defaultButtons,
      startSelectColor: initialData.startSelectColor || defaultButtons,
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
      // Default screen to off if starting in a shop mode, unless specified in URL
      isScreenOn: initialData.isScreenOn ?? (sMode ? false : true),
    };
  };

  const [config, setConfig] = useState<GbaConfig>(getInitialConfig);
  const [past, setPast] = useState<GbaConfig[]>([]);
  const [future, setFuture] = useState<GbaConfig[]>([]);

  const applySfcMix = (currentConfig: GbaConfig, sourceColor: ColorOption) => {
    return {
      ...currentConfig,
      dpadColor: { ...sourceColor, id: 'hi-sfc-set-dpad', name: 'SFC Mix', hex: '#6e707c' },
      aButtonColor: { ...sourceColor, id: 'hi-sfc-set-a', name: 'SFC Mix', hex: '#fa5949' },
      bButtonColor: { ...sourceColor, id: 'hi-sfc-set-b', name: 'SFC Mix', hex: '#fbf265' },
      lButtonColor: { ...sourceColor, id: 'hi-sfc-set-l', name: 'SFC Mix', hex: '#3cb6ab' },
      rButtonColor: { ...sourceColor, id: 'hi-sfc-set-r', name: 'SFC Mix', hex: '#4a83df' },
      leftBumperColor: { ...sourceColor, id: 'hi-sfc-set-lbump', name: 'SFC Mix', hex: '#6e707c' },
      rightBumperColor: { ...sourceColor, id: 'hi-sfc-set-rbump', name: 'SFC Mix', hex: '#6e707c' },
      startSelectColor: HISPEEDIDO_DEFAULT_MEM,
      isClearButtons: false,
    };
  };

  const applyHiDefaultButtons = (currentConfig: GbaConfig) => {
    return {
      ...currentConfig,
      dpadColor: HISPEEDIDO_DEFAULT_BTN,
      aButtonColor: HISPEEDIDO_DEFAULT_BTN,
      bButtonColor: HISPEEDIDO_DEFAULT_BTN,
      lButtonColor: HISPEEDIDO_DEFAULT_BTN,
      rButtonColor: HISPEEDIDO_DEFAULT_BTN,
      leftBumperColor: HISPEEDIDO_DEFAULT_BTN,
      rightBumperColor: HISPEEDIDO_DEFAULT_BTN,
      startSelectColor: HISPEEDIDO_DEFAULT_MEM,
      isClearButtons: false,
    };
  };

  const applyOriginalGreyButtons = (currentConfig: GbaConfig) => {
      const isRgrsFp = currentConfig.shopMode === 'rgrs' && (currentConfig.rgrsSubBrand === 'funnyplaying' || currentConfig.rgrsSubBrand === 'hispeedido');
      const btnList = isRgrsFp ? RGRS_FUNNYPLAYING_BUTTON_COLORS : FUNNYPLAYING_BUTTON_COLORS;
      const defaultBtn = btnList.find(c => c.name.toLowerCase() === 'original grey') || btnList[2];
      
      const membraneList = isRgrsFp ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS : FUNNYPLAYING_MEMBRANE_COLORS;
      const defaultMem = membraneList.find(m => m.name.toLowerCase() === 'light grey') || membraneList[0];

      return {
          ...currentConfig,
          dpadColor: defaultBtn,
          aButtonColor: defaultBtn,
          bButtonColor: defaultBtn,
          lButtonColor: defaultBtn,
          rButtonColor: defaultBtn,
          leftBumperColor: defaultBtn,
          rightBumperColor: defaultBtn,
          startSelectColor: defaultMem,
      };
  };

  // Helper to update config and history
  const updateConfig = useCallback((nextConfig: GbaConfig) => {
    setPast((p) => [...p.slice(-49), config]);
    setFuture([]);
    setConfig(nextConfig);
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

  // Handle keyboard shortcuts
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
    setSelectedColor: (val: ColorOption) => {
        let updates: Partial<GbaConfig> = { selectedColor: val };
        if (val.id !== 'custom') {
          updates.isClearShell = !!val.forcedClear;
        }

        let nextConfig = { ...config, ...updates };

        // Handle Hispeedido locked sets
        if (config.shopMode === 'rgrs' && config.rgrsSubBrand === 'hispeedido' && !config.useCustomButtonsInHiMode) {
          if (val.id === 'hi-sfc-grey') {
            nextConfig = applySfcMix(nextConfig, val);
          } else {
            nextConfig = applyHiDefaultButtons(nextConfig);
          }
        }

        updateConfig(nextConfig);
    },
    setDpadColor: (val: ColorOption) => updateConfig({ ...config, dpadColor: val }),
    setAButtonColor: (val: ColorOption) => updateConfig({ ...config, aButtonColor: val }),
    setBButtonColor: (val: ColorOption) => updateConfig({ ...config, bButtonColor: val }),
    setStartSelectColor: (val: ColorOption) => {
        const updates: Partial<GbaConfig> = { startSelectColor: val };
        if (val.id !== 'custom') {
           updates.isClearButtons = !!val.forcedClear;
        }
        updateConfig({ ...config, ...updates });
    },
    setLButtonColor: (val: ColorOption) => updateConfig({ ...config, lButtonColor: val }),
    setRButtonColor: (val: ColorOption) => updateConfig({ ...config, rButtonColor: val }),
    setLeftBumperColor: (val: ColorOption) => updateConfig({ ...config, leftBumperColor: val }),
    setRightBumperColor: (val: ColorOption) => updateConfig({ ...config, rightBumperColor: val }),
    setAllButtonsColor: (val: ColorOption) => {
      if (config.shopMode === 'rgrs' && config.rgrsSubBrand === 'hispeedido' && !config.useCustomButtonsInHiMode) return; // Locked

      const isFunny = config.shopMode === 'funnyplaying';
      const isRgrsFp = config.shopMode === 'rgrs' && (config.rgrsSubBrand === 'funnyplaying' || config.rgrsSubBrand === 'hispeedido');
      
      // Handle Mixed Sets
      if (val.id.includes('snes-set')) {
        const dpadHex = '#6e707c';
        const triggerHex = '#cdc5e6';
        const abHex = '#8161b1';
        const ssHex = '#c9c9c9';

        const dpadColor = { ...val, hex: dpadHex };
        const triggerColor = { ...val, hex: triggerHex };
        const abColor = { ...val, hex: abHex };
        
        const membraneList = isRgrsFp ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS : FUNNYPLAYING_MEMBRANE_COLORS;
        const ssColor = membraneList.find(m => m.name.toLowerCase() === 'light grey') || { ...val, hex: ssHex };

        updateConfig({
          ...config,
          dpadColor: dpadColor,
          aButtonColor: abColor,
          bButtonColor: abColor,
          lButtonColor: triggerColor,
          rButtonColor: triggerColor,
          leftBumperColor: dpadColor,
          rightBumperColor: dpadColor,
          startSelectColor: ssColor,
        });
        return;
      }

      if (val.id.includes('dmg-set')) {
        const primaryHex = '#343434';
        const abHex = '#e1316a';
        const ssHex = '#c9c9c9';

        const primaryColor = { ...val, hex: primaryHex };
        const abColor = { ...val, hex: abHex };
        
        const membraneList = isRgrsFp ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS : FUNNYPLAYING_MEMBRANE_COLORS;
        const ssColor = membraneList.find(m => m.name.toLowerCase() === 'light grey') || { ...val, hex: ssHex };

        updateConfig({
          ...config,
          dpadColor: primaryColor,
          aButtonColor: abColor,
          bButtonColor: abColor,
          lButtonColor: primaryColor,
          rButtonColor: primaryColor,
          leftBumperColor: primaryColor,
          rightBumperColor: primaryColor,
          startSelectColor: ssColor,
        });
        return;
      }

      if (val.id.includes('sfc-set')) {
        const baseHex = '#6e707c';
        const lHex = '#3cb6ab';
        const rHex = '#4a83df';
        const aHex = '#fa5949';
        const bHex = '#fbf265';
        const ssHex = '#c9c9c9';

        const baseColor = { ...val, hex: baseHex };
        const lColor = { ...val, hex: lHex };
        const rColor = { ...val, hex: rHex };
        const aColor = { ...val, hex: aHex };
        const bColor = { ...val, hex: bHex };
        
        const membraneList = isRgrsFp ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS : FUNNYPLAYING_MEMBRANE_COLORS;
        const ssColor = membraneList.find(m => m.name.toLowerCase() === 'light grey') || { ...val, hex: ssHex };

        updateConfig({
          ...config,
          dpadColor: baseColor,
          aButtonColor: aColor,
          bButtonColor: bColor,
          lButtonColor: lColor,
          rButtonColor: rColor,
          leftBumperColor: baseColor,
          rightBumperColor: baseColor,
          startSelectColor: ssColor,
        });
        return;
      }

      // In shop mode, start/select must pull from membrane inventory
      let startColor = val;
      
      if (isFunny || isRgrsFp) {
        const membraneList = isRgrsFp ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS : FUNNYPLAYING_MEMBRANE_COLORS;
        const matchingMembrane = membraneList.find(
          m => m.name.toLowerCase() === val.name.toLowerCase()
        );
        
        if (matchingMembrane) {
          startColor = matchingMembrane;
        } else {
          // Default to Light Grey
          const lightGreyMembrane = membraneList.find(m => m.name.toLowerCase() === 'light grey');
          startColor = lightGreyMembrane || membraneList[0];
        }
      }
      
      updateConfig({
        ...config,
        dpadColor: val,
        aButtonColor: val,
        bButtonColor: val,
        startSelectColor: startColor,
        lButtonColor: val,
        rButtonColor: val,
        leftBumperColor: val,
        rightBumperColor: val,
      });
    },
    setLensColor: (val: ColorOption) => updateConfig({ ...config, lensColor: val }),
    setIsClearShell: (val: boolean) => updateConfig({ ...config, isClearShell: val }),
    setIsClearButtons: (val: boolean) => updateConfig({ ...config, isClearButtons: val }),
    setIsScreenOn: (val: boolean) => updateConfig({ ...config, isScreenOn: val }),
    setShopMode: (val: ShopMode) => {
        let nextConfig = { ...config, shopMode: val };
        
        if (val) {
            nextConfig.isScreenOn = false;
        }

        if (val === 'rgrs') {
            nextConfig.rgrsSubBrand = 'funnyplaying';
        }

        // Validate content if switching to specific inventory
        const isRgrsFp = val === 'rgrs' && nextConfig.rgrsSubBrand === 'funnyplaying';
        const isRgrsHi = val === 'rgrs' && nextConfig.rgrsSubBrand === 'hispeedido';
        const inventoryMode = val === 'funnyplaying' || isRgrsFp || isRgrsHi;

        if (inventoryMode) {
            // Validate Shell
            const currentShellList = isRgrsFp ? RGRS_FUNNYPLAYING_SHELL_COLORS : isRgrsHi ? RGRS_HISPEEDIDO_SHELL_COLORS : FUNNYPLAYING_SHELL_COLORS;
            const isCurrentShellInShop = currentShellList.some(c => c.id === config.selectedColor.id);
            let activeShell = config.selectedColor;
            if (!isCurrentShellInShop) {
                const defaultShopColor = currentShellList[0];
                nextConfig.selectedColor = defaultShopColor;
                nextConfig.isClearShell = !!defaultShopColor.forcedClear;
                activeShell = defaultShopColor;
            }

            if (isRgrsHi) {
                if (nextConfig.useCustomButtonsInHiMode) {
                   nextConfig = applyOriginalGreyButtons(nextConfig);
                } else {
                    // Lock buttons logic for Hispeedido
                    if (activeShell.id === 'hi-sfc-grey') {
                      nextConfig = applySfcMix(nextConfig, activeShell);
                    } else {
                      nextConfig = applyHiDefaultButtons(nextConfig);
                    }
                }
            } else {
                // Validate Buttons for FP
                const currentBtnList = isRgrsFp ? RGRS_FUNNYPLAYING_BUTTON_COLORS : FUNNYPLAYING_BUTTON_COLORS;
                const isCurrentBtnInShop = currentBtnList.some(c => c.id === config.dpadColor.id);
                if (!isCurrentBtnInShop) {
                    const defaultBtn = currentBtnList.find(c => c.name.toLowerCase() === 'original grey') || currentBtnList[2];
                    nextConfig.dpadColor = defaultBtn;
                    nextConfig.aButtonColor = defaultBtn;
                    nextConfig.bButtonColor = defaultBtn;
                    nextConfig.lButtonColor = defaultBtn;
                    nextConfig.rButtonColor = defaultBtn;
                    nextConfig.leftBumperColor = defaultBtn;
                    nextConfig.rightBumperColor = defaultBtn;
                }

                // Validate Membranes
                const membraneList = isRgrsFp ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS : FUNNYPLAYING_MEMBRANE_COLORS;
                const isCurrentMemInShop = membraneList.some(c => c.id === config.startSelectColor.id);
                if (!isCurrentMemInShop) {
                    const defaultMem = membraneList.find(m => m.name.toLowerCase() === 'light grey') || membraneList[0];
                    nextConfig.startSelectColor = defaultMem;
                    nextConfig.isClearButtons = !!defaultMem.forcedClear;
                }
            }
        }
        
        updateConfig(nextConfig);
    },
    setRgrsSubBrand: (val: RgrsSubBrand) => {
      if (config.shopMode !== 'rgrs') return;
      let nextConfig = { ...config, rgrsSubBrand: val };

      if (val === 'hispeedido') {
          // Select first shell in list if current isn't valid
          const isCurrentShellInShop = RGRS_HISPEEDIDO_SHELL_COLORS.some(c => c.id === config.selectedColor.id);
          let activeShell = config.selectedColor;
          if (!isCurrentShellInShop) {
              const defaultShopColor = RGRS_HISPEEDIDO_SHELL_COLORS[0];
              nextConfig.selectedColor = defaultShopColor;
              nextConfig.isClearShell = !!defaultShopColor.forcedClear;
              activeShell = defaultShopColor;
          }

          if (nextConfig.useCustomButtonsInHiMode) {
             nextConfig = applyOriginalGreyButtons(nextConfig);
          } else {
              // Lock buttons logic
              if (activeShell.id === 'hi-sfc-grey') {
                nextConfig = applySfcMix(nextConfig, activeShell);
              } else {
                nextConfig = applyHiDefaultButtons(nextConfig);
              }
          }
      } else if (val === 'funnyplaying') {
        const isCurrentShellInShop = RGRS_FUNNYPLAYING_SHELL_COLORS.some(c => c.id === config.selectedColor.id);
        if (!isCurrentShellInShop) {
            const defaultShopColor = RGRS_FUNNYPLAYING_SHELL_COLORS[0];
            nextConfig.selectedColor = defaultShopColor;
            nextConfig.isClearShell = !!defaultShopColor.forcedClear;
        }

        const isCurrentBtnInShop = RGRS_FUNNYPLAYING_BUTTON_COLORS.some(c => c.id === config.dpadColor.id);
        if (!isCurrentBtnInShop) {
            const defaultBtn = RGRS_FUNNYPLAYING_BUTTON_COLORS.find(c => c.name.toLowerCase() === 'original grey') || RGRS_FUNNYPLAYING_BUTTON_COLORS[2];
            nextConfig.dpadColor = defaultBtn;
            nextConfig.aButtonColor = defaultBtn;
            nextConfig.bButtonColor = defaultBtn;
            nextConfig.lButtonColor = defaultBtn;
            nextConfig.rButtonColor = defaultBtn;
            nextConfig.leftBumperColor = defaultBtn;
            nextConfig.rightBumperColor = defaultBtn;
        }
        
        const isCurrentMemInShop = RGRS_FUNNYPLAYING_MEMBRANE_COLORS.some(c => c.id === config.startSelectColor.id);
        if (!isCurrentMemInShop) {
            const defaultMem = RGRS_FUNNYPLAYING_MEMBRANE_COLORS.find(m => m.name.toLowerCase() === 'light grey') || RGRS_FUNNYPLAYING_MEMBRANE_COLORS[0];
            nextConfig.startSelectColor = defaultMem;
            nextConfig.isClearButtons = !!defaultMem.forcedClear;
        }
      }

      updateConfig(nextConfig);
    },
    setUseCustomButtonsInHiMode: (val: boolean) => {
        let nextConfig = { ...config, useCustomButtonsInHiMode: val };
        
        if (config.shopMode === 'rgrs' && config.rgrsSubBrand === 'hispeedido') {
            if (val) {
                // Switch to FP buttons
                nextConfig = applyOriginalGreyButtons(nextConfig);
            } else {
                // Switch back to locked
                if (config.selectedColor.id === 'hi-sfc-grey') {
                    nextConfig = applySfcMix(nextConfig, config.selectedColor);
                } else {
                    nextConfig = applyHiDefaultButtons(nextConfig);
                }
            }
        }
        
        updateConfig(nextConfig);
    }
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
    
    const shellOptions = isDirectFunny 
        ? FUNNYPLAYING_SHELL_COLORS 
        : isRgrsFp 
            ? RGRS_FUNNYPLAYING_SHELL_COLORS 
            : isRgrsHi
              ? RGRS_HISPEEDIDO_SHELL_COLORS
              : SHELL_COLORS;

    let btnOptions: ColorOption[];
    let memOptions: ColorOption[];

    if (isRgrsHi && !config.useCustomButtonsInHiMode) {
        btnOptions = [HISPEEDIDO_DEFAULT_BTN];
        memOptions = [HISPEEDIDO_DEFAULT_MEM];
    } else {
        btnOptions = isDirectFunny 
            ? FUNNYPLAYING_BUTTON_COLORS 
            : (isRgrsFp || isRgrsHi) 
              ? RGRS_FUNNYPLAYING_BUTTON_COLORS 
              : SHELL_COLORS;

        memOptions = isDirectFunny 
            ? FUNNYPLAYING_MEMBRANE_COLORS 
            : (isRgrsFp || isRgrsHi) 
              ? RGRS_FUNNYPLAYING_MEMBRANE_COLORS 
              : SHELL_COLORS;
    }

    const randomShell = getRandomOption(shellOptions);
    let nextConfig: GbaConfig = { ...config, selectedColor: randomShell };

    if (isRgrsHi && !config.useCustomButtonsInHiMode) {
      if (randomShell.id === 'hi-sfc-grey') {
        nextConfig = applySfcMix(nextConfig, randomShell);
      } else {
        nextConfig = applyHiDefaultButtons(nextConfig);
      }
    } else {
      const randomBtn = getRandomOption(btnOptions);
      const randomMem = getRandomOption(memOptions);
      nextConfig = {
        ...nextConfig,
        dpadColor: randomBtn,
        aButtonColor: randomBtn,
        bButtonColor: randomBtn,
        startSelectColor: randomMem,
        lButtonColor: randomBtn,
        rButtonColor: randomBtn,
        leftBumperColor: randomBtn,
        rightBumperColor: randomBtn,
        isClearButtons: randomMem.id !== 'custom' ? !!randomMem.forcedClear : config.isClearButtons,
      };
    }

    nextConfig.lensColor = LENS_COLORS[Math.floor(Math.random() * LENS_COLORS.length)];
    nextConfig.isClearShell = randomShell.id !== 'custom' ? !!randomShell.forcedClear : config.isClearShell;

    updateConfig(nextConfig);
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

    const nextConfig: GbaConfig = {
      selectedColor: SHELL_COLORS[1],
      dpadColor: SHELL_COLORS[4],
      aButtonColor: SHELL_COLORS[4],
      bButtonColor: SHELL_COLORS[4],
      startSelectColor: SHELL_COLORS[4],
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
    };

    updateConfig(nextConfig);
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