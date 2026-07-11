let hamburgerBtn;
let menuOverlay;

export function openMenu() {
  menuOverlay.classList.add('menu-open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

export function closeMenu() {
  if (!menuOverlay?.classList.contains('menu-open')) return;
  menuOverlay.classList.remove('menu-open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburgerBtn.focus();
}

export function initMenu() {
  hamburgerBtn = document.getElementById('hamburger-btn');
  menuOverlay = document.getElementById('menu-overlay');
  const menuClose = document.getElementById('menu-close');
  if (!hamburgerBtn || !menuOverlay || !menuClose) return;

  hamburgerBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('menu-open')) {
      closeMenu();
    }
  });
}
