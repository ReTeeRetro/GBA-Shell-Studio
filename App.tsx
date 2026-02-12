import { useRef, useState, useEffect } from 'react';
import { GbaPreview } from './components/GbaPreview';
import { GbcPreview } from './components/GbcPreview';
import { ColorPicker } from './components/ColorPicker';
import { HeaderLogo } from './components/HeaderLogo';
import { AiCard } from './components/AiCard';
import { ShopModeCard } from './components/ShopModeCard';
import { ExampleAiImages } from './components/ExampleAiImages';
import { InfoCard } from './components/InfoCard';
import { YoutubePromo } from './components/YoutubePromo';
import { ShareModal } from './components/ShareModal';
import { GbaProvider, useGba } from './contexts/GbaContext';
import { downloadGbaImage } from './utils/downloadUtils';
import { openAiTool } from './utils/aiUtils';
import { Download, RotateCcw, Pin, Share2, Undo2, Redo2, AlertTriangle, X, Sun, Moon } from 'lucide-react';

const ConsoleSilhouette = ({ type, isActive }: { type: 'gba' | 'gbc', isActive: boolean }) => {
  if (type === 'gba') {
    return (
      <svg viewBox="0 0 24 16" className={`w-5 h-4 transition-colors duration-300 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} fill="currentColor">
        <rect x="2" y="2" width="20" height="12" rx="3" />
        <rect x="7" y="5" width="10" height="6" rx="0.5" fill="white" fillOpacity="0.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 24" className={`w-4 h-5 transition-colors duration-300 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} fill="currentColor">
      {/* Straight rectangular body with minimal corner rounding */}
      <rect x="2" y="2" width="12" height="20" rx="1.5" />
      <rect x="4" y="4" width="8" height="8" rx="0.5" fill="white" fillOpacity="0.4" />
    </svg>
  );
};

const AppContent = () => {
  const { config, setters, reset, undo, redo, canUndo, canRedo } = useGba();
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Default to pinned on mobile (<1024px) for better UX
  const [isPinned, setIsPinned] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
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
      if (e.key === 'Escape') {
        setShowResetConfirm(false);
        setIsShareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const PreviewComponent = config.consoleType === 'gbc' ? GbcPreview : GbaPreview;

  if (isViewOnly) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <PreviewComponent
          ref={svgRef}
          selectedColor={config.selectedColor}
          dpadColor={config.dpadColor}
          aButtonColor={config.aButtonColor}
          bButtonColor={config.bButtonColor}
          startSelectColor={config.startSelectColor}
          powerSwitchColor={config.powerSwitchColor}
          lButtonColor={config.lButtonColor}
          rButtonColor={config.rButtonColor}
          leftBumperColor={config.leftBumperColor}
          rightBumperColor={config.rightBumperColor}
          lensColor={config.lensColor}
          gbcLogoGameBoyColor={config.gbcLogoGameBoyColor}
          gbcLogoColorWordColor={config.gbcLogoColorWordColor}
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-slate-300 selection:text-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <div className="shrink-0">
              <HeaderLogo />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                GBA Shell Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 text-sm font-medium text-slate-500 shrink-0">
            {/* Playful Console Toggle */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner mr-2">
              <div 
                className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white dark:bg-slate-600 rounded-xl shadow-md transition-all duration-300 ease-spring ${config.consoleType === 'gbc' ? 'translate-x-full' : 'translate-x-0'}`}
              />
              <button
                onClick={() => setters.setConsoleType('gba')}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all hover:scale-105 active:scale-95 ${config.consoleType === 'gba' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-500'}`}
              >
                <ConsoleSilhouette type="gba" isActive={config.consoleType === 'gba'} />
                <span className="hidden xs:block">GBA</span>
              </button>
              <button
                onClick={() => setters.setConsoleType('gbc')}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all hover:scale-105 active:scale-95 ${config.consoleType === 'gbc' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-500'}`}
              >
                <ConsoleSilhouette type="gbc" isActive={config.consoleType === 'gbc'} />
                <span className="hidden xs:block">GBC</span>
              </button>
            </div>

            {/* Undo/Redo/Reset Group */}
            <div className="flex items-center gap-0.5 sm:gap-1 border-r border-slate-200 dark:border-slate-800 pr-1.5 sm:pr-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`p-2 rounded-xl transition-all ${
                  canUndo ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`p-2 rounded-xl transition-all ${
                  canRedo ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </button>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-110 hover:text-red-500 dark:hover:text-red-400"
                title="Reset Design"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl transition-all shadow-sm hover:scale-110"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                <Share2 size={16} />
                <span className="hidden md:inline font-bold">Share</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <Download size={16} />
                <span className="hidden md:inline font-bold">Export</span>
              </button>
            </div>
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
              style={{ aspectRatio: config.consoleType === 'gbc' ? '900/930' : '900/550', marginBottom: '1rem' }}
            />

            <div className={`
              transition-all duration-300 ease-in-out
              ${isPinned 
                ? 'fixed top-20 left-0 right-0 z-40 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-md p-2 lg:p-0 lg:bg-transparent lg:border-none lg:shadow-none lg:backdrop-blur-none lg:static lg:sticky lg:top-24 lg:z-30' 
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
                      ? 'bg-slate-900 border-slate-800 text-white shadow-slate-200 ring-2 ring-slate-200 dark:ring-slate-700' 
                      : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-500'
                    }
                  `}
                  title={isPinned ? "Unpin Viewbox" : "Pin Viewbox to Top"}
                >
                  <Pin size={18} className={`transition-transform ${isPinned ? 'fill-current rotate-45' : ''}`} />
                </button>
              </div>

              <PreviewComponent
                ref={svgRef}
                selectedColor={config.selectedColor}
                dpadColor={config.dpadColor}
                aButtonColor={config.aButtonColor}
                bButtonColor={config.bButtonColor}
                startSelectColor={config.startSelectColor}
                powerSwitchColor={config.powerSwitchColor}
                lButtonColor={config.lButtonColor}
                rButtonColor={config.rButtonColor}
                leftBumperColor={config.leftBumperColor}
                rightBumperColor={config.rightBumperColor}
                lensColor={config.lensColor}
                gbcLogoGameBoyColor={config.gbcLogoGameBoyColor}
                gbcLogoColorWordColor={config.gbcLogoColorWordColor}
                isClearShell={config.isClearShell}
                isClearButtons={config.isClearButtons}
                isScreenOn={config.isScreenOn}
                onToggleScreen={toggleScreen}
                isDarkMode={isDark}
                shopMode={config.shopMode}
              />
            </div>

            {config.consoleType === 'gba' && <ShopModeCard />}

            <AiCard onOpenAi={handleOpenAi} />
            <ExampleAiImages />
            <YoutubePromo />
          </div>

          {/* Right: Controls */}
          <div className="space-y-6">
            <ColorPicker />
            <InfoCard />
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        config={config} 
      />

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
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
          &copy; {new Date().getFullYear()} <a href="https://www.gba-shell-studio.com">GBA Shell Studio</a> by ReTee Retro. Version 3.0.1. Not
          affiliated with Nintendo. 
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <GbaProvider>
      <AppContent />
    </GbaProvider>
  );
}

export default App;