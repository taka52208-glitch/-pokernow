# PokerNow デプロイガイド

## 概要

- **フロントエンド**: Vercel
- **バックエンド**: Render

---

## 1. バックエンドのデプロイ（Render）

### 1.1 Renderアカウント作成
1. [Render](https://render.com/) にアクセス
2. GitHubアカウントでサインアップ

### 1.2 新しいWeb Serviceを作成
1. Dashboard → **New** → **Web Service**
2. GitHubリポジトリを接続
3. 以下の設定を入力：

| 設定項目 | 値 |
|---------|-----|
| Name | `pokernow-api` |
| Region | Singapore (または最寄りのリージョン) |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install && npx prisma generate && npx prisma db push && npm run build` |
| Start Command | `npm run start` |
| Plan | Free |

### 1.3 環境変数の設定
**Environment** タブで以下を設定：

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3248` |
| `JWT_SECRET` | (Generate) ※自動生成を選択 |
| `DATABASE_URL` | `file:./prisma/dev.db` |
| `FRONTEND_URL` | ※Vercelデプロイ後に設定 |

### 1.4 デプロイ
**Create Web Service** をクリック

### 1.5 デプロイ完了後
- デプロイURLをメモ（例: `https://pokernow-api.onrender.com`）
- ヘルスチェック: `https://pokernow-api.onrender.com/health`

---

## 2. フロントエンドのデプロイ（Vercel）

### 2.1 Vercelアカウント作成
1. [Vercel](https://vercel.com/) にアクセス
2. GitHubアカウントでサインアップ

### 2.2 新しいプロジェクトを作成
1. Dashboard → **Add New** → **Project**
2. GitHubリポジトリをインポート
3. 以下の設定を入力：

| 設定項目 | 値 |
|---------|-----|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 2.3 環境変数の設定
**Environment Variables** で以下を設定：

| Key | Value |
|-----|-------|
| `VITE_APP_NAME` | `PokerNow` |
| `VITE_API_URL` | `https://pokernow-api.onrender.com` ※Renderのデプロイ先URL |

### 2.4 デプロイ
**Deploy** をクリック

### 2.5 デプロイ完了後
- デプロイURLをメモ（例: `https://pokernow.vercel.app`）
- **重要**: RenderのFRONTEND_URLをこのURLに更新

---

## 3. CORS設定の更新

### 3.1 Render側でFRONTEND_URLを更新
1. Render Dashboard → pokernow-api → Environment
2. `FRONTEND_URL` を Vercel のURLに更新
3. **Save Changes** → 自動再デプロイ

---

## 4. 動作確認

### 4.1 バックエンドAPI
```bash
curl https://pokernow-api.onrender.com/health
```

### 4.2 フロントエンド
ブラウザで `https://pokernow.vercel.app` にアクセス

---

## 5. トラブルシューティング

### バックエンドが起動しない
- Render のログを確認
- 環境変数が正しく設定されているか確認

### フロントエンドからAPIに接続できない
- `VITE_API_URL` が正しいか確認
- RenderのCORS設定（`FRONTEND_URL`）が正しいか確認

### SQLiteデータが消える（Render Free Plan）
- Renderの無料プランではファイルシステムが再デプロイ時にリセットされます
- 永続化が必要な場合はPostgreSQLへの移行を検討してください

---

## 6. カスタムドメイン（オプション）

### Vercel
1. Project Settings → Domains
2. カスタムドメインを追加
3. DNSレコードを設定

### Render
1. Service Settings → Custom Domains
2. カスタムドメインを追加
3. DNSレコードを設定

---

## デプロイ完了チェックリスト

- [ ] Renderにバックエンドをデプロイ
- [ ] ヘルスチェックAPI確認
- [ ] Vercelにフロントエンドをデプロイ
- [ ] 環境変数（VITE_API_URL）設定
- [ ] RenderのFRONTEND_URL更新
- [ ] ブラウザで動作確認
- [ ] ログイン機能テスト
- [ ] 店舗一覧表示確認
