import React, { forwardRef } from 'react';
import { ColorOption, RenderMode } from '../types';
import { ShellPaths, DpadPaths, StartSelectPath, LensPath, BumpersPath, SpeakerGrillPath, PowerLedPath, GbaLogo, DpadEngraving } from './GbaSvgPaths';

interface GbaPreviewProps {
  selectedColor: ColorOption;
  dpadColor: ColorOption;
  buttonsColor: ColorOption;
  startSelectColor: ColorOption;
  bumpersColor: ColorOption;
  lensColor: ColorOption;
  showGrid?: boolean;
  showButtonEffects?: boolean;
  renderMode?: RenderMode;
}

export const GbaPreview = forwardRef<SVGSVGElement, GbaPreviewProps>(({ 
  selectedColor, 
  dpadColor, 
  buttonsColor,
  startSelectColor,
  bumpersColor,
  lensColor,
  showGrid = false,
  showButtonEffects = true,
  renderMode = 'plastic'
}, ref) => {
  // Expanded VIEWBOX to accommodate Bumpers (approx 802px wide)
  // Original: 0 0 783 452
  // New: 0 0 900 500
  const VIEWBOX = "0 0 900 550";

  // MAIN CONTENT OFFSET
  // Shifts the Shell and Controls to center them in the new, wider viewbox
  const SHELL_OFFSET_X = 58;
  const SHELL_OFFSET_Y = 36;

  // BUMPERS OFFSET
  // Positions the bumpers relative to the workspace.
  // Aligned to match the shell's position.
  const BUMPERS_X = 48;
  const BUMPERS_Y = 50;

  // CONFIG: A/B Button Position Adjustment
  // Edit these values to shift the A and B buttons group.
  // Positive X = Right, Positive Y = Down
  const AB_BUTTON_OFFSET_X = 15;
  const AB_BUTTON_OFFSET_Y = 12;

  // CONFIG: Individual Button Fine-tuning
  // Specific offset for A button relative to the group
  const A_BUTTON_OFFSET_X = 10;
  const A_BUTTON_OFFSET_Y = 9;

  // Specific offset for B button relative to the group
  const B_BUTTON_OFFSET_X = 26;
  const B_BUTTON_OFFSET_Y = 2;

  // D-Pad Configuration for visualization
  const DPAD_X = 46;
  const DPAD_Y = 133;

  // Start/Select Configuration
  // Adjusted for larger button size (30px diameter vs 15px)
  // Shifted -7.5px from original top-left (166, 300) to keep center aligned
  const SELECT_BUTTON_X = 141;
  const SELECT_BUTTON_Y = 331;
  
  const START_BUTTON_X = 141;
  const START_BUTTON_Y = 286;

  // Speaker Grill Configuration
  // Positioned below the A/B buttons
  const SPEAKER_X = 680;
  const SPEAKER_Y = 310;

  // Lens Configuration
  const LENS_X = 379;
  const LENS_Y = 48;

  // Power LED Configuration
  // Targeted absolute visual position: X=702, Y=105
  // We calculate relative position inside the main-console group
  const LED_X = 711 - SHELL_OFFSET_X;
  const LED_Y = 115 - SHELL_OFFSET_Y;

  // RENDER MODES LOGIC
  const showTexture = renderMode === 'plastic';
  // With 'flat' removed, shading is always on for both 'plastic' and 'matte'
  const showShading = true;

  // SEPARATION: Define Shapes and Labels separately to prevent ghosting in effect layers
  
  const BUTTON_SHAPES = (
    <g transform={`translate(${AB_BUTTON_OFFSET_X}, ${AB_BUTTON_OFFSET_Y})`}>
      {/* A Button Shape */}
      <g transform={`translate(${A_BUTTON_OFFSET_X}, ${A_BUTTON_OFFSET_Y})`}>
        <path d="M700 129 A 26 26 0 1 1 700 181 A 26 26 0 1 1 700 129 Z" />
      </g>
      {/* B Button Shape */}
      <g transform={`translate(${B_BUTTON_OFFSET_X}, ${B_BUTTON_OFFSET_Y})`}>
        <path d="M615 159 A 26 26 0 1 1 615 211 A 26 26 0 1 1 615 159 Z" />
      </g>
    </g>
  );

  const BUTTON_LABELS = (
    <g transform={`translate(${AB_BUTTON_OFFSET_X}, ${AB_BUTTON_OFFSET_Y})`}>
      {/* A Label */}
      <g transform={`translate(${A_BUTTON_OFFSET_X}, ${A_BUTTON_OFFSET_Y})`}>
        <text 
          x="700" 
          y="157" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fontFamily="sans-serif" 
          fontWeight="bold" 
          fontSize="40"
          fill="#000000"
          fillOpacity="0.2"
          className="pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
        >
          A
        </text>
      </g>
      {/* B Label */}
      <g transform={`translate(${B_BUTTON_OFFSET_X}, ${B_BUTTON_OFFSET_Y})`}>
        <text 
          x="615" 
          y="187" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fontFamily="sans-serif" 
          fontWeight="bold" 
          fontSize="40"
          fill="#000000"
          fillOpacity="0.2"
          className="pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
        >
          B
        </text>
      </g>
    </g>
  );

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden group"
      style={{
        backgroundColor: '#e2e8f0', // Slate-200 provides contrast for white shells
        backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', // Subtle dot pattern
        backgroundSize: '20px 20px'
      }}
    >
      
      <svg 
        ref={ref}
        viewBox={VIEWBOX} 
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 
            Luminosity Normalizer:
            Takes the dark blue vector art and shifts it to be a neutral mid-grey.
          */}
          <filter id="vectorShading">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
               <feFuncR type="linear" slope="1" intercept="0.25"/>
               <feFuncG type="linear" slope="1" intercept="0.25"/>
               <feFuncB type="linear" slope="1" intercept="0.25"/>
            </feComponentTransfer>
          </filter>

          {/*
            D-Pad Darkener & Smoother:
          */}
          <filter id="dpadShading">
            <feColorMatrix type="saturate" values="0" />
            <feGaussianBlur stdDeviation="0.5" />
            <feComponentTransfer>
               <feFuncR type="linear" slope="0.3" intercept="0.35"/>
               <feFuncG type="linear" slope="0.3" intercept="0.35"/>
               <feFuncB type="linear" slope="0.3" intercept="0.35"/>
            </feComponentTransfer>
          </filter>

          {/* 
            Plastic Grain:
            Adds a subtle texture to simulate the ABS plastic surface.
            Maps noise to a neutral grey range (0.35-0.65) to be compatible with 'overlay' blend mode.
          */}
          <filter id="plasticGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feComponentTransfer in="grayNoise" result="balancedNoise">
                <feFuncR type="linear" slope="0.3" intercept="0.35"/>
                <feFuncG type="linear" slope="0.3" intercept="0.35"/>
                <feFuncB type="linear" slope="0.3" intercept="0.35"/>
            </feComponentTransfer>
            {/* Mask with SourceAlpha to apply texture only to the shape */}
            <feComposite operator="in" in="balancedNoise" in2="SourceAlpha" result="grain" />
          </filter>

          {/* 
            Button Drop Shadow:
            Adds a shadow to buttons so they appear to stick out from the shell.
          */}
          <filter id="btnShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.35" />
          </filter>

          {/* 
            Sheen Gradient:
            A soft top-down white gradient to simulate lighting/specularity on curved plastic.
          */}
          <linearGradient id="sheenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* 
            Screen Gradient:
            Simulates the look of an LCD screen (off state)
          */}
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#202020" />
            <stop offset="100%" stopColor="#404040" />
          </linearGradient>

          {/* 
            LED Glow Effect
          */}
          <filter id="ledGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Grid Patterns */}
          {showGrid && (
            <>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="cyan" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="cyan" strokeWidth="1" opacity="0.6"/>
              </pattern>
            </>
          )}
        </defs>

        {/*
            LAYER STYLES
            Using CSS to override SVG default fills.
        */}
        <style>
            {`
              #base-color-layer path {
                fill: ${selectedColor.hex} !important;
              }
              #dpad-base-layer path {
                fill: ${dpadColor.hex} !important;
              }
              #buttons-base-layer path {
                fill: ${buttonsColor.hex} !important;
              }
              #bumpers-layer path, #bumpers-base path {
                fill: ${bumpersColor.hex} !important;
              }
              /* Forces the sheen gradient fill on re-rendered geometry */
              .sheen-fill path, .sheen-fill circle {
                 fill: url(#sheenGradient) !important;
              }
            `}
        </style>

        {/*
            LAYER 0: BUMPERS
        */}
        <g id="bumpers-layer" transform={`translate(${BUMPERS_X}, ${BUMPERS_Y})`}>
          <g id="bumpers-base"><BumpersPath /></g>
          {/* Bumpers Texture */}
          {showTexture && (
            <g filter="url(#plasticGrain)" style={{ mixBlendMode: 'overlay' }} opacity="0.3">
               <BumpersPath />
            </g>
          )}
        </g>

        {/* 
            MAIN CONSOLE GROUP
            Wraps Shell, Lens, and Controls to center them in the new, wider viewbox.
        */}
        <g id="main-console" transform={`translate(${SHELL_OFFSET_X}, ${SHELL_OFFSET_Y})`}>
          
          {/* 
             LAYER 1: BASE COLOR
             We force ALL paths to be filled with the selected color.
          */}
          <g id="base-color-layer">
            <ShellPaths />
            
            {/* Speaker Grill */}
             <g transform={`translate(${SPEAKER_X}, ${SPEAKER_Y})`} style={{ mixBlendMode: 'multiply' }} opacity="0.4" fill="#000000">
                <SpeakerGrillPath />
             </g>

             {/* Power LED */}
             <g transform={`translate(${LED_X}, ${LED_Y})`} fill="#4ade80" filter="url(#ledGlow)">
                <PowerLedPath />
             </g>
          </g>

          {/* 
             LAYER 1.5: PLASTIC MATERIAL FINISH (NEW)
             Applies texture and gloss to the base shell color.
          */}
          <g pointerEvents="none">
             {/* Grain: Adds surface noise */}
             {showTexture && (
               <g filter="url(#plasticGrain)" style={{ mixBlendMode: 'overlay' }} opacity="0.35">
                  <ShellPaths />
               </g>
             )}
             {/* Sheen: Adds specular highlight */}
             {showTexture && (
               <g className="sheen-fill" style={{ mixBlendMode: 'screen' }} opacity="0.4">
                  <ShellPaths />
               </g>
             )}
          </g>
          
          {/* 
             LAYER 2: VECTOR SHADING (SHELL)
             Original shading map (shadows/crevices)
          */}
          {showShading && (
            <g filter="url(#vectorShading)" style={{ mixBlendMode: 'hard-light' }} opacity="0.4">
              <ShellPaths />
            </g>
          )}
          
          {/* 
              LAYER 2.5: LENS
          */}
          <g id="lens-layer" transform={`translate(${LENS_X}, ${LENS_Y})`}>
               <rect x="-165.5" y="37" width="359" height="238" fill="url(#screenGradient)" />
               <LensPath fill={lensColor.hex} />
               {/* 
                  Logo Layer
                  Positioned below the screen, centered on the chin.
                  Target Width: 220
                  Original ViewBox: 192.756
                  Scale: 220 / 192.756 = ~1.14
                  Center X: 14 (relative to lens group center)
                  Center Y: 320 (chin area)
                  Origin Offset: -96.378 (half of viewbox) to center the scaling
               */}
               <g transform="translate(14, 320) scale(1.14) translate(-96.378, -96.378)">
                  <GbaLogo />
               </g>
          </g>
  
          {/* 
              LAYER 3: D-PAD
          */}
          <g transform={`translate(${DPAD_X}, ${DPAD_Y})`}>
            {/* Base Layer + Drop Shadow */}
            <g id="dpad-base-layer" filter={showButtonEffects ? "url(#btnShadow)" : undefined}>
              <DpadPaths />
            </g>

            {/* D-Pad Details (Arrows/Dimple) - Rendered over base but under texture */}
            <DpadEngraving />
            
            {/* D-Pad Texture & Sheen */}
            {showTexture && showButtonEffects && (
              <>
                <g filter="url(#plasticGrain)" style={{ mixBlendMode: 'overlay' }} opacity="0.3">
                  <DpadPaths />
                </g>
                <g className="sheen-fill" style={{ mixBlendMode: 'screen' }} opacity="0.2">
                  <DpadPaths />
                </g>
              </>
            )}

            {/* D-Pad Shading */}
            {showShading && showButtonEffects && (
              <g filter="url(#dpadShading)" style={{ mixBlendMode: 'hard-light' }} opacity="0.5">
                <DpadPaths />
              </g>
            )}
          </g>
  
          {/* 
              LAYER 4: BUTTONS (A/B and Start/Select)
          */}
          <g>
            {/* A/B Buttons Base + Drop Shadow */}
            <g id="buttons-base-layer" filter={showButtonEffects ? "url(#btnShadow)" : undefined}>
              {BUTTON_SHAPES}
              {BUTTON_LABELS}
            </g>
            
            {/* Buttons Texture & Sheen - SHAPES ONLY (No labels) */}
            {showTexture && showButtonEffects && (
              <>
                <g filter="url(#plasticGrain)" style={{ mixBlendMode: 'overlay' }} opacity="0.3">
                  {BUTTON_SHAPES}
                </g>
                <g className="sheen-fill" style={{ mixBlendMode: 'screen' }} opacity="0.3">
                  {BUTTON_SHAPES}
                </g>
              </>
            )}

            {/* Buttons Shading - SHAPES ONLY */}
            {showShading && showButtonEffects && (
              <g filter="url(#dpadShading)" style={{ mixBlendMode: 'hard-light' }} opacity="0.5">
                {BUTTON_SHAPES}
              </g>
            )}
  
            {/* Start/Select Buttons (Rubber Texture) */}
            <g fill={startSelectColor.hex} filter={showButtonEffects ? "url(#btnShadow)" : undefined}>
              <g transform={`translate(${SELECT_BUTTON_X}, ${SELECT_BUTTON_Y})`}>
                <StartSelectPath />
              </g>
              <g transform={`translate(${START_BUTTON_X}, ${START_BUTTON_Y})`}>
                <StartSelectPath />
              </g>
            </g>
            {/* Grain only for rubber (no sheen) - Apply if Realistic OR Matte (texture is nice on rubber) */}
            {showTexture && showButtonEffects && (
              <g filter="url(#plasticGrain)" style={{ mixBlendMode: 'overlay' }} opacity="0.4">
                <g transform={`translate(${SELECT_BUTTON_X}, ${SELECT_BUTTON_Y})`}>
                  <StartSelectPath />
                </g>
                <g transform={`translate(${START_BUTTON_X}, ${START_BUTTON_Y})`}>
                  <StartSelectPath />
                </g>
              </g>
            )}
            {/* Shading */}
            {showShading && showButtonEffects && (
              <g filter="url(#dpadShading)" style={{ mixBlendMode: 'hard-light' }} opacity="0.3">
                <g transform={`translate(${SELECT_BUTTON_X}, ${SELECT_BUTTON_Y})`}>
                  <StartSelectPath />
                </g>
                <g transform={`translate(${START_BUTTON_X}, ${START_BUTTON_Y})`}>
                  <StartSelectPath />
                </g>
              </g>
            )}
          </g>
        </g>

        {/* 
            LAYER 5: DESIGNER OVERLAY
        */}
        {showGrid && (
         <g id="designer-overlay" pointerEvents="none">
           <rect width="100%" height="100%" fill="url(#grid)" />
           {[100, 200, 300, 400, 500, 600, 700, 800].map(x => (
             <text key={`x-${x}`} x={x + 2} y="12" fill="cyan" fontSize="10" fontFamily="monospace">{x}</text>
           ))}
           {[100, 200, 300, 400].map(y => (
             <text key={`y-${y}`} x="2" y={y - 2} fill="cyan" fontSize="10" fontFamily="monospace">{y}</text>
           ))}
           {/* Bumpers Origin */}
           <g transform={`translate(${BUMPERS_X}, ${BUMPERS_Y})`}>
             <circle r="3" fill="purple" />
             <text x="5" y="-5" fill="purple" fontSize="10" fontWeight="bold">BUMPERS ({BUMPERS_X}, {BUMPERS_Y})</text>
             <rect x="0" y="0" width="802" height="379" fill="none" stroke="purple" strokeDasharray="4 2" opacity="0.5" />
           </g>

           {/* Main Console Markers (Wrapped in Shell Offset) */}
           <g transform={`translate(${SHELL_OFFSET_X}, ${SHELL_OFFSET_Y})`}>
             {/* Shell Origin */}
             <circle r="4" fill="red" />
             <text x="5" y="-5" fill="red" fontSize="10" fontWeight="bold">SHELL GRP ({SHELL_OFFSET_X}, {SHELL_OFFSET_Y})</text>
             
             {/* D-Pad Origin */}
             <g transform={`translate(${DPAD_X}, ${DPAD_Y})`}>
               <circle r="3" fill="magenta" />
               <text x="5" y="-5" fill="magenta" fontSize="10" fontWeight="bold">D-PAD</text>
               <rect x="-5" y="-5" width="70" height="115" fill="none" stroke="magenta" strokeDasharray="4 2" opacity="0.5" />
             </g>
  
             {/* Buttons Origin */}
             <g transform={`translate(${AB_BUTTON_OFFSET_X}, ${AB_BUTTON_OFFSET_Y})`}>
               <circle r="3" fill="lime" />
               <text x="5" y="-5" fill="lime" fontSize="10" fontWeight="bold">BTNS</text>
                <rect x="600" y="100" width="130" height="130" fill="none" stroke="lime" strokeDasharray="4 2" opacity="0.5" />
             </g>
  
             {/* Start/Select Origin */}
             <g transform={`translate(${SELECT_BUTTON_X}, ${SELECT_BUTTON_Y})`}>
               <circle r="2" fill="yellow" />
               <text x="35" y="10" fill="yellow" fontSize="10" fontWeight="bold">SEL</text>
             </g>
             <g transform={`translate(${START_BUTTON_X}, ${START_BUTTON_Y})`}>
               <circle r="2" fill="yellow" />
               <text x="35" y="10" fill="yellow" fontSize="10" fontWeight="bold">STRT</text>
             </g>
  
             {/* Lens Origin */}
             <g transform={`translate(${LENS_X}, ${LENS_Y})`}>
               <circle r="3" fill="orange" />
               <text x="5" y="-5" fill="orange" fontSize="10" fontWeight="bold">LENS</text>
               <rect x="0" y="0" width="400" height="300" fill="none" stroke="orange" strokeDasharray="4 2" opacity="0.5" />
             </g>

             {/* Speaker Origin */}
             <g transform={`translate(${SPEAKER_X}, ${SPEAKER_Y})`}>
               <circle r="2" fill="cyan" />
               <text x="15" y="5" fill="cyan" fontSize="10" fontWeight="bold">SPKR</text>
             </g>

             {/* Power LED Origin */}
             <g transform={`translate(${LED_X}, ${LED_Y})`}>
               <circle r="2" fill="#4ade80" />
               <text x="-25" y="-5" fill="#4ade80" fontSize="10" fontWeight="bold">PWR</text>
             </g>
           </g>
         </g>
       )}

      </svg>
      
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md text-slate-800 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-slate-200 pointer-events-none shadow-sm transition-opacity group-hover:opacity-0 opacity-50">
        GBA Shell Studio
      </div>
    </div>
  );
});

GbaPreview.displayName = "GbaPreview";