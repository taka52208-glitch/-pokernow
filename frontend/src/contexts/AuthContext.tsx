import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Player, UserRole, AuthProvider as AuthProviderEnum, DisplaySetting } from '../types';
import { authApi, getAuthToken, setAuthToken } from '../services/api';

// ============================================
// 認証コンテキストの型定義
// ============================================

interface AuthContextType {
  isAuthenticated: boolean;
  player: Player | null;
  role: UserRole;
  loading: boolean;
  login: (provider: AuthProviderEnum) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerPokerName: (name: string, displaySetting: DisplaySetting) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// 認証プロバイダー
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [loading, setLoading] = useState(true);

  // 初回マウント時に認証状態を復元
  useEffect(() => {
    const restoreAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const currentPlayer = await authApi.getCurrentUser();
          if (currentPlayer) {
            setPlayer(currentPlayer);
            setRole((currentPlayer.role as UserRole) || 'player');
            setIsAuthenticated(true);
          }
        } catch {
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    restoreAuth();
  }, []);

  // ログイン
  const login = useCallback(async (provider: AuthProviderEnum) => {
    const loggedInPlayer = await authApi.login(provider);
    setPlayer(loggedInPlayer);
    setRole((loggedInPlayer.role as UserRole) || 'player');
    setIsAuthenticated(true);
  }, []);

  // ログアウト
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // エラーを無視
    }
    setPlayer(null);
    setRole('guest');
    setIsAuthenticated(false);
  }, []);

  // ロール切り替え（デモ用）
  // 実際にはバックエンドでロールを持つユーザーでログインし直す
  const switchRole = useCallback(async (newRole: UserRole) => {
    if (newRole === 'guest') {
      logout();
      return;
    }

    // デモ用：adminまたはplayerでログイン
    const email = newRole === 'admin' ? 'admin@pokernow.local' : 'player@pokernow.local';
    try {
      // 現在のトークンをクリアしてから新しいユーザーでログイン
      setAuthToken(null);
      const newPlayer = await authApi.login('google', email);
      setPlayer(newPlayer);
      setRole((newPlayer.role as UserRole) || newRole);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Role switch failed:', error);
    }
  }, [logout]);

  // ポーカーネーム登録
  const registerPokerName = useCallback(async (name: string, displaySetting: DisplaySetting) => {
    const updatedPlayer = await authApi.updateProfile(name, displaySetting);
    setPlayer(updatedPlayer);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    player,
    role,
    loading,
    login,
    logout,
    switchRole,
    registerPokerName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// カスタムフック
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
