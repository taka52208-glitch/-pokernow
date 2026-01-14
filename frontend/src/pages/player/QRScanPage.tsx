import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Chip,
  Dialog,
  DialogContent,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  EventSeat as EventSeatIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
import { MainLayout } from '../../layouts/MainLayout';
import type { Table, Shop } from '../../types';

// モックデータ: スキャン結果
const MOCK_SCANNED_TABLE: Table = {
  tableId: 't1',
  shopId: 'shop-001',
  name: '卓1',
  qrCode: 'qr1',
  maxSeats: 9,
  isActive: true,
  currentPlayers: 6,
  createdAt: new Date().toISOString(),
};

const MOCK_SHOP: Shop = {
  shopId: 'shop-001',
  name: 'Demo Poker Club',
  address: '東京都渋谷区道玄坂1-2-3',
  currentPlayers: 25,
  activeTables: 5,
  totalTables: 8,
  congestionLevel: 'medium',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// スキャン状態
type ScanState = 'scanning' | 'confirming' | 'success';

export function QRScanPage() {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [scannedTable, setScannedTable] = useState<Table | null>(null);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'inside' | 'outside'>('checking');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader';

  // 位置情報チェック（モック）
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationStatus('inside');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // QRスキャナー初期化
  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(scannerContainerId);
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (_decodedText) => {
            // QRコード検出時（モック: 実際はdecodedTextから卓情報を取得）
            html5QrCode.stop();
            setScannedTable(MOCK_SCANNED_TABLE);
            setScanState('confirming');
          },
          () => {
            // スキャン中（何もしない）
          }
        );
      } catch (err) {
        setCameraError('カメラを起動できませんでした。カメラへのアクセスを許可してください。');
        // デモ用: カメラエラー時は3秒後に自動でダイアログ表示
        setTimeout(() => {
          setScannedTable(MOCK_SCANNED_TABLE);
          setScanState('confirming');
        }, 3000);
      }
    };

    if (scanState === 'scanning') {
      startScanner();
    }

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [scanState]);

  // 着席確認
  const handleConfirmSeat = () => {
    setScanState('success');
    // 2秒後にマイページへ遷移
    setTimeout(() => {
      navigate('/mypage');
    }, 2000);
  };

  // キャンセル
  const handleCancel = () => {
    setScanState('scanning');
    setScannedTable(null);
  };

  return (
    <MainLayout>
      <Container
        maxWidth="sm"
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 'calc(100vh - 64px - 48px)',
        }}
      >
        {/* ページヘッダー */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            QRコードをスキャン
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            卓に設置されたQRコードを読み取ってください
          </Typography>
        </Box>

        {/* カメラセクション */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
          }}
        >
          {/* カメラプレビュー */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 320,
              aspectRatio: '1',
              bgcolor: '#141414',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            {/* html5-qrcodeコンテナ */}
            <Box
              id={scannerContainerId}
              sx={{
                width: '100%',
                height: '100%',
                '& video': {
                  objectFit: 'cover !important',
                },
                '& #qr-shaded-region': {
                  display: 'none !important',
                },
              }}
            />

            {/* カメラエラー時のプレースホルダー */}
            {cameraError && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
                  p: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', mb: 1 }}
                >
                  {cameraError}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  デモ: 3秒後に自動スキャン
                </Typography>
              </Box>
            )}

            {/* スキャンフレーム */}
            <Box
              sx={{
                position: 'absolute',
                top: 24,
                left: 24,
                right: 24,
                bottom: 24,
                pointerEvents: 'none',
              }}
            >
              {/* 四隅のコーナーマーク */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 24,
                  height: 24,
                  borderTop: '3px solid',
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  borderRadius: '4px 0 0 0',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  borderTop: '3px solid',
                  borderRight: '3px solid',
                  borderColor: 'primary.main',
                  borderRadius: '0 4px 0 0',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 24,
                  height: 24,
                  borderBottom: '3px solid',
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  borderRadius: '0 0 0 4px',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  borderBottom: '3px solid',
                  borderRight: '3px solid',
                  borderColor: 'primary.main',
                  borderRadius: '0 0 4px 0',
                }}
              />

              {/* スキャンライン（アニメーション） */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    'linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)',
                  animation: 'scan 2s ease-in-out infinite',
                  '@keyframes scan': {
                    '0%, 100%': { top: 0 },
                    '50%': { top: 'calc(100% - 2px)' },
                  },
                }}
              />
            </Box>
          </Box>

          {/* 位置情報ステータス */}
          <Chip
            icon={<LocationOnIcon />}
            label={
              locationStatus === 'checking'
                ? '位置確認中...'
                : locationStatus === 'inside'
                  ? '店舗内にいます'
                  : '店舗外です'
            }
            color={locationStatus === 'inside' ? 'success' : 'default'}
            variant="outlined"
            size="small"
            sx={{ mt: 3 }}
          />

          {/* スキャン説明 */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 3 }}
          >
            カメラをQRコードに向けてください
          </Typography>
        </Box>
      </Container>

      {/* 着席確認ダイアログ */}
      <Dialog
        open={scanState === 'confirming'}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            bgcolor: '#141414',
            borderRadius: 4,
            border: '1px solid rgba(255, 215, 0, 0.2)',
            maxWidth: 360,
          },
        }}
      >
        <DialogContent sx={{ textAlign: 'center', p: 3 }}>
          <EventSeatIcon
            sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            着席確認
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {MOCK_SHOP.name}
            </Box>
            の
            <br />
            <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>
              {scannedTable?.name}
            </Box>
            に着席しますか？
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              onClick={handleCancel}
              sx={{
                borderColor: '#B0B0B0',
                color: '#B0B0B0',
                '&:hover': {
                  borderColor: '#B0B0B0',
                  bgcolor: 'rgba(176, 176, 176, 0.1)',
                },
              }}
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConfirmSeat}
              sx={{ fontWeight: 600 }}
            >
              着席する
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* 着席完了ダイアログ */}
      <Dialog
        open={scanState === 'success'}
        PaperProps={{
          sx: {
            bgcolor: '#141414',
            borderRadius: 4,
            border: '1px solid rgba(255, 215, 0, 0.2)',
            maxWidth: 360,
          },
        }}
      >
        <DialogContent sx={{ textAlign: 'center', p: 3 }}>
          <CheckCircleIcon
            sx={{ fontSize: 48, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            着席完了
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <Box component="span" sx={{ fontWeight: 600 }}>
              {scannedTable?.name}
            </Box>
            に着席しました
          </Typography>
          <Typography variant="caption" color="text.secondary">
            マイページへ移動します...
          </Typography>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
