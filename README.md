# Ai生態圈App 介紹與使用見證

這是一個獨立的靜態網站，首頁介紹[原網站](https://shengtaiquanappgongneng.webnode.page/)列出的案源、客源與資源直送功能；`features.html` 整理[原網站的功能簡介](https://shengtaiquanappgongneng.webnode.page/%e6%9c%8d%e5%8b%99/)與影片；`testimonials.html` 整理[原網站的使用見證](https://shengtaiquanappgongneng.webnode.page/%e5%9c%98%e9%9a%8a/)。見證文字、店名與匿名姓名擷取於 2026-11-13，保留原文用字。

人物照片由 AI 生成，僅供版面示意，並非見證者本人。

## 本機預覽

需要 Python 3：

```powershell
python -m http.server 8000
```

在瀏覽器開啟 `http://localhost:8000/` 查看介紹首頁、`http://localhost:8000/features.html` 查看功能簡介，或開啟 `http://localhost:8000/testimonials.html` 查看見證頁。網站不需要安裝套件。

## 檢查資料與篩選功能

需要 Node.js 22：

```powershell
node --test tests/site.test.mjs
```

## 更新內容

在 `data.mjs` 修改見證資料。每筆資料依序為店名、匿名姓名、推薦功能與見證原文。人像檔依順序放在 `assets/portraits/portrait-01.webp` 至 `portrait-33.webp`。

## 發布

GitHub Pages 來源設為 `main` 分支的 `/ (root)`。頁面使用相對路徑，可直接從專案網址提供。
