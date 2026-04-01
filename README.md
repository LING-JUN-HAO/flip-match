# Flip Match

使用 React 與 Vite 製作的翻牌配對遊戲，共三個關卡，支援即時分數、倒數計時、過關提示與勝利/失敗畫面。

## 遊戲規則

- 共三關，牌組數量依序為 6 組、4 組、2 組
- 每關限時 30 秒
- 一次最多翻開兩張牌
- 兩張相同則保留正面，不同則約 1 秒後自動蓋回
- 每成功配對一組都會得分，剩餘時間越多加分越高

## 技術內容

- React 18
- Vite 5
- 純 CSS 製作 3D `rotateY` 翻牌動畫

主要檔案：

- [src/App.jsx](/Users/he8658/Desktop/flip-match/src/App.jsx)：遊戲狀態、關卡流程、計時與計分邏輯
- [src/styles.css](/Users/he8658/Desktop/flip-match/src/styles.css)：版面、卡片、覆蓋畫面與動畫樣式
- [src/main.jsx](/Users/he8658/Desktop/flip-match/src/main.jsx)：React 入口

## 本機開發

先安裝依賴：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev
```

預設會由 Vite 提供本機網址，通常是 `http://localhost:5173`。

## 打包

建立 production 版本：

```bash
npm run build
```

預覽打包結果：

```bash
npm run preview
```

## 部署到 GitHub Pages

此專案已包含 GitHub Pages workflow：

- [.github/workflows/deploy-gh-pages.yml](/Users/he8658/Desktop/flip-match/.github/workflows/deploy-gh-pages.yml)
- [scripts/deploy.sh](/Users/he8658/Desktop/flip-match/scripts/deploy.sh)

部署方式：

1. 將專案推到 GitHub 儲存庫的 `main` 分支
2. 到 GitHub 的 `Settings > Pages`
3. 將 Source 設為 `GitHub Actions`
4. 之後每次 push 到 `main` 都會自動重新部署

部署成功後，GitHub Actions 的 job summary 會顯示實際網址，格式通常為：

```text
https://<owner>.github.io/<repo>/
```

### 一鍵部署

第一次設定前提：

1. 這個資料夾已經是 git repo
2. 已設定 `origin` 指向 GitHub repo
3. 預設分支是 `main`
4. GitHub Pages 的 Source 已設為 `GitHub Actions`

完成一次設定後，可直接執行：

```bash
npm run deploy
```

或帶入 commit 訊息：

```bash
npm run deploy -- "Deploy memory game update"
```

這個腳本會：

- 先執行 `npm run build`
- 自動 `git add` 與 `git commit`
- 推送到 `origin/main`
- 輸出 GitHub Pages 網址
- 若系統已安裝並登入 `gh`，會等待 workflow 完成並回報實際上線網址

## 目前功能

- 關卡提示畫面
- 遊戲進行中的即時分數與倒數時間
- 三關完整流程
- 失敗與勝利後重新開始
- 響應式卡片版面，支援桌機與手機尺寸
