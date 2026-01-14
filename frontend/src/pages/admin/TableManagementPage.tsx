import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  ExitToApp as ExitToAppIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  GroupRemove as GroupRemoveIcon,
} from '@mui/icons-material';
import QRCode from 'react-qr-code';
import { MainLayout } from '../../layouts/MainLayout';
import { CongestionBadge } from '../../components/common/CongestionBadge';
import type { Table, Player, CongestionLevel } from '../../types';

// モックデータ: 卓
const MOCK_TABLES: Table[] = [
  { tableId: 't1', shopId: 'shop-001', name: '卓1', qrCode: 'pokernow://shop-001/table/t1', maxSeats: 9, isActive: true, currentPlayers: 6, createdAt: new Date().toISOString() },
  { tableId: 't2', shopId: 'shop-001', name: '卓2', qrCode: 'pokernow://shop-001/table/t2', maxSeats: 9, isActive: true, currentPlayers: 3, createdAt: new Date().toISOString() },
  { tableId: 't3', shopId: 'shop-001', name: '卓3', qrCode: 'pokernow://shop-001/table/t3', maxSeats: 9, isActive: true, currentPlayers: 9, createdAt: new Date().toISOString() },
  { tableId: 't4', shopId: 'shop-001', name: '卓4', qrCode: 'pokernow://shop-001/table/t4', maxSeats: 9, isActive: true, currentPlayers: 0, createdAt: new Date().toISOString() },
  { tableId: 't5', shopId: 'shop-001', name: '卓5', qrCode: 'pokernow://shop-001/table/t5', maxSeats: 9, isActive: true, currentPlayers: 2, createdAt: new Date().toISOString() },
];

// モックデータ: 着席者
const MOCK_PLAYERS: Record<string, Player[]> = {
  t1: [
    { playerId: 'p1', pokerName: 'Taka', displaySetting: 'public', authProvider: 'google', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p2', pokerName: 'Yuki', displaySetting: 'public', authProvider: 'apple', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p3', pokerName: 'Ken', displaySetting: 'masked', authProvider: 'phone', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p4', pokerName: 'Sato', displaySetting: 'public', authProvider: 'google', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p5', pokerName: 'Tanaka', displaySetting: 'hidden', authProvider: 'apple', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p6', pokerName: 'Suzuki', displaySetting: 'public', authProvider: 'google', role: 'player', createdAt: '', updatedAt: '' },
  ],
  t2: [
    { playerId: 'p7', pokerName: 'Mike', displaySetting: 'public', authProvider: 'google', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p8', pokerName: 'Tom', displaySetting: 'public', authProvider: 'apple', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p9', pokerName: 'Sara', displaySetting: 'public', authProvider: 'phone', role: 'player', createdAt: '', updatedAt: '' },
  ],
  t3: [
    { playerId: 'p10', pokerName: 'Player1', displaySetting: 'public', authProvider: 'google', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p11', pokerName: 'Player2', displaySetting: 'public', authProvider: 'apple', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p12', pokerName: 'Player3', displaySetting: 'public', authProvider: 'phone', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p13', pokerName: 'Player4', displaySetting: 'public', authProvider: 'google', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p14', pokerName: 'Player5', displaySetting: 'public', authProvider: 'apple', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p15', pokerName: 'Player6', displaySetting: 'public', authProvider: 'phone', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p16', pokerName: 'Player7', displaySetting: 'public', authProvider: 'google', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p17', pokerName: 'Player8', displaySetting: 'public', authProvider: 'apple', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p18', pokerName: 'Player9', displaySetting: 'public', authProvider: 'phone', role: 'player', createdAt: '', updatedAt: '' },
  ],
  t4: [],
  t5: [
    { playerId: 'p19', pokerName: 'Alex', displaySetting: 'public', authProvider: 'google', role: 'player', createdAt: '', updatedAt: '' },
    { playerId: 'p20', pokerName: 'Chris', displaySetting: 'public', authProvider: 'apple', role: 'player', createdAt: '', updatedAt: '' },
  ],
};

// 混雑度計算
function getCongestionLevel(current: number, max: number): CongestionLevel {
  const ratio = current / max;
  if (ratio >= 1) return 'high';
  if (ratio >= 0.5) return 'medium';
  return 'low';
}

// プレイヤー名の表示
function displayPlayerName(player: Player): string {
  switch (player.displaySetting) {
    case 'masked':
      return player.pokerName.charAt(0) + '***';
    case 'hidden':
      return '(非表示)';
    default:
      return player.pokerName;
  }
}

export function TableManagementPage() {
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
  const [players, setPlayers] = useState<Record<string, Player[]>>(MOCK_PLAYERS);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // QRダイアログを開く
  const handleOpenQrDialog = (table: Table) => {
    setSelectedTable(table);
    setQrDialogOpen(true);
  };

  // 個別退席
  const handleRemovePlayer = (tableId: string, playerId: string) => {
    setPlayers((prev) => ({
      ...prev,
      [tableId]: prev[tableId].filter((p) => p.playerId !== playerId),
    }));
    setTables((prev) =>
      prev.map((t) =>
        t.tableId === tableId ? { ...t, currentPlayers: t.currentPlayers - 1 } : t
      )
    );
    setSnackbarMessage('プレイヤーを退席させました');
    setSnackbarOpen(true);
  };

  // 卓全員退席
  const handleRemoveAllPlayers = (tableId: string) => {
    const playerCount = players[tableId]?.length || 0;
    setPlayers((prev) => ({
      ...prev,
      [tableId]: [],
    }));
    setTables((prev) =>
      prev.map((t) =>
        t.tableId === tableId ? { ...t, currentPlayers: 0 } : t
      )
    );
    setSnackbarMessage(`${playerCount}人を退席させました`);
    setSnackbarOpen(true);
  };

  // QRコードダウンロード
  const handleDownloadQr = () => {
    if (!selectedTable) return;
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${selectedTable.name}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    setSnackbarMessage('QRコードをダウンロードしました');
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
          卓管理
        </Typography>

        {/* 卓一覧 */}
        {tables.map((table) => (
          <Accordion
            key={table.tableId}
            sx={{
              mb: 1,
              bgcolor: 'background.paper',
              borderRadius: 2,
              '&:before': { display: 'none' },
              border: '1px solid',
              borderColor: 'rgba(255, 215, 0, 0.12)',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, minWidth: 60 }}>
                  {table.name}
                </Typography>
                <Chip
                  size="small"
                  label={`${table.currentPlayers}/${table.maxSeats}人`}
                  sx={{ minWidth: 70 }}
                />
                <CongestionBadge
                  level={getCongestionLevel(table.currentPlayers, table.maxSeats)}
                  size="small"
                />
                <Box sx={{ flex: 1 }} />
                <Button
                  size="small"
                  startIcon={<QrCodeIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenQrDialog(table);
                  }}
                  sx={{ mr: 1 }}
                >
                  QR
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              {/* 着席者一覧 */}
              {players[table.tableId]?.length > 0 ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      着席者一覧
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<GroupRemoveIcon />}
                      onClick={() => handleRemoveAllPlayers(table.tableId)}
                    >
                      全員退席
                    </Button>
                  </Box>
                  <List dense sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                    {players[table.tableId].map((player, index) => (
                      <ListItem key={player.playerId}>
                        <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">
                                {index + 1}. {displayPlayerName(player)}
                              </Typography>
                              {player.displaySetting !== 'public' && (
                                <Chip
                                  label={player.displaySetting === 'masked' ? '伏字' : '非表示'}
                                  size="small"
                                  sx={{ height: 18, fontSize: '0.65rem' }}
                                />
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            color="error"
                            onClick={() => handleRemovePlayer(table.tableId, player.playerId)}
                          >
                            <ExitToAppIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  着席者なし
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        {/* QRコードダイアログ */}
        <Dialog
          open={qrDialogOpen}
          onClose={() => setQrDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#141414',
              borderRadius: 3,
              border: '1px solid rgba(255, 215, 0, 0.2)',
            },
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
            {selectedTable?.name} QRコード
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>
            <Box
              sx={{
                p: 3,
                bgcolor: 'white',
                borderRadius: 2,
                display: 'inline-block',
              }}
            >
              {selectedTable && (
                <QRCode
                  id="qr-code-svg"
                  value={selectedTable.qrCode}
                  size={200}
                  level="H"
                />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              このQRコードを印刷して卓に設置してください
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadQr}
            >
              ダウンロード
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
