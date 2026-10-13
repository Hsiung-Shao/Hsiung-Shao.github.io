import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { validatePoeProducts } from '../scripts/lib/poe-products.mjs';

const root = resolve(import.meta.dirname, '..');

const tools = [
  { projectId: 'sample-tool', assets: { full: 'Sample-.*\\.zip' }, manual: { users: { value: 100 } } },
];

function product(overrides: Record<string, unknown> = {}) {
  return {
    slug: 'sample',
    projectId: 'sample-tool',
    accent: '#c8a050',
    hero: { kicker: '工具', title: '範例工具', lede: '一句話介紹', chips: ['PoE1'] },
    ctas: [{ label: '下載', href: 'https://example.com/download' }],
    stats: [
      { source: 'downloads', key: 'full', label: '下載次數' },
      { source: 'manual', key: 'users', label: '每週使用者' },
      { source: 'static', value: '10 萬組', label: '對照' },
    ],
    sections: [{ id: 'intro', title: '介紹', body: '內容', image: 'sample/shot.png' }],
    limits: ['非官方工具'],
    disclaimer: '使用風險自負',
    ...overrides,
  };
}

const alwaysExists = () => true;

function expectErrorsFor(errors: string[], slug: string) {
  expect(errors.length).toBeGreaterThan(0);
  expect(errors.every(message => message.includes(slug))).toBe(true);
}

describe('/poe 產品頁資料驗證', () => {
  it('正式產品資料全部通過驗證', () => {
    const products = JSON.parse(readFileSync(resolve(root, 'src/data/poe-products.json'), 'utf8'));
    const poeTools = JSON.parse(readFileSync(resolve(root, 'src/data/poe-tools.json'), 'utf8'));
    const imageExists = (relPath: string) => existsSync(resolve(root, 'src/assets/poe', relPath));
    const list = Array.isArray(products) ? products : products.products;
    expect(list.length).toBeGreaterThan(0);
    expect(validatePoeProducts(list, { tools: poeTools.tools, imageExists })).toEqual([]);
  });

  it('完整的範例資料不回報錯誤', () => {
    expect(validatePoeProducts([product()], { tools, imageExists: alwaysExists })).toEqual([]);
  });

  it('slug 重複時回報錯誤', () => {
    const errors = validatePoeProducts([product(), product()], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('projectId 不在工具清單時回報錯誤', () => {
    const errors = validatePoeProducts([product({ projectId: 'ghost-tool' })], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('統計引用不存在的下載 key 時報錯', () => {
    const stats = [{ source: 'downloads', key: 'nope', label: '下載次數' }];
    const errors = validatePoeProducts([product({ stats })], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('統計引用不存在的手動 key 時報錯', () => {
    const stats = [{ source: 'manual', key: 'nope', label: '每週使用者' }];
    const errors = validatePoeProducts([product({ stats })], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('缺 hero 標題時報錯', () => {
    const hero = { kicker: '工具', title: '', lede: '一句話介紹', chips: [] };
    const errors = validatePoeProducts([product({ hero })], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('截圖路徑含 .. 時報錯', () => {
    const sections = [{ id: 'intro', title: '介紹', body: '內容', image: '../../package.json' }];
    const errors = validatePoeProducts([product({ sections })], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('截圖路徑用反斜線穿越時報錯', () => {
    const sections = [{ id: 'intro', title: '介紹', body: '內容', image: 'sample\\..\\..\\package.json' }];
    const errors = validatePoeProducts([product({ sections })], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('截圖副檔名不是 png、jpg、webp 時報錯', () => {
    const sections = [{ id: 'intro', title: '介紹', body: '內容', image: 'sample/shot.gif' }];
    const errors = validatePoeProducts([product({ sections })], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('截圖路徑含磁碟代號時報錯', () => {
    const sections = [{ id: 'intro', title: '介紹', body: '內容', image: 'C:/shot.png' }];
    const errors = validatePoeProducts([product({ sections })], { tools, imageExists: alwaysExists });
    expectErrorsFor(errors, 'sample');
  });

  it('截圖檔案不存在時報錯', () => {
    const errors = validatePoeProducts([product()], { tools, imageExists: () => false });
    expectErrorsFor(errors, 'sample');
  });
});
