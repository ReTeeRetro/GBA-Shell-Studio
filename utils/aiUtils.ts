import { GbaConfig } from '../types';

export const generateAiPrompt = (config: GbaConfig): string => {
  return `Create a realistic high-resolution render of a Game Boy Advance.
Follow these exact colors from the provided design:

Shell: ${config.selectedColor.name} (Hex: ${config.selectedColor.hex})
Lens (Bevel around the screen): ${config.lensColor.name} (Hex: ${config.lensColor.hex})
D-Pad: ${config.dpadColor.name} (Hex: ${config.dpadColor.hex})
Button A: ${config.aButtonColor.name} (Hex: ${config.aButtonColor.hex})
Button B: ${config.bButtonColor.name} (Hex: ${config.bButtonColor.hex})
Start/Select: ${config.startSelectColor.name} (Hex: ${config.startSelectColor.hex})
L Button (Trigger): ${config.lButtonColor.name} (Hex: ${config.lButtonColor.hex})
R Button (Trigger): ${config.rButtonColor.name} (Hex: ${config.rButtonColor.hex})
Left Side Bumper: ${config.leftBumperColor.name} (Hex: ${config.leftBumperColor.hex})
Right Side Bumper: ${config.rightBumperColor.name} (Hex: ${config.rightBumperColor.hex})
Shell Material: ${config.isClearShell ? 'Transparent/Clear Plastic' : 'Solid Plastic'}
Buttons Material: ${config.isClearButtons ? 'Transparent/Clear Plastic' : 'Solid Plastic'}

The render should look like a real product photo of a Game Boy Advance.`;
};

export const openAiTool = (tool: 'chatgpt' | 'gemini', config: GbaConfig) => {
  const prompt = generateAiPrompt(config);
  const encodedPrompt = encodeURIComponent(prompt);

  let url = '';
  if (tool === 'chatgpt') {
    url = `https://chat.openai.com/?q=${encodedPrompt}`;
  } else {
    url = `https://gemini.google.com/app?prompt=${encodedPrompt}`;
  }

  window.open(url, '_blank');
};