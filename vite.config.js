import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { VitePWA } from 'vite-plugin-pwa';

const pageData = {
  '/index.html': {
    isHome: true,
    hebcalPowered: true,
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
    title: 'Rent Ad Space - Jewish Times',
    description: 'Rent advertising space on Jewish Times and reach people checking Shabbat times, Zmanim, and Jewish calendar details.',
    keywords: 'Jewish advertising, Shabbat times advertising, Zmanim ads, Jewish Times sponsor, rent ad space, Jewish community ads',
    ogTitle: 'Rent Ad Space - Jewish Times',
    ogDescription: 'Advertise with Jewish Times and reach people checking Shabbat times',
    ogUrl: 'https://shabbat-shalom.github.io/market.html',
  },
  '/calendar.html': {
    isCalendar: true,
    hebcalPowered: true,
    title: 'Jewish Calendar - Jewish Times',
    description: 'Browse Jewish holidays, Torah readings, Hebrew dates, and observances with a Hebcal-powered calendar.',
    keywords: 'Jewish calendar, Hebrew calendar, Hebcal, Jewish holidays, Torah readings, Parsha, Rosh Chodesh, Hebrew dates',
    ogTitle: 'Jewish Calendar - Jewish Times',
    ogDescription: 'Browse Jewish holidays, Torah readings, Hebrew dates, and observances',
    ogUrl: 'https://shabbat-shalom.github.io/calendar.html',
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
        background_color: '#f7f0df',
        theme_color: '#073252',
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
            name: 'Rent Ad Space',
            short_name: 'Advertise',
            description: 'Inquire about advertising on Jewish Times',
            url: '/market.html?shortcut=ads',
            icons: [{ src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Jewish Calendar',
            short_name: 'Calendar',
            description: 'Browse Jewish holidays and Hebrew dates',
            url: '/calendar.html?shortcut=calendar',
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
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jtimes-cdn',
              expiration: { maxEntries: 16, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
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
        calendar: resolve(__dirname, 'calendar.html'),
        market: resolve(__dirname, 'market.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
});
