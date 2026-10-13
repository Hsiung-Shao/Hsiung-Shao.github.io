import { useState } from 'react';

import { mono, placeholder, segment, segmentGroup } from './mockupStyles';

const cell = { fontSize: 12 } as const;

/** ExileAppraiser 首屏示意:游標旁的查價面板,切到 PoE2 多一張靈魂之井 OCR 卡。價格與物品名一律佔位。 */
export default function ExileMockup() {
  const [poe2, setPoe2] = useState(true);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div role="group" aria-label="切換遊戲版本" style={{ ...segmentGroup, justifySelf: 'end' }}>
        <button type="button" aria-pressed={!poe2} onClick={() => setPoe2(false)} style={segment(!poe2)}>PoE1</button>
        <button type="button" aria-pressed={poe2} onClick={() => setPoe2(true)} style={segment(poe2)}>PoE2</button>
      </div>
      <div style={{ position: 'relative', borderRadius: 10, border: '1px solid var(--p-line)', background: 'var(--p-deep)', minHeight: 380, padding: '44px 20px 20px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
        <span style={{ ...mono, position: 'absolute', top: 14, left: 16 }}>{poe2 ? 'Path of Exile 2' : 'Path of Exile'}</span>
        <div style={{ position: 'relative', width: 160, borderRadius: 6, border: '1px solid var(--p-line-strong)', background: 'var(--p-bar)', padding: 12, display: 'grid', gap: 4 }}>
          <span style={{ fontFamily: 'var(--p-serif)', fontSize: 14, color: 'var(--p-rare)' }}>[物品名稱]</span>
          <span style={placeholder}>[物品基底]</span>
          <span style={{ fontSize: 12, color: 'var(--p-mod)' }}>+92 最大生命</span>
          <span style={{ fontSize: 12, color: 'var(--p-mod)' }}>+38% 火焰抗性</span>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', right: -10, bottom: -12 }}>
            <path d="M4 2 L4 20 L9 15 L12 22 L15 21 L12 14 L19 14 Z" fill="var(--p-ink)" stroke="var(--p-bg)" strokeWidth="1.5" />
          </svg>
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 0, borderRadius: 8, border: '1px solid var(--p-accent)', background: 'var(--p-surface)', padding: 14, display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>交易站查價</span>
            <span style={{ ...mono, padding: '2px 8px', borderRadius: 4, background: 'var(--p-surface-2)', color: 'var(--p-ink)' }}>Ctrl+D</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '4px 8px' }}>
            <span style={placeholder}>價格</span><span style={placeholder}>物品等級</span><span style={placeholder}>刊登</span>
            {[0, 1, 2].map(row => (
              <span key={row} style={{ display: 'contents' }}>
                <span style={cell}>[價格]</span><span style={cell}>[等級]</span><span style={cell}>[時間]</span>
              </span>
            ))}
          </div>
        </div>
        {poe2 && (
          <div style={{ flex: '1 1 100%', borderRadius: 8, border: '1px dashed var(--p-line-strong)', background: 'var(--p-bar)', padding: 14, display: 'grid', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>靈魂之井 · 三選一（OCR 辨識）</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {[0, 1, 2].map(slot => (
                <div key={slot} style={{ padding: 8, borderRadius: 5, background: 'var(--p-surface-2)', fontSize: 12, display: 'grid', gap: 2 }}>
                  <span>[褻瀆詞綴]</span>
                  <span style={{ fontFamily: 'var(--p-mono)', color: 'var(--p-accent)' }}>T[n] · [範圍]</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
