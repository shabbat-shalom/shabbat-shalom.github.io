// Common boot for every page: menu, BMC widget handlers, PWA install layer,
// network toasts, and service worker registration.
import { initMenu } from './menu.js';
import { initBMC } from './bmc.js';
import { initInstall } from './pwa/install.js';
import { initNetworkStatus } from './pwa/network-status.js';

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        setInterval(() => registration.update(), 60 * 60 * 1000);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });

  // Also check for updates when the tab regains focus
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      navigator.serviceWorker.getRegistration().then((r) => r?.update());
    }
  });
}

export function bootPage() {
  initMenu();
  initBMC();
  initInstall();
  initNetworkStatus();
  registerServiceWorker();
}

bootPage();
