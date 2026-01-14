import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  SwapHoriz as SwapHorizIcon,
  AdminPanelSettings as AdminIcon,
  Casino as CasinoIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
  drawerWidth: number;
}

export function Header({ onMenuClick, drawerWidth }: HeaderProps) {
  const navigate = useNavigate();
  const { player, role, logout, switchRole } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleSwitchRole = (newRole: 'player' | 'admin') => {
    handleMenuClose();
    switchRole(newRole);
    if (newRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/shops');
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin':
        return '管理者';
      case 'player':
        return 'プレイヤー';
      default:
        return 'ゲスト';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'player':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        {/* モバイルメニューボタン */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* ロゴ（モバイルのみ表示） */}
        <Typography
          variant="h6"
          noWrap
          sx={{
            display: { xs: 'block', md: 'none' },
            fontFamily: '"Playfair Display", serif',
            color: 'primary.main',
            fontWeight: 700,
          }}
        >
          PokerNow
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* ロールバッジ */}
        <Chip
          label={getRoleLabel()}
          color={getRoleColor() as 'primary' | 'error' | 'default'}
          size="small"
          sx={{ mr: 2 }}
        />

        {/* ユーザーメニュー */}
        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 215, 0, 0.2)',
              color: 'primary.main',
              width: 36,
              height: 36,
            }}
          >
            {player?.pokerName?.[0]?.toUpperCase() || 'U'}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
            },
          }}
        >
          {/* ユーザー情報 */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {player?.pokerName || 'Guest'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {player?.email || ''}
            </Typography>
          </Box>

          <Divider />

          {/* マイページ */}
          <MenuItem onClick={() => { handleMenuClose(); navigate('/mypage'); }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>マイページ</ListItemText>
          </MenuItem>

          <Divider />

          {/* ロール切り替え（デモ用） */}
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <SwapHorizIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
              ロール切り替え（デモ用）
            </Typography>
          </Box>

          <MenuItem
            onClick={() => handleSwitchRole('player')}
            selected={role === 'player'}
          >
            <ListItemIcon>
              <CasinoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>プレイヤー</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => handleSwitchRole('admin')}
            selected={role === 'admin'}
          >
            <ListItemIcon>
              <AdminIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>管理者</ListItemText>
          </MenuItem>

          <Divider />

          {/* ログアウト */}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>ログアウト</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
