/**
 * /projects/<slug> 產品頁的資料檢查。欄位缺了頁面不會報錯,只會少一塊或數字變「待更新」,所以在建置前擋。
 * imageExists 由呼叫端注入(相對 src/assets/products/ 的路徑 → 是否存在),方便測試不碰檔案系統。
 */
const isText = value => typeof value === 'string' && value.trim() !== '';

// Windows 會把 \ 當分隔符,所以兩種斜線都切
const hasTraversal = path => path.split(/[\\/]/).some(segment => segment === '..' || segment === '.' || segment === '');

// 副檔名要和 src/pages/projects/[slug].astro 的 import.meta.glob 同步(大小寫也要一致),
// 不然驗證通過的圖在頁面裡查不到。含 ':' 的路徑(Windows 磁碟代號)一律拒絕。
const IMAGE_EXTENSION = /\.(png|jpg|webp)$/;
const isValidImagePath = path => isText(path) && !hasTraversal(path) && !path.includes(':') && IMAGE_EXTENSION.test(path);

const YOUTUBE_ID = /^[\w-]{11}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function validateProduct(product, { tools, projects, imageExists }) {
  const label = `products.json(${product.slug})`;
  const errors = [];
  if (!projects.some(project => project.id === product.projectId)) {
    errors.push(`${label}: projectId ${product.projectId} 不在 projects.json 裡`);
  }
  if (!isText(product.hero?.title)) errors.push(`${label}: hero.title 必須是非空字串`);

  // 只有引用下載數或人工數字的產品才需要對應 poe-tools.json 的工具設定
  const tool = tools.find(candidate => candidate.projectId === product.projectId);
  const needsTool = (product.stats ?? []).some(stat => stat.source === 'downloads' || stat.source === 'manual');
  if (needsTool && !tool) errors.push(`${label}: 引用了下載或人工統計,但 projectId 不在 poe-tools.json 裡`);
  for (const stat of product.stats ?? []) {
    if (!tool) continue;
    if (stat.source === 'downloads' && !(stat.key in (tool.assets ?? {}))) {
      errors.push(`${label}: 統計 ${stat.key} 沒有對應的下載規則`);
    } else if (stat.source === 'manual' && !(stat.key in (tool.manual ?? {}))) {
      errors.push(`${label}: 統計 ${stat.key} 沒有對應的手動數字`);
    }
  }

  for (const section of product.sections ?? []) {
    if (section.image === undefined) continue;
    if (!isValidImagePath(section.image)) {
      errors.push(`${label}: ${section.id} 的 image 必須是 src/assets/products/ 底下的相對路徑`);
    } else if (!imageExists(section.image)) {
      errors.push(`${label}: 找不到截圖 src/assets/products/${section.image}`);
    }
  }

  for (const song of product.songs ?? []) {
    if (!YOUTUBE_ID.test(song.youtubeId ?? '')) errors.push(`${label}: 歌曲〈${song.title}〉的 youtubeId 格式不對`);
    if (!ISO_DATE.test(song.date ?? '')) errors.push(`${label}: 歌曲〈${song.title}〉的 date 必須是 YYYY-MM-DD`);
  }
  return errors;
}

export function validateProducts(products, { tools, projects, imageExists }) {
  const errors = [];
  const seen = new Set();
  for (const product of products) {
    if (seen.has(product.slug)) errors.push(`products.json(${product.slug}): slug 重複`);
    seen.add(product.slug);
    errors.push(...validateProduct(product, { tools, projects, imageExists }));
  }
  return errors;
}
