// Buy Me a Coffee widget injects its own fixed-position overlay; these
// handlers let users dismiss it by clicking outside or pressing Escape.
function closeBMCModal() {
  const bmcOverlay = document.querySelector('div[id*="bmc"][style*="position: fixed"]');
  if (bmcOverlay) {
    bmcOverlay.style.display = 'none';
  }
}

export function initBMC() {
  document.addEventListener('click', (e) => {
    const bmcOverlay = document.querySelector('div[id*="bmc"][style*="position: fixed"]');
    if (bmcOverlay && e.target === bmcOverlay) {
      closeBMCModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBMCModal();
  });
}
