import { useState } from 'react';

import { bar, englishText, frame, modText, mono, segment, segmentGroup } from './mockupStyles';

// 詞綴譯名取自 GGPK 官方繁中(stat_descriptions);移動速度那條依同句型推得,只作示意。
const MODS = [
  { zh: '+92 最大生命', en: '+92 to maximum Life' },
  { zh: '+38% 火焰抗性', en: '+38% to Fire Resistance' },
  { zh: '增加 30% 移動速度', en: '30% increased Movement Speed' },
];

/** Poe Market zh 首屏示意:切換擴充介面語言與詞綴雙語顯示。 */
export default function MarketMockup() {
  const [zh, setZh] = useState(true);
  const [bilingual, setBilingual] = useState(true);

  return (
    <div style={frame}>
      <div style={bar}>
        <span style={mono}>pathofexile.com/trade</span>
        <div role="group" aria-label="擴充介面語言" style={segmentGroup}>
          <button type="button" aria-pressed={zh} onClick={() => setZh(true)} style={segment(zh)}>中文</button>
          <button type="button" aria-pressed={!zh} onClick={() => setZh(false)} style={segment(!zh)}>English</button>
        </div>
      </div>
      <div style={{ padding: 20, display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--p-serif)', fontWeight: 600, fontSize: 15 }}>{zh ? '詞綴篩選' : 'Stat Filters'}</span>
          <span style={mono}>{zh ? 'PoE1 20,000+ 條對照' : 'official English'}</span>
        </div>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--p-muted)' }}>{zh ? '搜尋詞綴（中英皆可）' : 'Search stat'}</span>
          <input
            type="text"
            value="phy gem"
            readOnly
            style={{ minHeight: 42, padding: '0 12px', borderRadius: 6, border: '1px solid var(--p-accent)', background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--p-mono)', fontSize: 14 }}
          />
        </label>
        <div style={{ borderRadius: 6, background: 'var(--p-surface-2)', padding: '10px 12px', display: 'grid', gap: 2 }}>
          <span style={{ fontSize: 14 }}>{zh ? '全部物理法術技能寶石等級 +#' : '+# to Level of all Physical Spell Skill Gems'}</span>
          {zh && <span style={englishText}>(+# to Level of all Physical Spell Skill Gems)</span>}
        </div>
        <div style={{ borderTop: '1px solid var(--p-line)', paddingTop: 16, display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--p-quiet)' }}>{zh ? '搜尋結果 · 詞綴' : 'Results · mods'}</span>
            {zh && (
              <button
                type="button"
                aria-pressed={bilingual}
                onClick={() => setBilingual(!bilingual)}
                style={{ display: 'flex', gap: 8, alignItems: 'center', minHeight: 34, padding: '0 10px', border: '1px solid var(--p-line-strong)', borderRadius: 6, background: 'transparent', color: 'var(--p-muted)', fontSize: 12, cursor: 'pointer' }}
              >
                <span aria-hidden="true" style={{ position: 'relative', width: 28, height: 16, borderRadius: 8, background: bilingual ? 'var(--p-accent)' : 'var(--p-line-strong)' }}>
                  <span style={{ position: 'absolute', top: 2, left: bilingual ? 14 : 2, width: 12, height: 12, borderRadius: 6, background: 'var(--p-bg)' }} />
                </span>
                詞綴雙語顯示
              </button>
            )}
          </div>
          {MODS.map(mod => (
            <div key={mod.en} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px', borderRadius: 6, background: 'var(--p-bg)' }}>
              <div style={{ flex: '1 1 auto', minWidth: 0, display: 'grid' }}>
                <span style={modText}>{zh ? mod.zh : mod.en}</span>
                {zh && bilingual && <span style={englishText}>{mod.en}</span>}
              </div>
              <span aria-hidden="true" style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: 5, border: '1px solid var(--p-line-strong)' }}>＋</span>
              <span aria-hidden="true" style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: 5, border: '1px solid var(--p-line-strong)' }}>−</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
