import { dailyGains } from './download-history.mjs';

const dayNumber = date => Date.parse(`${date}T00:00:00Z`) / 86_400_000;

/**
 * /downloads 每日新增長條圖的版面資料,單位一律是「天」,畫 SVG 時再換成像素。
 * 排程沒跑的日子會讓一筆差值橫跨多天(span > 1):畫成一根同寬的長條、高度取日均,
 * 才不會把三天的量畫成單日暴衝。圖表起點最早只到 today − days,更早的左緣截齊。
 * 可用資料不足兩筆時回傳 null。
 */
export function buildDailyBars(entries, key, { days, today }) {
  const cutoff = dayNumber(today) - days;
  const gains = dailyGains(entries, key, days, today).filter(gain => dayNumber(gain.date) > cutoff);
  if (gains.length === 0) return null;

  const start = Math.max(dayNumber(gains[0].prevDate), cutoff);
  const averages = gains.map(gain => gain.gain / gain.span);
  const maxAverage = Math.max(...averages.map(average => Math.max(average, 0))) || 1;

  const bars = gains.map((gain, index) => {
    const left = Math.max(dayNumber(gain.prevDate), start);
    return {
      prevDate: gain.prevDate,
      date: gain.date,
      span: gain.span,
      gain: gain.gain,
      average: averages[index],
      x: left - start,
      width: dayNumber(gain.date) - left,
      height: Math.max(averages[index], 0) / maxAverage,
    };
  });

  return {
    slots: dayNumber(gains[gains.length - 1].date) - start,
    bars,
    total: gains.reduce((sum, gain) => sum + gain.gain, 0),
  };
}
