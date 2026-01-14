import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Apple as AppleIcon,
  Google as GoogleIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthProvider } from '../../types';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSocialLogin = async (provider: AuthProvider) => {
    setLoading(true);
    try {
      await login(provider);
      navigate('/shops');
    } catch {
      // エラーハンドリング
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!phoneNumber) return;
    setLoading(true);
    try {
      await login('phone');
      navigate('/shops');
    } catch {
      // エラーハンドリング
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid rgba(255, 215, 0, 0.2)',
          background: 'linear-gradient(180deg, #141414 0%, #1E1E1E 100%)',
        }}
      >
        {/* ヘッダー */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              color: 'primary.main',
              fontWeight: 700,
              mb: 1,
            }}
          >
            PokerNow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            リアルタイム稼働状況＆トーナメント管理
          </Typography>
        </Box>

        {/* デモ用アラート */}
        <Alert
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
          }}
        >
          <Typography variant="caption">
            <strong>デモモード:</strong> どのボタンでもログインできます
          </Typography>
        </Alert>

        {/* ソーシャルログインボタン */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <AppleIcon />}
            onClick={() => handleSocialLogin('apple')}
            disabled={loading}
            sx={{
              py: 1.5,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Appleでログイン
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            sx={{
              py: 1.5,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Googleでログイン
          </Button>
        </Box>

        {/* 区切り線 */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">
            または
          </Typography>
        </Divider>

        {/* 電話番号ログイン */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="電話番号"
            placeholder="090-1234-5678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            InputProps={{
              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handlePhoneLogin}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : '電話番号でログイン'}
          </Button>
        </Box>

        {/* フッター */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 3 }}
        >
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
        </Typography>
      </Paper>
    </PublicLayout>
  );
}
