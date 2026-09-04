import { defineConfig } from 'vitest/config';

/**
 * 本站是 Astro 靜態站,測試基線刻意只涵蓋兩件機器能穩定判定的事:
 *   1. 內容護欄(隱私鐵律、資料結構、交叉引用)——改壞了會直接影響上線內容
 *   2. React 元件的 import 鏈與 render 不炸
 *
 * .astro 檔與 Three.js 場景不在此列:前者需要 Astro 自己的 runtime,
 * 後者在 jsdom 沒有 WebGL context,兩者都該用實際瀏覽器驗證。
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', '.astro/**'],
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
