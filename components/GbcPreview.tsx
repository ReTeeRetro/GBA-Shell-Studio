import { forwardRef } from 'react';
import { ColorOption, ShopMode } from '../types';
import {
  GbcShellPaths,
  GbcScreenPath,
  GbcButtonA,
  GbcButtonB,
  GbcStartSelectPaths,
  GbcLensLogo,
} from './GbcSvgPaths';
import {
  DpadPaths,
  DpadEngraving,
} from './GbaSvgPaths';

interface GbcPreviewProps {
  selectedColor: ColorOption;
  dpadColor: ColorOption;
  aButtonColor: ColorOption;
  bButtonColor: ColorOption;
  startSelectColor: ColorOption;
  powerSwitchColor: ColorOption;
  lButtonColor: ColorOption;
  rButtonColor: ColorOption;
  leftBumperColor: ColorOption;
  rightBumperColor: ColorOption;
  lensColor: ColorOption;
  gbcLogoGameBoyColor: ColorOption;
  gbcLogoColorWordColor: ColorOption;
  isClearShell?: boolean;
  isClearButtons?: boolean;
  isScreenOn?: boolean;
  onToggleScreen?: () => void;
  isDarkMode?: boolean;
  shopMode?: ShopMode;
  showGrid?: boolean;
}

export const GbcPreview = forwardRef<SVGSVGElement, GbcPreviewProps>(
  (
    {
      selectedColor,
      dpadColor,
      aButtonColor,
      bButtonColor,
      startSelectColor,
      lensColor,
      gbcLogoGameBoyColor,
      gbcLogoColorWordColor,
      isClearShell = false,
      isClearButtons = false,
      isScreenOn = false,
      onToggleScreen,
    },
    ref
  ) => {
    const VIEWBOX = '0 0 900 930';
    const buttonOpacity = isClearButtons ? 0.6 : 1;

    // Logo layout controls
    const LOGO_X = 130;
    const LOGO_Y = 390;
    const LOGO_SCALE = 0.27;

    const GBC_BUTTON_A_POS = { x: 487, y: 635 };
    const GBC_BUTTON_B_POS = { x: 390, y: 665 };
    const GBC_BUTTON_SCALE = 1.0;

    const DPAD_X = 70;
    const DPAD_Y = 588;
    const DPAD_SCALE = 1.22;

    const SELECT_X = 305 - 45;
    const SELECT_Y = 780 + 30;
    const START_X = 305 + 30;
    const START_Y = 780 + 30;

    const LENS_X = 31; 
    const LENS_Y = 39;

    const SCREEN_X = -387; 
    const SCREEN_Y = 35;

    const CALIBRATION_X = 351.6;
    const CALIBRATION_Y = -70.2;

    const displayTranslateX = LENS_X + CALIBRATION_X + SCREEN_X;
    const displayTranslateY = LENS_Y + CALIBRATION_Y + SCREEN_Y;

    return (
      <div
        className="relative w-full max-w-4xl mx-auto rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group transition-colors duration-300 bg-slate-200"
        style={{
          backgroundColor: '#e2e8f0',
          backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
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
            <filter id="gbcPlasticGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
              <feComponentTransfer in="grayNoise" result="balancedNoise">
                <feFuncR type="linear" slope="0.3" intercept="0.35" />
                <feFuncG type="linear" slope="0.3" intercept="0.35" />
                <feFuncB type="linear" slope="0.3" intercept="0.35" />
              </feComponentTransfer>
              <feComposite operator="in" in="balancedNoise" in2="SourceAlpha" result="grain" />
            </filter>

            <filter id="gbcFloorShadowBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
            </filter>
            
            <linearGradient id="gbcScreenOffGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#202020" />
              <stop offset="100%" stopColor="#404040" />
            </linearGradient>

            <linearGradient id="gbcScreenOnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            <linearGradient id="gbcBootLogoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

            <filter id="gbcBtnShadowRight" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.35" />
            </filter>

            <filter id="gbcBtnShadowLeft" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="-2" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.35" />
            </filter>

            <filter id="gbcLedGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3.75" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <style>
            {`
              #gbc-dpad-layer path {
                fill: ${dpadColor.hex} !important;
              }
            `}
          </style>

          <g transform="translate(450, 465) scale(0.81) translate(-300, -500)">
            <g id="gbc-floor-shadow" pointerEvents="none">
              <ellipse
                cx="300"
                cy="960"
                rx="240"
                ry="20"
                fill="#000000"
                opacity="0.2"
                filter="url(#gbcFloorShadowBlur)"
              />
            </g>

            <g id="gbc-shell" style={{ color: selectedColor.hex, opacity: isClearShell ? 0.6 : 1 }}>
              <GbcShellPaths />
            </g>

            <g filter="url(#gbcPlasticGrain)" style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }} opacity="0.3">
              <GbcShellPaths />
            </g>

            <g 
              id="gbc-lens-bezel"
              transform={`translate(${LENS_X}, ${LENS_Y})`}
            >
              <g style={{ color: lensColor.hex }}>
                <GbcScreenPath />
              </g>

              <GbcLensLogo 
                gameBoyColor={gbcLogoGameBoyColor.hex}
                colorWordColor={gbcLogoColorWordColor.hex}
                transform={`translate(${LOGO_X}, ${LOGO_Y}) scale(${LOGO_SCALE})`} 
              />

              <g transform="translate(38, 168)">
                <circle r="6.75" fill={isScreenOn ? "#ff0000" : "#220000"} filter={isScreenOn ? "url(#gbcLedGlow)" : ""} />
                {isScreenOn && <circle r="2.25" fill="#ffffff" opacity="0.6" transform="translate(-1.5, -1.5)" />}
              </g>
            </g>

            <g 
              id="gbc-display-active"
              transform={`translate(${displayTranslateX}, ${displayTranslateY})`}
            >
              <g transform="translate(300, 240) scale(0.95) translate(-300, -240)">
                <rect x="100" y="90" width="400" height="300" rx="4" fill="url(#gbcScreenOffGradient)" />
                {isScreenOn && (
                  <g>
                    <rect x="100" y="90" width="400" height="300" rx="4" fill="url(#gbcScreenOnGradient)" />
                    <text 
                      x="300" y="230" 
                      textAnchor="middle" 
                      fontFamily="sans-serif" 
                      fontWeight="900" 
                      fontStyle="italic" 
                      fontSize="56" 
                      fill="url(#gbcBootLogoGradient)" 
                      stroke="url(#gbcBootLogoGradient)"
                      strokeWidth="1"
                      letterSpacing="-7"
                      style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}
                    >
                      GAME BOY
                    </text>
                    <text 
                      x="300" y="275" 
                      textAnchor="middle" 
                      fontFamily="sans-serif" 
                      fontWeight="bold" 
                      fontSize="24" 
                      fill="#000000" 
                      letterSpacing="0.5"
                    >
                      Nintendo
                    </text>
                  </g>
                )}
                
                <rect 
                  x="100" y="90" width="400" height="300" 
                  fill="transparent" 
                  style={{ cursor: onToggleScreen ? 'pointer' : 'default' }}
                  onClick={onToggleScreen}
                />
              </g>
            </g>

            <g id="gbc-buttons" style={{ opacity: buttonOpacity }}>
              <g transform={`translate(${DPAD_X}, ${DPAD_Y}) scale(${DPAD_SCALE})`} filter="url(#gbcBtnShadowRight)">
                <g id="gbc-dpad-layer">
                  <DpadPaths />
                </g>
                <DpadEngraving />
              </g>
              
              <g filter="url(#gbcBtnShadowLeft)">
                <g 
                  style={{ color: aButtonColor.hex }} 
                  transform={`translate(${GBC_BUTTON_A_POS.x}, ${GBC_BUTTON_A_POS.y}) scale(${GBC_BUTTON_SCALE})`}
                >
                  <GbcButtonA />
                </g>

                <g 
                  style={{ color: bButtonColor.hex }} 
                  transform={`translate(${GBC_BUTTON_B_POS.x}, ${GBC_BUTTON_B_POS.y}) scale(${GBC_BUTTON_SCALE})`}
                >
                  <GbcButtonB />
                </g>
              </g>

              <g filter="url(#gbcBtnShadowRight)">
                <g 
                  style={{ color: startSelectColor.hex }}
                  transform={`translate(${SELECT_X}, ${SELECT_Y}) scale(0.35) translate(-82.5 -35)`}
                >
                  <GbcStartSelectPaths />
                </g>

                <g 
                  style={{ color: startSelectColor.hex }}
                  transform={`translate(${START_X}, ${START_Y}) scale(0.35) translate(-82.5 -35)`}
                >
                  <GbcStartSelectPaths />
                </g>
              </g>
            </g>
          </g>
        </svg>

        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md text-slate-800 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-slate-200 pointer-events-none shadow-sm transition-opacity group-hover:opacity-0 opacity-50">
          GBC Shell Studio
        </div>
      </div>
    );
  }
);

GbcPreview.displayName = 'GbcPreview';