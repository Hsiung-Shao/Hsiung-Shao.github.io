/**
 * 把 GitHub release 的版本說明拆成「## 修正 / ## 新增 / ## 調整」這類段落,給首頁與產品頁的版本卡用。
 * 只收每段頂層的 `- ` 條目並去掉粗體記號;縮排的子項(多半是 ⚠ 補充)、段尾說明文字都不收,
 * 沒有條目的段不回傳,版本卡才不會出現空標題。
 */
export function splitReleaseSections(body) {
  const sections = [];
  let current = null;
  for (const line of (body ?? '').split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = { title: heading[1], items: [] };
      sections.push(current);
      continue;
    }
    if (current && line.startsWith('- ')) {
      current.items.push(line.slice(2).replaceAll('**', '').trim());
    }
  }
  return sections.filter(section => section.items.length > 0);
}
