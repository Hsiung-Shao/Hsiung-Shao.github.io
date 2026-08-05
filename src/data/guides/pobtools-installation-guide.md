## PobTools 是什麼

PobTools 是 Windows 上的 Path of Building Community（POB）繁體中文化啟動器，支援 PoE 1 與 PoE 2。它把翻譯與字型放在外層執行環境中，不會改寫原始 POB 的 Lua 與資料檔；POB 本體可照原本方式更新。

除了中文介面，PobTools 還提供中文物品搜尋、翻譯編輯器、物品過濾器編輯器、輿圖策略規劃與軍團珠寶等獨立工具。

## 安裝前準備

- Windows 10 或 Windows 11。
- 已安裝或已解壓的 [Path of Building Community](https://github.com/PathOfBuildingCommunity/PathOfBuilding/releases/latest)。PobTools 不包含 POB 本體。
- POB 資料夾內必須有 `Launch.lua`。
- 從 [PobTools Releases](https://github.com/Hsiung-Shao/PobTools-zh/releases/latest) 下載 `PobTools-<版本>.zip`。

Release 可能同時提供主程式包與 `PobTools-Translations-<版本>.zip`。第一次安裝要下載主程式包；Translations 包只用來手動更新翻譯資料。

## 使用方式：安裝與第一次啟動

1. 將 `PobTools-<版本>.zip` 解壓到固定位置，例如 `D:\PobTools\`。不要直接在壓縮檔內執行。
2. 確認解壓後能看到 `pob-zh.exe`、`engine`、`Data` 與 `Fonts`。
3. 把 POB 本體資料夾移到 `pob-zh.exe` 同一層。資料夾名稱不限，重點是裡面有 `Launch.lua`。
4. PoE 2 的資料夾名稱必須包含 `PoE2`，例如 `PathOfBuildingCommunity-PoE2-Portable`，啟動器才會辨識為 PoE 2。
5. 執行 `pob-zh.exe`。啟動器會列出偵測到的遊戲版本與 POB 版本號。
6. 在對應列按「啟動」，確認 POB 介面以繁體中文開啟。

建議的資料夾結構：

```text
D:\PobTools\
|-- pob-zh.exe
|-- engine\
|-- Data\
|-- Fonts\
|-- PathOfBuildingCommunity\
|   `-- Launch.lua
`-- PathOfBuildingCommunity-PoE2-Portable\
    `-- Launch.lua
```

![PobTools 啟動器](/images/guides/pobtools/pobtools-launcher.png)

*啟動器會列出偵測到的 POB；底部可切換介面語言與字型。*

## 確認中文化正常

啟動後先做三項檢查：

1. POB 主頁、分頁與 tooltip 能顯示中文，不是方框或亂碼。
2. 到物品頁的傳奇／基底資料庫搜尋框輸入中文名稱，確認能找到物品；英文搜尋仍可使用。
3. 從繁中遊戲客戶端複製一件物品，在 POB 的建立自訂物品功能貼上，確認能正確解析。

![PobTools 啟動的繁中 POB](/images/guides/pobtools/pobtools-pob-main.png)

*翻譯只在執行期間套用，外部 POB 本體保持原狀。*

## 更新程式與翻譯

啟動器每天在背景檢查一次更新，更新分兩種：

- 翻譯修訂版：自動下載並套用，右上角短暫顯示「翻譯資料已更新」，下次啟動 POB 生效。
- 主體新版：右上角顯示橘色「發現新版」。點擊後才會下載、替換並重新啟動；失敗時會還原舊版。

想手動更新翻譯時：

1. 下載 `PobTools-Translations-<版本>.zip`。
2. 關閉 POB 與 PobTools。
3. 解壓後把其中的 `Data` 覆蓋到 PobTools 安裝目錄。
4. 重開 `pob-zh.exe`。

個人設定 `pob-zh.ini`、`PobTools\` 資料夾與 POB 本體不會被自動更新取代。輿圖資料則可在輿圖策略工具內按更新按鈕，不必手動換整包。

## 切換語言與加入字型

啟動器底部的語言選單可切換繁中、簡中或英文；翻譯資料必須存在才會生效。

要使用其他字型：

1. 關閉啟動器。
2. 把 TrueType 靜態字型 `.ttf` 放進 `Fonts\`。
3. 重開啟動器。
4. 從底部「字型」下拉選擇新字型，再啟動 POB。

可變字型可能無法正確載入，建議先轉成單一字重。預設 Noto Sans TC 已隨主程式提供。

## 翻譯編輯器

翻譯編輯器適合修正個別譯文：

1. 從啟動器上方工具列開啟翻譯編輯器。
2. 以英文原文搜尋條目。
3. 編輯繁中譯文並儲存。
4. 變更會寫入 `Data\<game>\<locale>\*.json`，下次啟動 POB 生效。

更新翻譯包可能覆蓋自己改過的字典，若有長期維護的自訂譯文，更新前先備份 `Data`。

## 物品過濾器編輯器

過濾器編輯器以三欄顯示標準 `.filter`：左欄是規則區塊，中欄顯示條件與樣式，右欄新增條件或樣式；音效管理在另一個分頁。

1. 從啟動器工具列開啟過濾器編輯器。
2. 載入既有 `.filter`，先另存副本。
3. 在左欄選擇規則，在中欄檢查物品類別、稀有度、階級、顏色、邊框、音效與小地圖圖示。
4. 從右欄加入條件或樣式。
5. 匯出 `.filter` 後放入遊戲的 filter 目錄。

介面以中文顯示，但輸出的規則維持遊戲可讀的英文格式。

![PobTools 物品過濾器編輯器](/images/guides/pobtools/pobtools-filter.png)

*三欄式編輯器將規則、目前設定與可新增項目分開。*

## 輿圖策略規劃

1. 從啟動器工具列開啟「輿圖策略」，或使用 `pob-zh.exe --atlas`。
2. 拖曳畫布平移、使用滾輪縮放。
3. 點擊節點配點或取消，程式會自動補上從起點到目標的最短路徑。
4. 右側查看已用點數與加成統計；搜尋支援中英關鍵字。
5. 點統計清單中的節點，可把畫布聚焦到該節點。
6. 為不同玩法建立多個方案，使用下拉選單切換。
7. 透過 JSON 或 `PTAT1|...` 分享碼匯出；另一台電腦可匯入還原。

![PobTools 輿圖策略](/images/guides/pobtools/pobtools-atlas.png)

*輿圖策略會即時統計目前路線，並支援多方案與分享碼。*

## 常見問題

### 顯示「未偵測到任何 POB」

確認 POB 資料夾和 `pob-zh.exe` 位於同一層，且資料夾內有 `Launch.lua`。PoE 2 資料夾名稱還必須包含 `PoE2`。同時有多個候選資料夾時，啟動器會優先官方名稱，再依名稱排序。

### 介面是方框或沒有中文

確認 `Fonts\NotoSansTC-Regular.ttf` 沒有在解壓時遺漏。也可換另一個支援繁中的靜態 `.ttf`。

### 防毒軟體攔截

PobTools 會啟動 POB 並在執行期間載入翻譯，且沒有商業數位簽章，可能觸發啟發式警告。只從 GitHub Release 下載，並以 Release 的 SHA-256 清單驗證：

```powershell
Get-FileHash .\PobTools-<版本>.zip -Algorithm SHA256
```

雜湊相同只代表檔案和發布者提供的檔案一致，不是第三方安全認證。PobTools 不注入 Path of Exile 遊戲行程。

### POB 更新後中文搜尋失效

一般中文介面仍應可用；中文物品搜尋是記憶體層修補，若 POB 改版移除對應位置，會退回英文搜尋。先更新 PobTools，再回報使用中的 POB 與 PobTools 版本。

## 使用邊界

PobTools 是非官方粉絲工具，與 Grinding Gear Games 或 Garena 無關。它的操作對象是 POB 計算器，不是遊戲行程；使用自訂翻譯或過濾器前仍應保留原始檔備份。
