import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const pageData = {
  '/index.html': { page: 'home', title: 'Shabbat Shalom - Find Shabbat Times' },
  '/market.html': { page: 'market', title: 'Shabbat Market - Shabbat Essentials' },
  '/about.html': { page: 'about', title: 'About - Shabbat Shalom' },
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
