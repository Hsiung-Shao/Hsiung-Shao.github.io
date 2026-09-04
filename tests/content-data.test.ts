import { describe, expect, it } from 'vitest';

import { activity } from '../src/data/activity';
import { now } from '../src/data/now';
import { posts } from '../src/data/posts';
import { featuredProjects, projects } from '../src/data/projects';

/**
 * 內容資料是這個站的核心——頁面只是它的呈現。
 * 這裡測的是「資料層的不變式」,不是 validate-content.mjs 的複寫:
 * 該腳本在 build 前跑並擋下發布,這些測試則讓破壞在改動當下就被指出來,
 * 且涵蓋 posts.ts 那層 markdown 替換等腳本看不到的執行期行為。
 */
describe('專案資料', () => {
  it('id 不重複', () => {
    const ids = projects.map((project) => project.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('受保護專案一律標記為客戶案例', () => {
    for (const project of projects.filter((p) => p.visibility === 'protected')) {
      expect(project.status, `${project.id} 的 status`).toBe('client');
    }
  });

  it('受保護專案不提供對外連結', () => {
    // 客戶站的網址本身就是身分,連結存在等同揭露客戶
    for (const project of projects.filter((p) => p.visibility === 'protected')) {
      expect(project.link, `${project.id} 不該有 link`).toBeUndefined();
    }
  });

  it('精選專案是全部專案的子集合且不為空', () => {
    expect(featuredProjects.length).toBeGreaterThan(0);
    expect(featuredProjects.every((project) => projects.includes(project))).toBe(true);
  });

  it('每個專案關聯的文章都真的存在', () => {
    const slugs = new Set(posts.map((post) => post.slug));

    for (const project of projects) {
      for (const slug of project.articles) {
        expect(slugs.has(slug), `${project.id} 關聯了不存在的文章 ${slug}`).toBe(true);
      }
    }
  });
});

describe('文章資料', () => {
  it('slug 不重複', () => {
    const slugs = posts.map((post) => post.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('受保護文章只能是去識別化的技術案例', () => {
    for (const post of posts.filter((p) => p.visibility === 'protected')) {
      expect(post.type, `${post.slug} 的 type`).toBe('case-study');
    }
  });

  it('日期格式一律為 YYYY-MM-DD', () => {
    for (const post of posts) {
      expect(post.date, `${post.slug} 的日期`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('公開文章都有摘要', () => {
    for (const post of posts.filter((p) => !p.draft)) {
      expect(post.excerpt?.trim(), `${post.slug} 缺少摘要`).toBeTruthy();
    }
  });

  it('教學文章的內容來自 guides 目錄的 markdown,而非 posts.json 佔位', () => {
    // posts.ts 會用 ?raw import 把 guides/*.md 蓋進 body。
    // 這層替換一旦壞掉,頁面會靜默地掉回短佔位文字而不會報錯。
    const guide = posts.find((post) => post.slug === 'multistream-hub-guide');

    expect(guide).toBeDefined();
    expect(guide!.body).toContain('## 使用方式');
    expect(guide!.body.length).toBeGreaterThan(1800);
  });
});

describe('開發活動與目前動態', () => {
  it('活動日期格式一律為 YYYY-MM-DD', () => {
    for (const entry of activity) {
      expect(entry.date, `${entry.project} 的日期`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('活動的 commit 一律是 7 碼短 SHA', () => {
    for (const entry of activity) {
      for (const commit of entry.commits ?? []) {
        expect(commit, `${entry.project} 的 commit`).toMatch(/^[0-9a-f]{7}$/);
      }
    }
  });

  it('每筆活動的 tier 都是合法值', () => {
    // activity 頁面用 tier 決定標示 Public 還是 Protected。
    // 打錯一個字不會讓建置失敗,但會把受保護的工作標成公開。
    for (const entry of activity) {
      expect(['personal', 'protected'], `${entry.project} 的 tier`).toContain(entry.tier);
    }
  });

  it('每筆活動都有專案名與摘要', () => {
    for (const entry of activity) {
      expect(entry.project?.trim(), `${entry.date} 缺少專案名`).toBeTruthy();
      expect(entry.summary?.trim(), `${entry.date} 缺少摘要`).toBeTruthy();
    }
  });

  it('目前動態最多列六個專案', () => {
    // now 頁面的版面以六格為上限,超過會溢出
    expect(now.projects.length).toBeGreaterThan(0);
    expect(now.projects.length).toBeLessThanOrEqual(6);
  });
});
