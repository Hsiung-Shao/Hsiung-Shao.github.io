#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  formatLeaks,
  loadProtectedTerms,
  scanProjectContent,
} from './lib/content-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const projects = readJson('src/data/projects.json');
const posts = readJson('src/data/posts.json');
const activity = readJson('src/data/activity.json');
const now = readJson('src/data/now.json');
const config = readJson('scripts/projects.config.json');
const poeTools = readJson('src/data/poe-tools.json');
const releaseSnapshot = readJson('src/data/releases.json');
const downloadHistory = readJson('src/data/download-history.json');
const errors = [];

const projectIds = new Set();
const postSlugs = new Set();
const statuses = new Set(['active', 'maintained', 'paused', 'archived', 'client']);
const visibilities = new Set(['public', 'protected']);
const requiredGuideSlugs = [
  'multistream-hub-guide',
  'pobtools-installation-guide',
  'poe-market-zh-guide',
  'awakened-poe-trade-zh-tw-guide',
  'minecraft-mod-translation-guide',
];
const requiredGuideSections = [
  '## 使用方式',
  '## 常見問題',
];
const aiMusicArticleSlug = 'kumori-music-first-release';
const kumoriChannelUrl = 'https://www.youtube.com/@KumoriMusic08';
const firstReleaseUrl = 'https://youtu.be/FPolv4K_yv4';

for (const project of projects) {
  if (projectIds.has(project.id)) errors.push(`重複的 project id: ${project.id}`);
  projectIds.add(project.id);
  if (!statuses.has(project.status)) errors.push(`${project.id}: 無效或缺少 status`);
  if (!visibilities.has(project.visibility)) errors.push(`${project.id}: 無效或缺少 visibility`);
  if (typeof project.featured !== 'boolean') errors.push(`${project.id}: featured 必須是 boolean`);
  if (project.visibility === 'protected' && project.status !== 'client') {
    errors.push(`${project.id}: protected 專案的 status 必須是 client`);
  }
}

for (const post of posts) {
  if (postSlugs.has(post.slug)) errors.push(`重複的 post slug: ${post.slug}`);
  postSlugs.add(post.slug);
  if (typeof post.draft !== 'boolean') errors.push(`${post.slug}: draft 必須是 boolean`);
  if (post.visibility && !visibilities.has(post.visibility)) {
    errors.push(`${post.slug}: 無效的 visibility`);
  }
  if (post.visibility === 'protected' && post.type !== 'case-study') {
    errors.push(`${post.slug}: protected 文章必須是 case-study`);
  }
}

for (const project of projects) {
  for (const slug of project.articles ?? []) {
    if (!postSlugs.has(slug)) errors.push(`${project.id}: 找不到文章 ${slug}`);
  }
}

for (const project of config.projects) {
  if (!['personal', 'protected', 'manual'].includes(project.tier)) {
    errors.push(`${project.name}: 無效的 tier`);
  }
  if (!['full', 'technical-only', 'disabled'].includes(project.contentPolicy)) {
    errors.push(`${project.name}: 無效或缺少 contentPolicy`);
  }
}

for (const [index, entry] of activity.entries()) {
  const label = `activity[${index}]`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date ?? '')) errors.push(`${label}: 日期格式必須是 YYYY-MM-DD`);
  if (!entry.project || !entry.summary) errors.push(`${label}: 缺少 project 或 summary`);
  if (!['personal', 'protected'].includes(entry.tier)) errors.push(`${label}: 無效或缺少 tier`);
  for (const commit of entry.commits ?? []) {
    if (!/^[0-9a-f]{7}$/.test(commit)) errors.push(`${label}: commit 必須是 7 碼十六進位短 SHA`);
  }
}

if (!Array.isArray(now.projects) || now.projects.length > 6) {
  errors.push('now.json: projects 必須是最多 6 個項目的陣列');
}

const aiMusicProject = projects.find(project => project.id === 'ai-music');
if (!aiMusicProject || aiMusicProject.status !== 'active') {
  errors.push('ai-music: 專案狀態必須是 active');
} else {
  if (aiMusicProject.link !== kumoriChannelUrl) errors.push('ai-music: 缺少 Kumori Music 頻道連結');
  if (!aiMusicProject.articles.includes(aiMusicArticleSlug)) errors.push(`ai-music: 找不到文章 ${aiMusicArticleSlug}`);
}

const aiMusicConfig = config.projects.find(project => project.name === 'ai-Music');
if (!aiMusicConfig || aiMusicConfig.status !== 'active' || aiMusicConfig.contentPolicy !== 'full') {
  errors.push('ai-Music: 自動更新設定必須是 active / full');
}

const aiMusicArticle = posts.find(post => post.slug === aiMusicArticleSlug);
if (!aiMusicArticle || aiMusicArticle.draft) {
  errors.push(`${aiMusicArticleSlug}: 首發文章必須存在且公開`);
} else if (!aiMusicArticle.body.includes(kumoriChannelUrl) || !aiMusicArticle.body.includes(firstReleaseUrl)) {
  errors.push(`${aiMusicArticleSlug}: 文章缺少頻道或首支作品連結`);
}

for (const slug of requiredGuideSlugs) {
  const post = posts.find(candidate => candidate.slug === slug);
  const guidePath = resolve(root, 'src/data/guides', `${slug}.md`);
  if (!post) {
    errors.push(`缺少指定的專案介紹文章: ${slug}`);
  } else if (post.draft) {
    errors.push(`${slug}: 指定的專案介紹文章不可為草稿`);
  } else if (!existsSync(guidePath)) {
    errors.push(`${slug}: 缺少詳細教學檔案`);
  } else {
    const guide = readFileSync(guidePath, 'utf8');
    if (guide.length < 1800) errors.push(`${slug}: 教學內容過短`);
    for (const section of requiredGuideSections) {
      if (!guide.includes(section)) errors.push(`${slug}: 缺少「${section.slice(3)}」章節`);
    }
    if (!guide.includes('## 使用方式')) {
      errors.push(`${slug}: 至少一個章節標題需以「使用方式」開頭`);
    }
  }
}

// PoE 工具頁:設定要指得到公開專案,手動數字必須是數字或明確的 null(頁面顯示「待更新」),
// 快照結構要完整——缺欄位時頁面不會報錯,只會默默顯示「待更新」,所以在這裡擋。
for (const tool of poeTools.tools ?? []) {
  const label = `poe-tools.json(${tool.projectId})`;
  const project = projects.find(candidate => candidate.id === tool.projectId);
  if (!project) errors.push(`${label}: 找不到對應專案`);
  else if (project.visibility !== 'public') errors.push(`${label}: 只能列公開專案`);
  if (!/^https:\/\//.test(tool.primaryUrl ?? '')) errors.push(`${label}: primaryUrl 必須是 https 連結`);
  if (!/^[\w.-]+\/[\w.-]+$/.test(tool.repo ?? '')) errors.push(`${label}: repo 格式必須是 owner/name`);
  for (const [bucket, pattern] of Object.entries(tool.assets ?? {})) {
    try { new RegExp(pattern); } catch { errors.push(`${label}: assets.${bucket} 不是合法的正規表示式`); }
  }
  for (const stat of tool.stats ?? []) {
    if (stat.source === 'downloads' && !(stat.key in (tool.assets ?? {}))) {
      errors.push(`${label}: 統計 ${stat.key} 沒有對應的 assets 規則`);
    }
    if (stat.source === 'manual') {
      const entry = tool.manual?.[stat.key];
      if (!entry || !(entry.value === null || Number.isInteger(entry.value))) {
        errors.push(`${label}: manual.${stat.key}.value 必須是整數或 null`);
      } else if (entry.value !== null && !/^\d{4}-\d{2}-\d{2}$/.test(entry.asOf ?? '')) {
        errors.push(`${label}: 有填 manual.${stat.key}.value 時必須附 asOf(YYYY-MM-DD)`);
      }
    }
  }
  const snapshot = releaseSnapshot.tools?.[tool.projectId];
  if (!snapshot) {
    errors.push(`releases.json: 缺少 ${tool.projectId} 的快照,請執行 npm run fetch-releases`);
  } else if (!snapshot.downloads || !Array.isArray(snapshot.recent) || !snapshot.fetchedAt) {
    errors.push(`releases.json(${tool.projectId}): 快照結構不完整`);
  }
}

// 下載數歷史由每日排程自動寫入,這裡擋住格式壞掉的資料,免得趨勢圖靜默畫錯。
const poeToolIds = new Set((poeTools.tools ?? []).map(tool => tool.projectId));
for (const [projectId, entries] of Object.entries(downloadHistory)) {
  const label = `download-history.json(${projectId})`;
  if (!poeToolIds.has(projectId)) errors.push(`${label}: 不在 poe-tools.json 裡`);
  if (!Array.isArray(entries)) { errors.push(`${label}: 必須是陣列`); continue; }
  let previous = '';
  for (const entry of entries) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date ?? '')) errors.push(`${label}: 日期格式必須是 YYYY-MM-DD`);
    else if (entry.date <= previous) errors.push(`${label}: ${entry.date} 重複或未依日期排序`);
    previous = entry.date ?? previous;
    for (const [key, value] of Object.entries(entry)) {
      if (key !== 'date' && !(Number.isInteger(value) && value >= 0)) errors.push(`${label}: ${entry.date} 的 ${key} 必須是非負整數`);
    }
  }
}

const supportPath = resolve(root, 'src/pages/support.astro');
if (!existsSync(supportPath)) {
  errors.push('缺少贊助頁: src/pages/support.astro');
} else {
  const supportPage = readFileSync(supportPath, 'utf8');
  for (const url of ['https://buymeacoffee.com/hsiung', 'https://www.exitlag.com/refer/10318098']) {
    if (!supportPage.includes(url)) errors.push(`贊助頁缺少連結: ${url}`);
  }
}

// 隱私鐵律:受保護專案的識別資訊不得出現在任何會被建置進網站的內容中。
// 這條放在最後,因為它掃的是 src/ 與 public/ 全部檔案,而非單一資料結構。
const protectedTerms = loadProtectedTerms(root, config);

// 客戶真名不在這個 repo 裡(它是公開的),要靠本機檔或 CI secret 提供。
// 兩者都沒有時掃描仍會跑,但只剩本機路徑樣式那一層。
//
// 這件事在兩種情境下的嚴重性不同:
//   - 部署(deploy.yml)無人值守。secret 哪天被誤刪或改名,只留一行沒人看的警告,
//     等於護欄靜默退化成半套而站照上——所以那條路徑設 REQUIRE_PROTECTED_TERMS=1 直接擋下。
//   - PR 檢查(ci.yml)不設。GitHub 不會把 secret 傳給 fork 送出的 PR,
//     硬失敗會讓外部貢獻者的 PR 永遠是紅的。
if (protectedTerms.length === 0) {
  const message =
    '未載入任何受保護識別詞:缺少環境變數 PROTECTED_TERMS 或 scripts/protected-terms.local.json。';

  if (process.env.REQUIRE_PROTECTED_TERMS === '1') {
    errors.push(`${message} 此路徑要求必須有識別詞來源,不接受降級掃描。`);
  } else {
    console.warn(`⚠ ${message}\n  隱私掃描目前只檢查本機路徑樣式,無法偵測客戶名洩漏。`);
  }
}

const leaks = scanProjectContent(root, protectedTerms);
errors.push(...formatLeaks(leaks));

if (errors.length > 0) {
  console.error(`內容驗證失敗 (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `內容驗證通過: ${projects.length} 個專案，${posts.length} 篇文章，` +
    `隱私掃描 ${protectedTerms.length} 個受保護識別詞無洩漏。`,
);
