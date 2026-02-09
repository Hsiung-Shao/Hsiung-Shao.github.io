export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  category: 'backend' | 'fullstack' | 'frontend' | 'tool';
  highlights: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    id: 'multistream-hub',
    title: 'MultiStream Hub',
    description: '免費的多平台直播串流觀看工具，支援同時觀看多個 Twitch 和 YouTube 直播。',
    longDescription:
      '一個純前端架構的多平台直播觀看工具，支援 Twitch 與 YouTube 同時觀看，提供多種布局模式（單螢幕、分割、網格、側邊聊天）、聊天室整合、收藏系統與多語言支援（繁中、簡中、英文、日文、韓文）。資料儲存於瀏覽器本地，注重使用者隱私。部署於 Cloudflare Pages。',
    tech: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Shadcn/UI', 'Zustand', 'TanStack Query', 'i18next'],
    category: 'frontend',
    link: 'https://multistreaming.org',
    highlights: [
      '多平台串流 — Twitch / YouTube 同時觀看',
      '多種布局 — 單螢幕、分割、網格、側邊聊天等模式',
      '收藏系統 — 多標籤管理、分類資料夾、匯入/匯出',
      '多語言支援 — 繁中、簡中、英文、日文、韓文',
    ],
  },
  {
    id: 'legacy-erp',
    title: '企業 ERP 系統（PHP）',
    description: '基於 PHP 開發的企業進銷存管理系統，整合多個電商平台訂單匯入與報表匯出。',
    longDescription:
      '獨立開發的企業級進銷存管理系統，涵蓋訂單、進貨、產品、客戶、廠商及財務報表等核心業務模組。支援多個第三方電商平台的訂單資料匯入，並提供多種格式的 Excel 報表匯出功能。',
    tech: ['PHP 8', 'MySQL', 'Bootstrap 5', 'jQuery', 'Chart.js', 'PhpSpreadsheet'],
    category: 'backend',
    highlights: [
      '訂單管理 — 多平台電商訂單匯入',
      '庫存管理 — 安全庫存警示與產品組合包',
      '報表匯出 — 多種 Excel 報表格式',
      '第三方整合 — 串接多個電商平台 API',
    ],
  },
  {
    id: 'modern-erp',
    title: '新版 ERP 系統（React）',
    description: '以 React + Supabase 全端架構重寫的現代化進銷存管理系統。',
    longDescription:
      '以現代前端框架重新打造的企業管理系統，提供更流暢的使用者體驗與即時資料同步。採用 React 19 + TypeScript + Supabase 架構，具備完整的權限控管與資料安全機制。',
    tech: ['React 19', 'TypeScript', 'Supabase', 'TailwindCSS', 'shadcn/ui', 'Vite', 'Vercel'],
    category: 'fullstack',
    highlights: [
      '全端架構 — React + Supabase BaaS',
      '即時同步 — PostgreSQL + Realtime 訂閱',
      '型別安全 — TypeScript + Zod Schema 驗證',
      'Excel 匯出 — ExcelJS 報表生成功能',
    ],
  },
  {
    id: 'poe-build-viewer',
    title: 'POE Build Viewer',
    description: 'Path of Exile 流派配置分享平台，解碼 POB code 並可視化角色配置。',
    longDescription:
      '專為 POE 玩家設計的 Web 應用程式，用於解碼並可視化 Path of Building 匯出的角色配置。取代傳統的 Google Excel 分享方式，提供更直觀、美觀且無人數限制的流派分享體驗。',
    tech: ['Next.js 14', 'TypeScript', 'Zustand', 'TailwindCSS', 'Pako', 'fast-xml-parser'],
    category: 'frontend',
    highlights: [
      'POB 解碼 — Base64 + Zlib + XML 完整解析',
      '裝備展示 — 含稀有度視覺與詞綴標記',
      '繁體中文 — 整合 GGPK 遊戲資料翻譯',
      'Trade 連結 — 自動生成 POE 交易搜尋',
    ],
  },
  {
    id: 'discord-bot',
    title: 'Discord Bot',
    description: '多功能 Discord 機器人，整合遊戲新聞爬蟲、伺服器管理與自動備份。',
    longDescription:
      '基於 discord.py 開發的多功能 Discord 機器人，包含遊戲伺服器管理（Minecraft、7DTD）、遊戲新聞爬蟲（FF14、Valorant、LoL）、Twitter 追蹤、自動備份系統等功能。採用 Cog 模組化架構設計。',
    tech: ['Python', 'discord.py', 'APScheduler', 'BeautifulSoup4', 'aiohttp', 'Cloudflare Tunnel'],
    category: 'tool',
    highlights: [
      '伺服器管理 — RCON 控制 Minecraft/7DTD',
      '新聞爬蟲 — FF14、BD2、Valorant 自動追蹤',
      'Twitter 追蹤 — Twikit 即時推文通知',
      '自動備份 — APScheduler 定時壓縮備份',
    ],
  },
];

export const featuredProjects = projects.slice(0, 3);
