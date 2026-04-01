# 部署到 GitHub Pages

當目標是將目前專案部署到 GitHub Pages，並回傳可實際使用的公開網址時，使用這份提示。

## 執行內容

1. 先確認目前目錄是 git repository，且 `origin` 指向 GitHub repository。
2. 在部署前檢查是否有尚未提交的 git 變更：
   - 若有變更，先自動 `git add -A`
   - 以合理的部署訊息自動 `git commit`
   - 再繼續部署流程
   - 若沒有變更，直接進入部署流程
3. 先用 `npm run build` 驗證專案可以在本機成功建置。
4. 確認 Vite 已正確設定 GitHub Pages 子路徑所需的 `base`。
5. 新增或更新 `.github/workflows/deploy-gh-pages.yml`，讓它在以下情況自動部署：
   - push 到 `main`
   - 手動觸發 `workflow_dispatch`
6. 優先使用 GitHub 官方 GitHub Pages Actions：
   - `actions/configure-pages`
   - `actions/upload-pages-artifact`
   - `actions/deploy-pages`
7. 部署流程必須能夠輸出部署網址，至少包含：
   - job 的 `environment.url`
   - `GITHUB_STEP_SUMMARY`
8. 如果儲存庫尚未啟用正確設定，要明確告知使用者到：
   - `Settings > Pages > Source: GitHub Actions`

## 回覆時必須包含

- 說明這次修改了哪些檔案。
- 說明本機建置驗證是否成功。
- 說明部署前是否偵測到 git 變更，以及是否已自動提交。
- 提供預期的 GitHub Pages 網址格式：
  - `https://<owner>.github.io/<repo>/`
- 如果 workflow 已經成功執行，提供實際部署完成的網址。
- 如果目前環境無法直接完成部署，要清楚說明原因，並告知使用者下一步需要在 GitHub 上完成什麼設定。

## 注意事項

- 除非專案原本就使用 `gh-pages` 分支發布，否則不要改用舊式 `gh-pages` branch 流程。
- 優先使用官方 GitHub Actions，不要自建多餘的自訂部署流程。
- 如果環境中可取得 `GITHUB_REPOSITORY`，應以此推導 Vite 的 `base` 路徑。
- 若已安裝並登入 `gh`，可在部署後查詢 workflow 狀態，並回報最終上線網址。
- 如果部署命令本身已內建自動提交邏輯，應優先沿用既有腳本，而不是重複實作另一套提交流程。
