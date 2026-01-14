import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  TableBar as TableIcon,
  EmojiEvents as TournamentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { MainLayout } from '../../layouts/MainLayout';

// 統計カードコンポーネント
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

function StatCard({ title, value, subtitle, icon, color, progress }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}20`,
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 3,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

// 卓状況コンポーネント
interface TableStatusProps {
  tableId: string;
  name: string;
  players: number;
  maxSeats: number;
  isActive: boolean;
}

function TableStatus({ name, players, maxSeats, isActive }: TableStatusProps) {
  const occupancy = (players / maxSeats) * 100;

  return (
    <Card
      sx={{
        opacity: isActive ? 1 : 0.5,
        border: isActive ? '1px solid rgba(255, 215, 0, 0.3)' : undefined,
      }}
    >
      <CardContent sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {players}/{maxSeats}席
            </Typography>
          </Box>
          <Chip
            label={isActive ? '稼働中' : '停止'}
            size="small"
            color={isActive ? 'success' : 'default'}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={occupancy}
          sx={{
            mt: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </CardContent>
    </Card>
  );
}

// モック卓データ
const MOCK_TABLES = [
  { tableId: 't1', name: 'Table 1', players: 8, maxSeats: 9, isActive: true },
  { tableId: 't2', name: 'Table 2', players: 6, maxSeats: 9, isActive: true },
  { tableId: 't3', name: 'Table 3', players: 9, maxSeats: 9, isActive: true },
  { tableId: 't4', name: 'Table 4', players: 4, maxSeats: 9, isActive: true },
  { tableId: 't5', name: 'Table 5', players: 0, maxSeats: 9, isActive: false },
  { tableId: 't6', name: 'Table 6', players: 7, maxSeats: 9, isActive: true },
];

export function AdminDashboardPage() {
  const totalPlayers = MOCK_TABLES.reduce((sum, t) => sum + t.players, 0);
  const activeTables = MOCK_TABLES.filter((t) => t.isActive).length;
  const totalTables = MOCK_TABLES.length;

  return (
    <MainLayout>
      <Box>
        {/* ヘッダー */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            管理ダッシュボード
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Demo Poker Club - リアルタイム状況
          </Typography>
        </Box>

        {/* 統計カード */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="現在の着席人数"
              value={totalPlayers}
              subtitle="前日比 +12%"
              icon={<PeopleIcon />}
              color="#FFD700"
              progress={75}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="稼働卓数"
              value={`${activeTables}/${totalTables}`}
              subtitle="稼働率 83%"
              icon={<TableIcon />}
              color="#4CAF50"
              progress={83}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="開催中トーナメント"
              value={1}
              subtitle="Saturday Special"
              icon={<TournamentIcon />}
              color="#2196F3"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="本日の来店者数"
              value={68}
              subtitle="前週比 +8%"
              icon={<TrendingUpIcon />}
              color="#9C27B0"
            />
          </Grid>
        </Grid>

        {/* 卓状況 */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          卓状況
        </Typography>
        <Grid container spacing={2}>
          {MOCK_TABLES.map((table) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={table.tableId}>
              <TableStatus {...table} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
}
