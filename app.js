// =====================================
// PWA Install Prompt Handler
// =====================================

let deferredPrompt;
let installBtn;

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
		return;
	}
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
	console.log('💡 beforeinstallprompt event fired');

	// Prevent the mini-infobar from appearing on mobile
	e.preventDefault();

	// Stash the event so it can be triggered later
	deferredPrompt = e;

	// Show the install button
	if (installBtn) {
		installBtn.hidden = false;
		installBtn.style.display = 'inline-flex';

		// Add click event listener
		installBtn.addEventListener('click', installApp);
	}
});

// Install app function
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

	// Hide the install button
	if (installBtn) {
		installBtn.hidden = true;
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
