// 用 /vitest 進入點:它同時註冊 matcher 與擴充 vitest 的 Assertion 型別,
// 少了這層 astro check 會對每個 toBeInTheDocument 報 ts(2339)。
import '@testing-library/jest-dom/vitest';

/**
 * jsdom 缺少幾個瀏覽器 API,而站上的 React 元件會用到:
 *   - matchMedia:framer-motion 讀 prefers-reduced-motion
 *   - IntersectionObserver:ProjectCard 等元件用 whileInView 觸發進場動畫
 * 沒有這兩者,元件會在 render 當下直接拋錯,測不到真正想測的東西。
 */

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});
