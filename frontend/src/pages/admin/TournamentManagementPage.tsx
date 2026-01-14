import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as SkipNextIcon,
  Add as AddIcon,
  Coffee as CoffeeIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { MainLayout } from '../../layouts/MainLayout';
import type { Tournament, TournamentStructure, TournamentStatus } from '../../types';

// デフォルトストラクチャー
const DEFAULT_STRUCTURE: TournamentStructure[] = [
  { level: 1, smallBlind: 25, bigBlind: 50, duration: 20, isBreak: false },
  { level: 2, smallBlind: 50, bigBlind: 100, duration: 20, isBreak: false },
  { level: 3, smallBlind: 75, bigBlind: 150, duration: 20, isBreak: false },
  { level: 0, smallBlind: 0, bigBlind: 0, duration: 10, isBreak: true }, // Break
  { level: 4, smallBlind: 100, bigBlind: 200, ante: 25, duration: 20, isBreak: false },
  { level: 5, smallBlind: 150, bigBlind: 300, ante: 50, duration: 20, isBreak: false },
  { level: 6, smallBlind: 200, bigBlind: 400, ante: 50, duration: 20, isBreak: false },
  { level: 0, smallBlind: 0, bigBlind: 0, duration: 10, isBreak: true }, // Break
  { level: 7, smallBlind: 300, bigBlind: 600, ante: 75, duration: 15, isBreak: false },
  { level: 8, smallBlind: 400, bigBlind: 800, ante: 100, duration: 15, isBreak: false },
];

// モックトーナメント
const MOCK_TOURNAMENT: Tournament = {
  tournamentId: 'tour-001',
  shopId: 'shop-001',
  name: 'サンデートーナメント',
  status: 'running',
  currentLevel: 5,
  remainingSeconds: 754,
  structure: DEFAULT_STRUCTURE,
  entryFee: 3000,
  startingStack: 10000,
  createdAt: new Date().toISOString(),
  startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

// タイマーフォーマット
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ステータスラベル
function getStatusLabel(status: TournamentStatus): string {
  const labels: Record<TournamentStatus, string> = {
    waiting: '待機中',
    running: '進行中',
    paused: '一時停止',
    break: 'ブレイク',
    finished: '終了',
  };
  return labels[status];
}

// ステータスカラー
function getStatusColor(status: TournamentStatus): 'default' | 'success' | 'warning' | 'error' {
  const colors: Record<TournamentStatus, 'default' | 'success' | 'warning' | 'error'> = {
    waiting: 'default',
    running: 'success',
    paused: 'warning',
    break: 'warning',
    finished: 'error',
  };
  return colors[status];
}

export function TournamentManagementPage() {
  const [tournament, setTournament] = useState<Tournament | null>(MOCK_TOURNAMENT);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTournamentName, setNewTournamentName] = useState('');
  const [newStructure] = useState<TournamentStructure[]>(DEFAULT_STRUCTURE);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // タイマーカウントダウン
  useEffect(() => {
    if (!tournament || tournament.status !== 'running') return;

    const interval = setInterval(() => {
      setTournament((prev) => {
        if (!prev || prev.remainingSeconds <= 0) {
          // レベル進行
          const currentIndex = prev?.structure.findIndex(
            (s) => s.level === prev.currentLevel || (s.isBreak && prev.status === 'break')
          );
          if (currentIndex !== undefined && currentIndex < (prev?.structure.length || 0) - 1) {
            const nextStructure = prev?.structure[currentIndex + 1];
            return {
              ...prev!,
              currentLevel: nextStructure?.isBreak ? prev!.currentLevel : (nextStructure?.level || prev!.currentLevel + 1),
              remainingSeconds: (nextStructure?.duration || 20) * 60,
              status: nextStructure?.isBreak ? 'break' : 'running',
            };
          }
          return prev;
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tournament?.status]);

  // 開始
  const handleStart = () => {
    setTournament((prev) =>
      prev ? { ...prev, status: 'running' as TournamentStatus } : null
    );
    setSnackbarMessage('トーナメントを開始しました');
    setSnackbarOpen(true);
  };

  // 一時停止
  const handlePause = () => {
    setTournament((prev) =>
      prev ? { ...prev, status: 'paused' as TournamentStatus } : null
    );
    setSnackbarMessage('トーナメントを一時停止しました');
    setSnackbarOpen(true);
  };

  // ブレイク
  const handleBreak = () => {
    setTournament((prev) =>
      prev
        ? {
            ...prev,
            status: 'break' as TournamentStatus,
            remainingSeconds: 10 * 60,
          }
        : null
    );
    setSnackbarMessage('ブレイクを開始しました');
    setSnackbarOpen(true);
  };

  // 次のレベルへ
  const handleNextLevel = () => {
    setTournament((prev) => {
      if (!prev) return null;
      const currentIndex = prev.structure.findIndex(
        (s) => s.level === prev.currentLevel && !s.isBreak
      );
      if (currentIndex < prev.structure.length - 1) {
        const nextStructure = prev.structure[currentIndex + 1];
        return {
          ...prev,
          currentLevel: nextStructure.isBreak ? prev.currentLevel : nextStructure.level,
          remainingSeconds: nextStructure.duration * 60,
          status: nextStructure.isBreak ? 'break' : prev.status,
        };
      }
      return prev;
    });
    setSnackbarMessage('次のレベルに進みました');
    setSnackbarOpen(true);
  };

  // 終了
  const handleEnd = () => {
    setTournament((prev) =>
      prev ? { ...prev, status: 'finished' as TournamentStatus } : null
    );
    setSnackbarMessage('トーナメントを終了しました');
    setSnackbarOpen(true);
  };

  // 新規作成
  const handleCreate = () => {
    const newTournament: Tournament = {
      tournamentId: `tour-${Date.now()}`,
      shopId: 'shop-001',
      name: newTournamentName,
      status: 'waiting',
      currentLevel: 1,
      remainingSeconds: newStructure[0].duration * 60,
      structure: newStructure,
      createdAt: new Date().toISOString(),
    };
    setTournament(newTournament);
    setCreateDialogOpen(false);
    setNewTournamentName('');
    setSnackbarMessage('トーナメントを作成しました');
    setSnackbarOpen(true);
  };

  const currentStructure = tournament?.structure.find(
    (s) => s.level === tournament.currentLevel && !s.isBreak
  );

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ p: 2 }}>
        {/* ページタイトル */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            トーナメント管理
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            新規作成
          </Button>
        </Box>

        {tournament ? (
          <>
            {/* 現在のトーナメント */}
            <Card
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(255, 215, 0, 0.3)',
                background: 'linear-gradient(135deg, #1E1E1E 0%, #141414 100%)',
              }}
            >
              {/* ヘッダー */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {tournament.name}
                </Typography>
                <Chip
                  label={getStatusLabel(tournament.status)}
                  color={getStatusColor(tournament.status)}
                />
              </Box>

              {/* タイマー */}
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: tournament.status === 'break' ? 'warning.main' : 'white',
                  }}
                >
                  {formatTime(tournament.remainingSeconds)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tournament.status === 'break' ? 'BREAK' : `Level ${tournament.currentLevel}`}
                </Typography>
              </Box>

              {/* ブラインド情報 */}
              {currentStructure && tournament.status !== 'break' && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        SB
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {currentStructure.smallBlind}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        BB
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {currentStructure.bigBlind}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        ANTE
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {currentStructure.ante || '-'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {/* コントロールボタン */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {tournament.status === 'waiting' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayIcon />}
                    onClick={handleStart}
                    size="large"
                  >
                    開始
                  </Button>
                )}
                {tournament.status === 'running' && (
                  <>
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<PauseIcon />}
                      onClick={handlePause}
                    >
                      一時停止
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<CoffeeIcon />}
                      onClick={handleBreak}
                    >
                      ブレイク
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SkipNextIcon />}
                      onClick={handleNextLevel}
                    >
                      次へ
                    </Button>
                  </>
                )}
                {tournament.status === 'paused' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayIcon />}
                    onClick={handleStart}
                    size="large"
                  >
                    再開
                  </Button>
                )}
                {tournament.status === 'break' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayIcon />}
                    onClick={handleStart}
                    size="large"
                  >
                    ブレイク終了
                  </Button>
                )}
                {tournament.status !== 'finished' && tournament.status !== 'waiting' && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={handleEnd}
                  >
                    終了
                  </Button>
                )}
              </Box>
            </Card>

            {/* ストラクチャー表 */}
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(255, 215, 0, 0.2)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                ストラクチャー
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Level</TableCell>
                      <TableCell align="right">SB</TableCell>
                      <TableCell align="right">BB</TableCell>
                      <TableCell align="right">Ante</TableCell>
                      <TableCell align="right">時間</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tournament.structure.map((s, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          bgcolor:
                            s.level === tournament.currentLevel && !s.isBreak
                              ? 'rgba(255, 215, 0, 0.1)'
                              : s.isBreak
                                ? 'rgba(255, 152, 0, 0.1)'
                                : 'transparent',
                        }}
                      >
                        <TableCell>
                          {s.isBreak ? (
                            <Chip label="BREAK" size="small" color="warning" />
                          ) : (
                            `Lv.${s.level}`
                          )}
                        </TableCell>
                        <TableCell align="right">{s.isBreak ? '-' : s.smallBlind}</TableCell>
                        <TableCell align="right">{s.isBreak ? '-' : s.bigBlind}</TableCell>
                        <TableCell align="right">{s.isBreak ? '-' : s.ante || '-'}</TableCell>
                        <TableCell align="right">{s.duration}分</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </>
        ) : (
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(255, 215, 0, 0.12)',
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              開催中のトーナメントはありません
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              トーナメントを作成
            </Button>
          </Card>
        )}

        {/* 新規作成ダイアログ */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#141414',
              borderRadius: 3,
              border: '1px solid rgba(255, 215, 0, 0.2)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>トーナメント新規作成</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="トーナメント名"
              value={newTournamentName}
              onChange={(e) => setNewTournamentName(e.target.value)}
              sx={{ mt: 1, mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>テンプレート</InputLabel>
              <Select
                value="standard"
                label="テンプレート"
              >
                <MenuItem value="standard">スタンダード (20分/レベル)</MenuItem>
                <MenuItem value="turbo">ターボ (10分/レベル)</MenuItem>
                <MenuItem value="deepstack">ディープスタック (30分/レベル)</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary">
              ストラクチャーは作成後に編集できます
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setCreateDialogOpen(false)} color="inherit">
              キャンセル
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              disabled={!newTournamentName}
            >
              作成
            </Button>
          </DialogActions>
        </Dialog>

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
