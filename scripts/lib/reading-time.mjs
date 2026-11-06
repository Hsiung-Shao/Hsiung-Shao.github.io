/**
 * 文章頁標頭的「約 N 分鐘」。中日韓字元每分鐘 400 字、英文與數字單字每分鐘 200 個,
 * 程式碼區塊、圖片、連結網址和 markdown 標記都不算,最少 1 分鐘。
 */
const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/g;

export function readingMinutes(markdown) {
  const text = (markdown ?? '')
    .replace(/^```[\s\S]*?^```[^\n]*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*`|>_~-]/g, ' ');
  const cjk = (text.match(CJK) ?? []).length;
  const words = (text.replace(CJK, ' ').match(/[A-Za-z0-9]+(?:['.][A-Za-z0-9]+)*/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}
