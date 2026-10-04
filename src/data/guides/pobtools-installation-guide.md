## PobTools 是什麼

PobTools 是 Windows 上的 Path of Building Community（POB）繁體中文化啟動器，PoE1 和 PoE2 都支援。翻譯和字型是在啟動時從外層注入的，**不會改你磁碟上的 POB 檔案**，所以 POB 自己更新也不會把中文化弄壞。

翻譯資料以官方遊戲客戶端為準，大約 10 萬組英中對照。除了中文化 POB，啟動器還附了幾個獨立工具：翻譯編輯器、物品過濾器編輯器、輿圖策略、軍團珠寶計算器和搜尋字串產生器。

## 安裝前準備

- Windows 10 或 11。
- Path of Building Community 本體。PobTools **不包含 POB**，要自己另外下載：
  - PoE1：[Path of Building 最新版](https://github.com/PathOfBuildingCommunity/PathOfBuilding/releases/latest)
  - PoE2：[Path of Building PoE2 最新版](https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2/releases/latest)
  - 或是你電腦上已經裝好的 POB 資料夾。
- 從 [PobTools Releases](https://github.com/Hsiung-Shao/PobTools-zh/releases/latest) 下載 **`PobTools-<版本>.zip`**。

Releases 頁上有三種檔案，第一次安裝只要第一個：

| 檔案 | 用途 |
|---|---|
| `PobTools-<版本>.zip` | 第一次安裝用的完整包 |
| `PobTools-update-<版本>.zip` | 程式自動更新用，**不含翻譯資料**，手動下載它會得到沒有中文的 POB |
| `PobTools-Data-<編號>.zip` | 只有翻譯資料，放在標著 `data-<編號>` 的那幾則 Release |

## 使用方式：安裝與第一次啟動

1. 把 `PobTools-<版本>.zip` 解壓到固定的位置，例如 `D:\PobTools\`。不要直接在壓縮檔裡執行。
2. 解壓後應該看得到 `pob-zh.exe` 和 `engine`、`Data`、`Fonts` 資料夾。
3. 把 POB 資料夾放到 `pob-zh.exe` 同一層。資料夾名稱不限，只要裡面有 `Launch.lua` 就會被偵測到。
4. PoE2 的 POB 資料夾名稱要包含 `PoE2`，例如 `PathOfBuildingCommunity-PoE2-Portable`，啟動器才會把它當成 PoE2。
5. 雙擊 `pob-zh.exe`。啟動器會把偵測到的每個遊戲版本列成一列，顯示 POB 版本號。
6. 在要用的那一列按「啟動」，POB 會以繁體中文開啟。

放好之後大概長這樣（資料夾名稱只是範例）：

```text
D:\PobTools\
|-- pob-zh.exe
|-- engine\
|-- Data\
|-- Fonts\
|-- PathOfBuildingCommunity\                <- PoE1 的 POB
`-- PathOfBuildingCommunity-PoE2-Portable\  <- PoE2 的 POB（沒玩可以不放）
```

只玩其中一款就只放一個。也可以把 `pob-zh.exe` 連同 `engine`、`Data`、`Fonts` 直接放進 POB 資料夾（和 `Launch.lua` 同層），但並排放比較好管理。

![PobTools 啟動器](/images/guides/pobtools/pobtools-launcher.png)

*啟動器列出偵測到的 POB，底部可以切換介面語言和字型。*

## 確認中文化正常

第一次啟動後可以檢查這三件事：

1. POB 的分頁、按鈕和 tooltip 顯示中文，沒有方框或亂碼。
2. 物品頁的傳奇／基底資料庫搜尋框輸入中文名稱找得到物品，英文也照樣能搜。
3. 從繁中遊戲客戶端複製一件物品，在 POB 建立自訂物品時貼上，能正確解析。

![PobTools 啟動的繁中 POB](/images/guides/pobtools/pobtools-pob-main.png)

*翻譯只在執行時套用，POB 資料夾裡的檔案保持原樣。*

## 更新程式與翻譯資料

程式和翻譯資料是分開更新的。

**翻譯資料**是獨立的一條發佈線（`data-1`、`data-2`…），程式會自己檢查並套用，不用做任何事。設定頁最下面會顯示目前的翻譯資料版本。如果你自己在改翻譯、不想被覆蓋，設定頁的「自動更新翻譯資料」選「否」；有新資料時仍會通知，可以按「立即套用一次」。

**程式本體**每天在背景檢查一次。有新版時右上角會出現橘色「發現新版」，按下去才會下載、替換並重新開啟；過程中任何一步失敗都會還原成舊版。不想每次都按，可以在設定頁「程式更新」勾「啟動後自動安裝新版本」，它只會在剛開啟、還沒開 POB 或任何工具時動手。

想先試新功能，可以勾「參加 beta 測試(搶先版)」。之後取消勾選不會退回舊版，會等正式版追上再照常更新。

手動換翻譯資料：到 Releases 找 `data-<編號>` 那一則，下載 `PobTools-Data-<編號>.zip`，把裡面的 `Data` 資料夾整個覆蓋到安裝目錄。裡面的 `Data\translations_version.json` 也要一起蓋過去，少了它程式會以為自己還沒更新。

`pob-zh.ini`、`PobTools\` 資料夾和 POB 本體都不會被更新動到。

連不上 GitHub 的網路環境，可以在設定頁「網路」填 HTTP 代理；留空會自動跟隨系統代理。

## 語言、字型與外觀

- **介面語言**：啟動器底部可以切換繁中、簡中、한국어、English。韓文以官方遊戲檔為主，POB 自身介面大約八成有譯文，其餘顯示英文。
- **字型**：底部的字型選單會列出 `Fonts\` 裡所有 `.ttf`。想加自己的字型，把 TrueType 靜態字型丟進 `Fonts\` 再重開啟動器；可變字型要先轉成單一字重。預設是 Noto Sans TC。
- **啟動器大小**：設定頁「介面」可以調字體大小（14–26 px），視窗也能直接拖邊緣調整，放開後會記住。這兩項不影響 POB 本身。
- **POB 外觀**：「外觀」分頁可以調 POB 面板不透明度、換背景圖片、加霧面效果，PoE1 和 PoE2 各一組設定。背景圖片放在 `PobTools\Backgrounds\`，不會被更新覆蓋。

## 附帶的工具

這些工具從啟動器上方的工具列開啟，各自是獨立視窗，可以同時開好幾個。

- **翻譯編輯器**：用英文原文搜尋條目，直接改繁中譯文。存檔後寫回 `Data\<game>\<locale>\*.json`，下次啟動 POB 生效。長期自己維護譯文的話，記得把「自動更新翻譯資料」關掉，或更新前備份 `Data`。
- **物品過濾器編輯器**：三欄式編輯標準 `.filter`。左欄是規則清單，中欄看條件和樣式，右欄新增；音效在另一個分頁管理。介面是中文，輸出的檔案維持遊戲讀得懂的英文格式。
- **輿圖策略**：規劃地圖天賦樹。點節點會自動補上最短路徑，右側統計可以用中英關鍵字搜尋。可以建多個方案，匯出 JSON 或 `PTAT1|...` 分享碼。新賽季可以用工具列的更新按鈕直接抓新圖譜。
- **軍團珠寶計算器**：選珠寶類型和陣營，輸入種子或條件，列出受影響的節點。搜尋框支援中文，可以直接產生國際服或台服的交易站連結。
- **搜尋字串產生器**：類似 poe.re。先選遊戲和物品清單，勾選詞綴後會組出遊戲內搜尋框用的正規表示式，一鍵複製。常用組合可以存成書籤。

![PobTools 物品過濾器編輯器](/images/guides/pobtools/pobtools-filter.png)

*過濾器編輯器把規則、目前設定和可新增的項目分成三欄。*

![PobTools 輿圖策略](/images/guides/pobtools/pobtools-atlas.png)

*輿圖策略會即時統計目前的路線，支援多方案與分享碼。*

## 常見問題

### 顯示「未偵測到任何 POB」

確認 POB 資料夾和 `pob-zh.exe` 在同一層，資料夾裡有 `Launch.lua`。PoE2 的資料夾名稱要包含 `PoE2`。同時有好幾個符合的資料夾時，會優先用官方名稱，其餘依名稱排序取第一個。

### 介面是方框或沒有中文

確認 `Fonts\NotoSansTC-Regular.ttf` 解壓時沒有漏掉。如果你是手動下載了 `PobTools-update-<版本>.zip`，那個包沒有翻譯資料，要改下載完整包。

### 防毒軟體攔截

PobTools 沒有買 Windows 程式碼簽章，加上會自動更新、在記憶體裡修補 POB 腳本，可能被防毒軟體的啟發式規則誤判。只從 GitHub Releases 下載，可以用 Release 附的 `SHA256SUMS-<版本>.txt` 核對：

```powershell
Get-FileHash .\PobTools-<版本>.zip -Algorithm SHA256
```

自動更新不用自己核對：程式主體和翻譯資料在安裝前都會用編譯進執行檔的公鑰驗證簽章，驗不過就不裝。這只能證明更新是維護者發的，不是 Windows 程式碼簽章，所以沒辦法消除防毒誤判。

### POB 更新後中文搜尋失效

中文介面一般不受影響。中文物品搜尋是記憶體層修補，POB 改版移掉對應位置時會自動退回英文搜尋。先更新 PobTools，還是不行再回報 POB 和 PobTools 的版本。

### POB 卡住或當掉

設定頁最下面的「開啟問題紀錄資料夾」會開到 `PobTools\logs\`。POB 或啟動器停住超過 20 秒、或意外結束時，會在這裡留下記錄檔。回報問題時把當天的檔案一起附上最有幫助，裡面沒有你的配置內容。啟動器不會替你結束卡住的 POB，因為它可能只是在算比較慢的東西。

## 使用邊界

PobTools 是非官方粉絲工具，與 Grinding Gear Games、Garena 沒有關係。它只和 POB 這個計算器互動，不注入遊戲行程、不讀寫遊戲記憶體、不改遊戲檔案。程式碼採 MIT 授權，遊戲資料著作權屬 Grinding Gear Games。有問題或想許願新功能，可以到 [Discord 社群](https://discord.gg/6VamPQb8nC)。
