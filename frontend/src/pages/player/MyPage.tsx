import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  EventSeat as EventSeatIcon,
  LocationOn as LocationOnIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { MainLayout } from '../../layouts/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import type { Seating, Shop, Table } from '../../types';

// モックデータ: 着席情報
const MOCK_SEATING: Seating | null = {
  seatingId: 'seat-001',
  playerId: 'player-001',
  shopId: 'shop-001',
  tableId: 't1',
  seatNumber: 3,
  status: 'active',
  seatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45分前
};

const MOCK_SHOP: Shop = {
  shopId: 'shop-001',
  name: 'Demo Poker Club',
  address: '東京都渋谷区道玄坂1-2-3 ポーカービル5F',
  currentPlayers: 25,
  activeTables: 5,
  totalTables: 8,
  congestionLevel: 'medium',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_TABLE: Table = {
  tableId: 't1',
  shopId: 'shop-001',
  name: '卓1',
  qrCode: 'qr1',
  maxSeats: 9,
  isActive: true,
  currentPlayers: 6,
  createdAt: new Date().toISOString(),
};

// 経過時間を計算
function formatElapsedTime(seatedAt: string): string {
  const diff = Date.now() - new Date(seatedAt).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  }
  return `${minutes}分`;
}

// 表示設定のラベル
function getDisplaySettingLabel(setting: string): string {
  const labels: Record<string, string> = {
    public: '公開',
    masked: '伏字',
    hidden: '非表示',
  };
  return labels[setting] || setting;
}

export function MyPage() {
  const navigate = useNavigate();
  const { player } = useAuth();
  const [loading, setLoading] = useState(true);
  const [seating, setSeating] = useState<Seating | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('');

  // データ読み込み
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSeating(MOCK_SEATING);
      setShop(MOCK_SHOP);
      setTable(MOCK_TABLE);
      setLoading(false);
    };
    loadData();
  }, []);

  // 経過時間の更新
  useEffect(() => {
    if (!seating) return;

    const updateElapsed = () => {
      setElapsedTime(formatElapsedTime(seating.seatedAt));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [seating]);

  // 退席処理
  const handleExit = () => {
    setSeating(null);
    setExitDialogOpen(false);
  };

  // 着席するボタン
  const handleSeat = () => {
    navigate('/shops');
  };

  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ p: 2 }}>
        {/* プロフィールセクション */}
        <Card
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(255, 215, 0, 0.2)',
            background: 'linear-gradient(135deg, #1E1E1E 0%, #141414 100%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                color: 'background.default',
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            >
              {player?.pokerName?.charAt(0) || 'P'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              {loading ? (
                <>
                  <Skeleton width={120} height={28} />
                  <Skeleton width={80} height={20} />
                </>
              ) : (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                    }}
                  >
                    {player?.pokerName || 'TestPlayer'}
                  </Typography>
                  <Chip
                    size="small"
                    label={getDisplaySettingLabel(player?.displaySetting || 'public')}
                    sx={{
                      mt: 0.5,
                      bgcolor: 'rgba(255, 215, 0, 0.1)',
                      color: 'primary.main',
                      fontSize: '0.7rem',
                    }}
                  />
                </>
              )}
            </Box>
            <Button
              size="small"
              startIcon={<EditIcon />}
              sx={{ color: 'text.secondary' }}
            >
              編集
            </Button>
          </Box>
        </Card>

        {/* 着席状況セクション */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            borderBottom: 1,
            borderColor: 'divider',
            pb: 1,
            mb: 2,
          }}
        >
          着席状況
        </Typography>

        {loading ? (
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
        ) : seating && seating.status === 'active' ? (
          /* 着席中の場合 */
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'success.main',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, #141414 100%)',
            }}
          >
            {/* ステータスバッジ */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Chip
                icon={<EventSeatIcon />}
                label="着席中"
                color="success"
                size="small"
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {elapsedTime}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 店舗情報 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                店舗
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: 'primary.main' }}
              >
                {shop?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary', mt: 0.2 }} />
                <Typography variant="caption" color="text.secondary">
                  {shop?.address}
                </Typography>
              </Box>
            </Box>

            {/* 卓情報 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary">
                卓
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {table?.name}
                </Typography>
                {seating.seatNumber && (
                  <Typography variant="body2" color="text.secondary">
                    / Seat {seating.seatNumber}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {table?.currentPlayers}/{table?.maxSeats} 人着席中
              </Typography>
            </Box>

            {/* 退席ボタン */}
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<ExitToAppIcon />}
              onClick={() => setExitDialogOpen(true)}
              sx={{
                py: 1.5,
                fontWeight: 600,
              }}
            >
              退席する
            </Button>
          </Card>
        ) : (
          /* 着席していない場合 */
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(255, 215, 0, 0.12)',
              textAlign: 'center',
            }}
          >
            <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              現在、どの卓にも着席していません
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EventSeatIcon />}
              onClick={handleSeat}
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 600,
              }}
            >
              店舗を探す
            </Button>
          </Card>
        )}

        {/* 退席確認ダイアログ */}
        <Dialog
          open={exitDialogOpen}
          onClose={() => setExitDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: '#141414',
              borderRadius: 3,
              border: '1px solid rgba(255, 215, 0, 0.2)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            退席確認
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {shop?.name}
              </Box>
              の
              <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>
                {table?.name}
              </Box>
              から退席しますか？
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setExitDialogOpen(false)}
              sx={{ color: 'text.secondary' }}
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleExit}
            >
              退席する
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
}
