#!/usr/bin/env node
/**
 * 把 data 分支的 releases.json 與 download-history.json 拉到 src/data/。
 * npm 的 predev / prebuild / prevalidate-content / pretypecheck 會自動呼叫;離線時沿用上次拉到的副本。
 */
import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { pullData } from './lib/data-branch.mjs';

const root = resolve(import.meta.dirname, '..');
// execFileSync 不經過 shell,參數原樣傳給 git(Windows 的 cmd.exe 會吃掉 ^ 之類的字元)
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

try {
  const result = pullData({ run, fs: { existsSync, writeFileSync }, env: process.env, dataDir: resolve(root, 'src/data') });
  if (result.status === 'pulled') console.log('已從 data 分支更新 releases.json、download-history.json');
  if (result.status === 'skipped') console.log('SKIP_DATA_PULL 已設定,沿用目前的 src/data/');
  if (result.warning) console.warn(`⚠ ${result.warning}`);
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}
