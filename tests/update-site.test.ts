import { describe, expect, it, vi } from 'vitest';

import { selectLogRange } from '../scripts/lib/git-history.mjs';

describe('網站 Git 日誌同步範圍', () => {
  it('使用仍存在的同步基準，只讀取基準後的新 commit', () => {
    const commitExists = vi.fn(() => true);

    expect(selectLogRange('a'.repeat(40), 40, commitExists)).toEqual({
      range: `${'a'.repeat(40)}..HEAD`,
      resetBaseline: false,
    });
  });

  it('同步基準已因歷史重寫消失時，有限回溯最新 commit', () => {
    const commitExists = vi.fn(() => false);

    expect(selectLogRange('b'.repeat(40), 40, commitExists)).toEqual({
      range: '-n 40',
      resetBaseline: true,
    });
  });

  it('拒絕格式異常的基準值並有限回溯', () => {
    const commitExists = vi.fn();

    expect(selectLogRange('--all', 20, commitExists)).toEqual({
      range: '-n 20',
      resetBaseline: true,
    });
    expect(commitExists).not.toHaveBeenCalled();
  });

  it('指定 origin 預設分支時讀到遠端 ref,本機停在舊分支也不會漏', () => {
    const commitExists = vi.fn(() => true);

    expect(selectLogRange('c'.repeat(40), 40, commitExists, 'origin/main')).toEqual({
      range: `${'c'.repeat(40)}..origin/main`,
      resetBaseline: false,
    });
  });
});
