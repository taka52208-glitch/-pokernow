import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

// Modern Luxury テーマ
// シャープなブラック + ゴールドのミニマルで高級感のあるデザイン

const themeOptions: ThemeOptions = {
  palette: {
    mode: palette.mode,
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    text: palette.text,
    error: palette.error,
    warning: palette.warning,
    success: palette.success,
    info: palette.info,
    divider: palette.divider,
  },
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
};

export const theme = createTheme(themeOptions);

// カスタムカラーの型拡張用エクスポート
export { palette };
export type { CustomPalette } from './palette';
