const SHA_PATTERN = /^[0-9a-f]{7,40}$/i;

/**
 * head 是要讀到哪個 ref 為止。update-site 會傳 origin 的預設分支(例如 origin/main),
 * 本機 checkout 停在舊分支時也不會漏掉遠端已經有的 commit。
 */
export function selectLogRange(sinceSha, maxCount, isBaselineUsable, head = 'HEAD') {
  const limit = Number.isInteger(maxCount) && maxCount > 0 ? maxCount : 40;

  if (!sinceSha) {
    return { range: `-n ${limit}`, resetBaseline: false };
  }

  if (!SHA_PATTERN.test(sinceSha) || !isBaselineUsable(sinceSha)) {
    return { range: `-n ${limit}`, resetBaseline: true };
  }

  return { range: `${sinceSha}..${head}`, resetBaseline: false };
}
