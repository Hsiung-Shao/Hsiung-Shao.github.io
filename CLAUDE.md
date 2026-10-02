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
npm test                 # vitest,43 個測試
npm run validate-content # 內容護欄(隱私掃描 + 資料結構),build 會自動先跑
npm run build            # validate-content + astro build
npm run typecheck        # astro check —— 目前有 2 個既有錯誤,見 §5
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

## 4. Git Log 同步交接

### 4.1 各檔案的責任

| 檔案 | 責任 | 是否提交 |
|---|---|---|
| `scripts/projects.config.json` | 可掃描的 repo、路徑、狀態與內容政策 | 是 |
| `scripts/.lastrun.json` | 每個 repo 上次完成同步的 commit SHA | 否,已 gitignore |
| `scripts/pending-digest.md` | `update-site` 產生的待審 commit 摘要與下一版基準 | 否,已 gitignore |
| `src/data/activity.json` | 已審核、會顯示在活動日誌的代表性工程進度 | 是 |
| `src/data/now.json` | 「現在進行式」摘要,最多 6 個專案 | 是 |
| `src/data/posts.json`、`src/data/guides/*.md` | 有獨立教學價值時才新增或更新的文章 | 是 |

`.lastrun.json` 只是游標,不是公開內容來源。不要先推進游標再整理內容,否則下一次掃描會把
尚未寫入網站的 commit 當成已處理。也不要把 `.lastrun.json` 或 `pending-digest.md` 強制加入 Git。

### 4.2 每次同步的執行順序

1. 先跑 `git status --short --branch`,保留使用者現有變更,不可用 reset 或 checkout 清掉。
2. 檢查 `scripts/projects.config.json`。公開專案的 `path` 必須指向實際 repo；
   `contentPolicy: disabled` 的專案不會掃描；protected 代號的不存在路徑是刻意的隱私設計。
3. 跑 `npm run update-site`。它只讀 Git 並生成 `scripts/pending-digest.md`,不會自動發布內容。
4. 閱讀 digest,先用專案名、功能關鍵字與短 SHA 搜尋 `src/data/activity.json`,排除已發布內容。
5. 每個專案挑 1-3 則具有代表性的進度。把同一功能的一組 commit 合併為一則活動,
   不要把每個 commit 逐筆倒進頁面；保留實際相關的 7 字元短 SHA。
6. 更新 `activity.json`；只有仍在進行或維護中的重點專案才更新 `now.json`,且最多 6 個。
   只有能提供完整安裝、使用或工程決策脈絡時才建立文章,新文章一律先設 `draft: true`。
7. 完成內容審核後,才把 digest 最下方的 `nextLastrun` **原樣**寫入 `scripts/.lastrun.json`。
8. 再跑一次 `npm run update-site`。所有可讀 repo 應顯示「無新 commit」；若仍有新紀錄,
   重新檢查游標是否完整複製,不要直接手改 SHA 猜測。
9. 依序跑 `npm test`、`npm run validate-content`、`npm run build`。`npm run typecheck`
   目前另有 §5 記錄的 2 個既有死碼錯誤,不可把它誤報成這次 Git Log 更新造成。

### 4.3 指令輸出的判讀

- `無新 commit`:該 repo 的本機基準已追上目前 HEAD。
- `略過(內容更新已停用)`:預期行為,例如已封存的 `poe-build`。
- `略過(非 git repo)`:protected 代號屬預期行為；若是公開專案,代表路徑不存在、不是 repo，
  或 repo 已搬動,要先查出正確路徑再更新 config,不可直接宣稱已同步。
- `同步基準失效，有限回溯最新 commit`:舊 SHA 已不在目前歷史中,通常是 rebase、force push
  或 repo 搬移。程式會限制在 `maxCommitsPerRun` 筆,避免把整段歷史重新灌入；仍須人工去重。
- Git 顯示 `detected dubious ownership`:只對該 repo 使用
  `git -c safe.directory=<絕對路徑> -C <絕對路徑> ...`,不要寫入全域 safe.directory。

### 4.4 活動內容規格

`activity.json` 的每一則內容使用以下結構：

```json
{
  "date": "YYYY-MM-DD",
  "project": "PobTools",
  "tier": "personal",
  "summary": "以使用者看得到的成果為主，補上關鍵工程方法與必要限制，避免只改寫 commit 標題。",
  "tags": ["release", "tooling"],
  "commits": ["abcdef1"]
}
```

- `date`:單一功能採實際 commit 日期；合併多筆時採該組最新一筆日期。
- `project`:使用網站既有名稱,例如 `PobTools`、`Poe Market zh`、
  `Awakened PoE Trade-zh-TW`、`個人網站`,不要直接沿用資料夾名造成前台名稱分裂。
- `tier`:個人／公開專案用 `personal`；去識別化客戶案例才用 `protected`。
- `summary`:繁體中文約 40-80 字,優先寫「完成什麼、怎麼做、解決何種限制」；
  不寫無法從程式碼或 commit 驗證的效能數字、使用者數量或發布狀態。
- `tags`:2-4 個穩定分類即可,避免把每個技術名詞都列成標籤。
- `commits`:只放支撐這則摘要的真實 7 字元短 SHA；同一 SHA 不應重複形成等義活動。

`now.json` 不是完整 changelog。它只保留目前最重要的 6 個進行中／維護中項目，狀態文字
應描述現在正在處理的方向，不要把單次 commit 清單貼進去。AI Music 對外名稱為
`Kumori Music`,目前視為 active；頻道與首發歌曲連結受內容驗證器保護,不可在同步時誤刪。

### 4.5 專案與隱私邊界

- `Awakened PoE Trade-zh-TW` 的 repo 是 `D:/codeproject/Pob2/apt-patched`。
- `poeMarketTranslate` 的 repo 是 `D:/codeproject/Pob2/poeMarketTranslate/poe-market-zh`，
  前台名稱固定寫 `Poe Market zh`。
- `ai-Music` 設定路徑為 `D:/codeproject/ai-Music`；如果輸出為非 Git repo,先驗證實際位置，
  不可因 config 有一列就聲稱已讀取其 Git 歷史。
- protected 專案的真實路徑與名稱不得放進這個公開 repo。若另有授權來源提供其變更，
  必須先去識別化,只整理可複用的技術決策,再以 `tier: protected` 寫入活動。
- Git Log 只能證明程式變更,不能單獨證明功能已部署、公開發布或使用者已可取得；
  這類措辭需要 release、部署紀錄或使用者明確資訊佐證。

## 5. 已知狀況

- **死碼**:`src/components/HeroSection.astro`、`src/components/AboutSection.astro`、
  `src/components/three/HeroScene.tsx`、`src/components/three/SkillSphere.tsx`、
  `src/components/react/FeaturedProjects.tsx`
  沒有被任何頁面引用(舊版首頁殘留)。`astro check` 那 2 個型別錯誤
  (`bufferAttribute` 缺 `args`)都在其中,所以 CI 的 typecheck job 掛的是
  `continue-on-error: true`。清掉死碼或補好 `args` 之後,把那行刪掉轉成硬性 gate。
- **首頁的精選由 `projects.json` 的 `featured` 決定**。`src/components/CinematicHome.astro`
  讀 `featuredProjects`:排最前面的當 hero(標題、狀態標籤、tech 前三項、description、
  連到第一篇**已發布**的 article),其餘列進下排 reel,計數也跟著筆數走。
  要換首頁展示什麼就改資料,不要回頭在 astro 裡寫死專案名——2026-10-02 之前那段
  是寫死的,導致改 `featured` 完全沒有效果。沒有任何 featured 專案時建置會直接失敗。
- **Three.js 元件不進單元測試**:jsdom 沒有 WebGL context。
  `SpatialScene.astro` 與 `three/` 底下的東西要用實際瀏覽器驗證。
- **CI 分兩條**:`ci.yml`(PR 進 main 時跑 validate + test + build)與
  `deploy.yml`(push main 後建置並部署)。

## 6. 本機環境陷阱

Windows 11 + PowerShell 5.1 + Git Bash:

- **含中文的檔案一律用 Write/Edit 工具寫**,不要用 PowerShell 的
  `Get-Content` + `-replace` + `Set-Content`(PS5.1 會用 cp950 解讀無 BOM 的 UTF-8,
  中文全毀且不可逆),也不要用 Bash heredoc(會把 `\\` 折成 `\`)。
- **驗證建置不要 pipe**:`npm run build | tail` 會讓失敗的退出碼被 tail 的 0 蓋掉。
  要縮短輸出就先導檔再 tail,或用 `${PIPESTATUS[0]}` 取真實退出碼。

## 7. 測試邊界

測試基線只涵蓋機器能穩定判定的事:內容護欄、資料層不變式、React 元件 render 不炸。
**視覺、動畫、3D 場景不在此列**,改到那些東西要在瀏覽器實際看過才算完成。

不要為了覆蓋率補測試。新增測試前先問:這條測的是「改壞了會出事」的東西嗎?
