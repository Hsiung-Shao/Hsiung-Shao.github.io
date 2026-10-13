import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://hsiung-shao.github.io',
  integrations: [react()],
  // 文字版工具介紹頁已由 /poe/<slug> 產品頁取代,舊連結導回總覽
  redirects: {
    '/poe/about': '/poe',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
