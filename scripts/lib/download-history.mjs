/**
 * /poe 下載數歷史的純函式。GitHub 只給累計值、不給時間序列,
 * 所以每天記一筆累計值,趨勢與每日新增都從這份歷史算出來。
 */

/** 以台灣時間取 YYYY-MM-DD,排程在早上 8 點跑,用 UTC 會記成前一天。 */
export function taipeiDate(now = new Date()) {
  return now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' });
}

/**
 * 把某一天的數值併進該工具的歷史:同一天已有就合併欄位(傳入的欄位覆蓋舊值、其他欄位保留),
 * 沒有就插入,依日期排序。重跑結果相同(冪等),也不會讓下載數與手動使用者數互相蓋掉。
 * 不修改傳入的陣列。
 */
export function upsertDay(entries, date, values) {
  const list = entries ?? [];
  const existing = list.find(entry => entry.date === date);
  const others = list.filter(entry => entry.date !== date);
  return [...others, { ...existing, date, ...values }].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 從某個欄位的歷史算出「最近 days 天的新增量」:最後一筆減去 days 天前(含)最近的一筆。
 * 資料不足兩筆或找不到起點時回傳 null,頁面顯示「累積中」。
 */
export function recentGain(entries, key, days, today) {
  const points = (entries ?? []).filter(entry => Number.isInteger(entry[key]));
  if (points.length < 2) return null;
  const last = points[points.length - 1];
  const start = new Date(`${today}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - days);
  const startDate = start.toISOString().slice(0, 10);
  const base = [...points].reverse().find(entry => entry.date <= startDate) ?? points[0];
  if (base === last) return null;
  return last[key] - base[key];
}

/**
 * 解析 Chrome 開發人員資訊主頁匯出的「每週使用者人數」CSV。
 * 日期是不補零的 YYYY/M/D;值為 0 的列是資料缺口,不是真的歸零,直接略過。
 */
export function parseChromeUsersCsv(text) {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trim().match(/^(\d{4})\/(\d{1,2})\/(\d{1,2}),(\d+)$/))
    .filter(Boolean)
    .map(([, y, m, d, value]) => ({
      date: `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`,
      users: Number(value),
    }))
    .filter(row => row.users > 0);
}
