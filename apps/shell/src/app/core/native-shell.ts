import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/** Status bar + safe layout for Capacitor (menu not hidden under notifications). */
export async function initNativeShell(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  document.documentElement.classList.add('native-shell');

  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#103d29' });
  } catch {
    // StatusBar plugin optional at runtime.
  }
}
