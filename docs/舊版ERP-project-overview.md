# 專案架構與技術文件

## 專案簡介

這是一個基於 **PHP** 開發的企業後台行政管理系統，用於管理訂單、進貨、產品、客戶、廠商及財務報表等業務流程。系統整合了蝦皮（Shopee）、EasyStore、Line 等電商平台的資料匯入功能，並提供豐富的 Excel 報表匯出能力。

---

## 技術棧

| 類別 | 技術 |
|------|------|
| **後端語言** | PHP 8.x |
| **資料庫** | MySQL (mysqli 擴充) |
| **前端框架** | Bootstrap 5.3、jQuery 3.4 |
| **圖表庫** | Chart.js |
| **圖示** | Font Awesome 6.4 |
| **Excel 處理** | PhpSpreadsheet / PHPExcel |
| **Web Server** | Apache (XAMPP 環境) |

---

## 目錄結構

```
work/
├── index.php              # 主頁（儀表板）
├── Login.php              # 登入頁面
├── LoginCheck.php         # 登入驗證
├── Logout.php             # 登出處理
├── CheckCookie.php        # Cookie 驗證
│
├── Add/                   # 新增資料頁面
│   ├── Client.php         # 新增客戶
│   ├── Vendor.php         # 新增廠商
│   ├── Product.php        # 新增產品
│   ├── List.php           # 新增訂單
│   ├── Import.php         # 新增進貨
│   └── ProductPack.php    # 新增產品組合包
│
├── Menu/                  # 主選單頁面
│   ├── Client.php         # 客戶管理列表
│   ├── Vendor.php         # 廠商管理列表
│   ├── Product.php        # 產品管理列表
│   ├── List.php           # 訂單管理列表
│   ├── Import.php         # 進貨管理列表
│   └── Financial.php      # 財務管理
│
├── Product/               # 產品相關功能
│   ├── Park.php           # 產品庫存管理
│   ├── ProductPackage.php # 產品組合包
│   ├── checkProduct.php   # 產品盤點
│   ├── safetyStock.php    # 安全庫存
│   ├── salesVolume.php    # 銷售量統計
│   └── WaitingForDelivery.php # 待出貨列表
│
├── Alert/                 # 警示系統
│
├── Report/                # 報表頁面
│   └── report.php         # 報表生成
│
├── import/                # 資料匯入頁面
│
├── modules/               # 模組化功能
│   ├── batch/             # 批次管理
│   ├── client/            # 客戶模組
│   ├── order/             # 訂單模組
│   ├── product/           # 產品模組
│   ├── vendor/            # 廠商模組
│   └── import/            # 進貨模組
│
├── test_ecpay/            # 綠界金流測試
│
└── libs/                  # 核心函式庫
    ├── database.php       # 資料庫連線類別
    ├── config/            # 設定檔
    │   └── serverInfo.php # 伺服器連線資訊
    ├── css/               # 樣式表
    │   ├── main.css
    │   ├── theme.css
    │   ├── sidebar.css
    │   └── modern-theme.css
    ├── js/                # JavaScript 檔案
    │   ├── universal.js
    │   └── webLink.js
    ├── templates/         # 共用模板
    │   ├── header.php     # 頁首（導覽列與側邊欄）
    │   └── footer.php     # 頁尾
    ├── getData/           # 資料查詢 API
    │   ├── List.php       # 訂單資料
    │   ├── Product.php    # 產品資料
    │   ├── clientData.php # 客戶資料
    │   ├── vendorData.php # 廠商資料
    │   ├── import.php     # 進貨資料
    │   ├── undoneData.php # 未完成訂單/進貨
    │   └── ...
    ├── edit/              # 編輯詳情頁面
    │   ├── ListDetail.php      # 訂單詳情
    │   ├── importDetail.php    # 進貨詳情
    │   ├── clientDetail.php    # 客戶詳情
    │   ├── vendorDetail.php    # 廠商詳情
    │   ├── DepositDetail.php   # 押金詳情
    │   └── PackageDetail.php   # 組合包詳情
    ├── export/            # Excel 報表匯出
    │   ├── LExportExcel.php    # 出貨單匯出
    │   ├── RExportExcel.php    # 報表匯出
    │   ├── RAExportExcel.php   # 區域分析匯出
    │   ├── DailyReport.php     # 每日報表
    │   ├── Financial.php       # 財務報表
    │   ├── exportClient.php    # 客戶匯出
    │   ├── exportProduct.php   # 產品匯出
    │   ├── PrintHTML.php       # HTML 列印
    │   ├── PHPExcel/           # PHPExcel 函式庫
    │   ├── PhpSpreadsheet/     # PhpSpreadsheet 函式庫
    │   └── achievement-report/ # 業績報表子目錄
    ├── import/            # 電商平台資料匯入
    │   ├── shopee/        # 蝦皮訂單匯入
    │   ├── easyStore/     # EasyStore 訂單匯入
    │   └── line/          # Line 訂單匯入
    ├── upload/            # 資料上傳處理
    │   ├── ListUpload.php       # 訂單上傳
    │   ├── ImportUpload.php     # 進貨上傳
    │   ├── ProductUpload.php    # 產品上傳
    │   ├── ClientUpload.php     # 客戶上傳
    │   ├── VendorUpload.php     # 廠商上傳
    │   └── FinancialUpload.php  # 財務上傳
    └── update/            # 更新同步功能
        ├── shopee/        # 蝦皮庫存更新
        ├── EasyStore/     # EasyStore 更新
        └── line/          # Line 更新
```

---

## 核心功能模組

### 1. 訂單管理 (Order Management)

- 新增、編輯、刪除訂單
- 訂單狀態追蹤（報價中、待付款、已完成）
- 出貨單列印與匯出
- 支援蝦皮、EasyStore、Line 等電商平台訂單匯入

### 2. 進貨管理 (Import/Purchase Management)

- 進貨單新增與編輯
- 批次號管理
- 進貨狀態追蹤

### 3. 產品管理 (Product Management)

- 產品基本資料維護
- 庫存管理與安全庫存警示
- 產品組合包管理
- 批次產品批量更新

### 4. 客戶管理 (Client Management)

- 客戶資料維護
- 客戶訂單歷史查詢

### 5. 廠商管理 (Vendor Management)

- 廠商資料維護
- 進貨記錄關聯

### 6. 財務管理 (Financial Management)

- 財務報表生成
- 每日報表
- 業績分析

### 7. 報表匯出 (Report Export)

- Excel 報表匯出（使用 PhpSpreadsheet / PHPExcel）
- 出貨單、訂單單、盤點表等多種報表格式
- HTML 列印功能

### 8. 電商平台整合

- **蝦皮 (Shopee)**: 訂單匯入、庫存同步更新
- **EasyStore**: 訂單匯入、資料同步
- **Line**: 訂單匯入

---

## 資料庫架構

系統使用 MySQL 資料庫，透過 `libs/database.php` 提供統一的資料庫連線封裝類別 `Database`，支援：

- Prepared Statement 參數綁定（防止 SQL Injection）
- UTF-8 字符集設定
- 自動錯誤處理

---

## 前端架構

### UI 框架

- **Bootstrap 5.3**: 響應式網格系統、元件、表單樣式
- **Font Awesome 6.4**: 圖示套件

### JavaScript

- **jQuery 3.4**: DOM 操作、AJAX 請求
- **Chart.js**: 銷售業績圖表（年度/月度/週度切換）

### 自訂樣式

- `modern-theme.css`: 現代化主題樣式
- `sidebar.css`: 側邊欄導航樣式
- `theme.css`: 色彩主題配置

---

## 安全機制

- Session 基礎的使用者驗證
- Cookie 驗證機制
- Prepared Statement 防止 SQL Injection
- HTML 特殊字元轉義（防止 XSS）

---

## 開發環境

- **Server**: XAMPP (Apache + MySQL + PHP)
- **路徑**: `E:\Xampp\htdocs\work\`
- **入口**: `http://localhost/work/`

---

## 整合金流

- **綠界科技 (ECPay)**: 整合測試目錄 `test_ecpay/`
