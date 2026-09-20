# 🧈 Butterball

AI 廣告素材工作站 · cacaFly 內部工具

---

## 📦 專案結構

```
butterball-vercel/
├── index.html              # 前端主檔(Butterball 本體)
├── api/
│   └── openai-proxy.js     # OpenAI API 代理(繞開 CORS)
├── vercel.json             # Vercel 部署設定
├── package.json
└── README.md               # 本檔
```

---

## 🚀 首次部署到 Vercel(30 分鐘)

### 1. 準備 GitHub Repo(5 分鐘)

假設你還沒有 GitHub 帳號 → 到 https://github.com 註冊

**建立 repo:**
- 在 GitHub 網頁右上角點 `+ → New repository`
- 名稱:`butterball`
- 選 **Private**(重要!不要 Public,免得 code 曝光)
- 建立

**把這個資料夾推上去:**

```bash
# 在你電腦上,進到 butterball-vercel 資料夾
cd butterball-vercel

# 初始化 git
git init
git add .
git commit -m "Initial commit"

# 綁定到 GitHub repo(替換成你的網址)
git branch -M main
git remote add origin https://github.com/<你的 GitHub 帳號>/butterball.git
git push -u origin main
```

### 2. 連 Vercel(10 分鐘)

- 到 https://vercel.com,用 GitHub 帳號登入(免費)
- Dashboard 右上角 `Add New... → Project`
- 找到你剛推的 `butterball` repo → `Import`
- **設定:**
  - Framework Preset:`Other`
  - Root Directory:`./`(預設)
  - Build Command:留空
  - Output Directory:留空
- 點 **Deploy**

30 秒後上線,你會拿到一個網址,例如:
```
https://butterball-abc123.vercel.app
```

### 3. 測試(5 分鐘)

打開 Vercel 給你的網址 → 應該看到 Butterball 頁面
- 貼 Gemini Key → 生 1 張測試 → 應該通
- 貼 OpenAI Key → 生 1 張測試 → 應該通(這個要 proxy 有正常運作)

### 4. 自訂網域(選用,10 分鐘)

如果你有 cacaFly 網域,可以綁 `butterball.cacafly.com`:
- Vercel 專案 → Settings → Domains → Add
- 依 Vercel 指示到你的 DNS 加 CNAME 紀錄

---

## 🔄 之後更新版本(3 分鐘)

改完 code 後:

```bash
git add .
git commit -m "v7.10 · 加入 XX 功能"
git push
```

Vercel 會自動偵測 → 30 秒後上線。同事下次刷新頁面就是新版。

**看部署狀態:** Vercel Dashboard 的 Deployments 頁面。

---

## 💰 費用

**Vercel 免費層(Hobby Plan):**
- 每月 100 GB 頻寬(夠用)
- 每月 100,000 次 Serverless 呼叫(夠用)
- 每次 Function 最長執行 300 秒(足夠 OpenAI 生圖等待)

**估算:一天 50 次生圖 = 一個月 1500 次呼叫,遠低於上限。**

實際會超上限的情境:整個公司 50 人每天都用、每人生 100 張。到那個規模再升級 Vercel Pro($20/月)。

**⚠️ OpenAI / Gemini 的 API 費用不是 Vercel 收的**,是使用者自己付給 OpenAI / Google。

---

## 🔒 安全性說明

- **使用者的 OpenAI Key 會流經你的 Vercel 伺服器**(用來代打 OpenAI)
  - 只是轉發,不記錄、不儲存
  - 已在 `api/openai-proxy.js` 明確不留 log
  - 只允許 3 個特定 OpenAI endpoint(不能被拿來打其他 API)
- **Gemini Key 不會經過你的伺服器**(前端直連 Google,因為 Gemini 允許)
- **前端 code 公開可見**(HTML source 誰都看得到),裡面不能寫死任何 Key

---

## 🛠 本機開發(選用)

如果想在本機測試改動:

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 在專案目錄啟動
vercel dev
```

會在 http://localhost:3000 啟動,proxy 也會運作。

---

## 📝 版本紀錄

- **v7.9** · AI 重生 resize、Nano Banana Flash 引擎
- **v7.8** · 加 Nano Banana Flash 便宜引擎
- **v7.7** · 擷取重點可編輯、抑制 AI 腦補
- **v7.6** · 優惠截圖上傳分析
- **v7.5** · 每個選項加 AI 決定、批次 resize、實際廣告尺寸
- **v7.4** · PDF 圖片版 fallback + 圖片直接上傳
- **v7.3** · Sunburst 引擎、4:5 尺寸、ZIP 下載、文字大小強化
- **v7.2** · 人像 9 大類 57 chip
- **v7.1** · 品牌調性擴充 17 個
- **v7** · PDF 上傳、模特兒張數控制、safety retry
