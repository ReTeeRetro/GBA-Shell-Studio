export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export type ViewMode = 'front-off' | 'front-on' | 'back';

export type RenderMode = 'plastic' | 'matte';

export interface GbaConfig {
  selectedColor: ColorOption;
  dpadColor: ColorOption;
  aButtonColor: ColorOption;
  bButtonColor: ColorOption;
  startSelectColor: ColorOption;
  lButtonColor: ColorOption;
  rButtonColor: ColorOption;
  leftBumperColor: ColorOption;
  rightBumperColor: ColorOption;
  lensColor: ColorOption;
  isClearShell: boolean;
  isClearButtons: boolean;
}