// Modern Luxury テーマ - カラーパレット
// シャープなブラック + ゴールドのミニマルで高級感のあるデザイン

export const palette = {
  mode: 'dark' as const,
  primary: {
    main: '#FFD700',      // ゴールド
    light: '#FFE44D',     // ライトゴールド
    dark: '#C9A900',      // ダークゴールド
    contrastText: '#0A0A0A',
  },
  secondary: {
    main: '#B0B0B0',      // シルバーグレー
    light: '#D0D0D0',
    dark: '#808080',
    contrastText: '#0A0A0A',
  },
  background: {
    default: '#0A0A0A',   // シャープなブラック
    paper: '#141414',     // ダークサーフェス
  },
  surface: {
    main: '#1E1E1E',      // サーフェス
    light: '#2A2A2A',     // ライトサーフェス
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#666666',
  },
  error: {
    main: '#FF4444',
    light: '#FF6666',
    dark: '#CC0000',
  },
  warning: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FFA000',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },
  divider: 'rgba(255, 215, 0, 0.12)', // ゴールドの薄い線
  // カスタムカラー
  congestion: {
    low: '#4CAF50',       // 空き - グリーン
    medium: '#FFC107',    // やや混雑 - イエロー
    high: '#F44336',      // 混雑 - レッド
  },
  accent: {
    green: '#2E7D32',     // フェルト風グリーン
    gold: '#FFD700',      // ゴールド
  },
};

export type CustomPalette = typeof palette;
