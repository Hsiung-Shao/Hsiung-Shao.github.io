#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONFIG_PATH = join(__dirname, 'projects.config.json');
const LASTRUN_PATH = join(__dirname, '.lastrun.json');
const DIGEST_PATH = join(__dirname, 'pending-digest.md');

const log = (...a) => console.log('[update-site]', ...a);

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function isGitRepo(path) {
  return existsSync(join(path, '.git'));
}

function gitCmd(repo, args) {
  return execSync(`git -c safe.directory="${repo}" -C "${repo}" ${args}`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function getNewCommits(repo, sinceSha, maxCount) {
  const range = sinceSha ? `${sinceSha}..HEAD` : `-n ${maxCount}`;
  const format = '%H%x09%aI%x09%s';
  try {
    const out = gitCmd(repo, `log ${range} --format=${format} --no-merges`);
    if (!out) return [];
    return out.split('\n').map(line => {
      const [sha, date, ...rest] = line.split('\t');
      return { sha, date, subject: rest.join('\t') };
    }).slice(0, maxCount);
  } catch {
    return [];
  }
}

function getCommitDetail(repo, sha) {
  try {
    const body = gitCmd(repo, `show --no-patch --format=%B ${sha}`);
    const stat = gitCmd(repo, `show --stat --format= ${sha}`).split('\n').slice(0, 8).join('\n');
    return { body, stat };
  } catch {
    return { body: '', stat: '' };
  }
}

function main() {
  const config = readJson(CONFIG_PATH, null);
  if (!config) { console.error('找不到 projects.config.json'); process.exit(1); }
  const lastrun = readJson(LASTRUN_PATH, { projects: {} });

  const sections = [];
  let totalCommits = 0;
  const nextLastrun = { projects: { ...lastrun.projects } };

  for (const project of config.projects) {
    if (project.contentPolicy === 'disabled') { log(`略過(內容更新已停用):${project.name}`); continue; }
    if (!isGitRepo(project.path)) { log(`略過(非 git repo):${project.name}`); continue; }
    const lastSha = lastrun.projects[project.name];
    const commits = getNewCommits(project.path, lastSha, config.maxCommitsPerRun ?? 40);
    if (commits.length === 0) { log(`  ${project.name}: 無新 commit`); continue; }
    totalCommits += commits.length;
    log(`${project.name}: ${commits.length} 個新 commit`);

    const rules = project.contentPolicy === 'technical-only'
      ? '⚠ **此為客戶專案**,只能產出去識別化的技術案例。嚴禁出現客戶名、品牌名、表名、欄位名、業務資料與實際流程。不嵌 code snippet，發佈前必須人工審閱。'
      : '個人專案,可詳述功能與實作,若有教學價值可產出 blogDraft,可嵌不超過 15 行 code snippet。';

    const lines = [];
    lines.push(`## ${project.name} (\`${project.tier}\`)`);
    lines.push('');
    lines.push(rules);
    lines.push('');
    lines.push(`新 commit 數:${commits.length}  |  最新 SHA:\`${commits[0].sha}\``);
    lines.push('');
    for (const c of commits.slice(0, 20)) {
      const { body, stat } = getCommitDetail(project.path, c.sha);
      lines.push(`### [${c.sha.slice(0, 7)}] ${c.date.slice(0, 10)} — ${c.subject}`);
      lines.push('');
      if (body.trim() && body.trim() !== c.subject) {
        lines.push('```');
        lines.push(body.trim());
        lines.push('```');
      }
      if (stat.trim()) {
        lines.push('變更檔案:');
        lines.push('```');
        lines.push(stat.trim());
        lines.push('```');
      }
      lines.push('');
    }
    if (commits.length > 20) {
      lines.push(`_(另有 ${commits.length - 20} 個 commit 未展開,完整清單:)_`);
      lines.push('');
      for (const c of commits.slice(20)) {
        lines.push(`- [${c.sha.slice(0, 7)}] ${c.date.slice(0, 10)} ${c.subject}`);
      }
      lines.push('');
    }
    sections.push(lines.join('\n'));
    nextLastrun.projects[project.name] = commits[0].sha;
  }

  log('───────────── 摘要 ─────────────');
  log(`掃描 commits 總數: ${totalCommits}`);

  if (totalCommits === 0) { log('沒有新 commit,結束。'); return; }

  const digest = [
    `# 網站內容更新 digest — ${new Date().toISOString().slice(0, 10)}`,
    '',
    `掃描到 ${totalCommits} 個新 commit,分佈於 ${sections.length} 個專案。`,
    '',
    '---',
    '',
    '## 給 Claude 的指示',
    '',
    '請依據下方各專案的 commit 紀錄,產出以下三種內容並**直接修改 `src/data/` 底下的 JSON**:',
    '',
    '1. **activity.json**:每個專案挑 1-3 則最具代表性的活動,append 到陣列末尾。格式:',
    '   ```json',
    '   { "date": "YYYY-MM-DD", "project": "專案名", "tier": "personal|protected", "summary": "40-80字摘要", "tags": ["tag"], "commits": ["7字元短 SHA"] }',
    '   ```',
    '',
    '2. **posts.json**:若有明確教學價值的 commit,產出一則 blog 草稿 append 到陣列末尾,`draft: true`。protected 專案只能產出去識別化的技術案例。格式:',
    '   ```json',
    '   { "slug": "短英文-slug", "title": "標題", "date": "YYYY-MM-DD", "tags": ["tag"], "draft": true, "type": "engineering|case-study|retrospective", "visibility": "public|protected", "excerpt": "120字內摘要", "body": "Markdown 內文", "project": "專案名或客戶技術案例" }',
    '   ```',
    '',
    '3. **now.json**:覆蓋整個物件,`updated` 設為現在 ISO 時間,`projects` 列出有進展的專案(最多 6 個)。格式:',
    '   ```json',
    '   { "updated": "ISO 時間", "focus": "一句話描述總體焦點", "projects": [{ "name": "...", "tier": "...", "status": "40字內狀態" }] }',
    '   ```',
    '',
    '**護欄**:',
    `- ${config.projects.filter(p => p.tier === 'protected').map(p => p.name).join('、')} 是客戶專案,只能講設計理念與架構,禁止出現客戶名、表名、欄位名、業務術語、特定 API 路徑`,
    `- forbiddenTerms: ${JSON.stringify(config.forbiddenTerms ?? [])} — 若要出現必須先跟使用者確認`,
    '- protected 文章必須使用 `type: "case-study"`、`visibility: "protected"`，且 `project` 只能寫「客戶技術案例」',
    '- 所有文章先保持 `draft: true`，人工確認後才能發佈',
    '- activity 必須保留來源 commit 的 7 字元短 SHA；同一批相關 commit 應合併成一則代表性活動，避免逐筆灌入頁面',
    '- 完成後把 `scripts/.lastrun.json` 更新為下方的 nextLastrun 值',
    '',
    '**nextLastrun**(完成後寫入 `scripts/.lastrun.json`):',
    '```json',
    JSON.stringify(nextLastrun, null, 2),
    '```',
    '',
    '---',
    '',
    ...sections
  ].join('\n');

  mkdirSync(dirname(DIGEST_PATH), { recursive: true });
  writeFileSync(DIGEST_PATH, digest, 'utf-8');
  log(`已寫入 digest:${DIGEST_PATH}`);
  log('');
  log('下一步:在 Claude Code 對話中貼上這個檔案內容(或叫我讀它),');
  log('我會依規則產出摘要並更新 src/data/ 底下的 JSON。');
}

main();
