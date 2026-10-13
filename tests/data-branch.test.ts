import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { pullData } from '../scripts/lib/data-branch.mjs';

const dataDir = join('/repo', 'src', 'data');
const FILES = ['releases.json', 'download-history.json'];

const contentOf: Record<string, string> = {
  'releases.json': '{"fetchedAt":"2026-10-14"}\n',
  'download-history.json': '[{"date":"2026-10-14","full":1}]\n',
};

/** 假的 git:fetch 與每個 git show 的行為可個別覆寫 */
function fakeRun({ fetchFails = false, missing = [] as string[] } = {}) {
  return vi.fn((cmd: string, args: string[]) => {
    if (cmd !== 'git') throw new Error(`unexpected command ${cmd}`);
    if (args[0] === 'fetch') {
      if (fetchFails) throw new Error('fatal: could not read from remote repository');
      return '';
    }
    if (args[0] === 'show') {
      const file = args[1].replace(/^FETCH_HEAD:/, '');
      if (missing.includes(file) || !(file in contentOf)) {
        throw new Error(`fatal: path '${file}' does not exist in 'FETCH_HEAD'`);
      }
      return contentOf[file];
    }
    throw new Error(`unexpected git ${args.join(' ')}`);
  });
}

function fakeFs(exists: boolean) {
  return { existsSync: vi.fn(() => exists), writeFileSync: vi.fn() };
}

describe('從 data 分支拉資料', () => {
  it('fetch 成功時寫入 data 分支的兩個檔', () => {
    const run = fakeRun();
    const fs = fakeFs(true);

    const result = pullData({ run, fs, env: {}, dataDir });

    expect(result.status).toBe('pulled');
    expect(run).toHaveBeenCalledWith('git', ['fetch', 'origin', 'data', '--depth=1']);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    for (const file of FILES) {
      expect(run).toHaveBeenCalledWith('git', ['show', `FETCH_HEAD:${file}`]);
      const call = fs.writeFileSync.mock.calls.find(([path]) => String(path).endsWith(file));
      expect(call, `${file} 應被寫入`).toBeDefined();
      expect(call![0]).toBe(join(dataDir, file));
      expect(call![1]).toBe(contentOf[file]);
    }
  });

  it('fetch 失敗但本機有檔時沿用並警告', () => {
    const fs = fakeFs(true);

    const result = pullData({ run: fakeRun({ fetchFails: true }), fs, env: {}, dataDir });

    expect(result.status).toBe('kept');
    expect(typeof result.warning).toBe('string');
    expect(result.warning!.length).toBeGreaterThan(0);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('fetch 失敗且本機沒檔時回報錯誤', () => {
    const fs = fakeFs(false);
    const call = () => pullData({ run: fakeRun({ fetchFails: true }), fs, env: {}, dataDir });

    expect(call).toThrow(/data/);
    expect(call).toThrow(/pull-data/);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('設定 SKIP_DATA_PULL 時不動任何檔', () => {
    const run = fakeRun();
    const fs = fakeFs(true);

    const result = pullData({ run, fs, env: { SKIP_DATA_PULL: '1' }, dataDir });

    expect(result.status).toBe('skipped');
    expect(run).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('data 分支缺其中一個檔時回報錯誤', () => {
    const fs = fakeFs(true);
    const call = () =>
      pullData({ run: fakeRun({ missing: ['download-history.json'] }), fs, env: {}, dataDir });

    expect(call).toThrow(/download-history\.json/);
  });
});
