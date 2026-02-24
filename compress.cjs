const fs = require('fs');

const content = fs.readFileSync('./components/GbcSvgPaths.tsx', 'utf8');

const match = content.match(/<path\s+d="([^"]+)"\s+fill="currentColor"\s*\/>/);
if (!match) {
  console.log("Path not found");
  process.exit(1);
}

const d = match[1];
const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g);

const Y_THRESHOLD = 300;
const COMPRESSION = 0.9;

const newCommands = commands.map(cmd => {
  const type = cmd[0];
  const argsStr = cmd.slice(1).trim();
  if (!argsStr) return type;
  
  const args = argsStr.split(/[\s,]+/).map(Number);
  
  if (type === 'M' || type === 'L' || type === 'T') {
    let y = args[1];
    if (y > Y_THRESHOLD) y = Y_THRESHOLD + (y - Y_THRESHOLD) * COMPRESSION;
    // format to 3 decimal places to avoid long floats
    args[1] = parseFloat(y.toFixed(3));
    return `${type}${args[0]} ${args[1]}`;
  } else if (type === 'C') {
    for (let i = 1; i < args.length; i += 2) {
      let y = args[i];
      if (y > Y_THRESHOLD) y = Y_THRESHOLD + (y - Y_THRESHOLD) * COMPRESSION;
      args[i] = parseFloat(y.toFixed(3));
    }
    return `${type}${args.join(' ')}`;
  } else if (type === 'Z') {
    return type;
  }
  return cmd;
});

const newD = newCommands.join(' ');
const newContent = content.replace(d, newD);
fs.writeFileSync('./components/GbcSvgPaths.tsx', newContent);

function getNewY(oldY) {
  const y = (oldY - 10) / 1.5 - 6.8;
  if (y > Y_THRESHOLD) {
    const new_y = Y_THRESHOLD + (y - Y_THRESHOLD) * COMPRESSION;
    return 10 + 1.5 * (new_y + 6.8);
  }
  return oldY;
}

console.log("DPAD_CIRCLE_Y:", getNewY(665));
console.log("B_GUIDES_Y:", getNewY(630));
console.log("A_GUIDES_Y:", getNewY(625));
console.log("GBC_BUTTON_A_POS.y:", getNewY(635));
console.log("GBC_BUTTON_B_POS.y:", getNewY(665));
console.log("DPAD_Y:", getNewY(588));
console.log("SELECT_Y:", getNewY(810));
console.log("START_Y:", getNewY(810));
console.log("SPEAKER_Y:", getNewY(860));
console.log("GbcSpeakerHoles translate Y:", getNewY(868));
