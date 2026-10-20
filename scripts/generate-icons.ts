import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const svgPath = path.resolve(process.cwd(), 'public/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. pwa-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 2. pwa-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 3. pwa-maskable-512x512.png (padded with emerald background for Android safe zone)
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 2, g: 44, b: 34, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(svgBuffer).resize(410, 410).png().toBuffer(),
        top: 51,
        left: 51,
      },
    ])
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // 4. apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
