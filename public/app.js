// =====================================
// PWA Install Prompt Handler
// =====================================

let deferredPrompt;
let installBtn;
let iosInstallModal;

// Wait for the DOM to be ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}

function init() {
	installBtn = document.getElementById('install-btn');

	// Check if already installed
	if (
		window.matchMedia('(display-mode: standalone)').matches ||
		window.navigator.standalone === true
	) {
		console.log('✅ App is already installed');
		// Mark as installed in localStorage
		localStorage.setItem('jtimes_installed', 'true');
		return;
	}

	// Check if user has dismissed the guide
	const hasSeenGuide = localStorage.getItem('jtimes_install_guide_seen');
	const isInstalled = localStorage.getItem('jtimes_installed');

	if (isInstalled === 'true') {
		console.log('✅ App previously installed');
		return;
	}

	// Detect iOS devices
	const isIOS =
		/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	const isIOSSafari =
		isIOS &&
		!navigator.standalone &&
		!window.matchMedia('(display-mode: standalone)').matches;

	// Check for test parameter in URL (allows testing on any device)
	const urlParams = new URLSearchParams(window.location.search);
	const testMode = urlParams.has('test-install');

	showInstallButton();

	// Show guide automatically on first visit (optional) - only on actual iOS, not test mode
	if (!hasSeenGuide && isIOSSafari && !testMode) {
		// Delay showing guide on first load
		setTimeout(() => {
			showIOSInstallGuide();
		}, 2000);
	}
}

function closeNavMenu() {
	const menuOverlay = document.getElementById('menu-overlay');
	const hamburgerBtn = document.getElementById('hamburger-btn');

	if (menuOverlay?.classList.contains('menu-open')) {
		menuOverlay.classList.remove('menu-open');
		hamburgerBtn?.setAttribute('aria-expanded', 'false');
		document.body.style.overflow = '';
	}
}

function handleInstallButtonClick(event) {
	event.preventDefault();
	closeNavMenu();
	showIOSInstallGuide();
}

function showInstallButton() {
	if (!installBtn) return;

	installBtn.hidden = false;
	installBtn.style.display = 'flex';
	installBtn.innerHTML =
		'<box-icon name="info-circle" color="#007AFF" size="sm"></box-icon>How to Install';
	installBtn.onclick = handleInstallButtonClick;
}

// Helper function to reset install state (for testing)
window.resetInstallState = function () {
	localStorage.removeItem('jtimes_installed');
	localStorage.removeItem('jtimes_install_guide_seen');
	console.log(
		'✅ Install state reset. Reload the page to see the install button.'
	);
	location.reload();
};

// iOS Installation Guide
function showIOSInstallGuide() {
	// Mark as seen
	localStorage.setItem('jtimes_install_guide_seen', 'true');

	// Create modal if it doesn't exist
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
						<div class="ios-install-card">
							<div class="ios-install-row">
								<p>Go to the Safari app on your iPhone, then open this website.</p>
								<img
									src="/ui-assets/safari.png"
									alt="Safari app icon"
									class="ios-install-icon ios-install-icon-large"
								>
							</div>
						</div>

						<div class="ios-install-card">
							<div class="ios-install-row">
								<p>Tap the More button, then tap Share.</p>
								<div class="ios-install-icon-row">
									<img
										src="/ui-assets/dots.png"
										alt="More button"
										class="ios-install-icon"
									>
									<span>then</span>
									<img
										src="/ui-assets/share.png"
										alt="Share button"
										class="ios-install-icon"
									>
								</div>
							</div>
						</div>

						<div class="ios-install-card">
							<div class="ios-install-row">
								<p>Scroll down the list of options, then tap Add to Home Screen.</p>
								<img
									src="/ui-assets/add.png"
									alt="Add to Home Screen button"
									class="ios-install-icon"
								>
							</div>
						</div>

						<div class="ios-install-card">
							<div class="ios-install-row">
								<p>If you don't see this option, scroll down to the bottom, tap Edit Actions, then ensure "Add to Home Screen" is turned on and repeat steps.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		document.body.appendChild(iosInstallModal);

		// Add close button functionality
		const closeBtn = iosInstallModal.querySelector('.ios-modal-close');
		const overlay = iosInstallModal.querySelector('.ios-modal-overlay');

		closeBtn.addEventListener('click', closeIOSInstallGuide);
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) {
				closeIOSInstallGuide();
			}
		});
	}

	// Show modal
	iosInstallModal.style.display = 'block';
	document.body.style.overflow = 'hidden';
	iosInstallModal.querySelector('.ios-modal-close').focus();

	// Announce to screen readers
	announceToScreenReader('Installation guide opened');
}

// Close iOS Install Guide
function closeIOSInstallGuide() {
	if (iosInstallModal) {
		iosInstallModal.style.display = 'none';
		document.body.style.overflow = '';
	}
}

// Make closeIOSInstallGuide available globally
window.closeIOSInstallGuide = closeIOSInstallGuide;

// Screen reader announcement helper
function announceToScreenReader(message) {
	const announcement = document.createElement('div');
	announcement.setAttribute('role', 'status');
	announcement.setAttribute('aria-live', 'polite');
	announcement.className = 'sr-only';
	announcement.textContent = message;
	document.body.appendChild(announcement);

	setTimeout(() => {
		document.body.removeChild(announcement);
	}, 1000);
}

// Listen for the beforeinstallprompt event (Chrome/Android)
window.addEventListener('beforeinstallprompt', (e) => {
	console.log('💡 beforeinstallprompt event fired');

	// Prevent the mini-infobar from appearing on mobile
	e.preventDefault();

	// Stash the event so it can be triggered later
	deferredPrompt = e;

	showInstallButton();
});

// Install app function (Chrome/Android)
async function installApp() {
	if (!deferredPrompt) {
		console.log('⚠️ No deferred prompt available');
		return;
	}

	// Hide the install button
	if (installBtn) {
		installBtn.hidden = true;
	}

	// Show the install prompt
	deferredPrompt.prompt();

	// Wait for the user to respond to the prompt
	const { outcome } = await deferredPrompt.userChoice;

	console.log(`👤 User response to the install prompt: ${outcome}`);

	if (outcome === 'accepted') {
		console.log('✅ User accepted the install prompt');
		localStorage.setItem('jtimes_installed', 'true');

		// Show success message
		showNotification('App installed successfully! 🎉', 'success');
	} else {
		console.log('❌ User dismissed the install prompt');

		// Show the button again after 3 seconds
		setTimeout(() => {
			if (installBtn) {
				installBtn.hidden = false;
			}
		}, 3000);
	}

	// Clear the deferredPrompt
	deferredPrompt = null;
}

// Listen for successful installation
window.addEventListener('appinstalled', (e) => {
	console.log('✅ PWA successfully installed!');

	// Mark as installed
	localStorage.setItem('jtimes_installed', 'true');

	// Hide the install button permanently
	if (installBtn) {
		installBtn.hidden = true;
		installBtn.remove();
	}

	// Show success message
	showNotification(
		'Welcome to JTimes! App installed successfully. 🎉',
		'success'
	);

	// Clear the deferredPrompt
	deferredPrompt = null;

	// Track installation (optional - for analytics)
	if (typeof gtag !== 'undefined') {
		gtag('event', 'app_installed', {
			event_category: 'PWA',
			event_label: 'Installation',
		});
	}
});

// Detect if app is running in standalone mode
if (
	window.matchMedia('(display-mode: standalone)').matches ||
	window.navigator.standalone === true
) {
	console.log('📱 App is running in standalone mode');

	// Track standalone usage (optional - for analytics)
	if (typeof gtag !== 'undefined') {
		gtag('event', 'standalone_mode', {
			event_category: 'PWA',
			event_label: 'Running',
		});
	}
}

// Handle online/offline status
window.addEventListener('online', () => {
	console.log('🌐 App is online');
	showNotification('You are back online! 🌐', 'success');
});

window.addEventListener('offline', () => {
	console.log('📴 App is offline');
	showNotification(
		'You are offline. Some features may be limited. 📴',
		'warning'
	);
});

// Show notification function
function showNotification(message, type = 'info') {
	// Check if there's already a notification
	let existingNotification = document.getElementById('pwa-notification');
	if (existingNotification) {
		existingNotification.remove();
	}

	// Create notification element
	const notification = document.createElement('div');
	notification.id = 'pwa-notification';
	notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${
			type === 'success'
				? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
				: type === 'warning'
				? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
				: 'linear-gradient(135deg, #0038b8 0%, #3366cc 100%)'
		};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    z-index: 10000;
    animation: slideUp 0.3s ease-out;
    max-width: 90%;
    text-align: center;
  `;

	notification.textContent = message;

	// Add to body
	document.body.appendChild(notification);

	// Remove after 4 seconds
	setTimeout(() => {
		notification.style.animation = 'slideDown 0.3s ease-out';
		setTimeout(() => {
			notification.remove();
		}, 300);
	}, 4000);
}

// Add animation styles
if (!document.getElementById('pwa-notification-styles')) {
	const style = document.createElement('style');
	style.id = 'pwa-notification-styles';
	style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    
    @keyframes slideDown {
      from {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      to {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
    }
  `;
	document.head.appendChild(style);
}

// Check for updates when the page is focused
document.addEventListener('visibilitychange', () => {
	if (!document.hidden && 'serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistration().then((registration) => {
			if (registration) {
				registration.update();
			}
		});
	}
});

// Log PWA capabilities
console.log('PWA Capabilities:');
console.log('- Service Worker:', 'serviceWorker' in navigator ? '✅' : '❌');
console.log('- Cache API:', 'caches' in window ? '✅' : '❌');
console.log('- Notifications:', 'Notification' in window ? '✅' : '❌');
console.log('- Geolocation:', 'geolocation' in navigator ? '✅' : '❌');
console.log('- Online Status:', navigator.onLine ? '🌐 Online' : '📴 Offline');
