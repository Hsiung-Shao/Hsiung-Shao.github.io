## 這個工具能幫你做什麼

玩模組整合包最常遇到的就是一堆模組沒有中文，任務書也是滿滿的英文。Minecraft MOD 翻譯工具會掃整合包裡的模組跟設定資料，幫你產生一個繁體中文資源包。它可以翻的東西有：

- JAR 裡面的 `assets/*/lang/en_us.json`。
- `config`、`kubejs` 這些資料夾裡的語言檔。
- FTB Quests 的 `en_us.snbt` 語言檔。
- FTB Quests chapter 裡直接寫在任務上的 `title`、`description` 等文字。

翻譯可以用 LM Studio／Ollama 的本地模型、Google Translate 的免費端點，或其他 OpenAI 相容的 API。一般 Windows 使用者下載一個執行檔就能用，不用裝 Python。

![Minecraft MOD 翻譯工具主畫面](/images/guides/minecraft/00-app-overview.png)

*左邊設定翻譯來源跟資料夾，右邊看分析、進度跟記錄。*

## 開始之前：先準備跟備份

1. 到 [Minecraft MOD 翻譯工具 Releases](https://github.com/Hsiung-Shao/minecraftTranslate/releases/latest) 下載 `MinecraftTranslate.exe`。
2. 找到整合包的 Minecraft 實例資料夾，確認裡面有 `mods`、`config`、`resourcepacks` 這些資料夾。
3. **先備份 `config/ftbquests/quests/`**。一般模組的翻譯會輸出成新的資源包，但 FTB Quests chapter 裡的文字是直接改原本的 SNBT 檔。
4. 決定要用哪種翻譯：沒有適合的顯示卡、或只是想快點用，就選 Google Translate；在意資料留在自己電腦、想要術語比較準，就選 LM Studio。

Windows SmartScreen 可能會因為執行檔沒有簽章跳警告。只從專案的 Release 下載，確認來源之後再決定要不要執行。

## 使用方式 A：Google Translate

Google Translate 不用 API Key，也不用獨立顯示卡，最快上手。

1. 打開工具，切到「連線」分頁。
2. 服務商選「Google Translate（免費）」，API 網址跟金鑰留空。
3. 按「測試連線」，確認狀態是成功。
4. 切回「翻譯」分頁，按資料夾按鈕選整合包的 `mods` 資料夾。
5. 工具會試著把輸出自動設成同一個實例的 `resourcepacks`；核對一下路徑，不要輸出到別的整合包去了。
6. 目標語言選繁體中文 `zh_tw`。
7. 先按「分析」，看一下找到哪些 JAR、資料夾來源、FTB Quests，還有總共要翻幾條字串。
8. 全部都要翻就按「開始翻譯」；只想翻一部分就按「選擇模組」，勾好再按「開始翻譯選定模組」。
9. 跑完之後確認輸出路徑有出現 `ModTranslation_zh_tw.zip`。

免費的 Google 端點有速率限制，工具雖然有加請求延遲，還是可能暫時被擋。遇到錯誤就先停個幾分鐘再繼續，不要一直重試。

## 使用方式 B：LM Studio 本地模型

用本地模型不需要 API Key，翻譯的文字也不會送到外面，但需要夠大的記憶體跟顯示記憶體。8GB VRAM 可以從 Qwen3 8B 的 Q4 量化開始試；12GB VRAM 可以考慮 Qwen3 14B Q4。

### 1. 安裝跟下載模型

1. 從 [LM Studio](https://lmstudio.ai/) 裝桌面版。
2. 打開左邊的 Discover，搜 `Qwen3 8B` 或 `Qwen3 14B`。
3. 選 GGUF 格式，不要選 VL 或 Coder 版本。
4. 第一次建議用 `Q4_K_M`；LM Studio 顯示 Full GPU Offload Possible 就代表顯示記憶體夠用。
5. 下載完進到 Developer 頁面。

![在 LM Studio 下載 Qwen3 模型](/images/guides/minecraft/01-download-model.png)

*Q4_K_M 通常是模型大小、速度跟品質之間比較平衡的選擇。*

### 2. 把本機 API 開起來

1. 在 Developer 頁把 Status 切成 Running。
2. 確認 Reachable at 有顯示位址，預設是 `http://localhost:1234`。
3. 按「Load Model」選剛剛下載的模型。
4. 等記錄顯示模型載入完成。看到 CUDA0 或 GPU offload 就代表主要是顯示卡在跑。

![LM Studio Developer 伺服器](/images/guides/minecraft/02-developer-server.png)

*伺服器要保持 Running，翻譯的時候也不要把 LM Studio 關掉。*

### 3. 關掉 Thinking，設定 Context

模型載入之後，在右邊的參數面板：

- Context Length 建議至少 `8192`。
- **Enable Thinking 一定要關掉**。一條一條翻譯根本不需要推理，開著可能會慢 10 到 20 倍，模型還可能把思考過程混進翻譯結果裡。
- System Prompt 留空，翻譯工具會自己給提示。

![LM Studio 模型參數](/images/guides/minecraft/05-model-ready.png)

*關掉 Enable Thinking 是影響速度最大的設定。*

### 4. 讓翻譯工具連到 LM Studio

1. 回到 Minecraft 翻譯工具的「連線」分頁。
2. 服務商選「LM Studio（本機）」。
3. API 網址確認是 `http://localhost:1234/v1`。
4. 按「測試連線」。成功的話會列出可以用的模型跟目前載入的模型。
5. 回到「翻譯」分頁，選好 `mods`、輸出資料夾跟 `zh_tw`，先跑一次分析。

如果模型跑在區網的另一台電腦，LM Studio 要打開 Serve on Local Network，網址改成那台的 IP，例如 `http://192.168.1.100:1234/v1`。只在你信任的區網裡這樣開。

## 分析、選模組，然後開始翻

「分析」只會掃描，不會呼叫翻譯服務，也不會改任何檔案。跑完會看到來源數量跟總字串數：

1. 先確認 `mods` 路徑是對的那個實例。
2. 看一下有沒有找到資料夾裡的語言檔跟 FTB Quests。
3. 按「選擇模組」可以把已經有不錯繁中、暫時用不到、或字串多到嚇人的模組排除掉。
4. 開始翻之後可以暫停或取消；取消不會刪掉已經寫進快取的翻譯。
5. 進度列會分開顯示快取命中跟真的送去翻譯的數量。

翻到一半中斷也沒關係，重開程式再跑一次就好。`translation_cache.db` 會記住已經翻過的相同字串，下次直接拿來用。

## 效能設定怎麼選

可以先按「進階 → 偵測 VRAM 自動設定」，再看穩不穩定慢慢調：

| VRAM | Context | Batch | Workers |
| --- | ---: | ---: | ---: |
| 少於 6GB | 4096 | 8 | 1 |
| 6–12GB | 8192 | 15 | 2 |
| 12–24GB | 16384 | 20 | 2 |
| 24GB 以上 | 32768 | 30 | 3 |

批次逾時的話，先把 batch 降到 10；記憶體不夠就降 Context 或 Workers。Workers 開多不一定比較快，如果模型後端一次只能好好處理一個請求，並行反而會讓大家都在等。

## 把資源包裝進遊戲

1. 翻完之後打開輸出資料夾。
2. 確認 `ModTranslation_zh_tw.zip` 是直接放在那個實例的 `resourcepacks` 裡。
3. 打開 Minecraft，進「選項 → 資源包」。
4. 把 `ModTranslation_zh_tw` 移到已選取的清單。
5. 建議放在其他模組翻譯包的上面，讓它的優先權比較高。
6. 進遊戲看一下物品名稱、介面跟說明；有些模組要重開遊戲才會重新讀語言資料。

輸出的 ZIP 裡有自動偵測的 `pack.mcmeta`，還有各個模組的 `assets/<namespace>/lang/zh_tw.json`。不要把 ZIP 解壓之後又多包一層資料夾，不然 Minecraft 可能認不出來。

## FTB Quests 要特別注意

FTB Quests 有兩種處理方式：

- `en_us.snbt` 語言檔：會在同一個資料夾產生 `zh_tw.snbt`。
- chapter 檔裡直接寫的文字：會直接改 `config/ftbquests/quests/chapters/*.snbt`。

第二種不是用資源包蓋過去，是真的改原檔，所以一定要先備份。整合包更新也可能把你改過的蓋回去；更新前後可以跟備份比一下，需要的話再重翻一次。

## 已經有的翻譯、合併跟快取

工具會讀 `resourcepacks` 裡已經有的 ZIP，一條一條比對已經存在的 `zh_tw`，只翻缺的那些。合併模式不會蓋掉舊的翻譯，很適合慢慢把整合包補齊。

- `translation_cache.db`：共用的字串翻譯快取。只有想全部重翻的時候才刪它。
- `logs/translation_YYYYMMDD_*.log`：完整的執行記錄。
- `logs/issues_YYYYMMDD_*.log`：警告跟錯誤，回報問題時先給我這個。

改了術語字典之後，舊快取可能還是會回傳以前的翻譯。確定要套新術語的話，先備份，再刪掉相關的快取或整個 `translation_cache.db` 重翻。

## 常見問題

### 測試 LM Studio 連線失敗

確認 Developer 的 Status 是 Running、模型有載入、網址結尾有 `/v1`。模型在另一台電腦的話，再檢查防火牆跟 Serve on Local Network。

### 翻譯超慢，或是輸出了思考過程

把 Enable Thinking 關掉，確認有開 GPU offload。用 CPU 跑大模型會非常慢，必要的話換小一點的模型，或改用 Google Translate。

### 批次翻譯逾時

Batch 降到 10、Context 降一級、Workers 改成 1。先拿幾個模組試到穩定，再處理整包。

### 已經翻過的模組又被送去翻

確認舊的資源包 ZIP 在目前這個實例的 `resourcepacks` 裡，而且裡面的語言碼一樣是 `zh_tw`。也確認輸出路徑沒有指到別的實例。

### 遊戲裡看不到資源包

確認 ZIP 在正確的 `resourcepacks`、根目錄直接就有 `pack.mcmeta`，而且有在遊戲的資源包選單裡啟用。換了遊戲版本的話，重跑一次工具，讓它產生符合目前版本的 pack format。

### 翻譯品質不太一致

先縮小到單一模組測試模型跟術語，再處理整包。本地模型比較能配合提示跟術語，但不同批次還是可能有差；Google Translate 比較一致，但遊戲語境跟專有名詞通常比較弱。
