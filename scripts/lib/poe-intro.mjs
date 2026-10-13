/**
 * /poe/about 介紹頁的資料檢查。欄位缺了頁面不會報錯,只會少一塊,所以在建置前擋。
 * imageExists 由呼叫端注入(public/ 底下的路徑 → 是否存在),方便測試不碰檔案系統。
 */
const isText = value => typeof value === 'string' && value.trim() !== '';

export function validatePoeIntro(tool, imageExists) {
  const label = `poe-tools.json(${tool.projectId}).intro`;
  const intro = tool.intro;
  if (!intro || typeof intro !== 'object') return [`${label}: 缺少介紹內容`];

  const errors = [];
  for (const field of ['problem', 'audience', 'privacy']) {
    if (!isText(intro[field])) errors.push(`${label}: ${field} 必須是非空字串`);
  }
  if (!Array.isArray(intro.features) || intro.features.filter(isText).length < 3) {
    errors.push(`${label}: features 至少要三條`);
  }
  for (const field of ['support', 'limits']) {
    if (!Array.isArray(intro[field])) errors.push(`${label}: ${field} 必須是陣列`);
  }
  if (intro.image !== null) {
    if (typeof intro.image !== 'string' || !intro.image.startsWith('/images/') || intro.image.split('/').some(seg => seg === '..' || seg === '.')) {
      errors.push(`${label}: image 必須是 null 或 /images/ 底下的路徑`);
    } else if (!imageExists(intro.image)) {
      errors.push(`${label}: 找不到圖片 public${intro.image}`);
    }
  }
  return errors;
}
