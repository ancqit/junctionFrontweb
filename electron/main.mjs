import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const bundleIndex = path.join(rootDir, 'dist/app-bundle/index.html');
const isDev = process.env.ELECTRON_DEV === '1';
const devUrl = process.env.ELECTRON_DEV_URL ?? 'http://localhost:4200';

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'Junction',
    autoHideMenuBar: true,
  webPreferences: {
    contextIsolation: true,
    sandbox: true,
    // file:// bundle → cross-origin API calls need this (no Vercel /api proxy).
    webSecurity: isDev,
  },
  });

  if (isDev) {
    window.loadURL(devUrl);
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    window.loadFile(bundleIndex);
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
