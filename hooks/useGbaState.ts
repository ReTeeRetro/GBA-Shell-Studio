import { useState } from 'react';
import { ColorOption, GbaConfig } from '../types';
import { SHELL_COLORS, LENS_COLORS } from '../constants';

export const useGbaState = () => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(SHELL_COLORS[1]);
  const [dpadColor, setDpadColor] = useState<ColorOption>(SHELL_COLORS[4]); // Default to Platinum
  const [aButtonColor, setAButtonColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [bButtonColor, setBButtonColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [startSelectColor, setStartSelectColor] = useState<ColorOption>(SHELL_COLORS[4]);
  
  // Split Bumpers state
  const [lButtonColor, setLButtonColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [rButtonColor, setRButtonColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [leftBumperColor, setLeftBumperColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [rightBumperColor, setRightBumperColor] = useState<ColorOption>(SHELL_COLORS[4]);

  const [lensColor, setLensColor] = useState<ColorOption>(LENS_COLORS[0]); // Default to Black
  const [isClearShell, setIsClearShell] = useState(false);
  const [isClearButtons, setIsClearButtons] = useState(false);

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