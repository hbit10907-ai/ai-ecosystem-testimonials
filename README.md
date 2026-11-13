# Ai生態圈App 使用見證

這是一個獨立的靜態網頁，整理[原網站的使用見證](https://shengtaiquanappgongneng.webnode.page/%e5%9c%98%e9%9a%8a/)。見證文字、店名與匿名姓名擷取於 2026-11-13，保留原文用字。

人物照片由 AI 生成，僅供版面示意，並非見證者本人。

## 本機預覽

需要 Python 3：

```powershell
python -m http.server 8000
```

在瀏覽器開啟 `http://localhost:8000/`。網站不需要安裝套件。

## 檢查資料與篩選功能

需要 Node.js 22：

```powershell
node --test tests/site.test.mjs
```

## 更新內容

在 `data.mjs` 修改見證資料。每筆資料依序為店名、匿名姓名、推薦功能與見證原文。人像檔依順序放在 `assets/portraits/portrait-01.webp` 至 `portrait-33.webp`。

## 發布

GitHub Pages 來源設為 `main` 分支的 `/ (root)`。頁面使用相對路徑，可直接從專案網址提供。
