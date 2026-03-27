export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  shopUrl?: string;
  forcedClear?: boolean;
  isTranslucent?: boolean;
}

export type ViewMode = 'front-off' | 'front-on' | 'back';

export type RenderMode = 'plastic' | 'matte';

export type ShopMode = 'funnyplaying' | 'rgrs' | 'silentmodding' | null;

export type RgrsSubBrand = 'funnyplaying' | 'hispeedido';

export type ConsoleType = 'gba' | 'gbc';

export interface GbaConfig {
  consoleType: ConsoleType;
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
  gbcLensOffset: { x: number; y: number };
  gbcScreenOffset: { x: number; y: number };
  gbcSpeakerOffset: { x: number; y: number };
  gbcLogoGameBoyColor: ColorOption;
  gbcLogoColorWordColor: ColorOption;
}