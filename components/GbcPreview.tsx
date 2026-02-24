
import { forwardRef } from 'react';
import { ColorOption, ShopMode } from '../types';
import gbcPcbUrl from './Gbcpcb.svg';
import {
  GbcShellPaths,
  GbcScreenPath,
  GbcButtonA,
  GbcButtonB,
  GbcStartSelectPaths,
  GbcLensLogo,
  GbcSpeakerHoles,
  GbcStartSelectMembrane,
  GbcABMembrane,
  GbcDpadMembrane,
  GbcDpadCircleUnderlay,
  GbcBButtonGuidesUnderlay,
  GbcAButtonGuidesUnderlay,
  GbcScrewPosts,
  GbcPowerButton,
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
  gbcSpeakerOffset?: { x: number; y: number };
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
      powerSwitchColor,
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
    const LOGO_X = 129;
    const LOGO_Y = 396;
    const LOGO_SCALE = 0.28;
    
    // PCB layout controls
    const PCB_X = -5;
    const PCB_Y = 10;
    const PCB_SCALE = 1.02;

    const DPAD_CIRCLE_X = 209;
    const DPAD_CIRCLE_Y = 665 - 50;
    const DPAD_CIRCLE_SCALE = 0.38;
    const DPAD_CIRCLE_ROT = 85;

    // --- GBC D-pad membrane (shows ONLY on clear shells) ---
    const DPAD_MEMBRANE_X = 190;
    const DPAD_MEMBRANE_Y = 538;
    const DPAD_MEMBRANE_SCALE = 0.7;
    const DPAD_MEMBRANE_ROT = 40;

    // --- GBC Power Button (shows ONLY on clear shells) ---
    const POWER_BUTTON_X = 476;
    const POWER_BUTTON_Y = 135;
    const POWER_BUTTON_SCALE = 1.2;
    const POWER_BUTTON_ROT = 0;

    // --- GBC B-button plastic guides underlay (shows ONLY on clear shells) ---
    const B_GUIDES_X = 360;
    const B_GUIDES_Y = 630 - 50;
    const B_GUIDES_SCALE = 0.4;
    const B_GUIDES_ROT = 0;

    // --- GBC A-button plastic guides underlay (shows ONLY on clear shells) ---
    const A_GUIDES_X = 440;
    const A_GUIDES_Y = 625 - 50;
    const A_GUIDES_SCALE = 0.4;
    const A_GUIDES_ROT = -22;

    const GBC_BUTTON_A_POS = { x: 487, y: 635 - 50 };
    const GBC_BUTTON_B_POS = { x: 390, y: 665 - 50 };
    const GBC_BUTTON_SCALE = 1.0;

    const DPAD_X = 70;
    const DPAD_Y = 588 - 50;
    const DPAD_SCALE = 1.22;

    const SELECT_X = 305 - 45;
    const SELECT_Y = 780 + 30 - 75;
    const START_X = 305 + 30;
    const START_Y = 780 + 30 - 75;

    const LENS_X = 29; 
    const LENS_Y = 3;

    const SCREEN_X = -383; 
    const SCREEN_Y = 35;

    const CALIBRATION_X = 351.6;
    const CALIBRATION_Y = -70.2;

    const SPEAKER_X = 460;
    const SPEAKER_Y = 860 - 75;
    const SPEAKER_SCALE = 1.75;

    const displayTranslateX = LENS_X + CALIBRATION_X + SCREEN_X;
    const displayTranslateY = LENS_Y + CALIBRATION_Y + SCREEN_Y;

    const isDefaultMembrane = aButtonColor.hex === '#2D2D2D' && bButtonColor.hex === '#2D2D2D' && dpadColor.hex === '#2D2D2D';
    const abMembraneColor = isDefaultMembrane ? '#98fbcb' : startSelectColor.hex;
    const abMembraneOpacity = isDefaultMembrane ? 0.9 : 0.6;

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

            <g
              id="gbc-pcb-layer"
              transform={`translate(${PCB_X}, ${PCB_Y}) scale(${PCB_SCALE})`}
              pointerEvents="none"
              opacity={0.9}
            >
              <image href={gbcPcbUrl} width="591" height="904" />
            </g>

            {isClearShell && (
              <g 
                id="gbc-ab-membrane"
                style={{ color: abMembraneColor, opacity: abMembraneOpacity }}
                transform={`translate(${GBC_BUTTON_B_POS.x - -170}, ${GBC_BUTTON_B_POS.y - -15}) scale(0.75) rotate(-197)`}
              >
                <GbcABMembrane />
              </g>
            )}

            {isClearShell && (
              <g 
                id="gbc-dpad-membrane"
                style={{ color: abMembraneColor, opacity: abMembraneOpacity }}
                transform={`translate(${DPAD_MEMBRANE_X}, ${DPAD_MEMBRANE_Y}) rotate(${DPAD_MEMBRANE_ROT}) scale(${DPAD_MEMBRANE_SCALE}) translate(-163, -5)`}
              >
                <GbcDpadMembrane />
              </g>
            )}

            {isClearShell && (
              <g 
                id="gbc-start-select-membrane"
                style={{ color: startSelectColor.hex, opacity: 0.4 }}
                transform={`translate(${SELECT_X - 48}, ${SELECT_Y - 40}) scale(0.7)`}
              >
                <GbcStartSelectMembrane />
              </g>
            )}

            <g 
              id="gbc-power-button"
              style={{ color: powerSwitchColor.hex, opacity: 0.8 }}
              transform={`translate(${POWER_BUTTON_X}, ${POWER_BUTTON_Y}) rotate(${POWER_BUTTON_ROT}) scale(${POWER_BUTTON_SCALE})`}
            >
              <GbcPowerButton />
            </g>

            {isClearShell && (
              <g
                id="gbc-dpad-circle-underlay"
                style={{
                  color: dpadColor.hex,
                  opacity: 0.4,
                  mixBlendMode: 'multiply' as any,
                  pointerEvents: 'none',
                }}
                transform={`translate(${DPAD_CIRCLE_X}, ${DPAD_CIRCLE_Y}) rotate(${DPAD_CIRCLE_ROT}) scale(${DPAD_CIRCLE_SCALE}) translate(-487, -360)`}
              >
                <GbcDpadCircleUnderlay />
              </g>
            )}

            {isClearShell && (
              <g
                id="gbc-b-button-guides-underlay"
                style={{
                  color: bButtonColor.hex,
                  opacity: 0.4,
                  mixBlendMode: 'multiply' as any,
                  pointerEvents: 'none',
                }}
                transform={`translate(${B_GUIDES_X}, ${B_GUIDES_Y}) rotate(${B_GUIDES_ROT}) scale(${B_GUIDES_SCALE}) translate(-710, -825)`}
              >
                <GbcBButtonGuidesUnderlay />
              </g>
            )}

            {isClearShell && (
              <g
                id="gbc-a-button-guides-underlay"
                style={{
                  color: aButtonColor.hex,
                  opacity: 0.4,
                  pointerEvents: 'none',
                }}
                transform={`translate(${A_GUIDES_X}, ${A_GUIDES_Y}) rotate(${A_GUIDES_ROT}) scale(${A_GUIDES_SCALE}) translate(-360, -861)`}
              >
                <GbcAButtonGuidesUnderlay />
              </g>
            )}

            {isClearShell && (
              <g 
                id="gbc-internal-speaker-layer" 
                transform={`translate(${SPEAKER_X}, ${SPEAKER_Y}) scale(${SPEAKER_SCALE})`} 
                opacity={0.85} 
                pointerEvents="none"
              >
                <circle cx="0" cy="0" r="46" fill="#9ca3af" />
                <circle cx="0" cy="0" r="40" fill="#4b5563" />
                <circle cx="0" cy="0" r="26" fill="#374151" opacity="0.5" />
                <circle cx="0" cy="0" r="14" fill="#6b7280" />
                <ellipse cx="-5" cy="-5" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-45)" />
              </g>
            )}

            <g id="gbc-shell" style={{ color: selectedColor.hex, opacity: isClearShell ? 0.6 : 1 }}>
              <GbcShellPaths />
            </g>

            {isClearShell && (
              <g id="gbc-screw-posts" pointerEvents="none" style={{ color: selectedColor.hex }}>
                <GbcScrewPosts />
              </g>
            )}

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

              <g transform="translate(35, 168)">
                <circle r="6.75" fill={isScreenOn ? "#ff0000" : "#220000"} filter={isScreenOn ? "url(#gbcLedGlow)" : ""} />
                {isScreenOn && <circle r="2.25" fill="#ffffff" opacity="0.6" transform="translate(-1.5, -1.5)" />}
                <text
                  x="0"
                  y="18"
                  textAnchor="start"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="300"
                  fill="#94a3b8"
                  letterSpacing="0.5"
                  pointerEvents="none"
                  transform="translate(-7, 5)"
                >POWER</text>
                <text
                  x="12"
                  y="3"
                  textAnchor="start"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="300"
                  fill="#94a3b8"
                  letterSpacing="1"
                  pointerEvents="none"
                >)))</text>
              </g>
            </g>

            <g 
              id="gbc-display-active"
              transform={`translate(${displayTranslateX}, ${displayTranslateY})`}
            >
              <g transform="translate(300, 240) scale(0.82) translate(-300, -240)">
                <rect x="80" y="90" width="440" height="360" rx="4" fill="url(#gbcScreenOffGradient)" />
                {isScreenOn && (
                  <g>
                    <rect x="80" y="90" width="440" height="360" rx="4" fill="url(#gbcScreenOnGradient)" />
                    <text 
                      x="300" y="260" 
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
                      x="300" y="305" 
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
                  x="80" y="90" width="440" height="360" 
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

            <GbcSpeakerHoles />
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
