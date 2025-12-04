import { useState, useRef } from 'react';
import { GbaPreview } from './components/GbaPreview';
import { ColorPicker } from './components/ColorPicker';
import { HeaderLogo } from './components/HeaderLogo';
import { SHELL_COLORS, LENS_COLORS } from './constants';
import { ColorOption, RenderMode } from './types';
import { Layers, ScanFace, CircleDashed, Download } from 'lucide-react';

function App() {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(SHELL_COLORS[1]);
  const [dpadColor, setDpadColor] = useState<ColorOption>(SHELL_COLORS[4]); // Default to Platinum
  const [aButtonColor, setAButtonColor] = useState<ColorOption>(SHELL_COLORS[4]); // Default to Platinum
  const [bButtonColor, setBButtonColor] = useState<ColorOption>(SHELL_COLORS[4]); // Default to Platinum
  const [startSelectColor, setStartSelectColor] = useState<ColorOption>(SHELL_COLORS[4]); // Default to Platinum
  const [bumpersColor, setBumpersColor] = useState<ColorOption>(SHELL_COLORS[4]); // Default to Platinum
  const [lensColor, setLensColor] = useState<ColorOption>(LENS_COLORS[0]); // Default to Black
  const [showButtonEffects, setShowButtonEffects] = useState(true);
  const [renderMode, setRenderMode] = useState<RenderMode>('plastic');
  
  const svgRef = useRef<SVGSVGElement>(null);

  const handleRandomize = () => {
    const getRandomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const getRandomOption = (options: ColorOption[]) => {
      // 25% chance of a completely custom random color
      if (Math.random() < 0.25) {
        return {
          id: 'custom',
          name: 'Custom',
          hex: getRandomHex()
        };
      }
      return options[Math.floor(Math.random() * options.length)];
    };
    
    setSelectedColor(getRandomOption(SHELL_COLORS));
    setDpadColor(getRandomOption(SHELL_COLORS));
    
    // A and B buttons should share the same color for better aesthetics
    const randomButtonColor = getRandomOption(SHELL_COLORS);
    setAButtonColor(randomButtonColor);
    setBButtonColor(randomButtonColor);
    
    setStartSelectColor(getRandomOption(SHELL_COLORS));
    setBumpersColor(getRandomOption(SHELL_COLORS));
    
    // Lens color should only be one of the presets (Black or White), avoiding custom random colors
    setLensColor(LENS_COLORS[Math.floor(Math.random() * LENS_COLORS.length)]);
  };

  const handleDownload = () => {
    if (!svgRef.current) return;
    
    const w = 900;
    const h = 550;
    const scale = 2; // High res scale
    const footerHeight = 160; // Increased height to accommodate 3 rows of metadata

    // 1. Clone the SVG to manipulate it safely without affecting the DOM
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
    
    // 2. Set explicit dimensions on the clone to force high-res rasterization
    svgClone.setAttribute("width", `${w * scale}`);
    svgClone.setAttribute("height", `${h * scale}`);
    
    // 3. Serialize to XML string
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgClone);
    
    // 4. Ensure XML namespace and Declaration (critical for Blob/Image usage)
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+xmlns:xlink/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    // 5. Create Blob URL
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = (h + footerHeight) * scale;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        URL.revokeObjectURL(url);
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 1. Fill Background
      // Using a light slate (slate-100) to ensure white shells are visible
      ctx.fillStyle = "#f1f5f9"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw GBA Image
      // Draw at origin (0,0) as the SVG is already scaled via width/height attributes
      ctx.drawImage(img, 0, 0);

      // 3. Draw Footer Background
      const footerY = h * scale;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, footerY, canvas.width, footerHeight * scale);
      
      // Footer Divider
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(0, footerY, canvas.width, 2);

      // 4. Draw Metadata
      ctx.textBaseline = "middle";
      
      // Organize parts
      const parts = [
        { label: 'Shell', color: selectedColor },
        { label: 'Lens', color: lensColor },
        { label: 'D-Pad', color: dpadColor },
        { label: 'Btn A', color: aButtonColor },
        { label: 'Btn B', color: bButtonColor },
        { label: 'Start/Select', color: startSelectColor },
        { label: 'Bumpers', color: bumpersColor },
      ];

      const startX = 60;
      const colWidth = 530; // Slightly wider columns
      const itemsPerCol = 3; // Allow up to 3 items per column (creates 3 columns total for 7 items)
      
      parts.forEach((part, index) => {
         const col = Math.floor(index / itemsPerCol);
         const row = index % itemsPerCol;
         
         const x = startX + (col * colWidth);
         const y = footerY + 60 + (row * 60); // 60px row gap

         // Label
         ctx.textAlign = "left";
         ctx.font = "bold 24px sans-serif";
         ctx.fillStyle = "#64748b"; // slate-500
         ctx.fillText(part.label + ":", x, y);
         
         // Color Name
         const labelWidth = ctx.measureText(part.label + ":").width;
         ctx.font = "bold 24px sans-serif";
         ctx.fillStyle = "#0f172a"; // slate-900
         ctx.fillText(part.color.name, x + labelWidth + 12, y);

         // Hex Code
         const nameWidth = ctx.measureText(part.color.name).width;
         ctx.font = "20px monospace";
         ctx.fillStyle = "#94a3b8"; // slate-400
         ctx.fillText(part.color.hex.toUpperCase(), x + labelWidth + 12 + nameWidth + 12, y);
      });

      // 5. Draw Year Tag
      ctx.textAlign = "right";
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#cbd5e1"; // slate-300
      // Position relative to the bottom of the canvas
      ctx.fillText(`GBA Shell Studio ${new Date().getFullYear()}`, canvas.width - 40, canvas.height - 40);
      
      // 6. Save & Download
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `gba-shell-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Cleanup
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <HeaderLogo />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">GBA Shell Studio</h1>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-sm border border-transparent"
              title="Download PNG"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Intro Text */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-slate-500 text-lg">
            Try out different shell and button color combinations to get a rough idea of how you might want to mod your GBA
          </p>
        </div>

        {/* Workspace */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Preview Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <GbaPreview 
              ref={svgRef}
              selectedColor={selectedColor} 
              dpadColor={dpadColor}
              aButtonColor={aButtonColor}
              bButtonColor={bButtonColor}
              startSelectColor={startSelectColor}
              bumpersColor={bumpersColor}
              lensColor={lensColor}
              showButtonEffects={showButtonEffects}
              renderMode={renderMode}
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-center px-1 gap-4">
              <div className="flex items-center gap-2">
                {/* Render Mode Toggle */}
                <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                   <button 
                    onClick={() => setRenderMode('plastic')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${renderMode === 'plastic' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                   >
                     <ScanFace size={14} />
                     Plastic
                   </button>
                   <button 
                    onClick={() => setRenderMode('matte')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${renderMode === 'matte' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                   >
                     <Layers size={14} />
                     Matte
                   </button>
                </div>

                {/* Button Depth Toggle */}
                <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                  <button
                    onClick={() => setShowButtonEffects(!showButtonEffects)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${showButtonEffects ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                    title="Toggle Button Depth"
                  >
                    <CircleDashed size={14} />
                    Button Depth
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono hidden sm:block">
                 {renderMode === 'plastic' && 'RENDER: Textured Plastic + Sheen'}
                 {renderMode === 'matte' && 'RENDER: Clean Vector Shading'}
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="space-y-6">
            <ColorPicker 
              selectedColor={selectedColor} 
              onSelectColor={setSelectedColor}
              dpadColor={dpadColor}
              onSelectDpadColor={setDpadColor}
              aButtonColor={aButtonColor}
              onSelectAButtonColor={setAButtonColor}
              bButtonColor={bButtonColor}
              onSelectBButtonColor={setBButtonColor}
              startSelectColor={startSelectColor}
              onSelectStartSelectColor={setStartSelectColor}
              bumpersColor={bumpersColor}
              onSelectBumpersColor={setBumpersColor}
              lensColor={lensColor}
              onSelectLensColor={setLensColor}
              onRandomize={handleRandomize}
            />

            {/* Step Indicator */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px]">i</span>
                How it works
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Choose colors for the shell, lens, and buttons, and experiment freely - you can even use custom colors. When you're happy with the result, download your configuration. This is a very early version of the tool, and things may change as it improves and gains more features over time.
              </p>
            </div>
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-8 text-center text-slate-400 text-sm bg-white/50 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} GBA Shell Studio by ReTee Retro. Version 1.56. Not affiliated with Nintendo.</p>
      </footer>
    </div>
  );
}

export default App;