import { GbaConfig, ColorOption, ShopMode } from '../types';
import { SHELL_COLORS, LENS_COLORS, FUNNYPLAYING_SHELL_COLORS, RGRS_FUNNYPLAYING_SHELL_COLORS, RGRS_HISPEEDIDO_SHELL_COLORS, SILENTMODDING_HISPEEDIDO_SHELL_COLORS, SILENTMODDING_FUNNYPLAYING_BUTTON_COLORS, FUNNYPLAYING_BUTTON_COLORS, RGRS_FUNNYPLAYING_BUTTON_COLORS, FUNNYPLAYING_MEMBRANE_COLORS, RGRS_FUNNYPLAYING_MEMBRANE_COLORS, SILENTMODDING_FUNNYPLAYING_MEMBRANE_COLORS } from '../constants';

const PARAM_MAP: Record<keyof GbaConfig, string> = {
  selectedColor: 'shell',
  dpadColor: 'dpad',
  aButtonColor: 'btn_a',
  bButtonColor: 'btn_b',
  startSelectColor: 'btn_ss',
  lButtonColor: 'btn_l',
  rButtonColor: 'btn_r',
  leftBumperColor: 'bump_l',
  rightBumperColor: 'bump_r',
  lensColor: 'lens',
  isClearShell: 'clear_shell',
  isClearButtons: 'clear_btns',
  isScreenOn: 'screen_on',
  shopMode: 'shop_mode',
  rgrsSubBrand: 'rgrs_brand',
  useCustomButtonsInHiMode: 'hi_custom_btns',
};

// Helper to convert a ColorOption to a string for the URL
const encodeColor = (color: ColorOption): string => {
  if (color.id === 'custom') {
    return `custom-${color.hex.replace('#', '')}`;
  }
  return color.id;
};

// Helper to convert a string from URL back to a ColorOption
const decodeColor = (param: string | null, presets: ColorOption[]): ColorOption | undefined => {
  if (!param) return undefined;

  // 1. Check presets first
  const preset = presets.find((c) => c.id === param);
  if (preset) return preset;

  // 2. Check for custom hex format "custom-FFAA00"
  if (param.startsWith('custom-')) {
    const hexPart = param.replace('custom-', '');
    // Validate hex (3 or 6 chars)
    if (/^[0-9A-Fa-f]{3,6}$/.test(hexPart)) {
      return {
        id: 'custom',
        name: 'Custom',
        hex: `#${hexPart}`,
      };
    }
  }

  return undefined;
};

export const serializeConfig = (config: GbaConfig): string => {
  const params = new URLSearchParams();

  (Object.keys(config) as Array<keyof GbaConfig>).forEach((key) => {
    const value = config[key];
    const paramName = PARAM_MAP[key];

    if (typeof value === 'boolean') {
      if (value) params.set(paramName, '1');
    } else if (key === 'shopMode') {
      if (value) params.set(paramName, value as string);
    } else if (key === 'rgrsSubBrand') {
      if (config.shopMode === 'rgrs') params.set(paramName, value as string);
    } else {
      // It's a ColorOption
      params.set(paramName, encodeColor(value as ColorOption));
    }
  });

  return params.toString();
};

export const deserializeConfig = (searchString: string): Partial<GbaConfig> => {
  const params = new URLSearchParams(searchString);
  const config: Partial<GbaConfig> = {};

  const allShellPresets = [
    ...SHELL_COLORS, 
    ...FUNNYPLAYING_SHELL_COLORS, 
    ...RGRS_FUNNYPLAYING_SHELL_COLORS, 
    ...RGRS_HISPEEDIDO_SHELL_COLORS,
    ...SILENTMODDING_HISPEEDIDO_SHELL_COLORS
  ];

  const allButtonPresets = [
    ...SHELL_COLORS, // Base colors
    ...FUNNYPLAYING_BUTTON_COLORS,
    ...RGRS_FUNNYPLAYING_BUTTON_COLORS,
    ...SILENTMODDING_FUNNYPLAYING_BUTTON_COLORS,
    ...FUNNYPLAYING_MEMBRANE_COLORS,
    ...RGRS_FUNNYPLAYING_MEMBRANE_COLORS,
    ...SILENTMODDING_FUNNYPLAYING_MEMBRANE_COLORS
  ];

  // Colors
  config.selectedColor = decodeColor(params.get(PARAM_MAP.selectedColor), allShellPresets);
  config.dpadColor = decodeColor(params.get(PARAM_MAP.dpadColor), allButtonPresets);
  config.aButtonColor = decodeColor(params.get(PARAM_MAP.aButtonColor), allButtonPresets);
  config.bButtonColor = decodeColor(params.get(PARAM_MAP.bButtonColor), allButtonPresets);
  config.startSelectColor = decodeColor(params.get(PARAM_MAP.startSelectColor), allButtonPresets); 
  config.lButtonColor = decodeColor(params.get(PARAM_MAP.lButtonColor), allButtonPresets);
  config.rButtonColor = decodeColor(params.get(PARAM_MAP.rButtonColor), allButtonPresets);
  config.leftBumperColor = decodeColor(params.get(PARAM_MAP.leftBumperColor), allButtonPresets);
  config.rightBumperColor = decodeColor(params.get(PARAM_MAP.rightBumperColor), allButtonPresets);
  
  config.lensColor = decodeColor(params.get(PARAM_MAP.lensColor), LENS_COLORS);

  // Booleans
  if (params.has(PARAM_MAP.isClearShell)) {
    config.isClearShell = params.get(PARAM_MAP.isClearShell) === '1';
  }
  if (params.has(PARAM_MAP.isClearButtons)) {
    config.isClearButtons = params.get(PARAM_MAP.isClearButtons) === '1';
  }
  if (params.has(PARAM_MAP.isScreenOn)) {
    config.isScreenOn = params.get(PARAM_MAP.isScreenOn) === '1';
  }
  if (params.has(PARAM_MAP.useCustomButtonsInHiMode)) {
    config.useCustomButtonsInHiMode = params.get(PARAM_MAP.useCustomButtonsInHiMode) === '1';
  }
  if (params.has(PARAM_MAP.shopMode)) {
    const sMode = params.get(PARAM_MAP.shopMode);
    if (sMode === 'funnyplaying' || sMode === 'rgrs' || sMode === 'silentmodding') {
      config.shopMode = sMode as ShopMode;
    }
  }
  if (params.has(PARAM_MAP.rgrsSubBrand)) {
    const rBrand = params.get(PARAM_MAP.rgrsSubBrand);
    if (rBrand === 'funnyplaying' || rBrand === 'hispeedido') {
      config.rgrsSubBrand = rBrand;
    }
  }

  // Remove undefined keys so they don't overwrite defaults with undefined
  Object.keys(config).forEach(key => {
      if (config[key as keyof GbaConfig] === undefined) {
          delete config[key as keyof GbaConfig];
      }
  });

  return config;
};