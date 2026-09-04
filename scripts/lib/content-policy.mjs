/**
 * 內容政策護欄:客戶／受保護專案的識別資訊,不得出現在任何會被建置進網站的內容中。
 *
 * 這是本站的隱私鐵律。個人作品集公開展示的是「工程方法」,不是「客戶是誰」——
 * 受保護專案在 src/data/projects.json 中一律以去識別化代號呈現
 * (例如 protected-management-platform),真名只存在於 scripts/projects.config.json
 * 這份本機自動化設定裡。
 *
 * 本模組同時被兩處使用,確保護欄不會只存在於其中一邊:
 *   - scripts/validate-content.mjs → build 前擋下,洩漏永遠上不了線
 *   - tests/content-policy.test.ts → 用反例證明掃描器真的抓得到,不是空轉
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

/** 掃描範圍:會被 Astro 建置進網站的來源目錄。 */
export const SCANNED_DIRS = ['src', 'public'];

/**
 * 掃描時略過的副檔名:二進位檔沒有可讀的文字內容,逐位元組比對只會拖慢且無意義。
 */
const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.ico',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.mp4', '.webm', '.mp3', '.wav', '.pdf', '.zip',
]);

/**
 * 本機開發環境路徑樣式。這些不該出現在公開網站內容裡:
 * 既暴露本機目錄結構,也常常順帶把未公開的專案名一起帶出去。
 */
const LOCAL_PATH_PATTERNS = [
  { label: '本機專案路徑', pattern: /[A-Za-z]:[\\/]codeproject/gi },
  { label: '本機使用者目錄', pattern: /[A-Za-z]:[\\/]Users[\\/][^\s"'<>]+/gi },
];

/** 存放客戶真名的本機檔案,不進 git(見 .gitignore)。 */
export const LOCAL_TERMS_FILE = 'scripts/protected-terms.local.json';

/**
 * 把原始詞彙正規化成可比對的識別詞:小寫、去重,並補上去掉網域後綴的變體——
 * `acmestudio-com` 這種名字,文章裡寫成 `acmestudio` 一樣會洩漏身分。
 *
 * 註解一律用假名舉例。這個檔案在公開 repo 裡,而掃描刻意不掃 `scripts/`,
 * 拿真名當範例的話,護欄反而抓不到自己造成的洩漏。
 *
 * @param {string[]} rawTerms
 * @returns {string[]} 去重後的識別詞,全部小寫
 */
export function normalizeTerms(rawTerms) {
  const terms = new Set();

  for (const raw of rawTerms ?? []) {
    const name = String(raw ?? '').trim();
    if (!name) continue;

    terms.add(name.toLowerCase());

    const withoutDomain = name.replace(/[-.](com|net|org|io|tw)$/i, '');
    if (withoutDomain && withoutDomain !== name) {
      terms.add(withoutDomain.toLowerCase());
    }
  }

  return [...terms];
}

/**
 * 載入受保護識別詞。
 *
 * 客戶真名**刻意不存在於這個 repo 裡**(它是公開的),所以來源有三,依序合併:
 *   1. 環境變數 `PROTECTED_TERMS`(逗號分隔)—— CI 用,由 GitHub secret 注入
 *   2. 本機檔 `scripts/protected-terms.local.json`(字串陣列)—— 本機開發用,不進 git
 *   3. `config.forbiddenTerms` —— 公開設定裡的補充詞,通常為空
 *
 * `projects.config.json` 裡 tier 為 protected 的專案名**不再**是來源:
 * 那些欄位現在存的是去識別化代號(`protected-commerce-site` 等),
 * 而代號本來就該出現在 `src/data/projects.json`,拿它當識別詞只會誤報。
 *
 * 三個來源都空的時候回傳空陣列,呼叫端有責任把「保護已降級」講出來,不要靜默通過。
 *
 * @param {string} root 專案根目錄
 * @param {{ forbiddenTerms?: string[] }} [config]
 * @param {Record<string, string | undefined>} [env]
 * @returns {string[]}
 */
export function loadProtectedTerms(root, config = {}, env = process.env) {
  const raw = [];

  if (env.PROTECTED_TERMS) {
    raw.push(...env.PROTECTED_TERMS.split(','));
  }

  const localPath = resolve(root, LOCAL_TERMS_FILE);
  if (existsSync(localPath)) {
    try {
      const parsed = JSON.parse(readFileSync(localPath, 'utf8'));
      if (Array.isArray(parsed)) raw.push(...parsed);
    } catch {
      // 本機檔壞掉不該讓建置無法進行,但也不能假裝有保護——
      // 這裡吞掉解析錯誤,由回傳的空陣列讓呼叫端印出降級警告。
    }
  }

  raw.push(...(config.forbiddenTerms ?? []));

  return normalizeTerms(raw);
}

/**
 * 在一段文字中找出所有洩漏,回傳帶行號的命中清單。
 *
 * 比對刻意採大小寫不敏感的子字串比對,而非單字邊界比對:
 * `AcmeCorp`、`acmecorp-admin`、`專案 acmecorp 的` 都必須抓到。
 *
 * @param {string} text 要掃描的文字內容
 * @param {string[]} terms 受保護識別詞(小寫)
 * @returns {Array<{term: string, line: number, kind: string}>}
 */
export function findLeaks(text, terms) {
  const hits = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const lowered = line.toLowerCase();

    for (const term of terms) {
      if (term && lowered.includes(term)) {
        hits.push({ term, line: index + 1, kind: '受保護專案識別詞' });
      }
    }

    for (const { label, pattern } of LOCAL_PATH_PATTERNS) {
      // 每行重置 lastIndex,避免 /g 正則跨行殘留狀態造成漏抓
      pattern.lastIndex = 0;
      const match = pattern.exec(line);
      if (match) {
        hits.push({ term: match[0], line: index + 1, kind: label });
      }
    }
  });

  return hits;
}

/**
 * 遞迴列出目錄下所有可讀的文字檔絕對路徑。
 *
 * @param {string} dir 起始目錄
 * @returns {string[]}
 */
export function listTextFiles(dir) {
  const found = [];

  const walk = (current) => {
    let entries;
    try {
      entries = readdirSync(current);
    } catch {
      return; // 目錄不存在就當作沒有檔案,不讓掃描本身變成失敗原因
    }

    for (const entry of entries) {
      const full = join(current, entry);
      const stats = statSync(full);

      if (stats.isDirectory()) {
        walk(full);
        continue;
      }

      const lowered = entry.toLowerCase();
      const ext = lowered.slice(lowered.lastIndexOf('.'));
      if (!BINARY_EXTENSIONS.has(ext)) found.push(full);
    }
  };

  walk(dir);
  return found;
}

/**
 * 掃描整個專案的網站來源內容,回傳所有洩漏。
 *
 * 刻意「不」掃描 scripts/ 目錄:scripts/projects.config.json 正是識別詞的
 * 來源檔案,掃描它等於自我矛盾。該檔的公開範圍屬於獨立議題,見 CLAUDE.md。
 *
 * @param {string} root 專案根目錄
 * @param {string[]} terms 受保護識別詞
 * @param {string[]} [dirs] 掃描目錄,預設為 SCANNED_DIRS
 * @returns {Array<{file: string, term: string, line: number, kind: string}>}
 */
export function scanProjectContent(root, terms, dirs = SCANNED_DIRS) {
  const leaks = [];

  for (const dir of dirs) {
    for (const file of listTextFiles(join(root, dir))) {
      let content;
      try {
        content = readFileSync(file, 'utf8');
      } catch {
        continue; // 讀不到的檔案(權限、被鎖)略過,不阻斷整體掃描
      }

      for (const hit of findLeaks(content, terms)) {
        leaks.push({ file: relative(root, file).split(sep).join('/'), ...hit });
      }
    }
  }

  return leaks;
}

/**
 * 把洩漏清單格式化成人看得懂的錯誤訊息。
 *
 * @param {Array<{file: string, term: string, line: number, kind: string}>} leaks
 * @returns {string[]}
 */
export function formatLeaks(leaks) {
  return leaks.map(
    (leak) => `${leak.file}:${leak.line} 出現${leak.kind}「${leak.term}」`,
  );
}
