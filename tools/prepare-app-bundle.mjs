#!/usr/bin/env node
/**
 * Single-folder web bundle for Capacitor / Electron (shell + back-office remote).
 * Uses relative remote paths so file:// and capacitor:// loads work offline.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const shellBrowser = path.join(root, 'dist/apps/shell/browser');
const remoteBrowser = path.join(root, 'dist/apps/back-office/browser');
const outDir = path.join(root, 'dist/app-bundle');
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

function patchIndexBaseHref(htmlPath) {
  if (!fs.existsSync(htmlPath)) {
    return;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const patched = html.replace(/<base href="\/">/, '<base href="./">');
  if (patched !== html) {
    fs.writeFileSync(htmlPath, patched);
  }
}

assertDir(shellBrowser, 'shell browser build');
assertDir(remoteBrowser, 'back-office browser build');

fs.rmSync(outDir, { recursive: true, force: true });
copyDir(shellBrowser, outDir);
copyDir(remoteBrowser, remoteOutDir);

patchIndexBaseHref(path.join(outDir, 'index.html'));

fs.writeFileSync(
  path.join(outDir, 'federation.manifest.json'),
  `${JSON.stringify({ backOffice: './remotes/back-office/remoteEntry.json' }, null, 2)}\n`,
);

console.log(`Prepared app bundle at ${outDir}`);
console.log('- shell at ./');
console.log('- back-office remote at ./remotes/back-office/');
