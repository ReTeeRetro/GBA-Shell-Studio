import { forwardRef } from 'react';
import { ColorOption } from '../types';
import {
  ShellPaths,
  DpadPaths,
  StartSelectPath,
  LensPath,
  SpeakerGrillPath,
  PowerLedPath,
  GbaLogo,
  DpadEngraving,
  StartSelectMembraneBase,
  ABMembraneBase,
  ClearShellInternals,
  LeftBumperPath,
  RightBumperPath,
  LButtonPath,
  RButtonPath,
} from './GbaSvgPaths';

interface GbaPreviewProps {
  selectedColor: ColorOption;
  dpadColor: ColorOption;
  aButtonColor: ColorOption;
  bButtonColor: ColorOption;
  startSelectColor: ColorOption;
  lButtonColor: ColorOption;
  rButtonColor: ColorOption;
  leftBumperColor: ColorOption;
  rightBumperColor: ColorOption;
  lensColor: ColorOption;
  showGrid?: boolean;
  isClearShell?: boolean;
  isClearButtons?: boolean;
}

export const GbaPreview = forwardRef<SVGSVGElement, GbaPreviewProps>(
  (
    {
      selectedColor,
      dpadColor,
      aButtonColor,
      bButtonColor,
      startSelectColor,
      lButtonColor,
      rButtonColor,
      leftBumperColor,
      rightBumperColor,
      lensColor,
      showGrid = false,
      isClearShell = false,
      isClearButtons = false,
    },
    ref
  ) => {
    // Expanded VIEWBOX to accommodate Bumpers (approx 802px wide)
    // Original: 0 0 783 452
    // New: 0 0 900 550
    const VIEWBOX = '0 0 900 550';

    // MAIN CONTENT OFFSET
    // Shifts the Shell and Controls to center them in the new, wider viewbox
    const SHELL_OFFSET_X = 58;
    const SHELL_OFFSET_Y = 36;

    // BUMPERS OFFSET
    // Positions the bumpers relative to the workspace.
    // Aligned to match the shell's position.
    const BUMPERS_X = 48;
    const BUMPERS_Y = 50;

    // Bumper placement & angle tuning
    const LEFT_BUMPER_OFFSET_X = 28;
    const LEFT_BUMPER_OFFSET_Y = 75;
    const LEFT_BUMPER_SCALE = 0.47;
    const LEFT_BUMPER_ROTATION = 5; // degrees, tilt to follow left side curve

    const RIGHT_BUMPER_OFFSET_X = 777;
    const RIGHT_BUMPER_OFFSET_Y = 75;
    const RIGHT_BUMPER_SCALE = 0.47;
    const RIGHT_BUMPER_ROTATION = -6; // degrees, opposite direction

    // L / R button placement (on top of bumpers)
    const L_BUTTON_OFFSET_X = 0;
    const L_BUTTON_OFFSET_Y = 0;
    const L_BUTTON_SCALE = 0.35;
    const L_BUTTON_ROTATION = -6; // roughly follow left side curve

    const R_BUTTON_OFFSET_X = 600;
    const R_BUTTON_OFFSET_Y = -15;
    const R_BUTTON_SCALE = 0.35;
    const R_BUTTON_ROTATION = 6;  // for when we add the R path


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

    // A/B Membrane Configuration
    const AB_MEMBRANE_X = 589; // approx midpoint between A and B in shell coords
    const AB_MEMBRANE_Y = 167;
    const AB_MEMBRANE_ROTATION = -19; // align with A/B button diagonal

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
    const LENS_X = 356;
    const LENS_Y = 37.7;

    // Power LED Configuration
    // Targeted absolute visual position: X=702, Y=105
    // We calculate relative position inside the main-console group
    const LED_X = 711 - SHELL_OFFSET_X;
    const LED_Y = 115 - SHELL_OFFSET_Y;

    // RENDER MODES LOGIC - Hardcoded defaults as requested
    const showTexture = true; // Always plastic
    const showShading = true; // Always shading/depth

    // Opacity for clear buttons
    const buttonOpacity = isClearButtons ? 0.6 : 1;

    // SEPARATION: Define Shapes and Labels separately to prevent ghosting in effect layers

    const A_BUTTON_SHAPE = (
      <g transform={`translate(${AB_BUTTON_OFFSET_X}, ${AB_BUTTON_OFFSET_Y})`}>
        <g transform={`translate(${A_BUTTON_OFFSET_X}, ${A_BUTTON_OFFSET_Y})`}>
          <path d="M700 129 A 26 26 0 1 1 700 181 A 26 26 0 1 1 700 129 Z" />
        </g>
      </g>
    );

    const B_BUTTON_SHAPE = (
      <g transform={`translate(${AB_BUTTON_OFFSET_X}, ${AB_BUTTON_OFFSET_Y})`}>
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
          backgroundSize: '20px 20px',
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
                <feFuncR type="linear" slope="1" intercept="0.25" />
                <feFuncG type="linear" slope="1" intercept="0.25" />
                <feFuncB type="linear" slope="1" intercept="0.25" />
              </feComponentTransfer>
            </filter>

            {/* D-Pad Darkener & Smoother: */}
            <filter id="dpadShading">
              <feColorMatrix type="saturate" values="0" />
              <feGaussianBlur stdDeviation="0.5" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.3" intercept="0.35" />
                <feFuncG type="linear" slope="0.3" intercept="0.35" />
                <feFuncB type="linear" slope="0.3" intercept="0.35" />
              </feComponentTransfer>
            </filter>

            {/* 
              Plastic Grain:
              Adds a subtle texture to simulate the ABS plastic surface.
              Maps noise to a neutral grey range (0.35-0.65) to be compatible with 'overlay' blend mode.
            */}
            <filter id="plasticGrain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.6"
                numOctaves="3"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
              <feComponentTransfer in="grayNoise" result="balancedNoise">
                <feFuncR type="linear" slope="0.3" intercept="0.35" />
                <feFuncG type="linear" slope="0.3" intercept="0.35" />
                <feFuncB type="linear" slope="0.3" intercept="0.35" />
              </feComponentTransfer>
              {/* Mask with SourceAlpha to apply texture only to the shape */}
              <feComposite operator="in" in="balancedNoise" in2="SourceAlpha" result="grain" />
            </filter>

            {/* 
              Button Drop Shadows:
              Right Shadow for D-Pad and Start/Select
              Left Shadow for A/B Buttons
            */}
            <filter id="btnShadowRight" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="2"
                dy="2"
                stdDeviation="1.5"
                floodColor="#000000"
                floodOpacity="0.35"
              />
            </filter>

            <filter id="btnShadowLeft" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="-2"
                dy="2"
                stdDeviation="1.5"
                floodColor="#000000"
                floodOpacity="0.35"
              />
            </filter>

            {/* 
              Floor Shadow Blur:
              Softens the shadow underneath the console.
            */}
            <filter id="floorShadowBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
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
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Grid Patterns */}
            {showGrid && (
              <>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="cyan"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)" />
                  <path
                    d="M 100 0 L 0 0 0 100"
                    fill="none"
                    stroke="cyan"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                </pattern>
              </>
            )}

            {/* 
               Shell Clip Path for Texture Overlay
               This matches the position of the shell in the main-console group.
            */}
            <clipPath id="shell-clip">
              <g transform={`translate(${SHELL_OFFSET_X}, ${SHELL_OFFSET_Y})`}>
                <ShellPaths />
              </g>
            </clipPath>
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
              #btn-a-base path {
                fill: ${aButtonColor.hex} !important;
              }
              #btn-b-base path {
                fill: ${bButtonColor.hex} !important;
              }
              /* Independent Bumper Coloring */
              #left-bumper-path path {
                fill: ${leftBumperColor.hex} !important;
              }
              #right-bumper-path path {
                fill: ${rightBumperColor.hex} !important;
              }
              #l-button-path path {
                fill: ${lButtonColor.hex} !important;
              }
              #r-button-path path {
                fill: ${rButtonColor.hex} !important;
              }
              /* Forces the sheen gradient fill on re-rendered geometry */
              .sheen-fill path, .sheen-fill circle {
                 fill: url(#sheenGradient) !important;
              }
            `}
          </style>

          {/*
              LAYER -1: FLOOR SHADOW
              Placed at the bottom to render behind everything
          */}
          <g id="floor-shadow-layer" pointerEvents="none">
            <ellipse
              cx="320"
              cy="495"
              rx="280"
              ry="25"
              fill="#000000"
              opacity="0.2"
              filter="url(#floorShadowBlur)"
            />
          </g>
 
{/* LAYER 0: BUMPERS */}
<g
  id="bumpers-layer"
  transform={`translate(${BUMPERS_X}, ${BUMPERS_Y})`}
  style={{ opacity: buttonOpacity }}
>
  {/* Bumper shells */}
  <g id="bumpers-base">
    {/* Left bumper shell */}
    <g
      id="left-bumper-path"
      transform={`
        translate(${LEFT_BUMPER_OFFSET_X}, ${LEFT_BUMPER_OFFSET_Y})
        rotate(${LEFT_BUMPER_ROTATION})
        scale(${LEFT_BUMPER_SCALE})
      `}
    >
      <LeftBumperPath />
    </g>

    {/* Right bumper shell */}
    <g
      id="right-bumper-path"
      transform={`
        translate(${RIGHT_BUMPER_OFFSET_X}, ${RIGHT_BUMPER_OFFSET_Y})
        rotate(${RIGHT_BUMPER_ROTATION})
        scale(${RIGHT_BUMPER_SCALE})
      `}
    >
      <RightBumperPath />
    </g>
  </g>

  {/* L / R plastic buttons sitting on top of shells */}
  <g id="bumper-buttons-layer">
    {/* L button */}
    <g
      id="l-button-path"
      transform={`
        translate(${L_BUTTON_OFFSET_X}, ${L_BUTTON_OFFSET_Y})
        rotate(${L_BUTTON_ROTATION})
        scale(${L_BUTTON_SCALE})
      `}
    >
      <LButtonPath />
    </g>

    {/* R button */}
     <g
      id="r-button-path"
      transform={`
        translate(${R_BUTTON_OFFSET_X}, ${R_BUTTON_OFFSET_Y})
        rotate(${R_BUTTON_ROTATION})
        scale(${R_BUTTON_SCALE})
      `}
    >
      <RButtonPath />
    </g>
  </g>

  {/* Optional bumper texture */}
  {showTexture && (
    <g
      filter="url(#plasticGrain)"
      style={{ mixBlendMode: 'overlay' }}
      opacity="0.3"
    >
      {/* Texture applied via layers above if needed, here just placeholders if we wanted to clone paths */}
    </g>
  )}
</g>

          
          {/* 
              MAIN CONSOLE GROUP
              Wraps Shell, Lens, and Controls to center them in the new, wider viewbox.
          */}
          <g id="main-console" transform={`translate(${SHELL_OFFSET_X}, ${SHELL_OFFSET_Y})`}>
            {/* 
               LAYER 0.5: D-PAD UNDERLAY
               A circle sitting behind the shell, visible through the D-Pad cutout.
               Part of the D-Pad assembly (same color).
            */}
            <g transform={`translate(${DPAD_X}, ${DPAD_Y})`} style={{ opacity: buttonOpacity }}>
              <circle cx="53" cy="54" r="55" fill={dpadColor.hex} />
              {/* Optional Texture for consistency */}
              {showTexture && (
                <circle
                  cx="53"
                  cy="54"
                  r="55"
                  filter="url(#plasticGrain)"
                  style={{ mixBlendMode: 'overlay' }}
                  opacity="0.5"
                />
              )}
            </g>

            {/* 
               LAYER 0.6: START/SELECT MEMBRANE
               Vertical 'Pill' shape with tab on left.
               Centered at (115, 265).
            */}
            <g transform="translate(115, 265)">
              <StartSelectMembraneBase fill={startSelectColor.hex} />
              {showTexture && (
                <StartSelectMembraneBase
                  fill={startSelectColor.hex}
                  filter="url(#plasticGrain)"
                  style={{ mixBlendMode: 'overlay' }}
                  opacity="0.4"
                />
              )}
            </g>

            {/* 
               LAYER 0.65: A/B BUTTON MEMBRANE
               Double-pad rubber under A+B, same color as Start/Select.
               Positioned between A and B and rotated to match their angle.
            */}
            <g
              transform={`
                translate(${AB_MEMBRANE_X}, ${AB_MEMBRANE_Y})
                rotate(${AB_MEMBRANE_ROTATION})
              `}
            >
              <ABMembraneBase fill={startSelectColor.hex} />
              {showTexture && (
                <ABMembraneBase
                  fill={startSelectColor.hex}
                  filter="url(#plasticGrain)"
                  style={{ mixBlendMode: 'overlay' }}
                  opacity="0.4"
                />
              )}
            </g>

          {/* 
             LAYER 0.7: CLEAR SHELL INTERNALS
             Visible only when using a clear shell; lives beneath the plastic.
          */}
          {isClearShell && (
            <g
              id="clear-shell-internals-layer"
              style={{ mixBlendMode: 'multiply' }}
              opacity={0.75}
              pointerEvents="none"
            >
              <ClearShellInternals />
            </g>
          )}

            {/* 
               LAYER 1: BASE COLOR
               We force ALL paths to be filled with the selected color.
            */}
            <g id="base-color-layer" style={{ opacity: isClearShell ? 0.5 : 1 }}>
              <ShellPaths />

              {/* Speaker Grill */}
              <g
                transform={`translate(${SPEAKER_X}, ${SPEAKER_Y})`}
                style={{ mixBlendMode: 'multiply' }}
                opacity="0.4"
                fill="#000000"
              >
                <SpeakerGrillPath />
              </g>

              {/* Power LED */}
              <g
                transform={`translate(${LED_X}, ${LED_Y})`}
                fill="#4ade80"
                filter="url(#ledGlow)"
              >
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

            {/* LAYER 2.5: LENS */}
<g id="lens-layer" transform={`translate(${LENS_X}, ${LENS_Y})`}>
  {/* Lens bezel / plastic */}
  <LensPath fill={lensColor.hex} />

  {/* Screen on top, slightly inset */}
  <rect
    x="-148"   // a bit inset from old -165.5 to sit inside the lens
    y="40"
    width="370"
    height="250"
    fill="url(#screenGradient)"
    rx="8"
    ry="8"
  />

  {/* Logo */}
  <g transform="translate(32, 330) scale(1.14) translate(-96.378, -96.378)">
    <GbaLogo />
  </g>
</g>

            {/* 
                LAYER 3: D-PAD
            */}
            <g transform={`translate(${DPAD_X}, ${DPAD_Y})`}>
              {/* Base Layer + Drop Shadow (Right) */}
              <g
                id="dpad-base-layer"
                filter="url(#btnShadowRight)"
                style={{ opacity: buttonOpacity }}
              >
                <DpadPaths />
              </g>

              {/* D-Pad Details (Arrows/Dimple) - Rendered over base but under texture */}
              <DpadEngraving />
            </g>

            {/* 
                LAYER 4: BUTTONS (A/B and Start/Select)
            */}
            <g>
              {/* A/B Buttons Base + Drop Shadow (Left) */}
              <g
                id="buttons-base-layer"
                filter="url(#btnShadowLeft)"
                style={{ opacity: buttonOpacity }}
              >
                <g id="btn-a-base">{A_BUTTON_SHAPE}</g>
                <g id="btn-b-base">{B_BUTTON_SHAPE}</g>
                {BUTTON_LABELS}
              </g>

              {/* Start/Select Buttons (Rubber Texture) + Drop Shadow (Right) */}
              <g
                fill={startSelectColor.hex}
                filter="url(#btnShadowRight)"
                style={{ opacity: buttonOpacity }}
              >
                <g transform={`translate(${SELECT_BUTTON_X}, ${SELECT_BUTTON_Y})`}>
                  <StartSelectPath />
                </g>
                <g transform={`translate(${START_BUTTON_X}, ${START_BUTTON_Y})`}>
                  <StartSelectPath />
                </g>
              </g>

              {/* Grain only for rubber (no sheen) - Apply if Realistic OR Matte (texture is nice on rubber) */}
              {showTexture && (
                <g
                  filter="url(#plasticGrain)"
                  style={{ mixBlendMode: 'overlay' }}
                  opacity="0.4"
                >
                  <g transform={`translate(${SELECT_BUTTON_X}, ${SELECT_BUTTON_Y})`}>
                    <StartSelectPath />
                  </g>
                  <g transform={`translate(${START_BUTTON_X}, ${START_BUTTON_Y})`}>
                    <StartSelectPath />
                  </g>
                </g>
              )}

              {/* Shading */}
              {showShading && (
                <g
                  filter="url(#dpadShading)"
                  style={{ mixBlendMode: 'hard-light' }}
                  opacity="0.3"
                >
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
              {[100, 200, 300, 400, 500, 600, 700, 800].map((x) => (
                <text
                  key={`x-${x}`}
                  x={x + 2}
                  y="12"
                  fill="cyan"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {x}
                </text>
              ))}
              {[100, 200, 300, 400].map((y) => (
                <text
                  key={`y-${y}`}
                  x="2"
                  y={y - 2}
                  fill="cyan"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {y}
                </text>
              ))}
            </g>
          )}
        </svg>

        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md text-slate-800 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-slate-200 pointer-events-none shadow-sm transition-opacity group-hover:opacity-0 opacity-50">
          GBA Shell Studio
        </div>
      </div>
    );
  }
);

GbaPreview.displayName = 'GbaPreview';