const SHA_PATTERN = /^[0-9a-f]{7,40}$/i;

export function selectLogRange(sinceSha, maxCount, isBaselineUsable) {
  const limit = Number.isInteger(maxCount) && maxCount > 0 ? maxCount : 40;

  if (!sinceSha) {
    return { range: `-n ${limit}`, resetBaseline: false };
  }

  if (!SHA_PATTERN.test(sinceSha) || !isBaselineUsable(sinceSha)) {
    return { range: `-n ${limit}`, resetBaseline: true };
  }

  return { range: `${sinceSha}..HEAD`, resetBaseline: false };
}
