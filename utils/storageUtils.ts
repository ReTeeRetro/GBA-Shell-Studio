import { GbaConfig } from '../types';

export interface SavedBuildData {
  config: GbaConfig;
  savedAt: number;
}

export const STORAGE_KEY_GBA = 'gba_shell_studio_saved_build_gba';
export const STORAGE_KEY_GBC = 'gba_shell_studio_saved_build_gbc';
export const LEGACY_STORAGE_KEY = 'gba_shell_studio_saved_build';
export const AUTOSAVE_PREF_KEY = 'gba_shell_studio_autosave_enabled';

export const getAutoSaveEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(AUTOSAVE_PREF_KEY);
    if (raw === null) return true; // Enabled by default
    return raw === 'true';
  } catch {
    return true;
  }
};

export const setAutoSaveEnabledInStorage = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTOSAVE_PREF_KEY, String(enabled));
  } catch (err) {
    console.warn('Failed to save autosave preference:', err);
  }
};

export const getStorageKey = (consoleType: 'gba' | 'gbc'): string => {
  return consoleType === 'gbc' ? STORAGE_KEY_GBC : STORAGE_KEY_GBA;
};

export const isSameConfig = (a?: GbaConfig | null, b?: GbaConfig | null): boolean => {
  if (!a || !b) return false;
  return (
    a.consoleType === b.consoleType &&
    a.selectedColor?.hex === b.selectedColor?.hex &&
    a.aButtonColor?.hex === b.aButtonColor?.hex &&
    a.bButtonColor?.hex === b.bButtonColor?.hex &&
    a.dpadColor?.hex === b.dpadColor?.hex &&
    a.lensColor?.hex === b.lensColor?.hex &&
    a.startSelectColor?.hex === b.startSelectColor?.hex &&
    a.powerSwitchColor?.hex === b.powerSwitchColor?.hex &&
    a.leftBumperColor?.hex === b.leftBumperColor?.hex &&
    a.rightBumperColor?.hex === b.rightBumperColor?.hex &&
    Boolean(a.isClearShell) === Boolean(b.isClearShell) &&
    Boolean(a.isClearButtons) === Boolean(b.isClearButtons) &&
    a.shopMode === b.shopMode &&
    (a.consoleType !== 'gbc' || (
      a.gbcLogoGameBoyColor?.hex === b.gbcLogoGameBoyColor?.hex &&
      a.gbcLogoColorWordColor?.hex === b.gbcLogoColorWordColor?.hex
    ))
  );
};

export const getSavedBuild = (consoleType: 'gba' | 'gbc'): SavedBuildData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const key = getStorageKey(consoleType);
    let raw = localStorage.getItem(key);

    // If no build found under this console's specific key, check if legacy storage has one
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const legacyParsed = JSON.parse(legacyRaw);
          const legacyType: 'gba' | 'gbc' = legacyParsed?.config?.consoleType === 'gbc' ? 'gbc' : 'gba';
          if (legacyType === consoleType && legacyParsed?.config?.selectedColor) {
            // Migrate into specific key
            localStorage.setItem(key, legacyRaw);
            raw = legacyRaw;
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.config || !parsed.config.selectedColor) return null;
    return parsed as SavedBuildData;
  } catch (err) {
    console.warn(`Failed to load saved ${consoleType} build from localStorage:`, err);
    return null;
  }
};

export const saveBuildToStorage = (config: GbaConfig): SavedBuildData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const consoleType: 'gba' | 'gbc' = config.consoleType === 'gbc' ? 'gbc' : 'gba';
    const key = getStorageKey(consoleType);
    const data: SavedBuildData = {
      config,
      savedAt: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn(`Failed to save ${config.consoleType} build to localStorage:`, err);
    return null;
  }
};

export const clearSavedBuildFromStorage = (consoleType: 'gba' | 'gbc'): void => {
  if (typeof window === 'undefined') return;
  try {
    const key = getStorageKey(consoleType);
    localStorage.removeItem(key);

    // Also remove legacy key if it matched this console type
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      try {
        const legacyParsed = JSON.parse(legacyRaw);
        const legacyType = legacyParsed?.config?.consoleType === 'gbc' ? 'gbc' : 'gba';
        if (legacyType === consoleType) {
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.warn(`Failed to clear saved ${consoleType} build from localStorage:`, err);
  }
};

export const formatSavedTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 45) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) {
    const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `Yesterday at ${timeStr}`;
  }
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};
