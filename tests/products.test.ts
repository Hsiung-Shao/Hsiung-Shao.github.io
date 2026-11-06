import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { validateProducts } from '../scripts/lib/products.mjs';

const root = resolve(import.meta.dirname, '..');

const tools = [
  { projectId: 'sample-tool', assets: { full: 'Sample-.*\\.zip' }, manual: { users: { value: 100 } } },
];

const projects = [{ id: 'sample-tool' }, { id: 'static-only' }];

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

function run(products: unknown[], imageExists: (p: string) => boolean = alwaysExists) {
  return validateProducts(products, { tools, projects, imageExists });
}

function expectErrorsFor(errors: string[], slug: string) {
  expect(errors.length).toBeGreaterThan(0);
  expect(errors.every(message => message.includes(slug))).toBe(true);
}

describe('產品頁資料驗證', () => {
  it('完整的範例資料不回報錯誤', () => {
    expect(run([product()])).toEqual([]);
  });

  it('slug 重複時回報錯誤', () => {
    expectErrorsFor(run([product(), product()]), 'sample');
  });

  it('缺 hero 標題時報錯', () => {
    const hero = { kicker: '工具', title: '', lede: '一句話介紹', chips: [] };
    expectErrorsFor(run([product({ hero })]), 'sample');
  });

  describe('專案關聯與統計口徑', () => {
    it('沒有下載統計的專案不在工具清單也通過', () => {
      const stats = [{ source: 'static', value: '5 首', label: '作品' }];
      const errors = run([product({ projectId: 'static-only', stats })]);
      expect(errors).toEqual([]);
    });

    it('引用下載統計卻不在工具清單時報錯', () => {
      const stats = [{ source: 'downloads', key: 'full', label: '下載次數' }];
      expectErrorsFor(run([product({ projectId: 'static-only', stats })]), 'sample');
    });

    it('引用手動統計卻不在工具清單時報錯', () => {
      const stats = [{ source: 'manual', key: 'users', label: '每週使用者' }];
      expectErrorsFor(run([product({ projectId: 'static-only', stats })]), 'sample');
    });

    it('projectId 不在 projects.json 時報錯', () => {
      expectErrorsFor(run([product({ projectId: 'ghost-tool' })]), 'sample');
    });

    it('統計引用不存在的下載 key 時報錯', () => {
      const stats = [{ source: 'downloads', key: 'nope', label: '下載次數' }];
      expectErrorsFor(run([product({ stats })]), 'sample');
    });

    it('統計引用不存在的手動 key 時報錯', () => {
      const stats = [{ source: 'manual', key: 'nope', label: '每週使用者' }];
      expectErrorsFor(run([product({ stats })]), 'sample');
    });
  });

  describe('截圖路徑', () => {
    const withImage = (image: string) =>
      product({ sections: [{ id: 'intro', title: '介紹', body: '內容', image }] });

    it('截圖路徑含 .. 時報錯', () => {
      expectErrorsFor(run([withImage('../../package.json')]), 'sample');
    });

    it('截圖路徑用反斜線穿越時報錯', () => {
      expectErrorsFor(run([withImage('sample\\..\\..\\package.json')]), 'sample');
    });

    it('截圖副檔名不是 png、jpg、webp 時報錯', () => {
      expectErrorsFor(run([withImage('sample/shot.gif')]), 'sample');
    });

    it('截圖副檔名大寫時報錯(glob 分大小寫)', () => {
      expectErrorsFor(run([withImage('sample/shot.PNG')]), 'sample');
    });

    it('截圖路徑含磁碟代號時報錯', () => {
      expectErrorsFor(run([withImage('C:/shot.png')]), 'sample');
    });

    it('截圖路徑含空段時報錯', () => {
      expectErrorsFor(run([withImage('sample//shot.png')]), 'sample');
    });

    it('截圖檔案不存在時報錯', () => {
      expectErrorsFor(run([product()], () => false), 'sample');
    });
  });

  describe('歌曲清單', () => {
    const song = { title: '範例歌', date: '2026-10-14', youtubeId: 'abcdefghijk', tag: '首發' };

    it('有合法 songs 的產品通過', () => {
      expect(run([product({ songs: [song, { ...song, youtubeId: 'A-b_C-d_E-f' }] })])).toEqual([]);
    });

    it('歌曲 youtubeId 只有 10 碼時報錯', () => {
      expectErrorsFor(run([product({ songs: [{ ...song, youtubeId: 'abcdefghij' }] })]), 'sample');
    });

    it('歌曲日期格式為 10/14 時報錯', () => {
      expectErrorsFor(run([product({ songs: [{ ...song, date: '10/14' }] })]), 'sample');
    });
  });

  it('正式資料五筆全部通過', () => {
    const products = JSON.parse(readFileSync(resolve(root, 'src/data/products.json'), 'utf8'));
    const poeTools = JSON.parse(readFileSync(resolve(root, 'src/data/poe-tools.json'), 'utf8'));
    const realProjects = JSON.parse(readFileSync(resolve(root, 'src/data/projects.json'), 'utf8'));
    const imageExists = (relPath: string) => existsSync(resolve(root, 'src/assets/products', relPath));

    expect(Array.isArray(products)).toBe(true);
    expect(products).toHaveLength(5);
    expect(new Set(products.map((p: { slug: string }) => p.slug))).toEqual(
      new Set(['pobtools', 'poe-market-zh', 'exile-appraiser', 'multistream-hub', 'kumori-music']),
    );
    expect(
      validateProducts(products, { tools: poeTools.tools, projects: realProjects, imageExists }),
    ).toEqual([]);
  });
});
