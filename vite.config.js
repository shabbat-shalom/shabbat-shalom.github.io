import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { VitePWA } from 'vite-plugin-pwa';

const pageData = {
  '/index.html': {
    isHome: true,
    ads: true,
    title: 'Shabbat Times - Jewish Times | Find Accurate Shabbat & Zmanim',
    description: 'Find accurate Shabbat times and Zmanim for your location. A modern reference for Jewish times on the World Wide Web. Search by zip code or use your current location.',
    keywords: 'Shabbat, Zmanim, Jew, Jewish, Shalom, Shabbat Times, Sunset, Sunrise, Tzais, Kochavim, Tzais Hakochavim, 613, Shabbat start, Shabbat end, Shabbos times, Jew time, Jewish Times, Jewishtimes.org',
    ogTitle: 'Shabbat Times - Jewish Times',
    ogDescription: 'Find accurate Shabbat times and Zmanim for your location',
    ogUrl: 'https://shabbat-shalom.github.io/',
  },
  '/market.html': {
    isMarket: true,
    ads: true,
    social: true,
    title: 'Shabbat Essentials Marketplace - Jewish Times',
    description: 'Discover beautiful Shabbat essentials including candles, Kiddush cups, challah covers, and more. Quality Judaica for your Shabbat table.',
    keywords: 'Shabbat candles, Kiddush cup, challah cover, havdalah, besamim, Jewish marketplace, Shabbat essentials, Judaica',
    ogTitle: 'Shabbat Essentials Marketplace - Jewish Times',
    ogDescription: 'Discover beautiful Shabbat essentials for your table',
    ogUrl: 'https://shabbat-shalom.github.io/market.html',
  },
  '/about.html': {
    isAbout: true,
    title: 'About & Disclaimer - Jewish Times',
    description: 'Important halachic disclaimer and attribution information for Jewish Times Shabbat application.',
    ogTitle: 'About & Disclaimer - Jewish Times',
    ogDescription: 'Halachic disclaimer and attribution information',
    ogUrl: 'https://shabbat-shalom.github.io/about.html',
  },
};

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'partials'),
      context(pagePath) {
        return pageData[pagePath] ?? {};
      },
    }),
    VitePWA({
      // Keep the SW at /sw.js scope / and the manifest at its old URL so
      // already-installed users upgrade in place.
      filename: 'sw.js',
      manifestFilename: 'manifest.webmanifest',
      registerType: 'autoUpdate',
      injectRegister: null, // registered manually in src/js/shared.js
      manifest: {
        name: 'Shabbat Times - Jewish Times',
        short_name: 'Shabbat',
        description:
          'Find accurate Shabbat times and Zmanim for your location. A modern reference for Jewish times.',
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#0038b8',
        theme_color: '#0038b8',
        categories: ['lifestyle', 'utilities', 'reference'],
        lang: 'en-US',
        dir: 'ltr',
        icons: [
          { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          {
            name: 'Find Shabbat Times',
            short_name: 'Times',
            description: 'Search for Shabbat times by location',
            url: '/?shortcut=times',
            icons: [{ src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Marketplace',
            short_name: 'Shop',
            description: 'Browse Shabbat essentials',
            url: '/market.html?shortcut=marketplace',
            icons: [{ src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        share_target: {
          action: '/',
          method: 'GET',
          enctype: 'application/x-www-form-urlencoded',
          params: { title: 'title', text: 'text', url: 'url' },
        },
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        edge_side_panel: { preferred_width: 400 },
      },
      workbox: {
        globPatterns: ['**/*.{html,css,js,png,svg,webmanifest}'],
        globIgnores: ['**/logo.png', '**/assets/*.jpg', '**/assets/*.JPG'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.hebcal\.com\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jtimes-api',
              expiration: { maxEntries: 32, maxAgeSeconds: 7 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jtimes-fonts',
              expiration: { maxEntries: 32, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jtimes-vendor',
              expiration: { maxEntries: 16, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.amazon\.com\/.*images.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jtimes-images',
              expiration: { maxEntries: 32, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        market: resolve(__dirname, 'market.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
});
