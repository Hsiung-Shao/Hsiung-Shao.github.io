/**
 * /poe/<slug> 產品頁的資料檢查。欄位缺了頁面不會報錯,只會少一塊或數字變「待更新」,所以在建置前擋。
 * imageExists 由呼叫端注入(相對 src/assets/poe/ 的路徑 → 是否存在),方便測試不碰檔案系統。
 */
const isText = value => typeof value === 'string' && value.trim() !== '';

// Windows 會把 \ 當分隔符,所以兩種斜線都切
const hasTraversal = path => path.split(/[\\/]/).some(segment => segment === '..' || segment === '.' || segment === '');

// 副檔名要和 src/pages/poe/[slug].astro 的 import.meta.glob('/src/assets/poe/**/*.{png,jpg,webp}') 同步,
// 不然驗證通過的圖在頁面裡查不到。含 ':' 的路徑(Windows 磁碟代號)一律拒絕。
const IMAGE_EXTENSION = /\.(png|jpg|webp)$/i;
const isValidImagePath = path => isText(path) && !hasTraversal(path) && !path.includes(':') && IMAGE_EXTENSION.test(path);

function validateProduct(product, tools, imageExists) {
  const label = `poe-products.json(${product.slug})`;
  const errors = [];
  const tool = tools.find(candidate => candidate.projectId === product.projectId);
  if (!tool) errors.push(`${label}: projectId ${product.projectId} 不在 poe-tools.json 裡`);
  if (!isText(product.hero?.title)) errors.push(`${label}: hero.title 必須是非空字串`);

  for (const stat of product.stats ?? []) {
    if (stat.source === 'downloads' && !(tool && stat.key in (tool.assets ?? {}))) {
      errors.push(`${label}: 統計 ${stat.key} 沒有對應的下載規則`);
    } else if (stat.source === 'manual' && !(tool && stat.key in (tool.manual ?? {}))) {
      errors.push(`${label}: 統計 ${stat.key} 沒有對應的手動數字`);
    }
  }

  for (const section of product.sections ?? []) {
    if (section.image === undefined) continue;
    if (!isValidImagePath(section.image)) {
      errors.push(`${label}: ${section.id} 的 image 必須是 src/assets/poe/ 底下的相對路徑`);
    } else if (!imageExists(section.image)) {
      errors.push(`${label}: 找不到截圖 src/assets/poe/${section.image}`);
    }
  }
  return errors;
}

export function validatePoeProducts(products, { tools, imageExists }) {
  const errors = [];
  const seen = new Set();
  for (const product of products) {
    if (seen.has(product.slug)) errors.push(`poe-products.json(${product.slug}): slug 重複`);
    seen.add(product.slug);
    errors.push(...validateProduct(product, tools, imageExists));
  }
  return errors;
}
