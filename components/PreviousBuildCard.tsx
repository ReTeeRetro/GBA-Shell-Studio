import React, { useState, useEffect } from 'react';
import { useGba } from '../contexts/GbaContext';
import { GbaPreview } from './GbaPreview';
import { GbcPreview } from './GbcPreview';
import {
  getSavedBuild,
  saveBuildToStorage,
  clearSavedBuildFromStorage,
  formatSavedTime,
  isSameConfig,
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
  ShieldCheck,
} from 'lucide-react';

interface PreviousBuildCardProps {
  isDarkMode?: boolean;
}

export const PreviousBuildCard: React.FC<PreviousBuildCardProps> = ({ isDarkMode = false }) => {
  const { config, loadConfig, resetCount } = useGba();
  const currentConsole: 'gba' | 'gbc' = config.consoleType === 'gbc' ? 'gbc' : 'gba';

  // Saved builds separated by console type
  const [savedGbaBuild, setSavedGbaBuild] = useState<SavedBuildData | null>(() => getSavedBuild('gba'));
  const [savedGbcBuild, setSavedGbcBuild] = useState<SavedBuildData | null>(() => getSavedBuild('gbc'));

  // Which console's saved build is currently being inspected in the card tabs
  const [selectedTab, setSelectedTab] = useState<'gba' | 'gbc'>(() => currentConsole);

  // Track if the user has loaded or saved a build in this session for each console
  const [isEditingSavedGba, setIsEditingSavedGba] = useState<boolean>(false);
  const [isEditingSavedGbc, setIsEditingSavedGbc] = useState<boolean>(false);

  const [justLoaded, setJustLoaded] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync tab with top-level console switch
  useEffect(() => {
    setSelectedTab(currentConsole);
    setShowDeleteConfirm(false);
  }, [currentConsole]);

  // When top-level reset is triggered, pause auto-saving for that console
  useEffect(() => {
    if (resetCount > 0) {
      if (currentConsole === 'gbc') {
        setIsEditingSavedGbc(false);
      } else {
        setIsEditingSavedGba(false);
      }
    }
  }, [resetCount, currentConsole]);

  // Auto-save ONLY for the active console if it was explicitly continued or saved in this session
  useEffect(() => {
    const isAutoSaving = currentConsole === 'gbc' ? isEditingSavedGbc : isEditingSavedGba;
    if (!isAutoSaving) return;

    const timer = setTimeout(() => {
      const updated = saveBuildToStorage(config);
      if (updated) {
        if (currentConsole === 'gbc') {
          setSavedGbcBuild(updated);
        } else {
          setSavedGbaBuild(updated);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [config, currentConsole, isEditingSavedGba, isEditingSavedGbc]);

  const activeSavedBuild = selectedTab === 'gbc' ? savedGbcBuild : savedGbaBuild;
  const isEditingCurrentTab = selectedTab === 'gbc' ? isEditingSavedGbc : isEditingSavedGba;
  const isTabActiveInStudio = currentConsole === selectedTab;

  const handleContinue = (targetConsole: 'gba' | 'gbc') => {
    const buildToLoad = targetConsole === 'gbc' ? savedGbcBuild : savedGbaBuild;
    if (!buildToLoad) return;

    loadConfig(buildToLoad.config);

    if (targetConsole === 'gbc') {
      setIsEditingSavedGbc(true);
    } else {
      setIsEditingSavedGba(true);
    }

    setJustLoaded(true);
    setTimeout(() => setJustLoaded(false), 2500);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleManualSave = () => {
    const updated = saveBuildToStorage(config);
    if (updated) {
      if (currentConsole === 'gbc') {
        setSavedGbcBuild(updated);
        setIsEditingSavedGbc(true);
      } else {
        setSavedGbaBuild(updated);
        setIsEditingSavedGba(true);
      }
      setSelectedTab(currentConsole);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const handleClear = (targetConsole: 'gba' | 'gbc') => {
    clearSavedBuildFromStorage(targetConsole);
    if (targetConsole === 'gbc') {
      setSavedGbcBuild(null);
      setIsEditingSavedGbc(false);
    } else {
      setSavedGbaBuild(null);
      setIsEditingSavedGba(false);
    }
    setShowDeleteConfirm(false);
  };

  const isMatchWithStudio = activeSavedBuild ? isSameConfig(config, activeSavedBuild.config) : false;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-tight">
                Previous Builds
              </h3>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                Independent Saves
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Separate browser saves for GBA and GBC — customizing one never overwrites the other.
            </p>
          </div>
        </div>

        {/* Clear/Delete button for the currently selected tab */}
        {activeSavedBuild && (
          <div className="relative">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-1 rounded-lg border border-rose-200 dark:border-rose-900/60">
                <span className="text-[11px] font-medium text-rose-700 dark:text-rose-300 px-1">
                  Delete {selectedTab === 'gbc' ? 'GBC' : 'GBA'} save?
                </span>
                <button
                  type="button"
                  onClick={() => handleClear(selectedTab)}
                  className="px-2 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                >
                  Confirm
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
                title={`Clear saved ${selectedTab === 'gbc' ? 'Game Boy Color' : 'Game Boy Advance'} build`}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Console Tab Selector */}
      <div className="px-5 pt-3.5 pb-0 bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* GBA Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedTab('gba');
              setShowDeleteConfirm(false);
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              selectedTab === 'gba'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span>Game Boy Advance</span>
            {savedGbaBuild ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="GBA build saved" />
            ) : (
              <span className="text-[10px] opacity-60 font-normal">(Empty)</span>
            )}
            {currentConsole === 'gba' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                In Studio
              </span>
            )}
          </button>

          {/* GBC Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedTab('gbc');
              setShowDeleteConfirm(false);
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              selectedTab === 'gbc'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span>Game Boy Color</span>
            {savedGbcBuild ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="GBC build saved" />
            ) : (
              <span className="text-[10px] opacity-60 font-normal">(Empty)</span>
            )}
            {currentConsole === 'gbc' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                In Studio
              </span>
            )}
          </button>
        </div>

        {/* Tab status indicator */}
        {activeSavedBuild && (
          <div className="pb-2 hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            <span>Saved {formatSavedTime(activeSavedBuild.savedAt)}</span>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="p-5">
        {activeSavedBuild ? (
          <div className="flex flex-col md:flex-row gap-5 items-center">
            {/* Interactive Preview of the saved build */}
            <div
              onClick={() => handleContinue(selectedTab)}
              className="w-full md:w-52 shrink-0 aspect-[16/11] md:aspect-auto rounded-xl overflow-hidden cursor-pointer group relative border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2 shadow-inner hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200"
              title={`Click to load and continue this ${selectedTab === 'gbc' ? 'GBC' : 'GBA'} build`}
            >
              <div className="w-full h-full flex items-center justify-center pointer-events-none transform group-hover:scale-[1.03] transition-transform duration-200">
                {selectedTab === 'gbc' ? (
                  <GbcPreview
                    {...activeSavedBuild.config}
                    idPrefix="prev-gbc"
                    className="w-full h-auto pointer-events-none drop-shadow-md"
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <GbaPreview
                    {...activeSavedBuild.config}
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
                  <span>Continue This Build</span>
                </div>
              </div>
            </div>

            {/* Specs & Actions */}
            <div className="flex-1 w-full min-w-0 flex flex-col justify-between self-stretch">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {selectedTab === 'gbc' ? 'Game Boy Color' : 'Game Boy Advance'} Snapshot
                    </span>
                  </div>

                  {isTabActiveInStudio && isEditingCurrentTab ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active in Studio (Auto-saving)
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      title="Customizing the base console will not overwrite this save"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      Preserved (Auto-save Paused)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  {/* Shell */}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                      style={{ backgroundColor: activeSavedBuild.config.selectedColor.hex }}
                    />
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                      {activeSavedBuild.config.selectedColor.name}
                      {activeSavedBuild.config.isClearShell && ' (Clear)'}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                      style={{ backgroundColor: activeSavedBuild.config.aButtonColor.hex }}
                    />
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                      {activeSavedBuild.config.aButtonColor.name} Buttons
                    </span>
                  </div>

                  {/* D-Pad */}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                      style={{ backgroundColor: activeSavedBuild.config.dpadColor.hex }}
                    />
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                      {activeSavedBuild.config.dpadColor.name} D-Pad
                    </span>
                  </div>

                  {/* Lens */}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                      style={{ backgroundColor: activeSavedBuild.config.lensColor.hex }}
                    />
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                      {activeSavedBuild.config.lensColor.name} Lens
                    </span>
                  </div>
                </div>

                {activeSavedBuild.config.shopMode && (
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200/60 dark:border-indigo-800/60">
                      <Gamepad2 className="w-3 h-3" />
                      Shop Mode: {activeSavedBuild.config.shopMode === 'funnyplaying' ? 'FunnyPlaying' : activeSavedBuild.config.shopMode === 'rgrs' ? 'Retro Game Repair Shop' : 'SilentModding'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2.5">
                {isTabActiveInStudio && isEditingCurrentTab && isMatchWithStudio ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Currently Active in Studio</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleContinue(selectedTab)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm transition-all duration-150 active:scale-95"
                  >
                    {justLoaded && isTabActiveInStudio ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Loaded into Studio!</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Continue This {selectedTab === 'gbc' ? 'GBC' : 'GBA'} Build</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                      </>
                    )}
                  </button>
                )}

                {/* Save Current Design button for current studio console */}
                {isTabActiveInStudio && (!isEditingCurrentTab || !isMatchWithStudio) && (
                  <button
                    type="button"
                    onClick={handleManualSave}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                    title={`Save current studio design into your ${selectedTab === 'gbc' ? 'GBC' : 'GBA'} slot`}
                  >
                    {justSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Saved {selectedTab === 'gbc' ? 'GBC' : 'GBA'}!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-slate-400" />
                        <span>Save Current {selectedTab === 'gbc' ? 'GBC' : 'GBA'} Design</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Empty state for the selected console */
          <div className="py-6 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              No Saved {selectedTab === 'gbc' ? 'Game Boy Color' : 'Game Boy Advance'} Build Yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1 leading-relaxed">
              {isTabActiveInStudio ? (
                `You are currently customizing ${selectedTab === 'gbc' ? 'Game Boy Color' : 'Game Boy Advance'} in the studio. Save your design below to store it in your browser without affecting any other console.`
              ) : (
                `Switch to ${selectedTab === 'gbc' ? 'Game Boy Color' : 'Game Boy Advance'} in the top-right toggle to customize colors and save a build.`
              )}
            </p>

            {isTabActiveInStudio && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm"
                >
                  {justSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Saved to Browser!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Current {selectedTab === 'gbc' ? 'GBC' : 'GBA'} Build</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
