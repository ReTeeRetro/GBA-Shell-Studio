import { useRef, useState } from 'react';
import { GbaPreview } from './components/GbaPreview';
import { ColorPicker } from './components/ColorPicker';
import { HeaderLogo } from './components/HeaderLogo';
import { AiCard } from './components/AiCard';
import { ExampleAiImages } from './components/ExampleAiImages';
import { InfoCard } from './components/InfoCard';
import { YoutubePromo } from './components/YoutubePromo';
import { useGbaState } from './hooks/useGbaState';
import { downloadGbaImage } from './utils/downloadUtils';
import { openAiTool } from './utils/aiUtils';
import { serializeConfig } from './utils/urlUtils';
import { Download, RotateCcw, Pin, Share2, Check } from 'lucide-react';

function App() {
  const { config, setters, randomize, reset } = useGbaState();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [shareText, setShareText] = useState('Share');

  // Check for view-only mode from URL
  const searchParams = new URLSearchParams(window.location.search);
  const isViewOnly = searchParams.get('viewOnly') === '1';

  const toggleScreen = () => setters.setIsScreenOn(!config.isScreenOn);

  if (isViewOnly) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
        />
      </div>
    );
  }

  const handleDownload = () => downloadGbaImage(svgRef.current, config);
  const handleOpenAi = (tool: 'chatgpt' | 'gemini') => openAiTool(tool, config);

  const handleShare = async () => {
    const queryString = serializeConfig(config);
    
    // Use URL object for safer manipulation, handles origin/pathname edge cases
    const url = new URL(window.location.href);
    url.search = queryString;
    const finalUrl = url.toString();
    
    try {
      // Update browser URL without reload
      // We wrap this in a try-catch because some environments (like sandboxed iframes or blobs)
      // block pushState updates for security reasons.
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
    <div className="min-h-screen bg-gray-50 text-slate-900 selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeaderLogo />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">GBA Shell Studio</h1>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all shadow-sm
                ${shareText === 'Copied!' 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              title="Share Design URL"
            >
              {shareText === 'Copied!' ? <Check size={16} /> : <Share2 size={16} />}
              <span className="hidden sm:inline">{shareText}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-sm border border-transparent"
              title="Download PNG"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full transition-all shadow-sm"
              title="Reset to Default"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-slate-500 text-lg">
            Try out different shell and button color combinations to get a rough idea of how you might
            want to mod your GBA
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Preview Canvas */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Placeholder to prevent layout shift on mobile when pinned (fixed) */}
            <div 
              className={`w-full transition-all duration-300 ${isPinned ? 'block lg:hidden' : 'hidden'}`}
              style={{ aspectRatio: '900/550', marginBottom: '1rem' }}
            />

            <div className={`
              transition-all duration-300 ease-in-out
              ${isPinned 
                ? 'fixed top-16 left-0 right-0 z-40 bg-gray-50/95 backdrop-blur-sm border-b border-slate-200 shadow-md p-2 lg:p-0 lg:bg-transparent lg:border-none lg:shadow-none lg:backdrop-blur-none lg:static lg:sticky lg:top-24 lg:z-30' 
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
                      ? 'bg-blue-600 border-blue-500 text-white shadow-blue-200 ring-2 ring-blue-100' 
                      : 'bg-white/80 border-slate-200 text-slate-400 hover:bg-white hover:text-slate-700 hover:border-slate-300'
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
              />
            </div>

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

              lensColor={config.lensColor}
              onSelectLensColor={setters.setLensColor}
              onRandomize={randomize}
              isClearShell={config.isClearShell}
              onToggleClearShell={() => setters.setIsClearShell(!config.isClearShell)}
              isClearButtons={config.isClearButtons}
              onToggleClearButtons={() => setters.setIsClearButtons(!config.isClearButtons)}
              isScreenOn={config.isScreenOn}
              onToggleScreenOn={() => setters.setIsScreenOn(!config.isScreenOn)}
            />

            <InfoCard />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 mt-12 py-8 text-center text-slate-400 text-sm bg-white/50 backdrop-blur-sm">
        <p>
          &copy; {new Date().getFullYear()} GBA Shell Studio by ReTee Retro. Version 1.8.4. Not
          affiliated with Nintendo.
        </p>
      </footer>
    </div>
  );
}

export default App;