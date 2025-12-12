import { useState } from 'react';
import { ColorOption, GbaConfig } from '../types';
import { SHELL_COLORS, LENS_COLORS } from '../constants';
import { deserializeConfig } from '../utils/urlUtils';

export const useGbaState = () => {
  // Compute initial state once by checking URL parameters
  const initialData = typeof window !== 'undefined' ? deserializeConfig(window.location.search) : {};

  // Defaults
  const defaultShell = SHELL_COLORS[1]; // Indigo
  const defaultButtons = SHELL_COLORS[4]; // Grey
  const defaultLens = LENS_COLORS[0]; // Black

  const [selectedColor, setSelectedColor] = useState<ColorOption>(initialData.selectedColor || defaultShell);
  const [dpadColor, setDpadColor] = useState<ColorOption>(initialData.dpadColor || defaultButtons);
  const [aButtonColor, setAButtonColor] = useState<ColorOption>(initialData.aButtonColor || defaultButtons);
  const [bButtonColor, setBButtonColor] = useState<ColorOption>(initialData.bButtonColor || defaultButtons);
  const [startSelectColor, setStartSelectColor] = useState<ColorOption>(initialData.startSelectColor || defaultButtons);
  
  const [lButtonColor, setLButtonColor] = useState<ColorOption>(initialData.lButtonColor || defaultButtons);
  const [rButtonColor, setRButtonColor] = useState<ColorOption>(initialData.rButtonColor || defaultButtons);
  const [leftBumperColor, setLeftBumperColor] = useState<ColorOption>(initialData.leftBumperColor || defaultButtons);
  const [rightBumperColor, setRightBumperColor] = useState<ColorOption>(initialData.rightBumperColor || defaultButtons);

  const [lensColor, setLensColor] = useState<ColorOption>(initialData.lensColor || defaultLens);
  const [isClearShell, setIsClearShell] = useState(initialData.isClearShell ?? false);
  const [isClearButtons, setIsClearButtons] = useState(initialData.isClearButtons ?? false);

  const randomize = () => {
    const getRandomHex = () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const getRandomOption = (options: ColorOption[]) => {
      // 25% chance of a completely custom random color
      if (Math.random() < 0.25) {
        return {
          id: 'custom',
          name: 'Custom',
          hex: getRandomHex(),
        };
      }
      return options[Math.floor(Math.random() * options.length)];
    };

    setSelectedColor(getRandomOption(SHELL_COLORS));
    setDpadColor(getRandomOption(SHELL_COLORS));

    // A and B buttons should share the same color for better aesthetics
    const randomButtonColor = getRandomOption(SHELL_COLORS);
    setAButtonColor(randomButtonColor);
    setBButtonColor(randomButtonColor);

    setStartSelectColor(getRandomOption(SHELL_COLORS));
    
    // Randomize bumpers/triggers as a coherent set for aesthetics, but they can be changed individually later
    const randomBumperColor = getRandomOption(SHELL_COLORS);
    setLButtonColor(randomBumperColor);
    setRButtonColor(randomBumperColor);
    setLeftBumperColor(randomBumperColor);
    setRightBumperColor(randomBumperColor);

    // Lens color should only be one of the presets (Black or White)
    setLensColor(LENS_COLORS[Math.floor(Math.random() * LENS_COLORS.length)]);
  };

  const reset = () => {
    // Reset to defaults AND clear URL
    if (typeof window !== 'undefined') {
        try {
            const url = new URL(window.location.href);
            url.search = '';
            window.history.pushState({}, '', url);
        } catch (e) {
            console.warn('Unable to reset URL history', e);
        }
    }

    setSelectedColor(SHELL_COLORS[1]);
    setDpadColor(SHELL_COLORS[4]);
    setAButtonColor(SHELL_COLORS[4]);
    setBButtonColor(SHELL_COLORS[4]);
    setStartSelectColor(SHELL_COLORS[4]);
    setLButtonColor(SHELL_COLORS[4]);
    setRButtonColor(SHELL_COLORS[4]);
    setLeftBumperColor(SHELL_COLORS[4]);
    setRightBumperColor(SHELL_COLORS[4]);
    setLensColor(LENS_COLORS[0]);
    setIsClearShell(false);
    setIsClearButtons(false);
  };

  const config: GbaConfig = {
    selectedColor,
    dpadColor,
    aButtonColor,
    bButtonColor,
    startSelectColor,
    lButtonColor,
    rButtonColor,
    leftBumperColor,
    rightBumperColor,
    lensColor,
    isClearShell,
    isClearButtons,
  };

  return {
    config,
    setters: {
      setSelectedColor,
      setDpadColor,
      setAButtonColor,
      setBButtonColor,
      setStartSelectColor,
      setLButtonColor,
      setRButtonColor,
      setLeftBumperColor,
      setRightBumperColor,
      setLensColor,
      setIsClearShell,
      setIsClearButtons,
    },
    randomize,
    reset,
  };
};
