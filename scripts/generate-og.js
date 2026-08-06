const sharp = require('sharp');
const path = require('path');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#18181b"/>
  <rect x="200" y="160" width="80" height="80" rx="8" fill="#6aaa64"/>
  <text x="240" y="215" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">S</text>
  <rect x="290" y="160" width="80" height="80" rx="8" fill="#c9b458"/>
  <text x="330" y="215" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">P</text>
  <rect x="380" y="160" width="80" height="80" rx="8" fill="#787c7e"/>
  <text x="420" y="215" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">E</text>
  <rect x="470" y="160" width="80" height="80" rx="8" fill="#6aaa64"/>
  <text x="510" y="215" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">L</text>
  <rect x="560" y="160" width="80" height="80" rx="8" fill="#c9b458"/>
  <text x="600" y="215" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">L</text>
  <rect x="650" y="160" width="80" height="80" rx="8" fill="#6aaa64"/>
  <text x="690" y="215" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">I</text>
  <rect x="740" y="160" width="80" height="80" rx="8" fill="#787c7e"/>
  <text x="780" y="215" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">O</text>
  <text x="600" y="340" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">SPELLIO</text>
  <text x="600" y="410" font-family="Arial, sans-serif" font-size="28" fill="#a1a1aa" text-anchor="middle">Guess the word in 6 tries</text>
  <rect x="240" y="460" width="720" height="4" rx="2" fill="#27272a"/>
  <rect x="240" y="460" width="240" height="4" rx="2" fill="#6aaa64"/>
</svg>`;

async function generate() {
  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'og-image.png'));
  console.log('Generated public/og-image.png');
}

generate();
