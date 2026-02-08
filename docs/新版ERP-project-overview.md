# 專案概覽 - WineFont 進銷存管理系統

> 版本：1.0.0  
> 最後更新：2026/02/08

---

## 📌 專案介紹

本專案是一套專為**酒類經銷商**設計的全端進銷存管理系統，旨在取代傳統 PHP 後台系統，提供現代化的使用者介面與更高效的業務流程管理。

### 主要功能

| 模組 | 功能說明 |
|------|---------|
| 🛒 **訂單管理** | 建立/編輯訂單、訂單狀態追蹤、出貨/收款流程、發票管理 |
| 📦 **產品管理** | 產品資料維護、產品組合（Bundle）管理、贈品設定 |
| 🏬 **庫存管理** | 批次追蹤、庫存異動紀錄、安全庫存警示 |
| 👥 **客戶管理** | 客戶資料維護、寄庫管理、借出紀錄 |
| 🏭 **廠商管理** | 供應商資料維護、進貨單管理 |
| 📊 **報表匯出** | 出貨單、發票、進銷報表 Excel 匯出 |

---

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (Frontend)                       │
│  React 19 + TypeScript + Vite + TailwindCSS + shadcn/ui    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase (BaaS)                          │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │  PostgreSQL DB  │  │  Auth 驗證   │  │  Edge Functions│   │
│  └─────────────────┘  └──────────────┘  └───────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      部署 (Deployment)                       │
│                      Vercel + Supabase                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 專案目錄結構

```
winefontdb/
├── src/                          # 前端原始碼
│   ├── components/               # React 元件
│   │   ├── ui/                   # shadcn/ui 基礎元件
│   │   ├── layout/               # 版面配置元件
│   │   └── auth/                 # 身份驗證元件
│   ├── pages/                    # 頁面元件
│   │   ├── orders/               # 訂單管理
│   │   ├── products/             # 產品管理
│   │   ├── inventory/            # 庫存管理
│   │   ├── clients/              # 客戶管理
│   │   └── vendors/              # 廠商管理
│   ├── lib/                      # 工具函式庫
│   │   ├── supabase.ts           # Supabase 客戶端設定
│   │   ├── excel/                # Excel 匯出功能
│   │   └── utils.ts              # 共用工具函式
│   ├── contexts/                 # React Context
│   └── hooks/                    # 自訂 Hooks
├── supabase/                     # Supabase 設定
│   ├── migrations/               # 資料庫遷移檔案
│   └── functions/                # Edge Functions
├── docs/                         # 專案文件
├── excel_templete/               # Excel 範本檔案
├── scripts/                      # 開發腳本
└── tests/                        # 測試檔案
```

---

## 🛠️ 技術棧

### 前端 (Frontend)

| 類別 | 技術 | 版本 | 說明 |
|------|------|------|------|
| **框架** | React | 19.x | UI 框架 |
| **語言** | TypeScript | 5.9 | 型別安全的 JavaScript |
| **建置工具** | Vite | 7.x | 快速的開發伺服器與建置工具 |
| **樣式** | TailwindCSS | 4.x | Utility-first CSS 框架 |
| **UI 套件** | shadcn/ui | - | 基於 Radix UI 的元件庫 |
| **路由** | React Router | 7.x | 客戶端路由 |
| **表單** | React Hook Form | 7.x | 高效能表單管理 |
| **驗證** | Zod | 4.x | Schema 驗證 |
| **圖示** | Lucide React | - | 圖示庫 |
| **日期** | date-fns | 4.x | 日期處理 |
| **Excel** | ExcelJS | 4.x | Excel 檔案生成 |

### 後端 (Backend)

| 類別 | 技術 | 說明 |
|------|------|------|
| **BaaS** | Supabase | 後端即服務平台 |
| **資料庫** | PostgreSQL | 關聯式資料庫 |
| **驗證** | Supabase Auth | 使用者身份驗證 |
| **Serverless** | Edge Functions | 伺服器端邏輯（Deno） |

### 開發工具

| 類別 | 技術 | 說明 |
|------|------|------|
| **測試** | Vitest | 單元測試框架 |
| **測試庫** | Testing Library | React 元件測試 |
| **Linter** | ESLint | 程式碼品質檢查 |
| **部署** | Vercel | 前端部署平台 |

---

## 🔗 相關文件

- [資料庫結構文件](../DATABASE_SCHEMA.md)
- [ECPay 發票整合指南](./ECPAY_INTEGRATION_GUIDE.md)
- [Supabase 本地開發設定](./SUPABASE_LOCAL_SETUP.md)
- [Vercel 部署設定](./VERCEL_SETUP.md)
- [Excel 報表功能總覽](./excel-report-summary.md)

---

## 🚀 快速開始

### 環境需求

- Node.js 20+
- npm 或 pnpm

### 安裝與執行

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 執行測試
npm run test

# 建置生產版本
npm run build
```

### 環境變數

複製 `.env.example` 為 `.env.local` 並設定以下變數：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📊 資料庫架構

系統使用 PostgreSQL 作為資料庫，主要資料表包含：

| 資料表 | 說明 |
|--------|------|
| `clients` | 客戶資料 |
| `products` | 產品資料 |
| `product_batches` | 產品批次 |
| `product_bundles` | 產品組合 |
| `orders` | 訂單主檔 |
| `order_items` | 訂單明細 |
| `vendors` | 廠商資料 |
| `purchase_orders` | 進貨單 |
| `inventory_logs` | 庫存異動紀錄 |
| `deposit_records` | 寄庫紀錄 |
| `loan_records` | 借出紀錄 |

詳細結構請參閱 [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md)。

---

## 📝 開發狀態

| 模組 | 狀態 |
|------|------|
| 訂單管理 | ✅ 已完成 |
| 產品管理 | ✅ 已完成 |
| 庫存管理 | ✅ 已完成 |
| 客戶管理 | ✅ 已完成 |
| 廠商管理 | ✅ 已完成 |
| 財務管理 | 🚧 開發中 |
| 報表中心 | 🚧 開發中 |
| 系統設定 | 🚧 開發中 |
