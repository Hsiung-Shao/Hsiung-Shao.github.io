#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

const projects = readJson('src/data/projects.json');
const posts = readJson('src/data/posts.json');
const config = readJson('scripts/projects.config.json');
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

const supportPath = resolve(root, 'src/pages/support.astro');
if (!existsSync(supportPath)) {
  errors.push('缺少贊助頁: src/pages/support.astro');
} else {
  const supportPage = readFileSync(supportPath, 'utf8');
  for (const url of ['https://buymeacoffee.com/hsiung', 'https://www.exitlag.com/refer/10318098']) {
    if (!supportPage.includes(url)) errors.push(`贊助頁缺少連結: ${url}`);
  }
}

if (errors.length > 0) {
  console.error(`內容驗證失敗 (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`內容驗證通過: ${projects.length} 個專案，${posts.length} 篇文章。`);
