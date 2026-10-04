/**
 * PoE 工具頁的 Release 彙總邏輯。fetch-releases.mjs 負責網路,這裡只放純函式,
 * 讓「下載數怎麼算」可以被測試釘住——口徑一旦算錯,頁面上的數字就是錯的。
 */

/** 每個工具最多保留幾個版本的更新內容。 */
export const RECENT_RELEASE_COUNT = 5;

/**
 * 依 poe-tools.json 的 assets 設定,把一個資產歸到某個計數欄位;不符合任何規則的回傳 null。
 * blockmap、latest.yml、manifest、SHA256SUMS 都不寫進規則,自然被排除。
 */
export function classifyAsset(name, assetRules) {
  for (const [bucket, pattern] of Object.entries(assetRules)) {
    if (new RegExp(pattern).test(name)) return bucket;
  }
  return null;
}

/** 頁面只需要「修正/新增/調整」;雜湊與安裝步驟屬於 Release 頁本身,這裡不重複。 */
const DROPPED_SECTION = /^##\s+(SHA-?256|安裝|Install)/i;

/**
 * 裁掉 release 內文中不適合放上頁面的區塊(從該標題起到下一個同級標題或結尾)。
 * 順便把 ExileAppraiser 慣用的「・」行首符號轉成 markdown 清單,否則 marked 會把整段併成一行。
 */
export function trimReleaseBody(body) {
  if (!body) return '';
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const kept = [];
  let skipping = false;
  for (const line of lines) {
    if (/^##\s/.test(line)) skipping = DROPPED_SECTION.test(line);
    if (!skipping) kept.push(line.replace(/^・\s*/, '- '));
  }
  return kept.join('\n').trim();
}

/**
 * 把 GitHub API 回傳的 release 陣列彙總成頁面需要的資料。
 * draft 與 prerelease 不列入(PobTools 的 data-N 翻譯資料包是 prerelease)。
 */
export function summarizeReleases(releases, assetRules) {
  const downloads = Object.fromEntries(Object.keys(assetRules).map(bucket => [bucket, 0]));
  const published = releases
    .filter(release => !release.draft && !release.prerelease)
    .sort((a, b) => (a.published_at < b.published_at ? 1 : -1));

  for (const release of published) {
    for (const asset of release.assets ?? []) {
      const bucket = classifyAsset(asset.name, assetRules);
      if (bucket) downloads[bucket] += asset.download_count;
    }
  }

  return {
    downloads,
    releaseCount: published.length,
    recent: published.slice(0, RECENT_RELEASE_COUNT).map(release => ({
      tag: release.tag_name,
      publishedAt: release.published_at,
      url: release.html_url,
      body: trimReleaseBody(release.body),
    })),
  };
}

/**
 * 合併新抓到的結果與舊快照:抓取失敗(值為 null)的工具保留舊資料,
 * 避免一次 API 失誤就把頁面上的數字清空。
 */
export function mergeSnapshot(previousTools, fetchedTools) {
  const merged = { ...previousTools };
  for (const [id, result] of Object.entries(fetchedTools)) {
    if (result) merged[id] = result;
  }
  return merged;
}
