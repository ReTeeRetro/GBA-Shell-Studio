import { GbaConfig } from '../types';

export const generateAiPrompt = (config: GbaConfig): string => {
  return `Create a realistic high-resolution render of a Game Boy Advance.
Follow these exact colors from the provided design:

Shell: ${config.selectedColor.name} (Hex: ${config.selectedColor.hex})
Lens: ${config.lensColor.name} (Hex: ${config.lensColor.hex})
D-Pad: ${config.dpadColor.name} (Hex: ${config.dpadColor.hex})
Button A: ${config.aButtonColor.name} (Hex: ${config.aButtonColor.hex})
Button B: ${config.bButtonColor.name} (Hex: ${config.bButtonColor.hex})
Start/Select: ${config.startSelectColor.name} (Hex: ${config.startSelectColor.hex})
Bumpers: ${config.bumpersColor.name} (Hex: ${config.bumpersColor.hex})
Shell Type: ${config.isClearShell ? 'Transparent/Clear Plastic' : 'Solid Plastic'}

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
