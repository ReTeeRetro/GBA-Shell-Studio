export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  shopUrl?: string;
  forcedClear?: boolean;
}

export type ViewMode = 'front-off' | 'front-on' | 'back';

export type RenderMode = 'plastic' | 'matte';

export type ShopMode = 'funnyplaying' | 'rgrs' | 'silentmodding' | null;

export type RgrsSubBrand = 'funnyplaying' | 'hispeedido';

export interface GbaConfig {
  selectedColor: ColorOption;
  dpadColor: ColorOption;
  aButtonColor: ColorOption;
  bButtonColor: ColorOption;
  startSelectColor: ColorOption;
  powerSwitchColor: ColorOption;
  lButtonColor: ColorOption;
  rButtonColor: ColorOption;
  leftBumperColor: ColorOption;
  rightBumperColor: ColorOption;
  lensColor: ColorOption;
  isClearShell: boolean;
  isClearButtons: boolean;
  isScreenOn: boolean;
  shopMode: ShopMode;
  rgrsSubBrand: RgrsSubBrand;
  useCustomButtonsInHiMode: boolean;
}