import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  TextField,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { MainLayout } from '../../layouts/MainLayout';
import type { Shop, Table } from '../../types';

// モックデータ
const MOCK_SHOP: Shop = {
  shopId: 'shop-001',
  name: 'Demo Poker Club',
  address: '東京都渋谷区道玄坂1-2-3 ポーカービル5F',
  imageUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
  currentPlayers: 25,
  activeTables: 5,
  totalTables: 8,
  congestionLevel: 'medium',
  latitude: 35.6595,
  longitude: 139.7004,
  openTime: '14:00',
  closeTime: '05:00',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_TABLES: Table[] = [
  { tableId: 't1', shopId: 'shop-001', name: '卓1', qrCode: 'qr1', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
  { tableId: 't2', shopId: 'shop-001', name: '卓2', qrCode: 'qr2', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
  { tableId: 't3', shopId: 'shop-001', name: '卓3', qrCode: 'qr3', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
  { tableId: 't4', shopId: 'shop-001', name: '卓4', qrCode: 'qr4', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
  { tableId: 't5', shopId: 'shop-001', name: '卓5', qrCode: 'qr5', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
  { tableId: 't6', shopId: 'shop-001', name: '卓6', qrCode: 'qr6', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
  { tableId: 't7', shopId: 'shop-001', name: '卓7', qrCode: 'qr7', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
  { tableId: 't8', shopId: 'shop-001', name: '卓8', qrCode: 'qr8', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
];

export function ShopSettingsPage() {
  const [shop, setShop] = useState<Shop>(MOCK_SHOP);
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 店舗情報の更新
  const handleShopChange = (field: keyof Shop, value: string) => {
    setShop((prev) => ({ ...prev, [field]: value }));
  };

  // 卓の追加
  const handleAddTable = () => {
    const newTable: Table = {
      tableId: `t${tables.length + 1}`,
      shopId: shop.shopId,
      name: `卓${tables.length + 1}`,
      qrCode: `qr${tables.length + 1}`,
      maxSeats: 9,
      isActive: true,
      currentPlayers: 0,
      createdAt: new Date().toISOString(),
    };
    setTables((prev) => [...prev, newTable]);
  };

  // 卓の削除
  const handleDeleteTable = (tableId: string) => {
    setTables((prev) => prev.filter((t) => t.tableId !== tableId));
  };

  // 卓名の更新
  const handleTableNameChange = (tableId: string, name: string) => {
    setTables((prev) =>
      prev.map((t) => (t.tableId === tableId ? { ...t, name } : t))
    );
  };

  // 最大座席数の更新
  const handleMaxSeatsChange = (tableId: string, maxSeats: number) => {
    setTables((prev) =>
      prev.map((t) => (t.tableId === tableId ? { ...t, maxSeats } : t))
    );
  };

  // 保存処理（モック）
  const handleSave = () => {
    setSnackbarMessage('設定を保存しました');
    setSnackbarOpen(true);
  };

  // 位置情報取得（モック）
  const handleGetLocation = () => {
    setShop((prev) => ({
      ...prev,
      latitude: 35.6595 + (Math.random() - 0.5) * 0.01,
      longitude: 139.7004 + (Math.random() - 0.5) * 0.01,
    }));
    setSnackbarMessage('現在地を取得しました');
    setSnackbarOpen(true);
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ p: 2 }}>
        {/* ページタイトル */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'primary.main',
          }}
        >
          店舗設定
        </Typography>

        {/* 基本情報セクション */}
        <Card
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            基本情報
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="店舗名"
                value={shop.name}
                onChange={(e) => handleShopChange('name', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="住所"
                value={shop.address}
                onChange={(e) => handleShopChange('address', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="開店時間"
                value={shop.openTime || ''}
                onChange={(e) => handleShopChange('openTime', e.target.value)}
                variant="outlined"
                placeholder="14:00"
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="閉店時間"
                value={shop.closeTime || ''}
                onChange={(e) => handleShopChange('closeTime', e.target.value)}
                variant="outlined"
                placeholder="05:00"
              />
            </Grid>
          </Grid>
        </Card>

        {/* 店舗画像セクション */}
        <Card
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            店舗画像
          </Typography>

          <Box
            sx={{
              width: '100%',
              height: 200,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'divider',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            {shop.imageUrl ? (
              <Box
                component="img"
                src={shop.imageUrl}
                alt={shop.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <PhotoCameraIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  クリックして画像をアップロード
                </Typography>
              </Box>
            )}
          </Box>
        </Card>

        {/* 位置情報セクション */}
        <Card
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            位置情報（着席制限用）
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="緯度"
                value={shop.latitude?.toFixed(6) || ''}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="経度"
                value={shop.longitude?.toFixed(6) || ''}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid size={{ xs: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleGetLocation}
                startIcon={<LocationOnIcon />}
                fullWidth
                sx={{ height: 40 }}
              >
                取得
              </Button>
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            プレイヤーが着席できる範囲を店舗から半径100m以内に制限します
          </Typography>
        </Card>

        {/* 卓設定セクション */}
        <Card
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              卓設定（{tables.length}卓）
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddTable}
              size="small"
            >
              卓を追加
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {tables.map((table, index) => (
              <Box
                key={table.tableId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ width: 24, color: 'text.secondary', textAlign: 'center' }}
                >
                  {index + 1}
                </Typography>
                <TextField
                  size="small"
                  value={table.name}
                  onChange={(e) => handleTableNameChange(table.tableId, e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="席数"
                  value={table.maxSeats}
                  onChange={(e) => handleMaxSeatsChange(table.tableId, parseInt(e.target.value) || 9)}
                  sx={{ width: 80 }}
                  inputProps={{ min: 1, max: 10 }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleDeleteTable(table.tableId)}
                  disabled={tables.length <= 1}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Card>

        {/* 保存ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            設定を保存
          </Button>
        </Box>

        {/* スナックバー */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
}
