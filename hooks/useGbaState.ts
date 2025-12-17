
import { useState, useCallback, useEffect } from 'react';
import { ColorOption, GbaConfig } from '../types';
import { SHELL_COLORS, LENS_COLORS } from '../constants';
import { deserializeConfig } from '../utils/urlUtils';

export const useGbaState = () => {
  // Defaults
  const defaultShell = SHELL_COLORS[1]; // Indigo
  const defaultButtons = SHELL_COLORS[4]; // Grey
  const defaultLens = LENS_COLORS[0]; // Black

  // Compute initial state once by checking URL parameters
  const getInitialConfig = (): GbaConfig => {
    const initialData = typeof window !== 'undefined' ? deserializeConfig(window.location.search) : {};
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
      isScreenOn: initialData.isScreenOn ?? true,
    };
  };

  const [config, setConfig] = useState<GbaConfig>(getInitialConfig);
  const [past, setPast] = useState<GbaConfig[]>([]);
  const [future, setFuture] = useState<GbaConfig[]>([]);

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
    setSelectedColor: (val: ColorOption) => updateConfig({ ...config, selectedColor: val }),
    setDpadColor: (val: ColorOption) => updateConfig({ ...config, dpadColor: val }),
    setAButtonColor: (val: ColorOption) => updateConfig({ ...config, aButtonColor: val }),
    setBButtonColor: (val: ColorOption) => updateConfig({ ...config, bButtonColor: val }),
    setStartSelectColor: (val: ColorOption) => updateConfig({ ...config, startSelectColor: val }),
    setLButtonColor: (val: ColorOption) => updateConfig({ ...config, lButtonColor: val }),
    setRButtonColor: (val: ColorOption) => updateConfig({ ...config, rButtonColor: val }),
    setLeftBumperColor: (val: ColorOption) => updateConfig({ ...config, leftBumperColor: val }),
    setRightBumperColor: (val: ColorOption) => updateConfig({ ...config, rightBumperColor: val }),
    setAllButtonsColor: (val: ColorOption) => updateConfig({
      ...config,
      dpadColor: val,
      aButtonColor: val,
      bButtonColor: val,
      startSelectColor: val,
      lButtonColor: val,
      rButtonColor: val,
      leftBumperColor: val,
      rightBumperColor: val,
    }),
    setLensColor: (val: ColorOption) => updateConfig({ ...config, lensColor: val }),
    setIsClearShell: (val: boolean) => updateConfig({ ...config, isClearShell: val }),
    setIsClearButtons: (val: boolean) => updateConfig({ ...config, isClearButtons: val }),
    setIsScreenOn: (val: boolean) => updateConfig({ ...config, isScreenOn: val }),
  };

  const randomize = () => {
    const getRandomHex = () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const getRandomOption = (options: ColorOption[]) => {
      if (Math.random() < 0.25) {
        return { id: 'custom', name: 'Custom', hex: getRandomHex() };
      }
      return options[Math.floor(Math.random() * options.length)];
    };

    const randomButtonColor = getRandomOption(SHELL_COLORS);
    const randomBumperColor = getRandomOption(SHELL_COLORS);

    const nextConfig: GbaConfig = {
      ...config,
      selectedColor: getRandomOption(SHELL_COLORS),
      dpadColor: getRandomOption(SHELL_COLORS),
      aButtonColor: randomButtonColor,
      bButtonColor: randomButtonColor,
      startSelectColor: getRandomOption(SHELL_COLORS),
      lButtonColor: randomBumperColor,
      rButtonColor: randomBumperColor,
      leftBumperColor: randomBumperColor,
      rightBumperColor: randomBumperColor,
      lensColor: LENS_COLORS[Math.floor(Math.random() * LENS_COLORS.length)],
    };

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
