import { forwardRef } from 'react';
import { ColorOption, ShopMode } from '../types';
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
  DpadMembraneBase,
  PowerSwitchButtonPath,
} from './GbaSvgPaths';

interface GbaPreviewProps {
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
  showGrid?: boolean;
  isClearShell?: boolean;
  isClearButtons?: boolean;
  isScreenOn?: boolean;
  onToggleScreen?: () => void;
  isDarkMode?: boolean;
  shopMode?: ShopMode;
}

export const GbaPreview = forwardRef<SVGSVGElement, GbaPreviewProps>(
  (
    {
      selectedColor,
      dpadColor,
      aButtonColor,
      bButtonColor,
      startSelectColor,
      powerSwitchColor,
      lButtonColor,
      rButtonColor,
      leftBumperColor,
      rightBumperColor,
      lensColor,
      showGrid = false,
      isClearShell = false,
      isClearButtons = false,
      isScreenOn = false,
      onToggleScreen,
      shopMode,
    },
    ref
  ) => {
    const VIEWBOX = '0 0 900 550';
    const SHELL_OFFSET_X = 58;
    const SHELL_OFFSET_Y = 36;
    const BUMPERS_X = 48;
    const BUMPERS_Y = 50;

    const LEFT_BUMPER_OFFSET_X = 28;
    const LEFT_BUMPER_OFFSET_Y = 75;
    const LEFT_BUMPER_SCALE = 0.47;
    const LEFT_BUMPER_ROTATION = 5;

    const RIGHT_BUMPER_OFFSET_X = 777;
    const RIGHT_BUMPER_OFFSET_Y = 75;
    const RIGHT_BUMPER_SCALE = 0.47;
    const RIGHT_BUMPER_ROTATION = -6;

    const L_BUTTON_OFFSET_X = 0;
    const L_BUTTON_OFFSET_Y = 0;
    const L_BUTTON_SCALE = 0.35;
    const L_BUTTON_ROTATION = -6;

    const R_BUTTON_OFFSET_X = 600;
    const R_BUTTON_OFFSET_Y = -15;
    const R_BUTTON_SCALE = 0.35;
    const R_BUTTON_ROTATION = 6;

    const AB_BUTTON_OFFSET_X = 15;
    const AB_BUTTON_OFFSET_Y = 12;
    const A_BUTTON_OFFSET_X = 10;
    const A_BUTTON_OFFSET_Y = 9;
    const B_BUTTON_OFFSET_X = 26;
    const B_BUTTON_OFFSET_Y = 2;

    const AB_MEMBRANE_X = 589;
    const AB_MEMBRANE_Y = 167;
    const AB_MEMBRANE_ROTATION = -19;

    const DPAD_X = 46;
    const DPAD_Y = 133;

    const DPAD_MEMBRANE_X = DPAD_X + 143;
    const DPAD_MEMBRANE_Y = DPAD_Y + 92;
    const DPAD_MEMBRANE_ROTATION = 155;
    const DPAD_MEMBRANE_SCALE = 0.93;

    const SELECT_BUTTON_X = 141;
    const SELECT_BUTTON_Y = 331;
    const START_BUTTON_X = 141;
    const START_BUTTON_Y = 286;

    const SPEAKER_X = 680;
    const SPEAKER_Y = 310;
    const LENS_X = 356;
    const LENS_Y = 37.7;
    const LED_X = 711 - SHELL_OFFSET_X;
    const LED_Y = 115 - SHELL_OFFSET_Y;

    // Power switch positioning logic
    const POWER_SWITCH_BTN_X = isScreenOn ? 20 : 0;
    const POWER_SWITCH_BTN_Y = isScreenOn ? 215 : 208;
    const POWER_SWITCH_BTN_SCALE = 0.62;
    const POWER_SWITCH_BTN_ROTATION = 20;

    const showTexture = true;
    const showShading = true;
    const buttonOpacity = isClearButtons ? 0.5 : 1;

    // Determine speaker grill color/blend mode based on shell color
    const isBlackShell = selectedColor.hex.toLowerCase() === '#000000';
    const speakerBlendMode = isBlackShell ? 'normal' : 'multiply';
    const speakerFill = isBlackShell ? '#2a2a2a' : '#000000';
    const speakerOpacity = isBlackShell ? 1 : 0.4;

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
        className="relative w-full max-w-4xl mx-auto rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group transition-colors duration-300 bg-slate-200"
        style={{
          backgroundColor: '#e2e8f0',
          // Fixed CSS syntax: radial-gradient must be a string value
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
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <filter id="vectorShading">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="1" intercept="0.25" />
                <feFuncG type="linear" slope="1" intercept="0.25" />
                <feFuncB type="linear" slope="1" intercept="0.25" />
              </feComponentTransfer>
            </filter>

            <filter id="dpadShading">
              <feColorMatrix type="saturate" values="0" />
              <feGaussianBlur stdDeviation="0.5" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.3" intercept="0.35" />
                <feFuncG type="linear" slope="0.3" intercept="0.35" />
                <feFuncB type="linear" slope="0.3" intercept="0.35" />
              </feComponentTransfer>
            </filter>

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
              <feComposite operator="in" in="balancedNoise" in2="SourceAlpha" result="grain" />
            </filter>

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

            <filter id="floorShadowBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
            </filter>

            <linearGradient id="sheenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#202020" />
              <stop offset="100%" stopColor="#404040" />
            </linearGradient>

            <linearGradient id="screenOnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            <linearGradient id="bootLogoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

            <filter id="ledGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="shell-clip">
              <g transform={`translate(${SHELL_OFFSET_X}, ${SHELL_OFFSET_Y})`}>
                <ShellPaths />
              </g>
            </clipPath>

            <clipPath id="screen-mask">
               <rect x="-148" y="40" width="370" height="250" rx="8" ry="8" />
            </clipPath>
          </defs>

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
              .sheen-fill path, .sheen-fill circle {
                 fill: url(#sheenGradient) !important;
              }
              #power-switch-button {
                transition: transform 0.3s ease-in-out;
              }
            `}
          </style>

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
 
          <g
            id="bumpers-layer"
            transform={`translate(${BUMPERS_X}, ${BUMPERS_Y})`}
          >
            <g style={{ opacity: buttonOpacity }}>
              <g id="bumpers-base">
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

              <g id="bumper-buttons-layer">
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
            </g>

            {showTexture && (
              <g
                filter="url(#plasticGrain)"
                style={{ mixBlendMode: 'overlay' }}
                opacity="0.3"
              />
            )}

            {isClearButtons && (
              <g style={{ opacity: 0.3, mixBlendMode: 'screen' }} fill="white" pointerEvents="none">
                  <g transform={`translate(${LEFT_BUMPER_OFFSET_X}, ${LEFT_BUMPER_OFFSET_Y}) rotate(${LEFT_BUMPER_ROTATION}) scale(${LEFT_BUMPER_SCALE})`}>
                      <LeftBumperPath />
                  </g>
                  <g transform={`translate(${RIGHT_BUMPER_OFFSET_X}, ${RIGHT_BUMPER_OFFSET_Y}) rotate(${RIGHT_BUMPER_ROTATION}) scale(${RIGHT_BUMPER_SCALE})`}>
                      <RightBumperPath />
                  </g>
                  <g transform={`translate(${L_BUTTON_OFFSET_X}, ${L_BUTTON_OFFSET_Y}) rotate(${L_BUTTON_ROTATION}) scale(${L_BUTTON_SCALE})`}>
                      <LButtonPath />
                  </g>
                  <g transform={`translate(${R_BUTTON_OFFSET_X}, ${R_BUTTON_OFFSET_Y}) rotate(${R_BUTTON_ROTATION}) scale(${R_BUTTON_SCALE})`}>
                      <RButtonPath />
                  </g>
              </g>
            )}
          </g>

          <g id="main-console" transform={`translate(${SHELL_OFFSET_X}, ${SHELL_OFFSET_Y})`}>
            <g
              transform={`
                translate(${DPAD_MEMBRANE_X}, ${DPAD_MEMBRANE_Y})
                rotate(${DPAD_MEMBRANE_ROTATION})
                scale(${DPAD_MEMBRANE_SCALE})
              `}
              style={{ opacity: buttonOpacity }}
            >
              <DpadMembraneBase fill={startSelectColor.hex} />
              {showTexture && (
                <DpadMembraneBase
                  fill={startSelectColor.hex}
                  filter="url(#plasticGrain)"
                  style={{ mixBlendMode: 'overlay' }}
                  opacity={0.4}
                />
              )}
            </g>

            <g transform={`translate(${DPAD_X}, ${DPAD_Y})`} style={{ opacity: buttonOpacity }}>
              <circle cx="53" cy="54" r="55" fill={dpadColor.hex} />
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

            <g transform="translate(115, 265)">
              <StartSelectMembraneBase fill={startSelectColor.hex} />
              {showTexture && (
                <StartSelectMembraneBase
                  fill={startSelectColor.hex}
                  filter="url(#plasticGrain)"
                  style={{ mixBlendMode: 'overlay' }}
                  opacity={0.4}
                />
              )}
            </g>

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
                  opacity={0.4}
                />
              )}
            </g>

            {isClearShell && (
              <>
                <g id="internal-speaker-layer" transform="translate(680, 315)" opacity={0.65} pointerEvents="none">
                  <circle cx="0" cy="0" r="46" fill="#9ca3af" />
                  <circle cx="0" cy="0" r="40" fill="#4b5563" />
                  <circle cx="0" cy="0" r="26" fill="#374151" opacity="0.5" />
                  <circle cx="0" cy="0" r="14" fill="#6b7280" />
                  <ellipse cx="-5" cy="-5" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-45)" />
                </g>
                <g
                  id="clear-shell-internals-layer"
                  style={{ mixBlendMode: 'multiply' }}
                  opacity={0.6}
                  pointerEvents="none"
                >
                  <ClearShellInternals />
                </g>
              </>
            )}

            <g
              id="power-switch-button"
              transform={`
                translate(${POWER_SWITCH_BTN_X}, ${POWER_SWITCH_BTN_Y})
                rotate(${POWER_SWITCH_BTN_ROTATION})
                scale(${POWER_SWITCH_BTN_SCALE})
              `}
              opacity={buttonOpacity}
              style={{ color: powerSwitchColor.hex }}
              pointerEvents="none"
            >
              <PowerSwitchButtonPath />
            </g>


            <g id="base-color-layer" style={{ opacity: isClearShell ? 0.55 : 1 }}>
              <ShellPaths />

              <g
                transform={`translate(${SPEAKER_X}, ${SPEAKER_Y})`}
                style={{ mixBlendMode: speakerBlendMode }}
                opacity={speakerOpacity}
                fill={speakerFill}
              >
                <SpeakerGrillPath />
              </g>

              <g
                transform={`translate(${LED_X}, ${LED_Y})`}
                fill={isScreenOn ? "#4ade80" : "#ffffff"}
                filter={isScreenOn ? "url(#ledGlow)" : undefined}
                opacity={isScreenOn ? 1 : 0.4}
              >
                <PowerLedPath />
              </g>
            </g>

            <g pointerEvents="none">
              {showTexture && (
                <g filter="url(#plasticGrain)" style={{ mixBlendMode: 'overlay' }} opacity="0.35">
                  <ShellPaths />
                </g>
              )}
              {showTexture && (
                <g className="sheen-fill" style={{ mixBlendMode: 'screen' }} opacity="0.4">
                  <ShellPaths />
                </g>
              )}
            </g>

            {showShading && (
              <g filter="url(#vectorShading)" style={{ mixBlendMode: 'hard-light' }} opacity="0.4">
                <ShellPaths />
              </g>
            )}

            <g 
              id="lens-layer" 
              transform={`translate(${LENS_X}, ${LENS_Y})`}
            >
              <LensPath fill={lensColor.hex} />

              {isScreenOn ? (
                <g clipPath="url(#screen-mask)">
                  <rect x="-148" y="40" width="370" height="250" fill="url(#screenOnGradient)" />
                  
                  <text 
                    x="37" 
                    y="160" 
                    textAnchor="middle" 
                    fontFamily="sans-serif" 
                    fontWeight="900" 
                    fontStyle="italic" 
                    fontSize="52" 
                    fill="url(#bootLogoGradient)" 
                    stroke="url(#bootLogoGradient)"
                    strokeWidth="1"
                    letterSpacing="-7"
                    style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}
                  >
                    GAME BOY
                  </text>
                  
                  <text 
                    x="37" 
                    y="200" 
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
              ) : (
                <rect
                  x="-148"
                  y="40"
                  width="370"
                  height="250"
                  fill="url(#screenGradient)"
                  rx="8"
                  ry="8"
                />
              )}

              {!shopMode && (
                <g transform="translate(32, 330) scale(1.14) translate(-96.378, -96.378)">
                  <GbaLogo />
                </g>
              )}

              <rect
                x="-148"
                y="40"
                width="370"
                height="250"
                fill="transparent"
                rx="8"
                ry="8"
                onClick={onToggleScreen}
                style={{ cursor: onToggleScreen ? 'pointer' : 'default' }}
              >
                <title>Toggle Power</title>
              </rect>
            </g>

            <g transform={`translate(${DPAD_X}, ${DPAD_Y})`}>
              <g
                id="dpad-base-layer"
                filter="url(#btnShadowRight)"
                style={{ opacity: buttonOpacity }}
              >
                <DpadPaths />
              </g>

              {isClearButtons && showTexture && (
                <g 
                  filter="url(#plasticGrain)" 
                  style={{ mixBlendMode: 'overlay' }} 
                  opacity="0.3"
                >
                  <DpadPaths />
                </g>
              )}

              {isClearButtons && (
                  <g opacity="0.3" style={{ mixBlendMode: 'screen' }} fill="#ffffff">
                      <DpadPaths />
                  </g>
              )}

              <DpadEngraving />
            </g>

            <g>
              <g
                id="buttons-base-layer"
                filter="url(#btnShadowLeft)"
                style={{ opacity: buttonOpacity }}
              >
                <g id="btn-a-base">{A_BUTTON_SHAPE}</g>
                <g id="btn-b-base">{B_BUTTON_SHAPE}</g>
                {BUTTON_LABELS}
              </g>

              {isClearButtons && showTexture && (
                <g 
                  filter="url(#plasticGrain)" 
                  style={{ mixBlendMode: 'overlay' }} 
                  opacity="0.3"
                >
                  <g transform={`translate(${AB_BUTTON_OFFSET_X}, ${AB_BUTTON_OFFSET_Y})`}>
                    <g transform={`translate(${A_BUTTON_OFFSET_X}, ${A_BUTTON_OFFSET_Y})`}>
                      <path d="M700 129 A 26 26 0 1 1 700 181 A 26 26 0 1 1 700 129 Z" />
                    </g>
                    <g transform={`translate(${B_BUTTON_OFFSET_X}, ${B_BUTTON_OFFSET_Y})`}>
                      <path d="M615 159 A 26 26 0 1 1 615 211 A 26 26 0 1 1 615 159 Z" />
                    </g>
                  </g>
                </g>
              )}

              {isClearButtons && (
                <g opacity="0.3" fill="white" style={{ mixBlendMode: 'screen' }}>
                   <g transform={`translate(${AB_BUTTON_OFFSET_X}, ${AB_BUTTON_OFFSET_Y})`}>
                      <g transform={`translate(${A_BUTTON_OFFSET_X}, ${A_BUTTON_OFFSET_Y})`}><path d="M700 129 A 26 26 0 1 1 700 181 A 26 26 0 1 1 700 129 Z" /></g>
                      <g transform={`translate(${B_BUTTON_OFFSET_X}, ${B_BUTTON_OFFSET_Y})`}><path d="M615 159 A 26 26 0 1 1 615 211 A 26 26 0 1 1 615 159 Z" /></g>
                   </g>
                </g>
              )}

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