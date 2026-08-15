#!/usr/bin/env node
/**
 * Rasterize branding/logo.svg into PNG for Electron and mobile icon pipelines.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const brandingDir = path.join(root, 'branding');
const logoSvg = path.join(brandingDir, 'logo.svg');

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

  await sharp(svg).resize(1024, 1024).png().toFile(iconPng);
  await sharp(svg).resize(32, 32).png().toFile(faviconPng);

  console.log(`Wrote ${iconPng}`);
  console.log(`Wrote ${faviconPng}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
