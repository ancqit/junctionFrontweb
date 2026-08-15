#!/usr/bin/env node
/**
 * Rasterize branding/logo.svg into PNG/ICO for Capacitor, Electron, and web favicons.
 * Requires: npm install sharp (devDependency on mobile/desktop branches).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const brandingDir = path.join(root, 'branding');
const logoSvg = path.join(brandingDir, 'logo.svg');
const androidResDir = path.join(root, 'android', 'app', 'src', 'main', 'res');

const WEB_FAVICON_TARGETS = [
  path.join(root, 'apps', 'shell', 'public', 'favicon.svg'),
  path.join(root, 'apps', 'back-office', 'public', 'favicon.svg'),
];

const ANDROID_LAUNCHER_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const ANDROID_FOREGROUND_SIZES = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432,
};

async function writePng(sharp, svg, size, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(svg).resize(size, size).png().toFile(dest);
}

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Install sharp first: npm install sharp --save-dev');
    process.exit(1);
  }

  if (!fs.existsSync(logoSvg)) {
    console.error(`Missing ${logoSvg}`);
    process.exit(1);
  }

  const svg = fs.readFileSync(logoSvg);
  const iconPng = path.join(brandingDir, 'icon.png');
  const faviconPng = path.join(brandingDir, 'favicon-32.png');
  const faviconIco = path.join(brandingDir, 'favicon.ico');

  await sharp(svg).resize(1024, 1024).png().toFile(iconPng);
  await sharp(svg).resize(32, 32).png().toFile(faviconPng);
  await sharp(svg).resize(32, 32).png().toFile(faviconIco);

  for (const dest of WEB_FAVICON_TARGETS) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(logoSvg, dest);
    console.log(`Wrote ${dest}`);
  }

  if (fs.existsSync(androidResDir)) {
    for (const [folder, size] of Object.entries(ANDROID_LAUNCHER_SIZES)) {
      const dir = path.join(androidResDir, folder);
      await writePng(sharp, svg, size, path.join(dir, 'ic_launcher.png'));
      await writePng(sharp, svg, size, path.join(dir, 'ic_launcher_round.png'));
      console.log(`Wrote Android launcher ${folder} (${size}px)`);
    }

    for (const [folder, size] of Object.entries(ANDROID_FOREGROUND_SIZES)) {
      const dir = path.join(androidResDir, folder);
      await writePng(sharp, svg, size, path.join(dir, 'ic_launcher_foreground.png'));
      console.log(`Wrote Android foreground ${folder} (${size}px)`);
    }

    const bgColorFile = path.join(androidResDir, 'values', 'ic_launcher_background.xml');
    if (fs.existsSync(bgColorFile)) {
      fs.writeFileSync(
        bgColorFile,
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#f3d782</color>
</resources>
`,
      );
      console.log('Updated ic_launcher_background to Junction gold (#f3d782)');
    }
  }

  console.log(`Wrote ${iconPng}`);
  console.log(`Wrote ${faviconPng}`);
  console.log(`Wrote ${faviconIco}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
