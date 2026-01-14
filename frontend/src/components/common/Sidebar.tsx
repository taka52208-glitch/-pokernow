import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Store as StoreIcon,
  QrCodeScanner as QrCodeIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  TableBar as TableIcon,
  EmojiEvents as TournamentIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
  isMobile: boolean;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  section: 'player' | 'admin';
}

const NAV_ITEMS: NavItem[] = [
  // プレイヤーセクション
  { label: '店舗一覧', path: '/shops', icon: <StoreIcon />, section: 'player' },
  { label: 'QRスキャン', path: '/scan', icon: <QrCodeIcon />, section: 'player' },
  { label: 'マイページ', path: '/mypage', icon: <PersonIcon />, section: 'player' },
  // 管理者セクション
  { label: 'ダッシュボード', path: '/admin', icon: <DashboardIcon />, section: 'admin' },
  { label: '店舗設定', path: '/admin/settings', icon: <SettingsIcon />, section: 'admin' },
  { label: '卓管理', path: '/admin/tables', icon: <TableIcon />, section: 'admin' },
  { label: 'トーナメント', path: '/admin/tournaments', icon: <TournamentIcon />, section: 'admin' },
];

export function Sidebar({ open, onClose, drawerWidth, isMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const playerItems = NAV_ITEMS.filter((item) => item.section === 'player');
  const adminItems = NAV_ITEMS.filter((item) => item.section === 'admin');

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ロゴ */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '0.05em',
          }}
        >
          PokerNow
        </Typography>
      </Box>

      {/* ナビゲーション */}
      <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
        {/* プレイヤーメニュー */}
        <Typography
          variant="overline"
          sx={{ px: 3, color: 'text.secondary', display: 'block', mb: 1 }}
        >
          プレイヤー
        </Typography>
        <List disablePadding>
          {playerItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>

        {/* 管理者メニュー（管理者のみ表示） */}
        {role === 'admin' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="overline"
              sx={{ px: 3, color: 'text.secondary', display: 'block', mb: 1 }}
            >
              店舗管理
            </Typography>
            <List disablePadding>
              {adminItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </>
        )}
      </Box>

      {/* フッター */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 215, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Demo Version
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* モバイル用ドロワー */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* デスクトップ用ドロワー */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
