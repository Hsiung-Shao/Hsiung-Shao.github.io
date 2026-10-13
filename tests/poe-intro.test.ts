import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { validatePoeIntro } from '../scripts/lib/poe-intro.mjs';
import poeTools from '../src/data/poe-tools.json';

const root = resolve(import.meta.dirname, '..');

function completeTool(overrides: Record<string, unknown> = {}) {
  return {
    projectId: 'sample-tool',
    intro: {
      problem: '要解決的問題',
      audience: '給誰用',
      features: ['功能一', '功能二', '功能三'],
      support: ['Windows 10 / 11'],
      privacy: '不上傳任何資料',
      limits: ['非官方工具'],
      image: null,
      ...overrides,
    },
  };
}

const alwaysExists = () => true;

describe('/poe 工具介紹驗證', () => {
  it('完整的介紹不回報錯誤', () => {
    expect(validatePoeIntro(completeTool(), alwaysExists)).toEqual([]);
  });

  it('功能少於三條時回報錯誤且訊息含工具 id', () => {
    const errors = validatePoeIntro(completeTool({ features: ['功能一', '功能二'] }), alwaysExists);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.every((message: string) => message.includes('sample-tool'))).toBe(true);
  });

  it('缺 intro 時回報錯誤', () => {
    const errors = validatePoeIntro({ projectId: 'no-intro' }, alwaysExists);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.every((message: string) => message.includes('no-intro'))).toBe(true);
  });

  it('圖片路徑不在 /images/ 底下時回報錯誤', () => {
    const errors = validatePoeIntro(completeTool({ image: '/assets/shot.png' }), alwaysExists);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.every((message: string) => message.includes('sample-tool'))).toBe(true);
  });

  it('圖片路徑含 .. 時回報錯誤', () => {
    const errors = validatePoeIntro(completeTool({ image: '/images/../../package.json' }), () => true);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.every((message: string) => message.includes('sample-tool'))).toBe(true);
  });

  it('圖片路徑用反斜線穿越時回報錯誤', () => {
    const errors = validatePoeIntro(completeTool({ image: '/images/..\\..\\package.json' }), () => true);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.every((message: string) => message.includes('sample-tool'))).toBe(true);
  });

  it('圖片檔不存在時回報錯誤', () => {
    const imageExists = vi.fn(() => false);
    const errors = validatePoeIntro(completeTool({ image: '/images/poe/missing.png' }), imageExists);
    expect(imageExists).toHaveBeenCalledWith('/images/poe/missing.png');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.every((message: string) => message.includes('sample-tool'))).toBe(true);
  });

  it('圖片存在且路徑正確時不回報錯誤', () => {
    expect(validatePoeIntro(completeTool({ image: '/images/poe/shot.png' }), alwaysExists)).toEqual([]);
  });

  it('圖片為 null 時不檢查檔案', () => {
    const imageExists = vi.fn(() => false);
    expect(validatePoeIntro(completeTool({ image: null }), imageExists)).toEqual([]);
    expect(imageExists).not.toHaveBeenCalled();
  });

  it('正式 poe-tools.json 的每個工具介紹都通過驗證', () => {
    const imageExists = (publicPath: string) => existsSync(resolve(root, 'public', `.${publicPath}`));
    expect(poeTools.tools.length).toBeGreaterThan(0);
    for (const tool of poeTools.tools) {
      expect(validatePoeIntro(tool, imageExists)).toEqual([]);
    }
  });
});
