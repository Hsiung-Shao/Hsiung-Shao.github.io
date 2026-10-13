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

const dayNumber = date => Date.parse(`${date}T00:00:00Z`) / 86_400_000;

/** 相鄰兩筆有效紀錄的差。span 是相隔天數,排程沒跑的日子會讓 span > 1,代表這筆是多天合計。 */
function pairwiseGains(entries, key) {
  const points = (entries ?? []).filter(entry => Number.isInteger(entry[key]));
  return points.slice(1).map((entry, index) => {
    const prev = points[index];
    return {
      date: entry.date,
      prevDate: prev.date,
      gain: entry[key] - prev[key],
      span: dayNumber(entry.date) - dayNumber(prev.date),
    };
  });
}

/**
 * 最近 days 天內每一筆紀錄的新增量,給每日長條圖用。
 * 先對全部歷史相減再篩日期,範圍內第一筆才會以範圍外的前一筆為基準,不會少算一段。
 */
export function dailyGains(entries, key, days, today) {
  const cutoff = dayNumber(today) - days;
  return pairwiseGains(entries, key).filter(gain => dayNumber(gain.date) >= cutoff);
}

/** 最後兩筆有效紀錄的差,給「較前日」用;Chrome 每週使用者不是累計值,gain 可能是負的。 */
export function latestDelta(entries, key) {
  return pairwiseGains(entries, key).at(-1) ?? null;
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
