/**
 * MediNova — Icon generator (pure Node, no deps).
 * Rasterizes the MediNova "M" mark into PNG app icons for the PWA:
 *   - icon-192.png, icon-512.png  (manifest)
 *   - apple-touch-icon.png        (iOS)
 *   - favicon.png                 (fallback favicon)
 *
 * Usage: node scripts/gen-icons.mjs
 */

import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "icons");
mkdirSync(outDir, { recursive: true });

// ---- minimal PNG encoder -------------------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc(height * (1 + width * 4));
  const src = Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 4);
    raw[rowStart] = 0; // filter: none
    src.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- rasterization helpers ------------------------------------------------
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function renderMark(size) {
  const S = size;
  const px = new Uint8Array(S * S * 4);
  const half = S / 2;
  const cornerR = S * 0.2;
  const stroke = S * 0.09;
  const halfStroke = stroke / 2;

  // segments of the "M" (in fractions of S)
  const segments = [
    [0.24, 0.34, 0.24, 0.78], // left vertical
    [0.24, 0.34, 0.5, 0.56],  // diagonal down
    [0.5, 0.56, 0.76, 0.34],  // diagonal up
    [0.76, 0.34, 0.76, 0.78], // right vertical
    [0.5, 0.13, 0.5, 0.25],   // cross vertical
    [0.44, 0.19, 0.56, 0.19], // cross horizontal
  ].map(([x1, y1, x2, y2]) => [x1 * S, y1 * S, x2 * S, y2 * S]);

  const DARK = [17, 26, 48, 255];
  const PURPLE_TOP = [168, 85, 247, 255];
  const PURPLE_BOT = [124, 58, 237, 255];
  const WHITE = [255, 255, 255, 255];

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      const cx = x + 0.5;
      const cy = y + 0.5;

      // rounded-square tile test
      const distX = Math.max(Math.abs(cx - half) - (half - cornerR), 0);
      const distY = Math.max(Math.abs(cy - half) - (half - cornerR), 0);
      const inTile = Math.hypot(distX, distY) <= cornerR;

      if (!inTile) {
        px[i + 3] = 0;
        continue;
      }

      // inside tile: base dark gradient
      const t = cy / S;
      px[i] = DARK[0]; px[i + 1] = DARK[1]; px[i + 2] = DARK[2]; px[i + 3] = 255;

      // "M" strokes (purple gradient)
      let minD = Infinity;
      for (const seg of segments) minD = Math.min(minD, distToSegment(cx, cy, seg[0], seg[1], seg[2], seg[3]));
      if (minD <= halfStroke) {
        const g = cy / S;
        px[i] = Math.round(PURPLE_TOP[0] + (PURPLE_BOT[0] - PURPLE_TOP[0]) * g);
        px[i + 1] = Math.round(PURPLE_TOP[1] + (PURPLE_BOT[1] - PURPLE_TOP[1]) * g);
        px[i + 2] = Math.round(PURPLE_TOP[2] + (PURPLE_BOT[2] - PURPLE_TOP[2]) * g);
        px[i + 3] = 255;
      }

      // cross (white)
      const crossSegs = segments.slice(4);
      let crossD = Infinity;
      for (const seg of crossSegs) crossD = Math.min(crossD, distToSegment(cx, cy, seg[0], seg[1], seg[2], seg[3]));
      if (crossD <= halfStroke * 0.85) {
        px[i] = WHITE[0]; px[i + 1] = WHITE[1]; px[i + 2] = WHITE[2]; px[i + 3] = WHITE[3];
      }
    }
  }
  return px;
}

// ---- generate -------------------------------------------------------------
for (const size of [512, 192, 180]) {
  const name = size === 180 ? "apple-touch-icon" : `icon-${size}`;
  const buf = encodePng(size, size, renderMark(size));
  const file = join(outDir, `${name}.png`);
  writeFileSync(file, buf);
  console.log(`generated ${name}.png (${size}x${size}, ${buf.length} bytes)`);
}

const favicon = encodePng(64, 64, renderMark(64));
writeFileSync(join(outDir, "favicon.png"), favicon);
console.log(`generated favicon.png (64x64, ${favicon.length} bytes)`);
