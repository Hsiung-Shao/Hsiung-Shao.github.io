/**
 * 從 data 分支把 /poe 的下載數資料拉到 src/data/。
 *
 * 這兩個檔不進 main:deploy.yml 的 stats job 每天寫進 data 分支,建置與本機開發前由這裡拉回來。
 * git 與檔案操作由呼叫端注入,方便測試不碰真的 repo。
 */
import { join } from 'node:path';

export const DATA_FILES = ['releases.json', 'download-history.json'];

export function pullData({ run, fs, env, dataDir }) {
  // stats job 剛寫完新資料、還沒推上去時,再拉一次會被 data 分支的舊版蓋回
  if (env.SKIP_DATA_PULL) return { status: 'skipped' };

  try {
    run('git', ['fetch', 'origin', 'data', '--depth=1']);
  } catch (error) {
    const missing = DATA_FILES.filter(file => !fs.existsSync(join(dataDir, file)));
    if (missing.length > 0) {
      throw new Error(
        `拿不到 data 分支(${error.message}),本機也沒有 ${missing.join('、')}。` +
        '請確認網路正常、origin 上有 data 分支,再重跑 node scripts/pull-data.mjs。',
      );
    }
    return { status: 'kept', warning: `拿不到 data 分支,沿用本機上次拉到的資料(${error.message})` };
  }

  // 先全部讀完再寫,避免只寫一半留下新舊混雜的資料
  const contents = DATA_FILES.map(file => {
    try {
      return [file, run('git', ['show', `FETCH_HEAD:${file}`])];
    } catch (error) {
      throw new Error(`data 分支缺少 ${file}(${error.message})`);
    }
  });
  for (const [file, content] of contents) fs.writeFileSync(join(dataDir, file), content);
  return { status: 'pulled' };
}
