const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svg = fs.readFileSync(path.join(__dirname, '..', 'public', 'og-image.svg'), 'utf8');

async function generate() {
  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'og-image.png'));
  console.log('Generated public/og-image.png');
}

generate();
