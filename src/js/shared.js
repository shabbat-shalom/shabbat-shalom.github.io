// Common boot for every page: menu, PWA install layer,
// network toasts, and service worker registration.
import { initMenu } from './menu.js';
import { initInstall } from './pwa/install.js';
import { initNetworkStatus } from './pwa/network-status.js';
import { initShare } from './share.js';

import { registerSW } from 'virtual:pwa-register';

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  registerSW({ immediate: true });

  // Check for updates when the tab regains focus
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      navigator.serviceWorker.getRegistration().then((r) => r?.update());
    }
  });

  // Purge caches left behind by the pre-Workbox hand-written service worker
  navigator.serviceWorker.ready.then(() => {
    caches.keys().then((keys) => {
      keys.filter((k) => k.startsWith('jtimes-v')).forEach((k) => caches.delete(k));
    });
  });
}

export function bootPage() {
  initMenu();
  initShare();
  initInstall();
  initNetworkStatus();
  registerServiceWorker();
}

bootPage();
