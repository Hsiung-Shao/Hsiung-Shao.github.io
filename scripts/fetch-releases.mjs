#!/usr/bin/env node
/**
 * 抓 PoE 工具頁需要的 GitHub Release 資料,寫進 src/data/releases.json。
 *
 * 這個檔不進 main,存在 data 分支:deploy.yml 的 stats job 每天執行這支、再推上 data 分支;
 * 建置與本機開發前由 pull-data 拉回 src/data/。本機手動執行只會改到自己的副本。
 *
 * 任一 repo 抓失敗時保留該工具的舊資料、印警告、仍以 0 結束——
 * 下載數晚一天更新,比整站部署失敗好。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { mergeSnapshot, summarizeReleases } from './lib/releases.mjs';

const root = resolve(import.meta.dirname, '..');
const toolsPath = resolve(root, 'src/data/poe-tools.json');
const outputPath = resolve(root, 'src/data/releases.json');

const { tools } = JSON.parse(readFileSync(toolsPath, 'utf8'));
const previous = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf8')) : { tools: {} };

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'myweb-fetch-releases',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function fetchAllReleases(repo) {
  const releases = [];
  for (let page = 1; page <= 10; page++) {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    const batch = await response.json();
    releases.push(...batch);
    if (batch.length < 100) break;
  }
  return releases;
}

const fetched = {};
let failures = 0;

for (const tool of tools) {
  if (!tool.repo) continue;
  try {
    const summary = summarizeReleases(await fetchAllReleases(tool.repo), tool.assets);
    fetched[tool.projectId] = { ...summary, fetchedAt: new Date().toISOString() };
    console.log(`✓ ${tool.repo}: ${summary.releaseCount} 個版本,下載 ${JSON.stringify(summary.downloads)}`);
  } catch (error) {
    failures++;
    fetched[tool.projectId] = null;
    const kept = previous.tools[tool.projectId] ? '保留上次快照' : '目前沒有快照可用';
    console.warn(`⚠ ${tool.repo}: 抓取失敗(${error.message}),${kept}`);
  }
}

const output = { tools: mergeSnapshot(previous.tools, fetched) };
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`已寫入 src/data/releases.json${failures ? `(${failures} 個 repo 失敗)` : ''}`);
