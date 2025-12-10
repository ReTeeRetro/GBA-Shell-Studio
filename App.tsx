import { useRef, useState } from 'react';
import { GbaPreview } from './components/GbaPreview';
import { ColorPicker } from './components/ColorPicker';
import { HeaderLogo } from './components/HeaderLogo';
import { AiCard } from './components/AiCard';
import { ExampleAiImages } from './components/ExampleAiImages';
import { InfoCard } from './components/InfoCard';
import { useGbaState } from './hooks/useGbaState';
import { downloadGbaImage } from './utils/downloadUtils';
import { openAiTool } from './utils/aiUtils';
import { Download, RotateCcw, Pin } from 'lucide-react';

function App() {
  const { config, setters, randomize, reset } = useGbaState();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPinned, setIsPinned] = useState(false);

  const handleDownload = () => downloadGbaImage(svgRef.current, config);
  const handleOpenAi = (tool: 'chatgpt' | 'gemini') => openAiTool(tool, config);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeaderLogo />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">GBA Shell Studio</h1>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
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

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: Preview Canvas */}
          <div className={`lg:col-span-2 space-y-4 transition-all duration-300 ease-in-out ${isPinned ? 'lg:sticky lg:top-24 lg:z-10' : ''}`}>
            <div className="relative">
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
              />
            </div>

            <AiCard onOpenAi={handleOpenAi} />
            <ExampleAiImages />
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
            />

            <InfoCard />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 mt-12 py-8 text-center text-slate-400 text-sm bg-white/50 backdrop-blur-sm">
        <p>
          &copy; {new Date().getFullYear()} GBA Shell Studio by ReTee Retro. Version 1.74. Not
          affiliated with Nintendo.
        </p>
      </footer>
    </div>
  );
}

export default App;