import { useState } from 'react';
import type { ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';

const DRAWER_WIDTH = 240;

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ヘッダー */}
      <Header onMenuClick={handleDrawerToggle} drawerWidth={DRAWER_WIDTH} />

      {/* サイドバー */}
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        drawerWidth={DRAWER_WIDTH}
        isMobile={isMobile}
      />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: '64px', // AppBarの高さ分
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
