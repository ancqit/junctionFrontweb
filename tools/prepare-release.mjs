#!/usr/bin/env node
/**
 * Copy Windows installer + branding assets into releases/ for distribution.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const releasesDir = path.join(root, 'releases');
const electronOut = path.join(root, 'dist', 'electron');
const docsSrc = path.join(root, 'docs', 'NATIVE-BUILDS.md');

const brandingFiles = [
  { src: path.join(root, 'branding', 'logo.svg'), dest: 'logo.svg' },
  { src: path.join(root, 'branding', 'icon.png'), dest: 'icon.png' },
  { src: path.join(root, 'branding', 'favicon-32.png'), dest: 'favicon-32.png' },
  { src: path.join(root, 'branding', 'favicon.ico'), dest: 'favicon.ico' },
];

function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Skipping missing file: ${src}`);
    return;
  }
  fs.copyFileSync(src, dest);
  console.log(`Copied ${dest}`);
}

fs.mkdirSync(releasesDir, { recursive: true });

if (!fs.existsSync(electronOut)) {
  console.error(`Electron output not found. Build first: npm run electron:pack:win`);
  console.error(`Expected directory: ${electronOut}`);
  process.exit(1);
}

const installers = fs
  .readdirSync(electronOut)
  .filter((name) => name.endsWith('.exe') && !name.includes('unpacked'));

if (installers.length === 0) {
  console.error(`No .exe installer found in ${electronOut}`);
  process.exit(1);
}

for (const name of installers) {
  copyIfExists(path.join(electronOut, name), path.join(releasesDir, name));
}

copyIfExists(docsSrc, path.join(releasesDir, 'NATIVE-BUILDS.md'));

for (const { src, dest } of brandingFiles) {
  copyIfExists(src, path.join(releasesDir, dest));
}

console.log(`Release bundle ready at ${releasesDir}`);
