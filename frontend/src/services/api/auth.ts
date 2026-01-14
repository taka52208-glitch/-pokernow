// 認証API サービス
import { api, setAuthToken } from './client';
import type { Player, AuthProvider, DisplaySetting } from '../../types';

// レスポンス型
interface LoginResponse {
  success: boolean;
  token: string;
  player: Player;
}

interface PlayerResponse {
  success: boolean;
  player: Player;
}

// ログイン
export async function login(provider: AuthProvider, email?: string): Promise<Player> {
  const response = await api.post<LoginResponse>('/api/auth/login', {
    provider,
    email,
  });

  setAuthToken(response.token);
  return response.player;
}

// ログアウト
export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
  setAuthToken(null);
}

// 現在のユーザー情報取得
export async function getCurrentUser(): Promise<Player | null> {
  try {
    const response = await api.get<PlayerResponse>('/api/auth/me');
    return response.player;
  } catch {
    return null;
  }
}

// プロフィール更新
export async function updateProfile(
  pokerName: string,
  displaySetting: DisplaySetting
): Promise<Player> {
  const response = await api.put<PlayerResponse>('/api/auth/profile', {
    pokerName,
    displaySetting,
  });
  return response.player;
}
