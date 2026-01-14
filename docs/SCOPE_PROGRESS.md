# PokerNow - 開発進捗管理表

## フェーズ進捗

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1 | 要件定義 | [x] |
| Phase 2 | Git/GitHub管理 | [x] |
| Phase 3 | フロントエンド基盤 | [x] |
| Phase 4 | ページ実装 | [x] |
| Phase 5 | バックエンド基盤 | [x] |
| Phase 6 | バックエンド計画 | [x] |
| Phase 7 | API実装 | [x] |
| Phase 8 | 結合テスト | [x] |
| Phase 9 | デプロイ | [x] |

---

## 統合ページ管理表

### ユーザー（プレイヤー）側ページ

| ID | ページ名 | ルート | 権限レベル | 統合機能 | 着手 | 完了 |
|----|---------|-------|----------|---------|------|------|
| P-001 | ログイン/登録 | `/login` | ゲスト | ソーシャルログインUI、ポーカーネーム登録、表示設定 | [x] | [x] |
| P-002 | 店舗一覧 | `/shops` | 全員 | 店舗カード一覧、混雑状況バッジ、検索・フィルター | [x] | [x] |
| P-003 | 店舗詳細 | `/shops/:id` | 全員 | 店舗情報、イベント一覧、トーナメントタイマー | [x] | [x] |
| P-004 | QRスキャン | `/scan` | プレイヤー | カメラ起動、QR読取、位置確認、着席登録 | [x] | [x] |
| P-005 | マイページ | `/mypage` | プレイヤー | 着席状況、退席ボタン、プロフィール | [x] | [x] |

### 店舗管理側ページ

| ID | ページ名 | ルート | 権限レベル | 統合機能 | 着手 | 完了 |
|----|---------|-------|----------|---------|------|------|
| A-001 | 管理ダッシュボード | `/admin` | 管理者 | 卓マップ、着席統計、クイックアクション | [x] | [x] |
| A-002 | 店舗設定 | `/admin/settings` | 管理者 | 店舗情報編集、卓数設定 | [x] | [x] |
| A-003 | 卓管理 | `/admin/tables` | 管理者 | QRコード表示、着席者一覧、退席操作 | [x] | [x] |
| A-004 | トーナメント管理 | `/admin/tournaments` | 管理者 | トナメ作成、ストラクチャー、進行管理 | [x] | [x] |

---

## 共通コンポーネント

| ID | コンポーネント名 | 用途 | 着手 | 完了 |
|----|-----------------|------|------|------|
| C-001 | ヘッダー/ナビ | ロール切り替え、ナビゲーション | [x] | [x] |
| C-002 | 混雑度バッジ | 空き/やや混雑/混雑の視覚表示 | [x] | [x] |
| C-003 | トーナメントタイマー | レベル・残り時間・ブレイク表示 | [ ] | [ ] |

---

## 作成済みファイル一覧

### フロントエンド基盤
- `frontend/src/theme/` - MUIテーマ（Modern Luxury）
- `frontend/src/contexts/AuthContext.tsx` - 認証コンテキスト
- `frontend/src/types/index.ts` - 型定義
- `frontend/src/layouts/PublicLayout.tsx` - 公開ページ用レイアウト
- `frontend/src/layouts/MainLayout.tsx` - 認証後レイアウト
- `frontend/src/components/common/Header.tsx` - ヘッダー
- `frontend/src/components/common/Sidebar.tsx` - サイドバー
- `frontend/src/components/common/CongestionBadge.tsx` - 混雑度バッジ
- `frontend/src/pages/player/LoginPage.tsx` - ログインページ
- `frontend/src/pages/player/ShopListPage.tsx` - 店舗一覧ページ
- `frontend/src/pages/player/ShopDetailPage.tsx` - 店舗詳細ページ
- `frontend/src/pages/player/QRScanPage.tsx` - QRスキャンページ
- `frontend/src/pages/player/MyPage.tsx` - マイページ
- `frontend/src/pages/admin/AdminDashboardPage.tsx` - 管理ダッシュボード
- `frontend/src/pages/admin/ShopSettingsPage.tsx` - 店舗設定ページ
- `frontend/src/pages/admin/TableManagementPage.tsx` - 卓管理ページ
- `frontend/src/pages/admin/TournamentManagementPage.tsx` - トーナメント管理ページ
- `frontend/src/App.tsx` - メインアプリ

### バックエンド基盤（Hono + Prisma + SQLite）
- `backend/package.json` - 依存関係定義
- `backend/tsconfig.json` - TypeScript設定
- `backend/.env` - 環境変数
- `backend/prisma/schema.prisma` - データベーススキーマ
- `backend/prisma/seed.ts` - シードデータ
- `backend/src/index.ts` - エントリーポイント
- `backend/src/utils/prisma.ts` - Prismaクライアント
- `backend/src/routes/auth.ts` - 認証API
- `backend/src/routes/shops.ts` - 店舗API
- `backend/src/routes/tables.ts` - 卓API
- `backend/src/routes/seatings.ts` - 着席API
- `backend/src/routes/events.ts` - イベントAPI
- `backend/src/routes/tournaments.ts` - トーナメントAPI
- `backend/src/routes/dashboard.ts` - ダッシュボードAPI

---

## バックエンド実装計画

### 2.1 垂直スライス実装順序

| 順序 | スライス名 | 主要機能 | 依存スライス | エンドポイント数 | 完了 |
|------|-----------|---------|-------------|-----------------|------|
| 1 | 認証基盤 | ログイン/ログアウト/トークン管理/プロフィール | なし | 4 | [x] |
| 2-A | 店舗マスター | 店舗一覧/詳細/更新 | 認証基盤 | 3 | [x] |
| 2-B | 卓マスター | 卓CRUD操作 | 認証基盤、店舗 | 4 | [x] |
| 3 | 着席機能 | 着席登録/退席/管理者操作 | 認証、店舗、卓 | 6 | [x] |
| 4-A | イベント機能 | イベント一覧取得 | 店舗 | 1 | [x] |
| 4-B | トーナメント機能 | トナメCRUD/進行制御 | 店舗 | 5 | [x] |
| 5 | ダッシュボード | 統計情報集約 | 店舗、卓、着席、トナメ | 1 | [x] |

※ 番号-アルファベット表記（2-A, 2-B等）は並列実装可能

---

### 2.2 エンドポイント実装タスクリスト

#### スライス1: 認証基盤（最優先）

| タスク | エンドポイント | メソッド | 説明 | 完了 |
|--------|--------------|---------|------|------|
| 1.1 | /api/auth/login | POST | ソーシャルログイン（モック認証） | [x] |
| 1.2 | /api/auth/logout | POST | ログアウト処理 | [x] |
| 1.3 | /api/auth/me | GET | 現在のユーザー情報取得 | [x] |
| 1.4 | /api/auth/profile | PUT | プロフィール更新（ポーカーネーム、表示設定） | [x] |

#### スライス2-A: 店舗マスター

| タスク | エンドポイント | メソッド | 説明 | 完了 |
|--------|--------------|---------|------|------|
| 2A.1 | /api/shops | GET | 店舗一覧取得（稼働状況含む） | [x] |
| 2A.2 | /api/shops/:shopId | GET | 店舗詳細取得 | [x] |
| 2A.3 | /api/shops/:shopId | PUT | 店舗情報更新（管理者） | [x] |

#### スライス2-B: 卓マスター

| タスク | エンドポイント | メソッド | 説明 | 完了 |
|--------|--------------|---------|------|------|
| 2B.1 | /api/shops/:shopId/tables | GET | 卓一覧取得 | [x] |
| 2B.2 | /api/shops/:shopId/tables | POST | 卓追加（管理者） | [x] |
| 2B.3 | /api/shops/:shopId/tables/:tableId | PUT | 卓情報更新（管理者） | [x] |
| 2B.4 | /api/shops/:shopId/tables/:tableId | DELETE | 卓削除（管理者） | [x] |

#### スライス3: 着席機能

| タスク | エンドポイント | メソッド | 説明 | 完了 |
|--------|--------------|---------|------|------|
| 3.1 | /api/seatings/my | GET | 自分の着席情報取得 | [x] |
| 3.2 | /api/seatings | POST | 着席登録（QRスキャン後） | [x] |
| 3.3 | /api/seatings/:seatingId | DELETE | 退席（自分） | [x] |
| 3.4 | /api/shops/:shopId/tables/:tableId/seatings | GET | 卓の着席者一覧 | [x] |
| 3.5 | /api/seatings/:seatingId/admin | DELETE | 退席（管理者による強制） | [x] |
| 3.6 | /api/shops/:shopId/tables/:tableId/seatings | DELETE | 卓全員退席（管理者） | [x] |

#### スライス4-A: イベント機能

| タスク | エンドポイント | メソッド | 説明 | 完了 |
|--------|--------------|---------|------|------|
| 4A.1 | /api/shops/:shopId/events | GET | 店舗のイベント一覧取得 | [x] |

#### スライス4-B: トーナメント機能

| タスク | エンドポイント | メソッド | 説明 | 完了 |
|--------|--------------|---------|------|------|
| 4B.1 | /api/shops/:shopId/tournaments | GET | トーナメント一覧取得 | [x] |
| 4B.2 | /api/shops/:shopId/tournaments | POST | トーナメント作成（管理者） | [x] |
| 4B.3 | /api/shops/:shopId/tournaments/:tournamentId | GET | トーナメント詳細取得 | [x] |
| 4B.4 | /api/shops/:shopId/tournaments/:tournamentId | PUT | トーナメント更新（管理者） | [x] |
| 4B.5 | /api/shops/:shopId/tournaments/:tournamentId/control | POST | トーナメント操作（開始/停止/ブレイク） | [x] |

#### スライス5: ダッシュボード

| タスク | エンドポイント | メソッド | 説明 | 完了 |
|--------|--------------|---------|------|------|
| 5.1 | /api/shops/:shopId/dashboard | GET | ダッシュボード統計情報 | [x] |

---

### 2.3 並列実装スケジュール

```
Phase 1: |=====認証基盤(4)=====|
         ↓
Phase 2: |===店舗マスター(3)===|  ← 並列可
         |====卓マスター(4)====|
         ↓
Phase 3: |=======着席機能(6)========|
         ↓
Phase 4: |==イベント(1)==|           ← 並列可
         |====トーナメント(5)====|
         ↓
Phase 5: |==ダッシュボード(1)==|
```

---

### 2.4 エンドポイント依存関係マトリックス

| エンドポイント | 依存先 | 提供リソース |
|---------------|-------|-------------|
| POST /api/auth/login | なし | 認証トークン、Player |
| GET /api/auth/me | auth/login | Player情報 |
| GET /api/shops | なし | Shop一覧 |
| GET /api/shops/:shopId | shops | Shop詳細 |
| GET /api/shops/:shopId/tables | shops/:shopId | Table一覧 |
| POST /api/seatings | auth/me, tables | Seating |
| GET /api/seatings/my | auth/me | 自分のSeating |
| GET /api/shops/:shopId/dashboard | shops, tables, seatings, tournaments | 統計データ |

---

### 2.5 データベーススキーマ概要

```
Players (プレイヤー)
├─ playerId (PK)
├─ pokerName
├─ displaySetting
├─ authProvider
├─ email
├─ createdAt / updatedAt

Shops (店舗)
├─ shopId (PK)
├─ name / address / imageUrl
├─ latitude / longitude
├─ openTime / closeTime
├─ createdAt / updatedAt

Tables (卓)
├─ tableId (PK)
├─ shopId (FK → Shops)
├─ name / qrCode / maxSeats
├─ isActive
├─ createdAt

Seatings (着席)
├─ seatingId (PK)
├─ playerId (FK → Players)
├─ shopId (FK → Shops)
├─ tableId (FK → Tables)
├─ seatNumber / status
├─ seatedAt / leftAt

Events (イベント)
├─ eventId (PK)
├─ shopId (FK → Shops)
├─ title / description
├─ startTime / endTime
├─ createdAt

Tournaments (トーナメント)
├─ tournamentId (PK)
├─ shopId (FK → Shops)
├─ name / status
├─ currentLevel / remainingSeconds
├─ structure (JSON)
├─ entryFee / startingStack
├─ createdAt / startedAt
```

---

### 2.6 実装時の注意事項

#### 認証・認可
- JWTトークンによる認証（モック実装可）
- ロール：guest / player / admin
- 管理者エンドポイントは権限チェック必須

#### バリデーション
- pokerName: 1〜20文字
- displaySetting: public / masked / hidden
- 1ユーザー1卓のみ着席可能

#### エラーハンドリング
- 401: 認証エラー
- 403: 権限エラー
- 404: リソース未発見
- 409: 競合（既に着席中など）
- 422: バリデーションエラー
