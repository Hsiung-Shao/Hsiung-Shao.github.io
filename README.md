# hsiung-shao.github.io

個人作品集網站，使用 Astro + React + Three.js 打造，部署於 GitHub Pages。

**Live:** https://hsiung-shao.github.io

## Tech Stack

| 類別 | 技術 |
|------|------|
| Framework | [Astro](https://astro.build) 5 |
| UI | [React](https://react.dev) 19 + [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4 |
| 3D | [Three.js](https://threejs.org) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) |
| Animation | [Framer Motion](https://www.framer.com/motion) |
| Deploy | [GitHub Pages](https://pages.github.com) + GitHub Actions |

## Pages

| 路徑 | 說明 |
|------|------|
| `/` | 首頁 — 3D Hero Scene、個人簡介、精選專案 |
| `/about` | 關於我 — 個人介紹、基本資訊、興趣、工作經歷、3D 技能球 |
| `/projects` | 專案作品 — 所有專案卡片（可展開詳情） |
| `/blog` | 開發部落格 — 開發筆記、技術案例與專案回顧 |
| `/activity` | 開發活動 — 從各專案整理的代表性進度 |
| `/now` | 目前動態 — 當前開發焦點與專案狀態 |
| `/support` | 贊助支持 — Buy Me a Coffee、Patreon 與揭露過的聯盟連結 |
| `/contact` | 聯絡方式 — Email、GitHub、Discord、X (Twitter)、留言表單 |

## Project Structure

```
src/
├── components/
│   ├── react/           # React 互動元件
│   │   ├── AllProjects.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── ProjectCard.tsx
│   │   └── TypeWriter.tsx
│   ├── three/           # Three.js 3D 元件
│   │   ├── HeroScene.tsx
│   │   └── SkillSphere.tsx
│   ├── AboutSection.astro
│   ├── ContactForm.astro
│   ├── Footer.astro
│   ├── HeroSection.astro
│   └── Navbar.astro
├── data/                # 專案、文章、活動與 Now 資料
├── layouts/
│   └── Layout.astro     # 共用版面
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── projects.astro
│   ├── blog/            # 文章列表與靜態文章頁
│   ├── activity.astro
│   ├── now.astro
│   └── contact.astro
└── styles/
    └── global.css
```

## Getting Started

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

## Deployment

推送到 `main` 分支後，GitHub Actions 會自動建置並部署到 GitHub Pages。

工作流程定義在 `.github/workflows/deploy.yml`。

## Content Workflow

- `src/data/projects.json` 保存專案狀態、公開層級與文章關聯。
- `src/data/posts.json` 保存文章；新內容預設應以草稿加入，人工確認後才發佈。
- `scripts/projects.config.json` 定義專案來源與內容政策。客戶專案只能使用 `technical-only`。
- `npm run validate-content` 檢查資料結構、文章關聯與客戶案例護欄。
- `npm run update-site` 掃描允許的 Git 專案並產生待審閱 digest。

## License

MIT
