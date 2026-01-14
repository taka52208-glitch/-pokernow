# プロジェクト設定

## 基本設定
```yaml
プロジェクト名: PokerNow - アミューズメントポーカー向けリアルタイム稼働管理アプリ
開始日: 2026-01-11
技術スタック:
  frontend: React 18 + TypeScript 5 + MUI v6 + Vite 5
  backend: なし（モックデータ）
  database: なし（フロントエンドのみ）
```

## 開発環境
```yaml
ポート設定:
  frontend: 3247
  backend: なし

環境変数:
  設定ファイル: .env.local（ルートディレクトリ）
  必須項目:
    - VITE_APP_NAME=PokerNow
```

## テスト認証情報
```yaml
開発用アカウント:
  プレイヤー:
    email: player@pokernow.local
    pokerName: TestPlayer
  管理者:
    email: admin@pokernow.local
    shopName: Demo Poker Club

ロール切り替え:
  - ヘッダーの切り替えボタンで即座にロール変更可能
  - デモ時に両方の画面を簡単に見せられる
```

## コーディング規約

### 命名規則
```yaml
ファイル名:
  - コンポーネント: PascalCase.tsx (例: ShopCard.tsx)
  - ページ: PascalCase.tsx (例: ShopList.tsx)
  - ユーティリティ: camelCase.ts (例: formatTime.ts)
  - 定数: UPPER_SNAKE_CASE.ts (例: MOCK_DATA.ts)
  - 型定義: types.ts または index.ts

変数・関数:
  - 変数: camelCase
  - 関数: camelCase
  - 定数: UPPER_SNAKE_CASE
  - 型/インターフェース: PascalCase
  - Enum: PascalCase
```

### コード品質
```yaml
必須ルール:
  - TypeScript: strictモード有効
  - 未使用の変数/import禁止
  - console.log本番環境禁止
  - エラーハンドリング必須
  - 関数行数: 100行以下
  - ファイル行数: 700行以下
  - 複雑度: 10以下
  - 行長: 120文字

フォーマット:
  - インデント: スペース2つ
  - セミコロン: あり
  - クォート: シングル
```

## プロジェクト固有ルール

### ディレクトリ構成
```yaml
src/
  components/     # 再利用可能なコンポーネント
    common/       # 共通コンポーネント（Header、Badge等）
    player/       # プレイヤー側コンポーネント
    admin/        # 管理側コンポーネント
  pages/          # ページコンポーネント
    player/       # プレイヤー側ページ
    admin/        # 管理側ページ
  hooks/          # カスタムフック
  stores/         # Zustandストア
  types/          # 型定義
  utils/          # ユーティリティ関数
  data/           # モックデータ
  theme/          # MUIテーマ設定
```

### デザインシステム
```yaml
テーマ: ダークモード（ポーカー/カジノの高級感）

カラーパレット:
  primary: '#FFD700'      # ゴールド
  background:
    default: '#121212'    # ダークグレー
    paper: '#1E1E1E'      # ややライト
  surface: '#2D2D2D'      # サーフェス
  accent: '#2E7D32'       # グリーン（フェルト風）
  error: '#D32F2F'        # レッド
  text:
    primary: '#FFFFFF'    # ホワイト
    secondary: '#B0B0B0'  # ライトグレー

混雑度バッジ:
  low: '#4CAF50'          # グリーン（空き）
  medium: '#FFC107'       # イエロー（やや混雑）
  high: '#F44336'         # レッド（混雑）
```

### 型定義
```yaml
配置: src/types/index.ts

主要な型:
  - Player: プレイヤー情報
  - Shop: 店舗情報
  - Table: 卓情報
  - Seating: 着席情報
  - Tournament: トーナメント情報
  - TournamentStructure: ストラクチャー情報
  - Event: イベント情報
  - CongestionLevel: 混雑レベル（low/medium/high）
  - DisplaySetting: 表示設定（public/masked/hidden）
```

### モックデータ
```yaml
配置: src/data/mockData.ts

データ:
  - shops: 3〜5店舗のサンプルデータ
  - tables: 各店舗に5〜10卓
  - players: 10〜20人のサンプルプレイヤー
  - tournaments: 2〜3個のサンプルトーナメント
  - events: 各店舗に2〜3個のイベント

リアルタイム演出:
  - setIntervalで定期的にデータを更新
  - 着席人数、混雑状況をランダムに変動
  - トーナメントタイマーをカウントダウン
```

## 最新技術情報（知識カットオフ対応）
```yaml
# 使用ライブラリのバージョン
react: ^18.2.0
react-dom: ^18.2.0
typescript: ^5.0.0
@mui/material: ^6.0.0
@mui/icons-material: ^6.0.0
@emotion/react: ^11.0.0
@emotion/styled: ^11.0.0
react-router-dom: ^6.0.0
zustand: ^4.0.0
react-qr-code: ^2.0.0
html5-qrcode: ^2.3.0
vite: ^5.0.0
```
