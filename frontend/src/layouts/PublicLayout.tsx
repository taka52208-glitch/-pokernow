import type { ReactNode } from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

interface PublicLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function PublicLayout({ children, maxWidth = 'sm' }: PublicLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0A0A0A 0%, #141414 100%)',
      }}
    >
      {/* ヘッダー */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: '#FFD700',
            letterSpacing: '0.05em',
          }}
        >
          PokerNow
        </Typography>
      </Box>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth={maxWidth}>{children}</Container>
      </Box>

      {/* フッター */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 215, 0, 0.1)',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          &copy; 2026 PokerNow Demo.{' '}
          <Link href="#" color="primary" underline="hover">
            利用規約
          </Link>
          {' | '}
          <Link href="#" color="primary" underline="hover">
            プライバシーポリシー
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
