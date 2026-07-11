// =====================================
// Service Worker - JTimes PWA
// =====================================

const CACHE_VERSION = 'jtimes-v3.3';
const CACHE_NAME = `${CACHE_VERSION}-cache`;

// Assets to cache on install
const CORE_ASSETS = [
	'/',
	'/index.html',
	'/market.html',
	'/about.html',
	'/css/styles.css',
	'/app.js',
	'/manifest.webmanifest',
	'/logo.png',
	'/assets/candles.jpg',
	'/assets/challah cover.jpg',
	'/assets/grape juice.jpg',
	'/assets/havdalah candle.jpg',
	'/assets/kiddush cup.jpg',
	'/assets/besamim.jpg',
	'/ui-assets/add.png',
	'/ui-assets/dots.png',
	'/ui-assets/safari.png',
	'/ui-assets/share.png',
];

// External resources to cache opportunistically
const EXTERNAL_RESOURCES = [
	'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap',
	'https://unpkg.com/boxicons@2.1.4/dist/boxicons.js',
];

// =====================================
// Install Event - Cache Core Assets
// =====================================
self.addEventListener('install', (event) => {
	console.log('⚙️ Service Worker: Installing...');

	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log('📦 Service Worker: Caching core assets');

				// Cache core assets
				return cache.addAll(CORE_ASSETS).then(() => {
					console.log('✅ Service Worker: Core assets cached');

					// Try to cache external resources (don't fail if they don't cache)
					return Promise.all(
						EXTERNAL_RESOURCES.map((url) =>
							cache.add(url).catch((err) => {
								console.warn(`⚠️ Failed to cache: ${url}`, err);
							})
						)
					);
				});
			})
			.then(() => {
				console.log('✅ Service Worker: Installation complete');
				return self.skipWaiting(); // Activate immediately
			})
			.catch((error) => {
				console.error('❌ Service Worker: Installation failed', error);
			})
	);
});

// =====================================
// Activate Event - Clean Old Caches
// =====================================
self.addEventListener('activate', (event) => {
	console.log('🔄 Service Worker: Activating...');

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME) {
							console.log(
								`🗑️ Service Worker: Deleting old cache: ${cacheName}`
							);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				console.log('✅ Service Worker: Activation complete');
				return self.clients.claim(); // Take control immediately
			})
	);
});

// =====================================
// Fetch Event - Network First with Cache Fallback
// =====================================
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip Chrome extensions and non-http(s) requests
	if (!url.protocol.startsWith('http')) {
		return;
	}

	// Skip analytics and ads requests
	if (
		url.hostname.includes('google-analytics.com') ||
		url.hostname.includes('googletagmanager.com') ||
		url.hostname.includes('googlesyndication.com') ||
		url.hostname.includes('doubleclick.net')
	) {
		return;
	}

	// Handle API requests (Hebcal) - Network First
	if (url.hostname.includes('hebcal.com')) {
		event.respondWith(networkFirstStrategy(request));
		return;
	}

	// Handle font requests - Cache First
	if (
		url.hostname.includes('fonts.googleapis.com') ||
		url.hostname.includes('fonts.gstatic.com')
	) {
		event.respondWith(cacheFirstStrategy(request));
		return;
	}

	// Handle external CDN requests - Cache First
	if (url.hostname.includes('unpkg.com')) {
		event.respondWith(cacheFirstStrategy(request));
		return;
	}

	// Handle own assets - Cache First with Network Update
	event.respondWith(staleWhileRevalidateStrategy(request));
});

// =====================================
// Caching Strategies
// =====================================

// Network First Strategy - Try network, fall back to cache
async function networkFirstStrategy(request) {
	try {
		const networkResponse = await fetch(request);

		// Only cache successful responses
		if (networkResponse && networkResponse.status === 200) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		console.log('📡 Network request failed, trying cache:', request.url);

		const cachedResponse = await caches.match(request);
		if (cachedResponse) {
			return cachedResponse;
		}

		// Return offline page for HTML requests
		if (request.headers.get('accept').includes('text/html')) {
			return new Response(
				`<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - JTimes</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 2rem;
              text-align: center;
            }
            .container {
              max-width: 500px;
            }
            h1 {
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            p {
              font-size: 1.25rem;
              margin-bottom: 2rem;
              opacity: 0.9;
            }
            button {
              background: white;
              color: #667eea;
              border: none;
              padding: 1rem 2rem;
              border-radius: 0.5rem;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.2s;
            }
            button:hover {
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📴</h1>
            <h2>You're Offline</h2>
            <p>Please check your internet connection and try again.</p>
            <button onclick="location.reload()">Try Again</button>
          </div>
        </body>
        </html>`,
				{
					status: 200,
					statusText: 'OK',
					headers: { 'Content-Type': 'text/html' },
				}
			);
		}

		throw error;
	}
}

// Cache First Strategy - Use cache, fall back to network
async function cacheFirstStrategy(request) {
	const cachedResponse = await caches.match(request);

	if (cachedResponse) {
		console.log('📦 Serving from cache:', request.url);
		return cachedResponse;
	}

	try {
		console.log('📡 Fetching from network:', request.url);
		const networkResponse = await fetch(request);

		if (networkResponse && networkResponse.status === 200) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		console.error('❌ Failed to fetch:', request.url, error);
		throw error;
	}
}

// Stale While Revalidate - Return cache immediately, update cache in background
async function staleWhileRevalidateStrategy(request) {
	const cachedResponse = await caches.match(request);

	const fetchPromise = fetch(request)
		.then((networkResponse) => {
			if (
				networkResponse &&
				networkResponse.status === 200 &&
				(networkResponse.type === 'basic' || networkResponse.type === 'cors')
			) {
				const cache = caches.open(CACHE_NAME);
				cache.then((c) => c.put(request, networkResponse.clone()));
			}
			return networkResponse;
		})
		.catch((error) => {
			console.log('📡 Network request failed:', request.url);
			return cachedResponse; // Return cached version if network fails
		});

	// Return cached response immediately if available
	return cachedResponse || fetchPromise;
}

// =====================================
// Message Event - Handle messages from clients
// =====================================
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}

	if (event.data && event.data.type === 'CACHE_URLS') {
		const urlsToCache = event.data.urls;

		event.waitUntil(
			caches.open(CACHE_NAME).then((cache) => {
				return cache.addAll(urlsToCache);
			})
		);
	}

	if (event.data && event.data.type === 'CLEAR_CACHE') {
		event.waitUntil(
			caches.keys().then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => caches.delete(cacheName))
				);
			})
		);
	}
});

// =====================================
// Background Sync (future enhancement)
// =====================================
self.addEventListener('sync', (event) => {
	console.log('🔄 Background Sync:', event.tag);

	if (event.tag === 'sync-shabbat-times') {
		event.waitUntil(syncShabbatTimes());
	}
});

async function syncShabbatTimes() {
	try {
		// Placeholder for future background sync functionality
		console.log('📅 Syncing Shabbat times in background...');
	} catch (error) {
		console.error('❌ Background sync failed:', error);
	}
}

// =====================================
// Push Notifications (future enhancement)
// =====================================
self.addEventListener('push', (event) => {
	console.log('🔔 Push notification received');

	const options = {
		body: event.data ? event.data.text() : 'New Shabbat times available',
		icon: '/assets/JTimes.png',
		badge: '/assets/JTimes.png',
		vibrate: [200, 100, 200],
		tag: 'shabbat-notification',
		requireInteraction: false,
	};

	event.waitUntil(self.registration.showNotification('JTimes', options));
});

self.addEventListener('notificationclick', (event) => {
	console.log('🔔 Notification clicked');

	event.notification.close();

	event.waitUntil(clients.openWindow('/'));
});

console.log('✅ Service Worker script loaded successfully');
