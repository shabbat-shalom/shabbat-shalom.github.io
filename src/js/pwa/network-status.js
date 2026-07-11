// Online/offline toasts, shown bottom-center. Styling lives in
// src/css/components/toast.css (.pwa-toast).
export function showNotification(message, type = 'info') {
  document.getElementById('pwa-notification')?.remove();

  const notification = document.createElement('div');
  notification.id = 'pwa-notification';
  notification.className = `pwa-toast pwa-toast--${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('pwa-toast--hiding');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

export function initNetworkStatus() {
  window.addEventListener('online', () => {
    showNotification('You are back online! 🌐', 'success');
  });

  window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may be limited. 📴', 'warning');
  });
}
