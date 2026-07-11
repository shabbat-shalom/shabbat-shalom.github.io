import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

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
