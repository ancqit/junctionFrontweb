import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const aabSrc = join(
  root,
  'android',
  'app',
  'build',
  'outputs',
  'bundle',
  'release',
  'app-release.aab',
);
const outDir = join(root, 'releases');
const outAab = join(outDir, 'junction-mobile-release.aab');
const siblingReleases = resolve(root, '..', 'releases');

if (!existsSync(aabSrc)) {
  console.error('Missing AAB at', aabSrc);
  console.error('Run: npm run cap:build:android:aab (with android/key.properties configured)');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(aabSrc, outAab);
console.log('Copied', outAab);

if (existsSync(dirname(siblingReleases))) {
  mkdirSync(siblingReleases, { recursive: true });
  copyFileSync(aabSrc, join(siblingReleases, 'junction-mobile-release.aab'));
  console.log('Also copied to', join(siblingReleases, 'junction-mobile-release.aab'));
}

console.log('Upload this AAB to Google Play Console (Internal testing).');
