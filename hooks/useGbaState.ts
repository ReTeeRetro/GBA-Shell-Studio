import { useState } from 'react';
import { ColorOption, RenderMode, GbaConfig } from '../types';
import { SHELL_COLORS, LENS_COLORS } from '../constants';

export const useGbaState = () => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(SHELL_COLORS[1]);
  const [dpadColor, setDpadColor] = useState<ColorOption>(SHELL_COLORS[4]); // Default to Platinum
  const [aButtonColor, setAButtonColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [bButtonColor, setBButtonColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [startSelectColor, setStartSelectColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [bumpersColor, setBumpersColor] = useState<ColorOption>(SHELL_COLORS[4]);
  const [lensColor, setLensColor] = useState<ColorOption>(LENS_COLORS[0]); // Default to Black
  const [showButtonEffects, setShowButtonEffects] = useState(true);
  const [renderMode, setRenderMode] = useState<RenderMode>('plastic');
  const [isClearShell, setIsClearShell] = useState(false);

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
    setBumpersColor(getRandomOption(SHELL_COLORS));

    // Lens color should only be one of the presets (Black or White)
    setLensColor(LENS_COLORS[Math.floor(Math.random() * LENS_COLORS.length)]);
  };

  const reset = () => {
    setSelectedColor(SHELL_COLORS[1]);
    setDpadColor(SHELL_COLORS[4]);
    setAButtonColor(SHELL_COLORS[4]);
    setBButtonColor(SHELL_COLORS[4]);
    setStartSelectColor(SHELL_COLORS[4]);
    setBumpersColor(SHELL_COLORS[4]);
    setLensColor(LENS_COLORS[0]);
    setShowButtonEffects(true);
    setRenderMode('plastic');
    setIsClearShell(false);
  };

  const config: GbaConfig = {
    selectedColor,
    dpadColor,
    aButtonColor,
    bButtonColor,
    startSelectColor,
    bumpersColor,
    lensColor,
    isClearShell,
  };

  return {
    config,
    renderSettings: {
      renderMode,
      showButtonEffects,
    },
    setters: {
      setSelectedColor,
      setDpadColor,
      setAButtonColor,
      setBButtonColor,
      setStartSelectColor,
      setBumpersColor,
      setLensColor,
      setRenderMode,
      setShowButtonEffects,
      setIsClearShell,
    },
    randomize,
    reset,
  };
};
