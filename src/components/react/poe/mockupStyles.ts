import type { CSSProperties } from 'react';

// 三個產品頁首屏示意共用的外觀。顏色走 ProductPage 設定的 --p-* 變數,主色隨工具切換。
export const frame: CSSProperties = {
  borderRadius: 10,
  background: 'var(--p-surface)',
  border: '1px solid var(--p-line)',
  overflow: 'hidden',
};

export const bar: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--p-line)',
  background: 'var(--p-bar)',
};

export const mono: CSSProperties = { fontFamily: 'var(--p-mono)', fontSize: 12, color: 'var(--p-quiet)' };

export const segmentGroup: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  border: '1px solid var(--p-line-strong)',
  borderRadius: 6,
  overflow: 'hidden',
};

export function segment(active: boolean): CSSProperties {
  return {
    minHeight: 34,
    padding: '0 14px',
    border: 0,
    background: active ? 'var(--p-accent)' : 'transparent',
    color: active ? 'var(--p-bg)' : 'var(--p-muted)',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  };
}

export const modText: CSSProperties = { fontSize: 14, color: 'var(--p-mod)' };
export const englishText: CSSProperties = { fontSize: 12, color: 'var(--p-english)' };
export const placeholder: CSSProperties = { fontSize: 12, color: 'var(--p-quiet)' };
