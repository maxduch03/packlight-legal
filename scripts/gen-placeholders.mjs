// Génère des images placeholder on-brand (dégradé teal + monogramme + titre).
// À remplacer par les vrais visuels ensuite. Lancer : node scripts/gen-placeholders.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = resolve(__dirname, '..', 'public');

const TEAL = '#0F766E';
const TEAL_DARK = '#0B5048';
const SAND = '#F7F1E6';
const AMBER = '#E0902F';

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Monogramme PackLight : carré arrondi sable + "P" teal.
function monogram(cx, cy, size) {
  const r = size * 0.22;
  const x = cx - size / 2;
  const y = cy - size / 2;
  return `
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" fill="${SAND}"/>
    <text x="${cx}" y="${cy}" fill="${TEAL}" font-family="Georgia, 'Times New Roman', serif"
      font-weight="700" font-size="${size * 0.62}" text-anchor="middle" dominant-baseline="central">P</text>
  `;
}

function svg({ w, h, title, label = '', accent = TEAL_DARK, play = false }) {
  const monoSize = Math.min(w, h) * 0.16;
  const cx = w / 2;
  const monoY = h * (play ? 0.32 : 0.38);
  const titleY = monoY + monoSize * 0.9;
  const labelY = titleY + Math.min(w, h) * 0.07;
  const titleSize = Math.min(w, h) * 0.08;
  const labelSize = Math.min(w, h) * 0.045;
  const playEl = play
    ? `<circle cx="${cx}" cy="${h * 0.62}" r="${Math.min(w, h) * 0.09}" fill="${SAND}" opacity="0.95"/>
       <path d="M ${cx - w * 0.02} ${h * 0.62 - h * 0.025} L ${cx - w * 0.02} ${h * 0.62 + h * 0.025} L ${cx + w * 0.03} ${h * 0.62} Z" fill="${TEAL}"/>`
    : '';
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${TEAL}"/>
        <stop offset="1" stop-color="${accent}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${monogram(cx, monoY, monoSize)}
    <text x="${cx}" y="${titleY}" fill="${SAND}" font-family="Georgia, 'Times New Roman', serif"
      font-weight="700" font-size="${titleSize}" text-anchor="middle">${esc(title)}</text>
    ${label ? `<text x="${cx}" y="${labelY}" fill="${SAND}" opacity="0.85"
      font-family="Arial, Helvetica, sans-serif" font-size="${labelSize}" text-anchor="middle">${esc(label)}</text>` : ''}
    ${playEl}
  </svg>`);
}

const jobs = [
  { file: 'assets/og-default.png', w: 1200, h: 630, title: 'PackLight', label: "Partir devrait être aussi simple que d'en avoir envie.", fmt: 'png' },
  { file: 'assets/reel-poster.jpg', w: 1080, h: 1920, title: 'PackLight', label: "Aperçu de l'app", play: true, fmt: 'jpg' },
  { file: 'assets/destinations/bali.jpg', w: 1600, h: 900, title: 'Bali', label: 'en 7 jours', accent: AMBER, fmt: 'jpg' },
  { file: 'assets/destinations/australie.jpg', w: 1600, h: 900, title: 'PVT Australie', label: 'par où commencer', accent: TEAL_DARK, fmt: 'jpg' },
  { file: 'assets/destinations/lisbonne.jpg', w: 1600, h: 900, title: 'Lisbonne', label: 'en 4 jours', accent: AMBER, fmt: 'jpg' },
  { file: 'assets/destinations/bali-itineraire.png', w: 1080, h: 1920, title: 'Bali', label: 'Itinéraire', accent: AMBER, fmt: 'png' },
  { file: 'assets/destinations/australie-itineraire.png', w: 1080, h: 1920, title: 'PVT Australie', label: 'Itinéraire', accent: TEAL_DARK, fmt: 'png' },
  { file: 'assets/destinations/lisbonne-itineraire.png', w: 1080, h: 1920, title: 'Lisbonne', label: 'Itinéraire', accent: AMBER, fmt: 'png' },
];

await mkdir(resolve(pub, 'assets', 'destinations'), { recursive: true });

for (const j of jobs) {
  const out = resolve(pub, j.file);
  const img = sharp(svg(j));
  if (j.fmt === 'jpg') await img.jpeg({ quality: 82 }).toFile(out);
  else await img.png().toFile(out);
  console.log('✓', j.file, `${j.w}x${j.h}`);
}
console.log('Placeholders générés.');
