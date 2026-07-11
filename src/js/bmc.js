// Buy Me a Coffee widget injects its own fixed-position overlay; these
// handlers let users dismiss it by clicking outside or pressing Escape.
const MOBILE_QUERY = window.matchMedia('(max-width: 640px)');

function getBMCOverlay() {
  return document.getElementById('bmc-iframe')?.parentElement ?? null;
}

function isBMCOpen(iframe) {
  if (!iframe) return false;

  const opacity = parseFloat(iframe.style.opacity || getComputedStyle(iframe).opacity);
  const height = parseFloat(iframe.style.height || '0');

  return opacity > 0 && height > 0;
}

function applyMobileBMCLayout(iframe) {
  if (!MOBILE_QUERY.matches || !iframe || !isBMCOpen(iframe)) return;

  const maxHeight = Math.min(Math.round(window.innerHeight * 0.72), 520);
  const width = Math.min(window.innerWidth - 24, 420);
  const top = Math.max(12, Math.round((window.innerHeight - maxHeight) / 2));

  iframe.style.inset = 'auto';
  iframe.style.top = `${top}px`;
  iframe.style.left = '50%';
  iframe.style.right = 'auto';
  iframe.style.bottom = 'auto';
  iframe.style.width = `${width}px`;
  iframe.style.maxWidth = `${width}px`;
  iframe.style.height = `${maxHeight}px`;
  iframe.style.maxHeight = `${maxHeight}px`;
  iframe.style.minHeight = '0';
  iframe.style.transform = 'translateX(-50%) scale(1)';
  iframe.style.transformOrigin = 'center center';
}

function closeBMCModal() {
  const overlay = getBMCOverlay();
  if (overlay && overlay.style.width === '100%') {
    overlay.click();
  }
}

function watchBMCWidget() {
  const iframe = document.getElementById('bmc-iframe');
  if (!iframe) return false;

  const observer = new MutationObserver(() => {
    applyMobileBMCLayout(iframe);
  });

  observer.observe(iframe, { attributes: true, attributeFilter: ['style'] });

  window.addEventListener('resize', () => {
    applyMobileBMCLayout(iframe);
  });

  document.getElementById('bmc-wbtn')?.addEventListener('click', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => applyMobileBMCLayout(iframe));
    });
  });

  return true;
}

export function initBMC() {
  if (!watchBMCWidget()) {
    const bodyObserver = new MutationObserver(() => {
      if (watchBMCWidget()) bodyObserver.disconnect();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('click', (e) => {
    const overlay = getBMCOverlay();
    if (overlay && e.target === overlay) {
      closeBMCModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBMCModal();
  });
}
