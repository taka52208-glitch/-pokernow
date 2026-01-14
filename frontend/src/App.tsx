import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import { LoginPage } from './pages/player/LoginPage';
import { ShopListPage } from './pages/player/ShopListPage';
import { ShopDetailPage } from './pages/player/ShopDetailPage';
import { QRScanPage } from './pages/player/QRScanPage';
import { MyPage } from './pages/player/MyPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ShopSettingsPage } from './pages/admin/ShopSettingsPage';
import { TableManagementPage } from './pages/admin/TableManagementPage';
import { TournamentManagementPage } from './pages/admin/TournamentManagementPage';

// 保護ルートコンポーネント
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'player' | 'admin';
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    return <Navigate to="/shops" replace />;
  }

  return <>{children}</>;
}

// ルーティング設定
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 公開ルート */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/shops" replace /> : <LoginPage />}
      />

      {/* プレイヤールート */}
      <Route
        path="/shops"
        element={
          <ProtectedRoute>
            <ShopListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shops/:shopId"
        element={
          <ProtectedRoute>
            <ShopDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <QRScanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />

      {/* 管理者ルート */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requiredRole="admin">
            <ShopSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tables"
        element={
          <ProtectedRoute requiredRole="admin">
            <TableManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tournaments"
        element={
          <ProtectedRoute requiredRole="admin">
            <TournamentManagementPage />
          </ProtectedRoute>
        }
      />

      {/* デフォルトリダイレクト */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
