# hsiung-shao.github.io

熊少愆的個人網站：Path of Exile 繁中工具、多平台直播觀看網站、AI 音樂，還有寫這些東西時的筆記。用 Astro 靜態輸出，部署在 GitHub Pages。

**Live:** https://hsiung-shao.github.io

## Tech Stack

| 類別 | 技術 |
|------|------|
| Framework | [Astro](https://astro.build) 5（靜態輸出，沒有前端框架島嶼） |
| Styling | 自寫 CSS 設計系統（`src/styles/site.css`），舊頁面暫時沿用 Tailwind CSS 4 與 `global.css` |
| Content | JSON 資料 + Markdown（[marked](https://marked.js.org)） |
| Test | [Vitest](https://vitest.dev) |
| Deploy | [GitHub Pages](https://pages.github.com) + GitHub Actions |

## Pages

| 路徑 | 說明 |
|------|------|
| `/` | 首頁：最新版本、三個 PoE 工具、其他專案、最近活動與文章 |
| `/projects/<slug>` | 專案介紹頁：PobTools、Poe Market zh、ExileAppraiser、MultiStream Hub、Kumori Music |
| `/downloads` | 三個 PoE 工具的下載數、每日新增長條圖與最近幾版的更新內容 |
| `/projects` | 全部專案列表 |
| `/blog` | 使用教學與開發筆記 |
| `/activity` | 從各專案 Git 紀錄整理的活動 |
| `/now` | 目前在做的事 |
| `/about`、`/resume` | 關於我、履歷 |
| `/support`、`/contact` | 贊助、聯絡方式 |

舊網址 `/poe`、`/poe/<slug>`、`/concepts/*` 會轉到新頁（`astro.config.mjs` 的 `redirects`）。

## Project Structure

```
src/
├── assets/products/     # 介紹頁截圖（astro:assets 轉檔）
├── components/
│   ├── Home.astro       # 首頁內容
│   ├── ProductPage.astro# 介紹頁，依 products.json 的段落型別排版
│   ├── ReleaseCard.astro# 版本卡（修正／新增／調整）
│   ├── Navbar.astro、Footer.astro、Analytics.astro、ContactForm.astro
├── data/                # 專案、介紹頁、文章、活動、Now、下載數口徑
├── layouts/Layout.astro # 共用版面
├── pages/
│   ├── index.astro、downloads.astro、projects.astro
│   ├── projects/[slug].astro
│   ├── blog/            # 文章列表與文章頁
│   └── about、activity、now、resume、support、contact
└── styles/
    ├── site.css         # 新版設計系統
    └── global.css       # 舊頁面用的樣式，第二階段改完後刪除
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
- `src/data/products.json` 保存五個介紹頁的文案、數字口徑與截圖路徑。
- `src/data/posts.json` 保存文章；新內容預設應以草稿加入，人工確認後才發佈。
- `scripts/projects.config.json` 定義專案來源與內容政策。客戶專案只能使用 `technical-only`。
- `npm run validate-content` 檢查資料結構、文章關聯與客戶案例護欄。
- `npm run update-site` 掃描允許的 Git 專案並產生待審閱 digest。

## License

MIT
