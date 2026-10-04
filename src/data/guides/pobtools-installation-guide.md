## PobTools 能幫你做什麼

如果你玩 Path of Exile 又用 Path of Building（POB）算配裝，應該遇過一個問題：中文化工具常常在 POB 一更新之後就壞掉。PobTools 就是為了這件事做的。

它是 Windows 上的 POB 繁體中文化啟動器，PoE1 和 PoE2 都能用。翻譯和字型是在啟動的時候從外面注入，**你磁碟上的 POB 檔案完全不會被改**，所以 POB 自己更新也照跑，中文化不會跟著掛掉。

翻譯資料是用官方遊戲客戶端的文字整理出來的，大概 10 萬組英中對照。另外啟動器還附了幾個小工具：翻譯編輯器、物品過濾器編輯器、輿圖策略、軍團珠寶計算器，還有搜尋字串產生器。

## 安裝前要準備的東西

- Windows 10 或 11。
- Path of Building Community 本體。PobTools **不包含 POB**，要自己另外下載：
  - PoE1：[Path of Building 最新版](https://github.com/PathOfBuildingCommunity/PathOfBuilding/releases/latest)
  - PoE2：[Path of Building PoE2 最新版](https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2/releases/latest)
  - 已經裝好的 POB 資料夾也可以直接用。
- 從 [PobTools Releases](https://github.com/Hsiung-Shao/PobTools-zh/releases/latest) 下載 **`PobTools-<版本>.zip`**。

Releases 頁上會看到三種檔案，第一次裝只要第一個就好：

| 檔案 | 用途 |
|---|---|
| `PobTools-<版本>.zip` | 第一次安裝用的完整包 |
| `PobTools-update-<版本>.zip` | 程式自動更新用的，**裡面沒有翻譯資料**，手動下載它會得到一個沒有中文的 POB |
| `PobTools-Data-<編號>.zip` | 只有翻譯資料，放在標著 `data-<編號>` 的那幾則 Release |

## 使用方式：安裝跟第一次啟動

1. 把 `PobTools-<版本>.zip` 解壓到一個固定的位置，例如 `D:\PobTools\`。不要直接在壓縮檔裡面點開。
2. 解壓完應該會看到 `pob-zh.exe`，還有 `engine`、`Data`、`Fonts` 這幾個資料夾。
3. 把 POB 資料夾放到 `pob-zh.exe` 旁邊。資料夾叫什麼名字都可以，裡面有 `Launch.lua` 就會被找到。
4. PoE2 的 POB 資料夾名稱要有 `PoE2`，例如 `PathOfBuildingCommunity-PoE2-Portable`，不然啟動器會把它當成 PoE1。
5. 雙擊 `pob-zh.exe`，偵測到的每個遊戲版本會列成一列，旁邊有 POB 的版本號。
6. 在要用的那一列按「啟動」，POB 就會用繁體中文開起來。

放好之後大概長這樣（資料夾名稱只是舉例）：

```text
D:\PobTools\
|-- pob-zh.exe
|-- engine\
|-- Data\
|-- Fonts\
|-- PathOfBuildingCommunity\                <- PoE1 的 POB
`-- PathOfBuildingCommunity-PoE2-Portable\  <- PoE2 的 POB（沒玩可以不放）
```

只玩一款就只放一個。其實也可以把 `pob-zh.exe` 連同 `engine`、`Data`、`Fonts` 直接丟進 POB 資料夾（跟 `Launch.lua` 同一層），不過並排放比較好整理。

![PobTools 啟動器](/images/guides/pobtools/pobtools-launcher.png)

*啟動器會列出找到的 POB，底下可以切換介面語言跟字型。*

## 怎麼確認中文化有成功

第一次開起來可以檢查這三件事：

1. POB 的分頁、按鈕還有 tooltip 都是中文，沒有方框或亂碼。
2. 物品頁的傳奇／基底資料庫搜尋框打中文找得到東西，打英文也一樣能搜。
3. 從繁中遊戲客戶端複製一件物品，在 POB 建立自訂物品的地方貼上，可以正常解析。

![PobTools 啟動的繁中 POB](/images/guides/pobtools/pobtools-pob-main.png)

*翻譯只在執行的時候套上去，POB 資料夾裡的檔案一個都沒動。*

## 更新：程式跟翻譯是分開的

**翻譯資料**是另外一條發佈線（`data-1`、`data-2`…），程式會自己檢查然後套用，你什麼都不用做。目前的翻譯資料版本會顯示在設定頁最下面。如果你自己有在改翻譯，不想被蓋掉，就把設定頁的「自動更新翻譯資料」改成「否」。之後有新資料還是會通知你，想要的時候按「立即套用一次」就好。

**程式本體**每天會在背景檢查一次。有新版的話右上角會出現橘色的「發現新版」，按下去才會下載、替換然後重開；中間任何一步失敗都會退回舊版。嫌每次都要按很麻煩的話，可以在設定頁「程式更新」勾「啟動後自動安裝新版本」，它只會在你剛打開、還沒開 POB 或任何工具的時候動手。

想先試新功能可以勾「參加 beta 測試(搶先版)」。之後取消勾選不會退回舊版，會等正式版追上來再照常更新。

要手動換翻譯資料的話：到 Releases 找 `data-<編號>` 那一則，下載 `PobTools-Data-<編號>.zip`，把裡面的 `Data` 資料夾整個蓋到安裝目錄。`Data\translations_version.json` 也要一起蓋過去，少了它程式會以為自己還沒更新過。

你的 `pob-zh.ini`、`PobTools\` 資料夾還有 POB 本體，更新都不會動到。

如果你的網路連不太到 GitHub，設定頁「網路」可以填 HTTP 代理；留空的話會自動跟系統代理走。

## 語言、字型跟外觀

- **介面語言**：啟動器底下可以切繁中、簡中、한국어、English。韓文主要是用官方遊戲檔的翻譯，POB 自己的介面大概八成有翻，剩下的會顯示英文。
- **字型**：底下的字型選單會列出 `Fonts\` 裡所有的 `.ttf`。想用自己的字型就把 TrueType 靜態字型丟進 `Fonts\`，再重開啟動器；可變字型要先轉成單一字重才讀得到。預設是 Noto Sans TC。
- **啟動器大小**：設定頁「介面」可以調字體大小（14–26 px），視窗也能直接拖邊緣調，放開之後會記住。這兩個都不影響 POB 本身。
- **POB 外觀**：「外觀」分頁可以調 POB 面板的不透明度、換背景圖、加霧面效果，PoE1 跟 PoE2 各自一組。背景圖放在 `PobTools\Backgrounds\`，更新不會蓋掉。

## 附帶的小工具

這些都從啟動器上方的工具列打開，每個是獨立視窗，可以同時開好幾個。

- **翻譯編輯器**：覺得哪個翻譯怪怪的，可以用英文原文搜到那一條直接改。存檔後會寫回 `Data\<game>\<locale>\*.json`，下次開 POB 就生效。如果你打算長期自己維護譯文，記得把「自動更新翻譯資料」關掉，或是更新前先備份 `Data`。
- **物品過濾器編輯器**：三欄式的 `.filter` 編輯器，左邊是規則清單，中間看條件跟樣式，右邊新增；音效在另一個分頁管。介面是中文，但輸出的檔案還是遊戲讀得懂的英文格式。
- **輿圖策略**：規劃地圖天賦樹。點一個節點它會自動幫你補最短路徑，右邊的統計可以用中文或英文搜。可以存好幾個方案，匯出 JSON 或 `PTAT1|...` 分享碼給朋友。新賽季的時候按工具列的更新按鈕就能抓新圖譜。
- **軍團珠寶計算器**：選珠寶類型跟陣營，輸入種子或條件，就會列出被影響的節點。搜尋框可以打中文，也可以直接產生國際服或台服的交易站連結。
- **搜尋字串產生器**：跟 poe.re 差不多。選遊戲跟物品清單，勾想找的詞綴，它就幫你組好遊戲搜尋框用的正規表示式，一鍵複製。常用的組合可以存成書籤。

![PobTools 物品過濾器編輯器](/images/guides/pobtools/pobtools-filter.png)

*過濾器編輯器把規則、目前的設定跟可以新增的東西分成三欄。*

![PobTools 輿圖策略](/images/guides/pobtools/pobtools-atlas.png)

*輿圖策略會即時算目前路線的加成，可以存多個方案跟分享碼。*

## 常見問題

### 顯示「未偵測到任何 POB」

先確認 POB 資料夾跟 `pob-zh.exe` 是在同一層，資料夾裡有 `Launch.lua`。PoE2 的資料夾名稱要有 `PoE2`。如果同時有好幾個符合的資料夾，會先用官方名稱的那個，其他的照名稱排序取第一個。

### 介面是方框或沒有中文

看一下 `Fonts\NotoSansTC-Regular.ttf` 解壓的時候有沒有漏掉。還有一種情況是你手動下載到 `PobTools-update-<版本>.zip`，那個包沒有翻譯資料，要改下載完整包。

### 被防毒軟體擋

PobTools 沒有買 Windows 程式碼簽章，加上它會自動更新、會在記憶體裡修補 POB 的腳本，有些防毒軟體會用啟發式規則誤判。只從 GitHub Releases 下載，然後可以用 Release 附的 `SHA256SUMS-<版本>.txt` 對一下：

```powershell
Get-FileHash .\PobTools-<版本>.zip -Algorithm SHA256
```

自動更新的部分不用自己對：程式本體跟翻譯資料在安裝前都會用編譯進執行檔的公鑰驗簽章，驗不過就不裝。不過這只能證明更新真的是我發的，跟 Windows 程式碼簽章是兩回事，所以防毒誤判還是沒辦法完全避免。

### POB 更新後中文搜尋不能用了

中文介面一般不會受影響。中文物品搜尋是在記憶體裡修補的，如果 POB 改版把那個位置拿掉了，就會自動退回英文搜尋。先把 PobTools 更新到最新，還是不行再跟我說你的 POB 跟 PobTools 版本。

### POB 卡住或當掉

設定頁最下面有「開啟問題紀錄資料夾」，會打開 `PobTools\logs\`。POB 或啟動器卡超過 20 秒、或是突然關掉的時候，都會在這裡留一份記錄。回報問題時把當天的檔案一起附上最有用，裡面不會有你的配裝內容。另外啟動器不會幫你把卡住的 POB 關掉，因為它有可能只是在算比較久的東西，硬關掉你沒存的配置就沒了。

## 使用上的界線

PobTools 是非官方的粉絲工具，跟 Grinding Gear Games、Garena 都沒有關係。它只跟 POB 這個計算器互動，不會注入遊戲、不讀寫遊戲記憶體，也不改遊戲檔案。程式碼是 MIT 授權，遊戲資料的著作權屬於 Grinding Gear Games。有問題或想許願新功能，歡迎到 [Discord 社群](https://discord.gg/6VamPQb8nC)找我。
