import { useState } from 'react';

import { bar, frame, modText, mono, placeholder, segment, segmentGroup } from './mockupStyles';

// 繁中分頁名取自 PobTools 新介面;简中與韓文沒有可查證的實際畫面,維持方括號佔位。
const LANGS = [
  { id: 'tc', label: '繁中', tabs: ['天賦樹', '物品', '技能', '計算'], mods: ['+92 最大生命', '+38% 火焰抗性', '全部物理法術技能寶石等級 +1'], status: '介面：繁體中文' },
  { id: 'sc', label: '简中', tabs: ['[天赋树]', '[物品]', '[技能]', '[计算]'], mods: ['[简中词缀]', '[简中词缀]', '[简中词缀]'], status: '[界面：简体中文]' },
  { id: 'kr', label: '한국어', tabs: ['[패시브]', '[아이템]', '[스킬]', '[계산]'], mods: ['[한국어 옵션]', '[한국어 옵션]', '[한국어 옵션]'], status: '[인터페이스: 한국어]' },
  { id: 'en', label: 'English', tabs: ['Tree', 'Items', 'Skills', 'Calcs'], mods: ['+92 to maximum Life', '+38% to Fire Resistance', '+1 to Level of all Physical Spell Skill Gems'], status: 'Interface: English' },
];

/** PobTools 首屏示意:切換 POB 介面語言。 */
export default function PobMockup() {
  const [current, setCurrent] = useState('tc');
  const view = LANGS.find(lang => lang.id === current)!;

  return (
    <div style={frame}>
      <div style={bar}>
        <span style={mono}>pob-zh.exe</span>
        <div role="group" aria-label="POB 介面語言" style={segmentGroup}>
          {LANGS.map(lang => (
            <button key={lang.id} type="button" aria-pressed={lang.id === current} onClick={() => setCurrent(lang.id)} style={segment(lang.id === current)}>
              {lang.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: 20, display: 'grid', gap: 14 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {view.tabs.map((tab, index) => (
            <span key={tab} style={{ padding: '6px 12px', borderRadius: 5, background: index === 1 ? 'var(--p-surface-2)' : 'transparent', border: '1px solid var(--p-line)', fontSize: 13, color: index === 1 ? 'var(--p-ink)' : 'var(--p-muted)' }}>{tab}</span>
          ))}
        </div>
        <div style={{ borderRadius: 6, background: 'var(--p-bg)', border: '1px solid var(--p-line)', padding: 16, display: 'grid', gap: 6 }}>
          <span style={{ fontFamily: 'var(--p-serif)', fontWeight: 600, color: 'var(--p-rare)' }}>[物品名稱]</span>
          <span style={placeholder}>[物品基底]</span>
          <div style={{ height: 1, background: 'var(--p-line)', margin: '6px 0' }} />
          {view.mods.map((mod, index) => <span key={`${mod}-${index}`} style={modText}>{mod}</span>)}
        </div>
        <span style={mono}>{view.status}</span>
      </div>
    </div>
  );
}
