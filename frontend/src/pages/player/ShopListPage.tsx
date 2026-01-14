import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  TableBar as TableIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import type { Shop } from '../../types';
import { CongestionBadge } from '../../components/common/CongestionBadge';
import { shopsApi } from '../../services/api';

export function ShopListPage() {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadShops = async () => {
      try {
        const shopList = await shopsApi.getShops();
        setShops(shopList);
        setError(null);
      } catch (err) {
        setError('店舗一覧の取得に失敗しました');
        console.error('Failed to load shops:', err);
      } finally {
        setLoading(false);
      }
    };
    loadShops();

    // リアルタイム更新（30秒ごと）
    const interval = setInterval(async () => {
      try {
        const shopList = await shopsApi.getShops();
        setShops(shopList);
      } catch {
        // リアルタイム更新のエラーは無視
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <Box>
        {/* ヘッダー */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            店舗一覧
          </Typography>
          <Typography variant="body2" color="text.secondary">
            リアルタイムの稼働状況を確認できます
          </Typography>
        </Box>

        {/* 検索バー */}
        <TextField
          fullWidth
          placeholder="店舗名・住所で検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />

        {/* エラー表示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 店舗カードグリッド */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={140} />
                    <CardContent>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : filteredShops.map((shop) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={shop.shopId}>
                  <Card
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/shops/${shop.shopId}`)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={shop.imageUrl || 'https://via.placeholder.com/400x200'}
                      alt={shop.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {shop.name}
                        </Typography>
                        <CongestionBadge level={shop.congestionLevel} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {shop.address}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip
                          icon={<PeopleIcon />}
                          label={`${shop.currentPlayers}人`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<TableIcon />}
                          label={`${shop.activeTables}/${shop.totalTables}卓`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {/* 結果なし */}
        {!loading && filteredShops.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              該当する店舗が見つかりません
            </Typography>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}
