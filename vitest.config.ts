import { defineConfig } from 'vitest/config';

/**
 * 本站是 Astro 靜態站,測試基線只涵蓋機器能穩定判定的事:
 * 內容護欄(隱私鐵律、資料結構、交叉引用)與資料層的純函式。
 * .astro 頁面的版面與互動要用實際瀏覽器驗證。
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['node_modules/**', 'dist/**', '.astro/**'],
  },
});
