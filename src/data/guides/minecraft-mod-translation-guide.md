## 工具可以翻譯哪些內容

Minecraft MOD 翻譯工具會掃描整合包的模組與設定資料，產生繁體中文資源包。它支援：

- JAR 內的 `assets/*/lang/en_us.json`。
- `config`、`kubejs` 等資料夾中的語言檔。
- FTB Quests 的 `en_us.snbt` 語言檔。
- FTB Quests chapter 內嵌的 `title`、`description` 等任務文字。

翻譯可使用 LM Studio／Ollama 本地模型、Google Translate 免費端點，或其他 OpenAI 相容 API。一般 Windows 使用者只要下載單一執行檔，不必安裝 Python。

![Minecraft MOD 翻譯工具主畫面](/images/guides/minecraft/00-app-overview.png)

*左側設定翻譯來源與目錄，右側顯示分析、進度與記錄。*

## 開始前準備與備份

1. 到 [Minecraft MOD 翻譯工具 Releases](https://github.com/Hsiung-Shao/minecraftTranslate/releases/latest) 下載 `MinecraftTranslate.exe`。
2. 找到整合包的 Minecraft 實例資料夾，確認裡面有 `mods`、`config`、`resourcepacks` 等資料夾。
3. **先備份 `config/ftbquests/quests/`**。一般模組翻譯輸出成新資源包，但 FTB Quests chapter 內嵌文字會直接修改原始 SNBT。
4. 決定翻譯來源：沒有適合顯示卡或只想快速使用，可選 Google Translate；重視資料留在本機與術語品質，可選 LM Studio。

Windows SmartScreen 可能因執行檔未簽章而警告。只從專案 Release 下載，確認來源後再決定是否執行。

## 使用方式 A：Google Translate

Google Translate 不需要 API Key，也不需要獨立顯示卡。

1. 啟動工具，切到「連線」分頁。
2. 服務商選「Google Translate（免費）」。API 網址與金鑰保持空白。
3. 按「測試連線」，確認狀態成功。
4. 切回「翻譯」分頁，按資料夾按鈕選擇整合包的 `mods` 資料夾。
5. 工具會嘗試把輸出自動設為同一實例的 `resourcepacks`；請核對路徑，不要輸出到另一個整合包。
6. 目標語言選繁體中文 `zh_tw`。
7. 先按「分析」，檢查找到的 JAR、資料夾來源、FTB Quests 與待翻譯字串數。
8. 要翻全部就按「開始翻譯」；只翻部分則按「選擇模組」，勾選後按「開始翻譯選定模組」。
9. 完成後確認輸出路徑出現 `ModTranslation_zh_tw.zip`。

免費 Google 端點有速率限制，工具雖已加入請求延遲，仍可能暫時被限制。遇到錯誤時先暫停幾分鐘再繼續，不要不停重試。

## 使用方式 B：LM Studio 本地模型

本地模型不需 API Key，翻譯文字不會送到外部服務，但需要足夠記憶體與顯示記憶體。8GB VRAM 可從 Qwen3 8B 的 Q4 量化開始；12GB VRAM 可考慮 Qwen3 14B Q4。

### 1. 安裝與下載模型

1. 從 [LM Studio](https://lmstudio.ai/) 安裝桌面程式。
2. 開啟左側 Discover，搜尋 `Qwen3 8B` 或 `Qwen3 14B`。
3. 選擇 GGUF 格式，不要選 VL 或 Coder 版本。
4. 初次建議用 `Q4_K_M`；LM Studio 顯示 Full GPU Offload Possible 代表顯示記憶體足夠。
5. 下載完成後進入 Developer 頁面。

![在 LM Studio 下載 Qwen3 模型](/images/guides/minecraft/01-download-model.png)

*Q4_K_M 通常是模型大小、速度與品質的平衡點。*

### 2. 啟動本機 API

1. 在 Developer 頁把 Status 切成 Running。
2. 確認 Reachable at 顯示位址，預設是 `http://localhost:1234`。
3. 按「Load Model」選取剛下載的模型。
4. 等待日誌顯示模型載入完成。若看到 CUDA0 或 GPU offload，表示模型主要由顯示卡執行。

![LM Studio Developer 伺服器](/images/guides/minecraft/02-developer-server.png)

*伺服器必須保持 Running，翻譯期間也不要關閉 LM Studio。*

### 3. 關閉 Thinking 並設定 Context

載入模型後，在右側參數面板：

- Context Length 建議至少 `8192`。
- **Enable Thinking 必須關閉**。逐條翻譯不需要推理內容，開啟後可能慢 10 到 20 倍，且模型可能把思考文字混入答案。
- System Prompt 保持空白，翻譯工具會自行提供提示。

![LM Studio 模型參數](/images/guides/minecraft/05-model-ready.png)

*關閉 Enable Thinking 是最重要的效能設定。*

### 4. 讓翻譯工具連上 LM Studio

1. 回到 Minecraft 翻譯工具的「連線」分頁。
2. 服務商選「LM Studio（本機）」。
3. API 網址確認為 `http://localhost:1234/v1`。
4. 按「測試連線」。成功時會列出可用與目前載入的模型。
5. 回到「翻譯」分頁，選 `mods`、輸出資料夾與 `zh_tw`，再先執行分析。

若模型在區網另一台電腦，LM Studio 要啟用 Serve on Local Network，網址改成對方 IP，例如 `http://192.168.1.100:1234/v1`。只在可信任的區網開放。

## 分析、選擇模組與開始翻譯

「分析」只掃描，不會呼叫翻譯服務，也不會修改檔案。完成後應看到來源數量與總字串數：

1. 先檢查 `mods` 路徑是否屬於正確實例。
2. 檢查是否找到資料夾語言檔與 FTB Quests。
3. 按「選擇模組」可排除已經有良好繁中、暫時不需要或字串量過大的模組。
4. 開始翻譯後可暫停或取消；取消不會刪除已寫入快取的翻譯。
5. 進度列會區分快取命中與實際 API 翻譯數量。

翻譯中斷後可以重開程式再執行。`translation_cache.db` 會保存已完成的相同字串，後續任務直接重用。

## 效能設定怎麼選

可先按「進階 → 偵測 VRAM 自動設定」，再依穩定度微調：

| VRAM | Context | Batch | Workers |
| --- | ---: | ---: | ---: |
| 少於 6GB | 4096 | 8 | 1 |
| 6–12GB | 8192 | 15 | 2 |
| 12–24GB | 16384 | 20 | 2 |
| 24GB 以上 | 32768 | 30 | 3 |

批次逾時時，先把 batch 降到 10；記憶體不足時降低 Context 或 Workers。增加 Workers 不一定更快，如果模型後端只能有效處理一個請求，並行反而會增加等待。

## 安裝產生的資源包

1. 翻譯完成後打開輸出資料夾。
2. 確認 `ModTranslation_zh_tw.zip` 直接位於該實例的 `resourcepacks`。
3. 啟動 Minecraft，進入「選項 → 資源包」。
4. 把 `ModTranslation_zh_tw` 移到已選取清單。
5. 建議放在其他模組翻譯包上方，讓這份資源包有較高優先權。
6. 進入遊戲檢查物品名稱、介面與說明；部分模組可能需要重啟遊戲才會重新載入語言資料。

輸出 ZIP 內含自動偵測的 `pack.mcmeta` 與各模組的 `assets/<namespace>/lang/zh_tw.json`。不要解壓 ZIP 後又多包一層資料夾，否則 Minecraft 可能無法辨識。

## FTB Quests 特別注意

處理方式有兩種：

- `en_us.snbt` 語言檔：產生同目錄的 `zh_tw.snbt`。
- chapter 檔內嵌文字：直接改寫 `config/ftbquests/quests/chapters/*.snbt`。

第二種不是資源包覆蓋，所以務必先備份。整合包更新也可能把修改覆蓋；更新前後可以比較備份，必要時重新翻譯。

## 既有翻譯、合併與快取

工具會讀取 `resourcepacks` 內現有 ZIP，逐鍵比對已存在的 `zh_tw`，只翻缺少的字串。合併模式不覆蓋舊翻譯，適合持續補齊整合包。

- `translation_cache.db`：共用字串翻譯快取。只有想全部重翻時才刪除。
- `logs/translation_YYYYMMDD_*.log`：完整執行記錄。
- `logs/issues_YYYYMMDD_*.log`：警告與錯誤，回報問題時優先提供。

修改術語字典後，舊快取可能仍回傳原譯文。若確定要套用新術語，先備份，再刪除相關快取或整個 `translation_cache.db` 重新翻譯。

## 常見問題

### 測試 LM Studio 連線失敗

確認 Developer 的 Status 是 Running、模型已載入、網址結尾包含 `/v1`。若模型在另一台電腦，檢查防火牆與 Serve on Local Network。

### 翻譯非常慢或輸出思考過程

關閉 Enable Thinking，確認 GPU offload 已啟用。CPU 執行大型模型會非常慢；必要時改小模型或改用 Google Translate。

### 批次翻譯逾時

把 Batch 降到 10、Context 降一級、Workers 改成 1。先用少數模組測試穩定，再處理整包。

### 已翻譯模組又被送去翻譯

確認舊資源包 ZIP 位於目前實例的 `resourcepacks`，且裡面的語言碼是相同目標 `zh_tw`。也要確認輸出路徑沒有指到另一個實例。

### 遊戲看不到資源包

確認 ZIP 在正確 `resourcepacks`、根目錄直接含 `pack.mcmeta`，並在遊戲資源包選單啟用。版本變更後可重新執行工具，讓它產生符合目前版本的 pack format。

### 翻譯品質不一致

先縮小到單一模組測試模型與術語，再處理整包。本地模型較能配合提示與術語，但不同批次仍可能有差異；Google Translate 較一致，但遊戲語境與專有名詞通常較弱。
