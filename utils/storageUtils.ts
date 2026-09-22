import { GbaConfig } from '../types';

export interface SavedBuildData {
  config: GbaConfig;
  savedAt: number;
}

export const STORAGE_KEY = 'gba_shell_studio_saved_build';

export const getSavedBuild = (): SavedBuildData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.config || !parsed.config.selectedColor) return null;
    return parsed as SavedBuildData;
  } catch (err) {
    console.warn('Failed to load saved build from localStorage:', err);
    return null;
  }
};

export const saveBuildToStorage = (config: GbaConfig): SavedBuildData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data: SavedBuildData = {
      config,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('Failed to save build to localStorage:', err);
    return null;
  }
};

export const clearSavedBuildFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear saved build from localStorage:', err);
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
