import React, { useState, useEffect } from 'react';
import { useGba } from '../contexts/GbaContext';
import { GbaPreview } from './GbaPreview';
import { GbcPreview } from './GbcPreview';
import {
  getSavedBuild,
  saveBuildToStorage,
  clearSavedBuildFromStorage,
  formatSavedTime,
  SavedBuildData,
} from '../utils/storageUtils';
import {
  History,
  RotateCcw,
  Trash2,
  ArrowUpRight,
  Check,
  Clock,
  Save,
  Gamepad2,
} from 'lucide-react';

interface PreviousBuildCardProps {
  isDarkMode?: boolean;
}

export const PreviousBuildCard: React.FC<PreviousBuildCardProps> = ({ isDarkMode = false }) => {
  const { config, loadConfig, canUndo } = useGba();
  const [savedBuild, setSavedBuild] = useState<SavedBuildData | null>(() => getSavedBuild());
  const [justLoaded, setJustLoaded] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Auto-save changes only when the user has actively customized something in this session
  useEffect(() => {
    if (!canUndo) return;

    const timer = setTimeout(() => {
      const updated = saveBuildToStorage(config);
      if (updated) {
        setSavedBuild(updated);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [config, canUndo]);

  const handleContinue = () => {
    if (!savedBuild) return;
    loadConfig(savedBuild.config);
    setJustLoaded(true);
    setTimeout(() => setJustLoaded(false), 2500);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleManualSave = () => {
    const updated = saveBuildToStorage(config);
    if (updated) {
      setSavedBuild(updated);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const handleClear = () => {
    clearSavedBuildFromStorage();
    setSavedBuild(null);
    setShowDeleteConfirm(false);
  };

  if (!savedBuild) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all duration-300">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Previous Build</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                Local Storage
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Your customized builds are saved locally in your browser. Each time you return, the studio starts fresh, but you can restore and continue your previous design right here.
            </p>
            {canUndo && (
              <div className="mt-3.5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm"
                >
                  {justSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      Saved to Browser
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Current Build
                    </>
                  )}
                </button>
                <span className="text-xs text-slate-400 dark:text-slate-500">Auto-saves as you edit</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const savedConfig = savedBuild.config;
  const isGbc = savedConfig.consoleType === 'gbc';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-tight">
                Previous Build
              </h3>
              <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                {isGbc ? 'Game Boy Color' : 'Game Boy Advance'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Saved {formatSavedTime(savedBuild.savedAt)}</span>
            </div>
          </div>
        </div>

        {/* Delete / Clear */}
        <div className="relative">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-1 rounded-lg border border-rose-200 dark:border-rose-900/60">
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              title="Clear saved build"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main card body */}
      <div className="p-5 flex flex-col md:flex-row gap-5 items-center">
        {/* Interactive mini console preview */}
        <div
          onClick={handleContinue}
          className="w-full md:w-52 shrink-0 aspect-[16/11] md:aspect-auto rounded-xl overflow-hidden cursor-pointer group relative border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2 shadow-inner hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200"
          title="Click to continue this build"
        >
          <div className="w-full h-full flex items-center justify-center pointer-events-none transform group-hover:scale-[1.03] transition-transform duration-200">
            {isGbc ? (
              <GbcPreview
                {...savedConfig}
                idPrefix="prev-gbc"
                className="w-full h-auto pointer-events-none drop-shadow-md"
                isDarkMode={isDarkMode}
              />
            ) : (
              <GbaPreview
                {...savedConfig}
                idPrefix="prev-gba"
                className="w-full h-auto pointer-events-none drop-shadow-md"
                isDarkMode={isDarkMode}
              />
            )}
          </div>

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold shadow-lg flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Continue Build</span>
            </div>
          </div>
        </div>

        {/* Specs & Actions */}
        <div className="flex-1 w-full min-w-0 flex flex-col justify-between self-stretch">
          {/* Swatches summary */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Build Snapshot
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              {/* Shell */}
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                  style={{ backgroundColor: savedConfig.selectedColor.hex }}
                />
                <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                  {savedConfig.selectedColor.name}
                  {savedConfig.isClearShell && ' (Clear)'}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                  style={{ backgroundColor: savedConfig.aButtonColor.hex }}
                />
                <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                  {savedConfig.aButtonColor.name} Buttons
                </span>
              </div>

              {/* D-Pad */}
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                  style={{ backgroundColor: savedConfig.dpadColor.hex }}
                />
                <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                  {savedConfig.dpadColor.name} D-Pad
                </span>
              </div>

              {/* Lens */}
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                  style={{ backgroundColor: savedConfig.lensColor.hex }}
                />
                <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                  {savedConfig.lensColor.name} Lens
                </span>
              </div>
            </div>

            {savedConfig.shopMode && (
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200/60 dark:border-indigo-800/60">
                  <Gamepad2 className="w-3 h-3" />
                  Shop Mode: {savedConfig.shopMode === 'funnyplaying' ? 'FunnyPlaying' : savedConfig.shopMode === 'rgrs' ? 'Retro Game Repair Shop' : 'SilentModding'}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm transition-all duration-150 active:scale-95"
            >
              {justLoaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Loaded into Studio!</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Continue This Build</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </>
              )}
            </button>

            {canUndo && (
              <button
                type="button"
                onClick={handleManualSave}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Overwrite with the build currently in the editor"
              >
                {justSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-slate-400" />
                    <span>Save Current Design</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
