import { announceToScreenReader } from '../a11y.js';
import { closeMenu } from '../menu.js';
import { showNotification } from './network-status.js';
// Served from public/ui-assets — referenced by URL, not imported
const safariIcon = '/ui-assets/safari.png';
const dotsIcon = '/ui-assets/dots.png';
const shareIcon = '/ui-assets/share.png';
const addIcon = '/ui-assets/add.png';

let deferredPrompt;
let installBtn;
let iosInstallModal;

const INSTALLED_KEY = 'jtimes_installed';
const GUIDE_SEEN_KEY = 'jtimes_install_guide_seen';

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function buildStep(text, iconsHtml) {
  return `
    <div class="ios-install-card">
      <div class="ios-install-row">
        <p>${text}</p>
        ${iconsHtml}
      </div>
    </div>`;
}

function showIOSInstallGuide() {
  localStorage.setItem(GUIDE_SEEN_KEY, 'true');

  if (!iosInstallModal) {
    iosInstallModal = document.createElement('div');
    iosInstallModal.id = 'ios-install-modal';
    iosInstallModal.innerHTML = `
      <div class="ios-modal-overlay">
        <div class="ios-modal-content" role="dialog" aria-modal="true" aria-labelledby="ios-install-title">
          <div class="ios-modal-header">
            <h2 id="ios-install-title">How to Add to Home Screen</h2>
            <button class="ios-modal-close" aria-label="Close add to home screen instructions">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="ios-modal-body">
            ${buildStep(
              'Go to the Safari app on your iPhone, then open this website.',
              `<img src="${safariIcon}" alt="Safari app icon" class="ios-install-icon ios-install-icon-large">`
            )}
            ${buildStep(
              'Tap the More button, then tap Share.',
              `<div class="ios-install-icon-row">
                <img src="${dotsIcon}" alt="More button" class="ios-install-icon">
                <span>then</span>
                <img src="${shareIcon}" alt="Share button" class="ios-install-icon">
              </div>`
            )}
            ${buildStep(
              'Scroll down the list of options, then tap Add to Home Screen.',
              `<img src="${addIcon}" alt="Add to Home Screen button" class="ios-install-icon">`
            )}
            ${buildStep(
              `If you don't see this option, scroll down to the bottom, tap Edit Actions, then ensure "Add to Home Screen" is turned on and repeat steps.`,
              ''
            )}
          </div>
        </div>
      </div>`;

    document.body.appendChild(iosInstallModal);

    const closeBtn = iosInstallModal.querySelector('.ios-modal-close');
    const overlay = iosInstallModal.querySelector('.ios-modal-overlay');
    closeBtn.addEventListener('click', closeIOSInstallGuide);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeIOSInstallGuide();
    });
  }

  iosInstallModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  iosInstallModal.querySelector('.ios-modal-close').focus();
  announceToScreenReader('Installation guide opened');
}

function closeIOSInstallGuide() {
  if (iosInstallModal) {
    iosInstallModal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function handleInstallButtonClick(event) {
  event.preventDefault();
  closeMenu();
  showIOSInstallGuide();
}

function showInstallButton() {
  if (!installBtn) return;
  installBtn.hidden = false;
  installBtn.style.display = 'flex';
  installBtn.innerHTML =
    '<box-icon name="info-circle" color="currentColor" size="sm"></box-icon>How to Install';
  installBtn.onclick = handleInstallButtonClick;
}

export function initInstall() {
  installBtn = document.getElementById('install-btn');

  // Test helper: run window.resetInstallState() in the console
  window.resetInstallState = () => {
    localStorage.removeItem(INSTALLED_KEY);
    localStorage.removeItem(GUIDE_SEEN_KEY);
    location.reload();
  };

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    localStorage.setItem(INSTALLED_KEY, 'true');
    installBtn?.remove();
    showNotification('Welcome to JTimes! App installed successfully. 🎉', 'success');
    deferredPrompt = null;
    if (typeof gtag !== 'undefined') {
      gtag('event', 'app_installed', {
        event_category: 'PWA',
        event_label: 'Installation',
      });
    }
  });

  if (isStandalone()) {
    localStorage.setItem(INSTALLED_KEY, 'true');
    if (typeof gtag !== 'undefined') {
      gtag('event', 'standalone_mode', {
        event_category: 'PWA',
        event_label: 'Running',
      });
    }
    return;
  }

  if (localStorage.getItem(INSTALLED_KEY) === 'true') return;

  const hasSeenGuide = localStorage.getItem(GUIDE_SEEN_KEY);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isIOSSafari = isIOS && !navigator.standalone && !isStandalone();
  const testMode = new URLSearchParams(window.location.search).has('test-install');

  showInstallButton();

  if (!hasSeenGuide && isIOSSafari && !testMode) {
    setTimeout(showIOSInstallGuide, 2000);
  }
}
