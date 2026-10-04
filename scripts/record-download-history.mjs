#!/usr/bin/env node
/**
 * 把今天的下載數寫進 src/data/download-history.json(每日排程在 fetch-releases 之後呼叫)。
 *
 * - 下載數:取 releases.json 快照的累計值,記在今天(台灣時間)。同一天重跑會覆蓋同一筆。
 * - 手動使用者數(Chrome 每週使用者):記在它的 asOf 日期,不是今天——手動值沒更新時,
 *   每天照抄同一個數字會畫出一條假的平線。
 *
 * 回填 Chrome 匯出的 CSV:
 *   npm run record-history -- --import-chrome-csv <檔案路徑> <projectId>
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { parseChromeUsersCsv, taipeiDate, upsertDay } from './lib/download-history.mjs';

const root = resolve(import.meta.dirname, '..');
const readJson = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const historyPath = resolve(root, 'src/data/download-history.json');

const history = existsSync(historyPath) ? JSON.parse(readFileSync(historyPath, 'utf8')) : {};
const save = () => writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);

const args = process.argv.slice(2);
const importIndex = args.indexOf('--import-chrome-csv');

if (importIndex >= 0) {
  const [csvPath, projectId] = args.slice(importIndex + 1);
  if (!csvPath || !projectId) {
    console.error('用法:--import-chrome-csv <檔案路徑> <projectId>');
    process.exit(1);
  }
  const rows = parseChromeUsersCsv(readFileSync(csvPath, 'utf8'));
  for (const row of rows) history[projectId] = upsertDay(history[projectId], row.date, { users: row.users });
  save();
  console.log(`已回填 ${projectId} 的每週使用者 ${rows.length} 筆(略過 0 值缺口)`);
  process.exit(0);
}

const { tools } = readJson('src/data/poe-tools.json');
const snapshot = readJson('src/data/releases.json');
const today = taipeiDate();

for (const tool of tools) {
  const downloads = snapshot.tools?.[tool.projectId]?.downloads;
  if (downloads) {
    history[tool.projectId] = upsertDay(history[tool.projectId], today, downloads);
  } else {
    console.warn(`⚠ ${tool.projectId}: 快照裡沒有下載數,今天不記`);
  }
  for (const [key, entry] of Object.entries(tool.manual ?? {})) {
    if (Number.isInteger(entry?.value) && entry.asOf) {
      history[tool.projectId] = upsertDay(history[tool.projectId], entry.asOf, { [key]: entry.value });
    }
  }
}

save();
console.log(`已記錄 ${today} 的下載數:${tools.map(tool => tool.projectId).join('、')}`);
