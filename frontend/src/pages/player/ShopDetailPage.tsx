import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
  Chip,
  Grid,
  Skeleton,
  Container,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  QrCodeScanner as QrCodeScannerIcon,
} from '@mui/icons-material';
import { MainLayout } from '../../layouts/MainLayout';
import { CongestionBadge } from '../../components/common/CongestionBadge';
import type {
  Shop,
  Table,
  Event,
  Tournament,
  CongestionLevel,
  TournamentStatus,
} from '../../types';

// モックデータ: 店舗
const MOCK_SHOP: Shop = {
  shopId: 'shop-001',
  name: 'Demo Poker Club',
  address: '東京都渋谷区道玄坂1-2-3 ポーカービル5F',
  imageUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
  currentPlayers: 25,
  activeTables: 5,
  totalTables: 8,
  congestionLevel: 'medium',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// モックデータ: 卓
const MOCK_TABLES: Table[] = [
  { tableId: 't1', shopId: 'shop-001', name: '卓1', qrCode: 'qr1', maxSeats: 9, isActive: true, currentPlayers: 6, createdAt: new Date().toISOString() },
  { tableId: 't2', shopId: 'shop-001', name: '卓2', qrCode: 'qr2', maxSeats: 9, isActive: true, currentPlayers: 3, createdAt: new Date().toISOString() },
  { tableId: 't3', shopId: 'shop-001', name: '卓3', qrCode: 'qr3', maxSeats: 9, isActive: true, currentPlayers: 9, createdAt: new Date().toISOString() },
  { tableId: 't4', shopId: 'shop-001', name: '卓4', qrCode: 'qr4', maxSeats: 9, isActive: true, currentPlayers: 5, createdAt: new Date().toISOString() },
  { tableId: 't5', shopId: 'shop-001', name: '卓5', qrCode: 'qr5', maxSeats: 9, isActive: true, currentPlayers: 2, createdAt: new Date().toISOString() },
];

// モックデータ: イベント
const MOCK_EVENTS: Event[] = [
  { eventId: 'e1', shopId: 'shop-001', title: '初心者講習会', startTime: '14:00', endTime: '16:00', createdAt: new Date().toISOString() },
  { eventId: 'e2', shopId: 'shop-001', title: 'ナイトトーナメント', startTime: '20:00', createdAt: new Date().toISOString() },
];

// モックデータ: トーナメント
const MOCK_TOURNAMENT: Tournament = {
  tournamentId: 'tour-001',
  shopId: 'shop-001',
  name: 'サンデートーナメント',
  status: 'running',
  currentLevel: 5,
  remainingSeconds: 754,
  structure: [
    { level: 1, smallBlind: 25, bigBlind: 50, duration: 20, isBreak: false },
    { level: 2, smallBlind: 50, bigBlind: 100, duration: 20, isBreak: false },
    { level: 3, smallBlind: 75, bigBlind: 150, duration: 20, isBreak: false },
    { level: 4, smallBlind: 100, bigBlind: 200, ante: 25, duration: 20, isBreak: false },
    { level: 5, smallBlind: 100, bigBlind: 200, ante: 25, duration: 20, isBreak: false },
  ],
  createdAt: new Date().toISOString(),
};

// 卓の混雑度を計算
function getTableCongestion(current: number, max: number): CongestionLevel {
  const ratio = current / max;
  if (ratio >= 1) return 'high';
  if (ratio >= 0.5) return 'medium';
  return 'low';
}

// タイマー表示のフォーマット
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ステータスラベル
function getStatusLabel(status: TournamentStatus): string {
  const labels: Record<TournamentStatus, string> = {
    waiting: 'WAITING',
    running: 'RUNNING',
    paused: 'PAUSED',
    break: 'BREAK',
    finished: 'FINISHED',
  };
  return labels[status];
}

// ステータスカラー
function getStatusColor(status: TournamentStatus): 'success' | 'warning' | 'default' | 'error' {
  const colors: Record<TournamentStatus, 'success' | 'warning' | 'default' | 'error'> = {
    waiting: 'default',
    running: 'success',
    paused: 'warning',
    break: 'warning',
    finished: 'error',
  };
  return colors[status];
}

export function ShopDetailPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    // モックデータのロード
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setShop(MOCK_SHOP);
      setTables(MOCK_TABLES);
      setEvents(MOCK_EVENTS);
      setTournament(MOCK_TOURNAMENT);
      setLoading(false);
    };
    loadData();
  }, [shopId]);

  // トーナメントタイマーのカウントダウン
  useEffect(() => {
    if (!tournament || tournament.status !== 'running') return;

    const interval = setInterval(() => {
      setTournament((prev) => {
        if (!prev || prev.remainingSeconds <= 0) return prev;
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tournament?.status]);

  // リアルタイム更新のシミュレーション
  useEffect(() => {
    const interval = setInterval(() => {
      setTables((prev) =>
        prev.map((table) => ({
          ...table,
          currentPlayers: Math.min(
            table.maxSeats,
            Math.max(0, table.currentPlayers + Math.floor(Math.random() * 3) - 1)
          ),
        }))
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSeatClick = () => {
    navigate('/scan');
  };

  const currentStructure = tournament?.structure.find(
    (s) => s.level === tournament.currentLevel
  );

  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ p: 2 }}>
        {/* 店舗画像 */}
        {loading ? (
          <Skeleton
            variant="rectangular"
            sx={{ width: '100%', height: 200, borderRadius: 2, mb: 2 }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 200,
              borderRadius: 2,
              mb: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            {shop?.imageUrl ? (
              <CardMedia
                component="img"
                image={shop.imageUrl}
                alt={shop.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="h2" color="text.secondary">
                  🏠
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* 店舗基本情報 */}
        <Box sx={{ mb: 3 }}>
          {loading ? (
            <>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="80%" />
            </>
          ) : (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                {shop?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mt: 0.3 }} />
                <Typography variant="body2" color="text.secondary">
                  {shop?.address}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* 卓状況セクション */}
        <Box sx={{ mb: 3 }}>
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
            卓状況
          </Typography>
          <Grid container spacing={1}>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Grid size={{ xs: 4, sm: 2.4 }} key={i}>
                    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))
              : tables.map((table) => (
                  <Grid size={{ xs: 4, sm: 2.4 }} key={table.tableId}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        textAlign: 'center',
                        borderColor: 'rgba(255, 215, 0, 0.12)',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {table.name}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {table.currentPlayers}
                        <Typography component="span" variant="body2" color="text.secondary">
                          /{table.maxSeats}
                        </Typography>
                      </Typography>
                      <CongestionBadge
                        level={getTableCongestion(table.currentPlayers, table.maxSeats)}
                        size="small"
                      />
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* 本日のイベント */}
        <Box sx={{ mb: 3 }}>
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
            本日のイベント
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          ) : events.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {events.map((event) => (
                <Card
                  key={event.eventId}
                  variant="outlined"
                  sx={{ p: 2, borderColor: 'rgba(255, 215, 0, 0.12)' }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {event.startTime} {event.endTime ? `- ${event.endTime}` : '-'}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              本日のイベントはありません
            </Typography>
          )}
        </Box>

        {/* 開催中トーナメント */}
        <Box sx={{ mb: 3 }}>
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
            開催中トーナメント
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
          ) : tournament ? (
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(255, 215, 0, 0.3)',
                background: 'linear-gradient(135deg, #1E1E1E 0%, #141414 100%)',
              }}
            >
              {/* トーナメントヘッダー */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {tournament.name}
                </Typography>
                <Chip
                  label={getStatusLabel(tournament.status)}
                  color={getStatusColor(tournament.status)}
                  size="small"
                />
              </Box>

              {/* タイマー */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {formatTime(tournament.remainingSeconds)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  残り時間
                </Typography>
              </Box>

              {/* ブラインド情報 */}
              {currentStructure && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'text.secondary', fontSize: '0.625rem' }}
                    >
                      SB / BB
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {currentStructure.smallBlind} / {currentStructure.bigBlind}
                    </Typography>
                  </Box>
                  <Chip
                    label={`Lv.${tournament.currentLevel}`}
                    variant="outlined"
                    color="primary"
                  />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'text.secondary', fontSize: '0.625rem' }}
                    >
                      ANTE
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {currentStructure.ante || '-'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Card>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              開催中のトーナメントはありません
            </Typography>
          )}
        </Box>

        {/* 下部の余白（固定ボタン分） */}
        <Box sx={{ height: 80 }} />
      </Container>

      {/* 着席ボタン（固定） */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10, 10, 10, 0.95) 100%)',
        }}
      >
        <Container maxWidth="sm" sx={{ p: 0 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<QrCodeScannerIcon />}
            onClick={handleSeatClick}
            sx={{
              py: 2,
              fontWeight: 600,
              letterSpacing: '0.05em',
              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(255, 215, 0, 0.4)',
              },
            }}
          >
            着席する
          </Button>
        </Container>
      </Box>
    </MainLayout>
  );
}
