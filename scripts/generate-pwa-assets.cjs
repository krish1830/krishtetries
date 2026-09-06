const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crcTarget = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crcVal = crc32(crcTarget);
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

function createPng(width, height, drawFn) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // Compression
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines
  const rowStride = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowStride);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const idatCompressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', idatCompressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Drawer: Retro Neon Arcade Joystick & Tetris / Cyber Badge
function drawArcadeIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const scale = isMaskable ? 0.75 : 0.9;
  
  // Background: Deep cyber black with subtle radial glow
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Rounded squircle badge for 'any', full bleed for 'maskable'
  if (!isMaskable) {
    const cornerR = 0.25;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (ax > 0.95 || ay > 0.95) return [0, 0, 0, 0]; // Transparent outer padding
    if (ax > 0.75 && ay > 0.75) {
      const cdx = (ax - 0.75) / cornerR;
      const cdy = (ay - 0.75) / cornerR;
      if (cdx * cdx + cdy * cdy > 1) return [0, 0, 0, 0];
    }
  }

  // Base dark cyber plate
  let r = 12, g = 10, b = 24, a = 255;

  // Gold / Amber ambient center glow
  const glow = Math.max(0, 1 - dist * 1.3);
  r = Math.min(255, Math.floor(r + glow * 80));
  g = Math.min(255, Math.floor(g + glow * 45));
  b = Math.min(255, Math.floor(b + glow * 10));

  // Neon gold border frame inside icon
  const badgeRadius = isMaskable ? 0.8 : 0.88;
  const borderDist = Math.abs(dist - badgeRadius);
  if (borderDist < 0.035) {
    const borderAlpha = Math.max(0, 1 - borderDist / 0.035);
    r = Math.floor(r * (1 - borderAlpha) + 245 * borderAlpha);
    g = Math.floor(g * (1 - borderAlpha) + 158 * borderAlpha);
    b = Math.floor(b * (1 - borderAlpha) + 11 * borderAlpha);
  }

  // Draw Gamepad D-pad & Tetris T-tetromino in the center
  const nx = (x - cx) / (w * scale * 0.45);
  const ny = (y - cy) / (h * scale * 0.45);

  // Diamond / Arcade Joy Core
  // Draw T-tetromino shape in neon amber/gold
  const inTetrisTop = (nx >= -0.75 && nx <= 0.75 && ny >= -0.55 && ny <= -0.15);
  const inTetrisStem = (nx >= -0.25 && nx <= 0.25 && ny >= -0.15 && ny <= 0.45);

  if (inTetrisTop || inTetrisStem) {
    // Gradient neon amber to yellow
    const grad = (ny + 0.55);
    r = 255;
    g = Math.min(255, Math.floor(180 + grad * 60));
    b = 30;
    // Highlight bevel
    if (nx > -0.2 && nx < 0.2 && ny > -0.5 && ny < -0.2) {
      r = 255; g = 240; b = 150;
    }
  }

  // Cyber corner accents (cyan & magenta dots)
  const isCornerCyan = (Math.abs(nx) > 0.6 && Math.abs(ny) > 0.6 && Math.abs(nx) < 0.78 && Math.abs(ny) < 0.78);
  if (isCornerCyan) {
    r = 6; g = 182; b = 212; // Cyan neon
  }

  return [r, g, b, a];
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA assets in:', publicDir);

// 1. Generate 192x192 PNG
const png192 = createPng(192, 192, (x, y, w, h) => drawArcadeIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// 2. Generate 512x512 PNG
const png512 = createPng(512, 512, (x, y, w, h) => drawArcadeIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

// 3. Generate 512x512 maskable PNG (safe zone padded)
const pngMaskable = createPng(512, 512, (x, y, w, h) => drawArcadeIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);

// 4. Generate 180x180 apple-touch-icon.png
const pngApple = createPng(180, 180, (x, y, w, h) => drawArcadeIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);

// 5. Generate favicon.ico / favicon.png (64x64)
const pngFavicon = createPng(64, 64, (x, y, w, h) => drawArcadeIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.png'), pngFavicon);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pngFavicon);

// 6. Generate SVG vector icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d174d" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="goldNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="110" fill="#050505"/>
  <rect width="512" height="512" rx="110" fill="url(#bgGlow)"/>
  
  <!-- Outer Neon Gold Frame -->
  <rect x="36" y="36" width="440" height="440" rx="85" fill="none" stroke="url(#goldNeon)" stroke-width="6" stroke-opacity="0.7" filter="url(#neonGlow)"/>
  
  <!-- Arcade Joy/Tetris Emblem -->
  <!-- Top bar of T-tetromino -->
  <rect x="136" y="156" width="240" height="70" rx="14" fill="url(#goldNeon)" filter="url(#neonGlow)"/>
  <rect x="144" y="164" width="224" height="24" rx="6" fill="#fef08a" opacity="0.6"/>
  <!-- Stem of T-tetromino -->
  <rect x="221" y="226" width="70" height="130" rx="14" fill="url(#goldNeon)" filter="url(#neonGlow)"/>
  
  <!-- Cyber Corner Diamonds -->
  <circle cx="120" cy="380" r="14" fill="url(#cyanNeon)" filter="url(#neonGlow)"/>
  <circle cx="392" cy="380" r="14" fill="#ec4899" filter="url(#neonGlow)"/>
  
  <!-- Sub-label -->
  <text x="256" y="420" text-anchor="middle" fill="#fbbf24" font-family="'Orbitron', sans-serif" font-size="28" font-weight="900" letter-spacing="6">ARCADE</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('Successfully generated all PWA icons & assets!');
