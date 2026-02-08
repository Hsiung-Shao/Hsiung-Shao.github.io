# POE Build Viewer

> Path of Exile 流派配置分享平台

## 專案簡介

**POE Build Viewer** 是一個專為 Path of Exile (POE) 玩家設計的 Web 應用程式，用於解碼並可視化 Path of Building (POB) 匯出的角色配置。本專案的目標是取代傳統的 Google Excel 分享方式，提供更直觀、美觀且無人數限制的流派分享體驗。

### 核心功能

| 功能 | 說明 |
|------|------|
| 🔓 **POB 解碼** | 支援貼上 POB code 自動解碼並解析角色配置 |
| ⚔️ **裝備展示** | 完整顯示所有裝備、藥劑、珠寶及其詞綴 |
| 💎 **技能配置** | 展示技能寶石組合，包含等級、品質與中英對照翻譯 |
| 📊 **角色屬性** | 顯示生命、魔力、能量護盾、抗性、DPS 等關鍵數據 |
| 🌳 **天賦樹** | 被動技能樹連結（渲染功能開發中） |
| ⭐ **詞綴標記** | 可標記裝備上的重要詞綴 |
| 🔗 **交易連結** | 自動生成 POE Trade 搜尋連結 |
| 🈶 **繁體中文** | 完整的中文化翻譯系統 |

---

## 技術架構

### 技術棧總覽

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Next.js   │  │    React    │  │      TypeScript         │  │
│  │    14.x     │  │    18.x     │  │         5.x             │  │
│  │ (App Router)│  │             │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                         Styling                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    TailwindCSS 3.x                          ││
│  │              + 自定義 POE 主題設計系統                       ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                      State & Logic                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Zustand   │  │    Pako     │  │    fast-xml-parser      │  │
│  │ 狀態管理     │  │  Zlib 解壓   │  │     XML 解析            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                        Data Sources                              │
│  ┌─────────────────────┐  ┌───────────────────────────────────┐ │
│  │   GGPK 遊戲資料      │  │      POE CDN / poe.ninja API     │ │
│  │  翻譯 + 技能資訊      │  │       圖示資源                    │ │
│  └─────────────────────┘  └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 核心依賴

| 套件 | 版本 | 用途 |
|------|------|------|
| `next` | ^14.2.5 | React 元框架，使用 App Router |
| `react` | ^18.2.0 | UI 框架 |
| `typescript` | ^5.4.5 | 靜態型別檢查 |
| `pako` | ^2.1.0 | Zlib DEFLATE 解壓縮 |
| `fast-xml-parser` | ^4.3.6 | XML 轉 JSON 解析 |
| `zustand` | ^4.5.2 | 輕量狀態管理 |
| `tailwindcss` | ^3.4.4 | CSS 框架 |

### POB 解碼流程

```
POB Code (Base64 URL-safe)
         │
         ▼
┌─────────────────────┐
│  Base64 URL 解碼    │  ← 替換 - → + 和 _ → /
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Zlib DEFLATE 解壓  │  ← pako.inflate()
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│    XML 字串解析     │  ← fast-xml-parser
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   TypeScript 物件   │  → UI 元件渲染
└─────────────────────┘
```

---

## 專案結構

```
poe-build/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # 首頁（POB 輸入 + Build 顯示）
│   │   ├── layout.tsx            # 根佈局
│   │   └── globals.css           # 全域樣式
│   │
│   ├── components/               # React 元件
│   │   ├── BuildViewer.tsx       # 主要 Build 檢視器（標籤頁導航）
│   │   ├── PobDecoder.tsx        # POB code 輸入與解碼
│   │   ├── Equipment.tsx         # 裝備顯示（含 Flask、Jewel）
│   │   ├── EquipmentNote.tsx     # 裝備註解功能
│   │   ├── CustomItem.tsx        # 自訂裝備編輯
│   │   ├── Skills.tsx            # 技能寶石配置
│   │   ├── Stats.tsx             # 角色屬性面板
│   │   ├── PassiveTree.tsx       # 被動技能樹
│   │   ├── TradeLink.tsx         # POE Trade 連結生成
│   │   ├── SkillIcon.tsx         # 技能圖示元件
│   │   └── ItemIcon.tsx          # 裝備圖示元件
│   │
│   ├── lib/                      # 核心邏輯
│   │   ├── pob-decoder.ts        # POB 解碼實作
│   │   ├── item-parser.ts        # 裝備文字解析
│   │   ├── trade-link.ts         # POE Trade URL 生成
│   │   ├── translations.ts       # 翻譯系統（含特殊 ID 映射）
│   │   ├── skill-icons.ts        # 技能圖示服務
│   │   └── item-icons.ts         # 裝備圖示服務
│   │
│   ├── hooks/                    # React Hooks
│   │   └── useTranslations.ts    # 翻譯載入 Hook
│   │
│   ├── types/                    # TypeScript 型別
│   │   └── pob.ts                # POB 資料結構定義
│   │
│   └── store/                    # 狀態管理
│       └── build-store.ts        # Zustand store
│
├── data/                         # 遊戲資料
│   ├── tables/                   # GGPK 匯出資料
│   │   ├── BaseItemTypes.json    # 物品基礎類型
│   │   ├── ActiveSkills.json     # 主動技能
│   │   ├── SkillGems.json        # 技能寶石
│   │   ├── GrantedEffects.json   # 技能效果
│   │   └── ...                   # 其他遊戲資料表
│   │
│   └── skilltree-export/         # 天賦樹資料
│       ├── data.json             # 完整天賦樹資料 (~151K 行)
│       ├── assets/               # 天賦樹圖片資源
│       └── README.md             # GGG 官方說明
│
├── docs/                         # 專案文件
├── public/                       # 靜態資源
├── scripts/                      # 工具腳本
│
├── tailwind.config.ts            # Tailwind 配置 + POE 主題
├── next.config.js                # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 專案依賴
```

---

## 元件架構

```
                    ┌─────────────────┐
                    │      Home       │
                    │   (page.tsx)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌────────────┐  ┌───────────────┐  ┌───────────┐
     │ PobDecoder │  │  BuildViewer  │  │   Error   │
     │ (輸入解碼)  │  │  (主檢視器)   │  │  Display  │
     └────────────┘  └───────┬───────┘  └───────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   ┌───────────┐       ┌───────────┐       ┌───────────┐
   │   Stats   │       │   Skills  │       │ Equipment │
   │ (角色屬性) │       │ (技能配置) │       │  (裝備)   │
   └───────────┘       └─────┬─────┘       └─────┬─────┘
                             │                   │
                      ┌──────┴──────┐     ┌──────┴──────┐
                      ▼             ▼     ▼             ▼
               ┌───────────┐ ┌───────────┐ ┌───────────┐
               │ SkillIcon │ │ ItemIcon  │ │ TradeLink │
               └───────────┘ └───────────┘ └───────────┘
```

---

## 翻譯系統

本專案整合 POE GGPK 遊戲資料，提供完整的翻譯支援：

### 資料來源

- `BaseItemTypes.json` - 物品基礎類型翻譯
- `ActiveSkills.json` - 主動技能翻譯
- `SkillGems.json` - 技能寶石資訊
- `GrantedEffects.json` - 技能效果對應
- `Characters.json` - 職業翻譯
- `Ascendancy.json` - 昇華職業翻譯

### 特殊 ID 映射

POB 使用的 skillId 與遊戲內的 BaseItemTypes ID 存在差異，專案內建 50+ 個特殊映射處理：

```typescript
// 範例映射
'SupportArrogance'     → 'SupportBloodMagic'     // 傲慢輔助
'SupportInspiration'   → 'SupportReducedMana'    // 啟發輔助
'SupportFasterAttacks' → 'SupportFasterAttack'   // 快速攻擊輔助
```

---

## 開發指南

### 環境需求

- Node.js 18.x 或更高版本
- npm 或 pnpm

### 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm run start
```

### 開發伺服器

開發伺服器啟動後，訪問 `http://localhost:3000`

---

## 開發進度

### ✅ 已完成功能

- [x] POB code 解碼（Base64 + Zlib + XML）
- [x] 裝備解析與顯示（含稀有度視覺）
- [x] 技能寶石配置（中英對照翻譯）
- [x] 角色屬性面板
- [x] 重要詞綴標記功能
- [x] POE Trade 交易連結生成
- [x] 技能寶石圖示
- [x] 裝備/藥劑/珠寶圖示
- [x] POE 主題 UI 設計

### 🚧 開發中

- [ ] 天賦樹完整渲染
- [ ] 天賦搜尋功能

### 📋 規劃中

- [ ] Build 分享連結
- [ ] 用戶登入/收藏
- [ ] DPS 計算
- [ ] POE 2 支援

---

## 授權聲明

Path of Exile® 是 Grinding Gear Games 的商標。

本專案為非官方社群工具，與 Grinding Gear Games 無關聯。
