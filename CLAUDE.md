# CLAUDE.md

個人作品集網站,Astro 5 靜態輸出 + React 19 島嶼 + Three.js,部署於 GitHub Pages。
專案結構與頁面清單見 [README.md](README.md) 與 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md);
這份文件只寫「動手前必須知道、但從程式碼看不出來」的部分。

## 1. 隱私鐵律(唯一不能破的規則)

**客戶／受保護專案的身分,不得出現在任何會被建置進網站的內容中。**

這個站公開展示的是工程方法,不是客戶是誰。具體要求:

- 受保護專案在 `src/data/projects.json` 一律用去識別化代號
  (現有的是 `protected-management-platform`、`protected-commerce-site`),
  且 `visibility: protected` + `status: client`,**不得有 `link`**——客戶站網址本身就是身分。
- 受保護專案的文章只能是 `type: case-study`,內容只談可複用的工程決策。
- `activity.json` 中 `tier: protected` 的條目,摘要不得帶出客戶名、網域或可反查的細節。

### 客戶真名放哪裡

**這個 repo 是公開的,所以真名不在裡面。** `scripts/projects.config.json` 存的是
去識別化代號(`protected-commerce-site`、`protected-management-platform`),
它們的 `path` 指向不存在的目錄,`update-site.mjs` 會印「略過(非 git repo)」跳過。

隱私掃描要比對的真名來自兩個來源,依序合併:

| 來源 | 用在哪 | 說明 |
|---|---|---|
| 環境變數 `PROTECTED_TERMS`(逗號分隔) | CI | 由 GitHub secret 注入,已接在 `ci.yml` 與 `deploy.yml` |
| `scripts/protected-terms.local.json`(字串陣列) | 本機 | 在 `.gitignore` 裡,**絕對不要 commit** |

兩個來源都沒有時的行為,依路徑而不同:

- **部署(`deploy.yml`)**:設了 `REQUIRE_PROTECTED_TERMS=1`,**直接讓建置失敗**。
  這條路徑無人值守,secret 若被誤刪只印警告的話沒人會看到,護欄會靜默退化成
  只檢查本機路徑而網站照常上線。寧可紅燈也不要假的綠燈。
- **PR 檢查(`ci.yml`)與本機**:只印警告、掃描降級,不失敗。
  GitHub 不會把 secret 傳給 fork 送出的 PR,硬失敗會讓外部 PR 永遠是紅的。

看到那行警告就表示客戶名沒有被實際比對過——不要當成通過。

### 護欄實作

`scripts/lib/content-policy.mjs`,同時被兩處使用,確保不會只剩一邊:

| 位置 | 時機 | 作用 |
|---|---|---|
| `scripts/validate-content.mjs` | `npm run build` 前 | 掃到洩漏就中止建置,永遠上不了線 |
| `tests/content-policy.test.ts` | `npm test` | 用反例證明掃描器真的抓得到,不是空轉 |

掃描範圍是 `src/` 與 `public/`,比對真名(含去掉網域後綴的變體)與本機路徑樣式。
**刻意不掃 `scripts/`**——本機真名檔在那裡,掃它等於自我矛盾。

## 2. 指令

```bash
npm run dev              # 開發伺服器
npm test                 # vitest,39 個測試
npm run validate-content # 內容護欄(隱私掃描 + 資料結構),build 會自動先跑
npm run build            # validate-content + astro build
npm run typecheck        # astro check —— 目前有 2 個既有錯誤,見 §4
npm run update-site      # 掃描允許的專案 Git 紀錄,產生待審 digest(不自動發布)
```

沒有 lint。

## 3. 內容工作流

資料驅動,頁面只是呈現層:

- `src/data/projects.json` — 專案卡片、狀態、公開層級、文章關聯
- `src/data/posts.json` — 文章;`src/data/posts.ts` 會用 `?raw` 把
  `src/data/guides/*.md` 的內容**蓋進** 5 篇教學文的 `body`,
  改教學內容要改 markdown 檔,不是改 posts.json 的 body
- `src/data/activity.json` — 跨專案活動;`activity.astro` 自己排序,JSON 順序無所謂
- `src/data/now.json` — 目前動態,版面上限 6 個專案

**新內容一律先以 `draft: true` 加入,人工確認後才發佈。**
`update-site.mjs` 只產生待審 digest,不會自己改內容。

`validate-content.mjs` 裡有一批寫死的內容契約(必備教學文、Kumori Music 的頻道與首發連結、
贊助頁的指定連結)。這些是刻意的——它們是對外承諾過的東西,改動前先確認不是誤刪。

## 4. 已知狀況

- **死碼**:`src/components/HeroSection.astro`、`src/components/AboutSection.astro`、
  `src/components/three/HeroScene.tsx`、`src/components/three/SkillSphere.tsx`
  沒有被任何頁面引用(舊版首頁殘留)。`astro check` 那 2 個型別錯誤
  (`bufferAttribute` 缺 `args`)都在其中,所以 CI 的 typecheck job 掛的是
  `continue-on-error: true`。清掉死碼或補好 `args` 之後,把那行刪掉轉成硬性 gate。
- **Three.js 元件不進單元測試**:jsdom 沒有 WebGL context。
  `SpatialScene.astro` 與 `three/` 底下的東西要用實際瀏覽器驗證。
- **CI 分兩條**:`ci.yml`(PR 進 main 時跑 validate + test + build)與
  `deploy.yml`(push main 後建置並部署)。

## 5. 本機環境陷阱

Windows 11 + PowerShell 5.1 + Git Bash:

- **含中文的檔案一律用 Write/Edit 工具寫**,不要用 PowerShell 的
  `Get-Content` + `-replace` + `Set-Content`(PS5.1 會用 cp950 解讀無 BOM 的 UTF-8,
  中文全毀且不可逆),也不要用 Bash heredoc(會把 `\\` 折成 `\`)。
- **驗證建置不要 pipe**:`npm run build | tail` 會讓失敗的退出碼被 tail 的 0 蓋掉。
  要縮短輸出就先導檔再 tail,或用 `${PIPESTATUS[0]}` 取真實退出碼。

## 6. 測試邊界

測試基線只涵蓋機器能穩定判定的事:內容護欄、資料層不變式、React 元件 render 不炸。
**視覺、動畫、3D 場景不在此列**,改到那些東西要在瀏覽器實際看過才算完成。

不要為了覆蓋率補測試。新增測試前先問:這條測的是「改壞了會出事」的東西嗎?
