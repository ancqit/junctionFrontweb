#!/usr/bin/env node
/**
 * Copy APK + branding assets into releases/ for distribution.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const releasesDir = path.join(root, 'releases');
const apkSrc = path.join(
  root,
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
);
const apkDest = path.join(releasesDir, 'junction-mobile-debug.apk');
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

if (!fs.existsSync(apkSrc)) {
  console.error(`APK not found. Build first: npm run cap:build:android:debug`);
  console.error(`Expected: ${apkSrc}`);
  process.exit(1);
}

copyIfExists(apkSrc, apkDest);
copyIfExists(docsSrc, path.join(releasesDir, 'NATIVE-BUILDS.md'));

for (const { src, dest } of brandingFiles) {
  copyIfExists(src, path.join(releasesDir, dest));
}

const parentReleases = path.join(root, '..', 'releases');
fs.mkdirSync(parentReleases, { recursive: true });
copyIfExists(apkDest, path.join(parentReleases, 'junction-mobile-debug.apk'));
copyIfExists(docsSrc, path.join(parentReleases, 'NATIVE-BUILDS.md'));
for (const { src, dest } of brandingFiles) {
  copyIfExists(path.join(releasesDir, dest), path.join(parentReleases, dest));
}

console.log(`Release bundle ready at ${releasesDir}`);
console.log(`Also copied to ${parentReleases}`);
