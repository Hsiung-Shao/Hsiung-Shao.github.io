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
├── data/
│   └── projects.ts      # 專案資料
├── layouts/
│   └── Layout.astro     # 共用版面
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── projects.astro
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

## License

MIT
