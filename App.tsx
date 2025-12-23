import { useRef, useState, useEffect } from 'react';
import { GbaPreview } from './components/GbaPreview';
import { ColorPicker } from './components/ColorPicker';
import { HeaderLogo } from './components/HeaderLogo';
import { AiCard } from './components/AiCard';
import { ShopModeCard } from './components/ShopModeCard';
import { ExampleAiImages } from './components/ExampleAiImages';
import { InfoCard } from './components/InfoCard';
import { YoutubePromo } from './components/YoutubePromo';
import { useGbaState } from './hooks/useGbaState';
import { downloadGbaImage } from './utils/downloadUtils';
import { openAiTool } from './utils/aiUtils';
import { serializeConfig } from './utils/urlUtils';
import { Download, RotateCcw, Pin, Share2, Check, Undo2, Redo2, AlertTriangle, X, Sun, Moon } from 'lucide-react';

function App() {
  const { config, setters, randomize, reset, undo, redo, canUndo, canRedo } = useGbaState();
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Default to pinned on mobile (<1024px) for better UX
  const [isPinned, setIsPinned] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [shareText, setShareText] = useState('Share');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Check for view-only mode from URL
  const searchParams = new URLSearchParams(window.location.search);
  const isViewOnly = searchParams.get('viewOnly') === '1';

  const toggleScreen = () => setters.setIsScreenOn(!config.isScreenOn);

  // Sync theme with document class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowResetConfirm(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (isViewOnly) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <GbaPreview
          ref={svgRef}
          selectedColor={config.selectedColor}
          dpadColor={config.dpadColor}
          aButtonColor={config.aButtonColor}
          bButtonColor={config.bButtonColor}
          startSelectColor={config.startSelectColor}
          lButtonColor={config.lButtonColor}
          rButtonColor={config.rButtonColor}
          leftBumperColor={config.leftBumperColor}
          rightBumperColor={config.rightBumperColor}
          lensColor={config.lensColor}
          isClearShell={config.isClearShell}
          isClearButtons={config.isClearButtons}
          isScreenOn={config.isScreenOn}
          onToggleScreen={toggleScreen}
          isDarkMode={isDark}
          shopMode={config.shopMode}
        />
      </div>
    );
  }

  const handleDownload = () => downloadGbaImage(svgRef.current, config);
  const handleOpenAi = (tool: 'chatgpt' | 'gemini') => openAiTool(tool, config);

  const confirmReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  const handleShare = async () => {
    const queryString = serializeConfig(config);
    const url = new URL(window.location.href);
    url.search = queryString;
    const finalUrl = url.toString();
    
    try {
      window.history.pushState({ path: finalUrl }, '', finalUrl);
    } catch (e) {
      console.warn('Unable to update URL history', e);
    }

    try {
      await navigator.clipboard.writeText(finalUrl);
      setShareText('Copied!');
      setTimeout(() => setShareText('Share'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <div className="shrink-0">
              <HeaderLogo />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap truncate">
              <span className="sm:hidden">GBA Studio</span>
              <span className="hidden sm:inline">GBA Shell Studio</span>
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 text-sm font-medium text-slate-500 shrink-0 ml-2">
            {/* Undo/Redo Group */}
            <div className="flex items-center gap-0.5 sm:gap-1 border-r border-slate-200 dark:border-slate-800 pr-1.5 sm:pr-2 mr-0.5 sm:mr-1">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`p-1.5 sm:p-2 rounded-full transition-all ${
                  canUndo ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-200 dark:text-slate-800 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`p-1.5 sm:p-2 rounded-full transition-all ${
                  canRedo ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-200 dark:text-slate-800 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </button>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 sm:p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full transition-all shadow-sm"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 border rounded-full transition-all shadow-sm
                ${shareText === 'Copied!' 
                  ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' 
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              title="Share Design URL"
            >
              {shareText === 'Copied!' ? <Check size={16} /> : <Share2 size={16} />}
              <span className="hidden md:inline">{shareText}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full transition-all shadow-sm"
              title="Download PNG"
            >
              <Download size={16} />
              <span className="hidden md:inline">Download</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full transition-all shadow-sm"
              title="Reset to Default"
            >
              <RotateCcw size={16} />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Preview Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              className={`w-full transition-all duration-300 ${isPinned ? 'block lg:hidden' : 'hidden'}`}
              style={{ aspectRatio: '900/550', marginBottom: '1rem' }}
            />

            <div className={`
              transition-all duration-300 ease-in-out
              ${isPinned 
                ? 'fixed top-16 left-0 right-0 z-40 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-md p-2 lg:p-0 lg:bg-transparent lg:border-none lg:shadow-none lg:backdrop-blur-none lg:static lg:sticky lg:top-24 lg:z-30' 
                : 'relative'
              }
            `}>
              {/* Pin Toggle Button */}
              <div className="absolute top-4 left-4 z-20">
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full shadow-sm border backdrop-blur-md transition-all duration-200
                    ${isPinned 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-blue-200 ring-2 ring-blue-100 dark:ring-blue-900/50' 
                      : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                    }
                  `}
                  title={isPinned ? "Unpin Viewbox" : "Pin Viewbox to Top"}
                >
                  <Pin size={18} className={`transition-transform ${isPinned ? 'fill-current rotate-45' : ''}`} />
                </button>
              </div>

              <GbaPreview
                ref={svgRef}
                selectedColor={config.selectedColor}
                dpadColor={config.dpadColor}
                aButtonColor={config.aButtonColor}
                bButtonColor={config.bButtonColor}
                startSelectColor={config.startSelectColor}
                lButtonColor={config.lButtonColor}
                rButtonColor={config.rButtonColor}
                leftBumperColor={config.leftBumperColor}
                rightBumperColor={config.rightBumperColor}
                lensColor={config.lensColor}
                isClearShell={config.isClearShell}
                isClearButtons={config.isClearButtons}
                isScreenOn={config.isScreenOn}
                onToggleScreen={toggleScreen}
                isDarkMode={isDark}
                shopMode={config.shopMode}
              />
            </div>

            <ShopModeCard 
              config={config} 
              onSetShopMode={setters.setShopMode}
              onSetRgrsSubBrand={setters.setRgrsSubBrand}
            />

            <AiCard onOpenAi={handleOpenAi} />
            <ExampleAiImages />
            <YoutubePromo />
          </div>

          {/* Right: Controls */}
          <div className="space-y-6">
            <ColorPicker
              selectedColor={config.selectedColor}
              onSelectColor={setters.setSelectedColor}
              dpadColor={config.dpadColor}
              onSelectDpadColor={setters.setDpadColor}
              aButtonColor={config.aButtonColor}
              onSelectAButtonColor={setters.setAButtonColor}
              bButtonColor={config.bButtonColor}
              onSelectBButtonColor={setters.setBButtonColor}
              startSelectColor={config.startSelectColor}
              onSelectStartSelectColor={setters.setStartSelectColor}
              
              lButtonColor={config.lButtonColor}
              onSelectLButtonColor={setters.setLButtonColor}
              rButtonColor={config.rButtonColor}
              onSelectRButtonColor={setters.setRButtonColor}
              leftBumperColor={config.leftBumperColor}
              onSelectLeftBumperColor={setters.setLeftBumperColor}
              rightBumperColor={config.rightBumperColor}
              onSelectRightBumperColor={setters.setRightBumperColor}
              onSelectAllButtonsColor={setters.setAllButtonsColor}

              lensColor={config.lensColor}
              onSelectLensColor={setters.setLensColor}
              onRandomize={randomize}
              isClearShell={config.isClearShell}
              onToggleClearShell={() => setters.setIsClearShell(!config.isClearShell)}
              isClearButtons={config.isClearButtons}
              onToggleClearButtons={() => setters.setIsClearButtons(!config.isClearButtons)}
              isScreenOn={config.isScreenOn}
              onToggleScreenOn={() => setters.setIsScreenOn(!config.isScreenOn)}
              shopMode={config.shopMode}
              rgrsSubBrand={config.rgrsSubBrand}
              useCustomButtonsInHiMode={config.useCustomButtonsInHiMode}
              onToggleCustomButtonsInHiMode={setters.setUseCustomButtonsInHiMode}
            />

            <InfoCard />
          </div>
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowResetConfirm(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-amber-500 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset design?</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">This will revert all shell and button colors to the classic Indigo theme. You cannot undo this action.</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md shadow-red-100 dark:shadow-red-900/20 transition-all active:scale-[0.98]"
                >
                  Reset Design
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setShowResetConfirm(false)}
              className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12 py-8 text-center text-slate-400 dark:text-slate-500 text-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors">
        <p>
          &copy; {new Date().getFullYear()} GBA Shell Studio by ReTee Retro. Version 2.0.1. Not
          affiliated with Nintendo.
        </p>
      </footer>
    </div>
  );
}

export default App;