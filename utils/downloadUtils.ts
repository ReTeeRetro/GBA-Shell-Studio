import { GbaConfig } from '../types';

export const downloadGbaImage = (svgElement: SVGSVGElement | null, config: GbaConfig) => {
  if (!svgElement) return;

  const isGbc = config.consoleType === 'gbc';
  const w = isGbc ? 600 : 900;
  const h = isGbc ? 900 : 550;
  const scale = 2; // High res scale
  const footerHeight = 220; // Increased for more rows

  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  svgClone.setAttribute('width', `${w * scale}`);
  svgClone.setAttribute('height', `${h * scale}`);

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgClone);

  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+xmlns:xlink/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = (h + footerHeight) * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(url);
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const footerY = h * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, footerY, canvas.width, footerHeight * scale);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, footerY, canvas.width, 2);

    ctx.textBaseline = 'middle';
    const btnSuffix = config.isClearButtons ? ' (Clear)' : '';

    let parts = [];
    
    if (isGbc) {
      parts = [
        { label: 'Shell', color: config.selectedColor, detail: config.isClearShell ? '(Clear)' : '' },
        { label: 'Lens', color: config.lensColor },
        { label: 'D-Pad', color: config.dpadColor, detail: btnSuffix },
        { label: 'Btn A', color: config.aButtonColor, detail: btnSuffix },
        { label: 'Btn B', color: config.bButtonColor, detail: btnSuffix },
        { label: 'Start/Select', color: config.startSelectColor, detail: btnSuffix },
      ];
    } else {
      const triggersMatch = config.lButtonColor.id === config.rButtonColor.id && config.lButtonColor.hex === config.rButtonColor.hex;
      const bumpersMatch = config.leftBumperColor.id === config.rightBumperColor.id && config.leftBumperColor.hex === config.rightBumperColor.hex;
      
      let bumperTextPart = [];
      if (triggersMatch) {
          bumperTextPart.push({ label: 'L/R Buttons', color: config.lButtonColor, detail: btnSuffix });
      } else {
          bumperTextPart.push({ label: 'L Button', color: config.lButtonColor, detail: btnSuffix });
          bumperTextPart.push({ label: 'R Button', color: config.rButtonColor, detail: btnSuffix });
      }

      if (bumpersMatch) {
          bumperTextPart.push({ label: 'Side Bumpers', color: config.leftBumperColor, detail: btnSuffix });
      } else {
          bumperTextPart.push({ label: 'L Side Bumper', color: config.leftBumperColor, detail: btnSuffix });
          bumperTextPart.push({ label: 'R Side Bumper', color: config.rightBumperColor, detail: btnSuffix });
      }

      parts = [
        { label: 'Shell', color: config.selectedColor, detail: config.isClearShell ? '(Clear)' : '' },
        { label: 'Lens', color: config.lensColor },
        { label: 'D-Pad', color: config.dpadColor, detail: btnSuffix },
        { label: 'Btn A', color: config.aButtonColor, detail: btnSuffix },
        { label: 'Btn B', color: config.bButtonColor, detail: btnSuffix },
        { label: 'Power Sw', color: config.powerSwitchColor, detail: btnSuffix },
        { label: 'Start/Select', color: config.startSelectColor, detail: btnSuffix },
        ...bumperTextPart
      ];
    }

    const startX = 60;
    const colWidth = isGbc ? 420 : 530; // Adjusted for GBC column spacing
    const itemsPerCol = 4;

    parts.forEach((part, index) => {
      const col = Math.floor(index / itemsPerCol);
      const row = index % itemsPerCol;
      const x = startX + col * colWidth;
      const y = footerY + 60 + row * 60;

      ctx.textAlign = 'left';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(part.label + ':', x, y);

      const labelWidth = ctx.measureText(part.label + ':').width;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#0f172a';
      let nameText = part.color.name;
      if (part.detail) nameText += part.detail;
      ctx.fillText(nameText, x + labelWidth + 12, y);

      const nameWidth = ctx.measureText(nameText).width;
      ctx.font = '20px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(part.color.hex.toUpperCase(), x + labelWidth + 12 + nameWidth + 12, y);
    });

    ctx.textAlign = 'right';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${isGbc ? 'GBC' : 'GBA'} Shell Studio ${new Date().getFullYear()}`, canvas.width - 40, canvas.height - 40);

    ctx.textAlign = 'left';
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('https://gba-shell-studio.com/', startX, canvas.height - 40);

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${config.consoleType}-shell-${config.selectedColor.name.toLowerCase().replace(/\s+/g, '-')}${config.isClearShell ? '-clear' : ''}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
  };
  img.src = url;
};