import { GbaConfig } from '../types';

export const downloadGbaImage = (svgElement: SVGSVGElement | null, config: GbaConfig) => {
  if (!svgElement) return;

  const w = 900;
  const h = 550;
  const scale = 2; // High res scale
  const footerHeight = 160;

  // 1. Clone the SVG to manipulate it safely without affecting the DOM
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

  // 2. Set explicit dimensions on the clone to force high-res rasterization
  svgClone.setAttribute('width', `${w * scale}`);
  svgClone.setAttribute('height', `${h * scale}`);

  // 3. Serialize to XML string
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgClone);

  // 4. Ensure XML namespace and Declaration
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+xmlns:xlink/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  // 5. Create Blob URL
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
    // 1. Fill Background
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw GBA Image
    ctx.drawImage(img, 0, 0);

    // 3. Draw Footer Background
    const footerY = h * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, footerY, canvas.width, footerHeight * scale);

    // Footer Divider
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, footerY, canvas.width, 2);

    // 4. Draw Metadata
    ctx.textBaseline = 'middle';

    const btnSuffix = config.isClearButtons ? ' (Clear)' : '';

    // Logic to condense bumper/trigger text
    const triggersMatch = config.lButtonColor.id === config.rButtonColor.id && config.lButtonColor.hex === config.rButtonColor.hex;
    const bumpersMatch = config.leftBumperColor.id === config.rightBumperColor.id && config.leftBumperColor.hex === config.rightBumperColor.hex;
    const allMatch = triggersMatch && bumpersMatch && config.lButtonColor.id === config.leftBumperColor.id && config.lButtonColor.hex === config.leftBumperColor.hex;

    let bumperTextPart = [];
    if (allMatch) {
        bumperTextPart.push({ label: 'Bumpers', color: config.lButtonColor, detail: btnSuffix });
    } else {
        if (triggersMatch) {
            bumperTextPart.push({ label: 'L/R Btns', color: config.lButtonColor, detail: btnSuffix });
        } else {
            bumperTextPart.push({ label: 'L Btn', color: config.lButtonColor, detail: btnSuffix });
            bumperTextPart.push({ label: 'R Btn', color: config.rButtonColor, detail: btnSuffix });
        }

        if (bumpersMatch) {
            bumperTextPart.push({ label: 'Side Bumpers', color: config.leftBumperColor, detail: btnSuffix });
        } else {
            bumperTextPart.push({ label: 'L Side', color: config.leftBumperColor, detail: btnSuffix });
            bumperTextPart.push({ label: 'R Side', color: config.rightBumperColor, detail: btnSuffix });
        }
    }

    // Organize parts
    const parts = [
      { label: 'Shell', color: config.selectedColor, detail: config.isClearShell ? '(Clear)' : '' },
      { label: 'Lens', color: config.lensColor },
      { label: 'D-Pad', color: config.dpadColor, detail: btnSuffix },
      { label: 'Btn A', color: config.aButtonColor, detail: btnSuffix },
      { label: 'Btn B', color: config.bButtonColor, detail: btnSuffix },
      { label: 'Start/Select', color: config.startSelectColor, detail: btnSuffix },
      ...bumperTextPart
    ];

    const startX = 60;
    const colWidth = 530;
    const itemsPerCol = 3;

    parts.forEach((part, index) => {
      const col = Math.floor(index / itemsPerCol);
      const row = index % itemsPerCol;

      const x = startX + col * colWidth;
      const y = footerY + 60 + row * 60;

      // Label
      ctx.textAlign = 'left';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.fillText(part.label + ':', x, y);

      // Color Name
      const labelWidth = ctx.measureText(part.label + ':').width;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#0f172a'; // slate-900
      let nameText = part.color.name;
      if (part.detail) {
        nameText += part.detail; // Space already handled in suffix if needed, or manual
      }
      ctx.fillText(nameText, x + labelWidth + 12, y);

      // Hex Code
      const nameWidth = ctx.measureText(nameText).width;
      ctx.font = '20px monospace';
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.fillText(part.color.hex.toUpperCase(), x + labelWidth + 12 + nameWidth + 12, y);
    });

    // 5. Draw Year Tag
    ctx.textAlign = 'right';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#cbd5e1'; // slate-300
    ctx.fillText(`GBA Shell Studio ${new Date().getFullYear()}`, canvas.width - 40, canvas.height - 40);

    // 6. Draw URL
    ctx.textAlign = 'left';
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.fillText('https://gba-shell-studio.vercel.app/', startX, canvas.height - 40);

    // 7. Save & Download
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `gba-shell-${config.selectedColor.name.toLowerCase().replace(/\s+/g, '-')}${
      config.isClearShell ? '-clear' : ''
    }.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Cleanup
    URL.revokeObjectURL(url);
  };
  img.src = url;
};