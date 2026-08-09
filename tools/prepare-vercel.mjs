#!/usr/bin/env node
/**
 * Assembles a single Vercel static site:
 * - shell (login host) at /
 * - back-office remote at /remotes/back-office/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const shellBrowser = path.join(root, 'dist/apps/shell/browser');
const remoteBrowser = path.join(root, 'dist/apps/back-office/browser');
const outDir = path.join(root, 'dist/vercel');
const remoteOutDir = path.join(outDir, 'remotes/back-office');

function assertDir(dir, label) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Missing ${label} at ${dir}. Run npm run build first.`);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

assertDir(shellBrowser, 'shell browser build');
assertDir(remoteBrowser, 'back-office browser build');

fs.rmSync(outDir, { recursive: true, force: true });
copyDir(shellBrowser, outDir);
copyDir(remoteBrowser, remoteOutDir);

const manifestPath = path.join(outDir, 'federation.manifest.json');
fs.writeFileSync(
  manifestPath,
  `${JSON.stringify({ backOffice: '/remotes/back-office/remoteEntry.json' }, null, 2)}\n`,
);

console.log(`Prepared Vercel output at ${outDir}`);
console.log('- shell at /');
console.log('- back-office remote at /remotes/back-office/');
