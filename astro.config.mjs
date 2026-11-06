import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://hsiung-shao.github.io',
  // 2026-11 改版:產品頁統一放 /projects/<slug>,下載數頁改名 /downloads,概念頁刪除。舊網址導到新頁
  redirects: {
    '/poe': '/downloads',
    '/poe/about': '/downloads',
    '/poe/pobtools': '/projects/pobtools',
    '/poe/market-zh': '/projects/poe-market-zh',
    '/poe/exile-appraiser': '/projects/exile-appraiser',
    '/concepts/bento': '/',
    '/concepts/cinematic': '/',
    '/concepts/editorial': '/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
