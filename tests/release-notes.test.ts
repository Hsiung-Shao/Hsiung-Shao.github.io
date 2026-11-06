import { describe, expect, it } from 'vitest';

import { splitReleaseSections } from '../scripts/lib/release-notes.mjs';

const v183 = `## 修正

- **經典視窗編輯物品**：按 F2 切換中英時，物品預覽沒有跟著切換。
- **新介面**：按 F2 切換語言時，製作中的物品、未套用的輸入與開著的對話框會被清掉。
- **新介面計算頁**：「技能詳情」等標籤與數值相隔一大段，對不齊。
- **永恆珠寶**：查詢永恆珠寶與軍團珠寶計算器的征服者名，和物品上的不一致。（改依遊戲官方譯名）
- **查詢永恆珠寶下拉選單**：英勇的悲劇與深淵珠寶的征服者選項顯示英文。

## 新增

- **新介面配置頁**：滑鼠停在選項上會顯示 POB 的說明浮窗。（含切換後的數值變化）

## 調整

- **新介面浮窗**：計算細項、天賦節點、物品浮窗改為 POB 式外框，內容逐行照 POB。

說明：征服者譯名隨翻譯資料 data-21 一起更新。
`;

describe('版本說明拆段', () => {
  it('版本說明拆成修正、新增、調整三段', () => {
    const sections = splitReleaseSections(v183);
    expect(sections.map(s => s.title)).toEqual(['修正', '新增', '調整']);
    expect(sections.map(s => s.items.length)).toEqual([5, 1, 1]);
    expect(sections[0].items[0]).toBe('經典視窗編輯物品：按 F2 切換中英時，物品預覽沒有跟著切換。');
  });

  it('條目不留 ** 與開頭的 - ', () => {
    const items = splitReleaseSections(v183).flatMap(s => s.items);
    expect(items.every(item => !item.includes('**'))).toBe(true);
    expect(items.every(item => !item.startsWith('-'))).toBe(true);
  });

  it('結尾的說明段落不算進最後一段的條目', () => {
    const last = splitReleaseSections(v183).at(-1)!;
    expect(last.items).toHaveLength(1);
    expect(last.items.some(item => item.includes('data-21'))).toBe(false);
  });

  it('缺某一段時不產生空段', () => {
    const body = '## 修正\n\n- **甲**：第一條。\n- **乙**：第二條。\n';
    const sections = splitReleaseSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].title).toBe('修正');
    expect(sections[0].items).toHaveLength(2);
  });

  it('標題下沒有任何條目時不回傳該段', () => {
    const body = '## 修正\n\n- **甲**：第一條。\n\n## 新增\n\n說明：這次沒有新增。\n';
    expect(splitReleaseSections(body).map(s => s.title)).toEqual(['修正']);
  });

  it('縮排子項整行略過,不併入條目也不另成條目', () => {
    const body = '## 調整\n\n- **浮窗**：改為新外框。\n  - ⚠ 舊設定需重設\n- **選單**：新增排序。\n';
    const [section] = splitReleaseSections(body);
    expect(section.items).toEqual(['浮窗：改為新外框。', '選單：新增排序。']);
  });

  it('空字串回傳空陣列', () => {
    expect(splitReleaseSections('')).toEqual([]);
  });
});
