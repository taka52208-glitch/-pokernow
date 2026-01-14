// PokerNow - 型定義ファイル
// 全ての型定義を一元管理

// ============================================
// 認証・ユーザー関連
// ============================================

export type UserRole = 'guest' | 'player' | 'admin';

export type AuthProvider = 'apple' | 'google' | 'phone';

export type DisplaySetting = 'public' | 'masked' | 'hidden';

export interface Player {
  playerId: string;
  pokerName: string;
  displaySetting: DisplaySetting;
  authProvider: AuthProvider;
  email?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  player: Player | null;
  role: UserRole;
}

// ============================================
// 店舗関連
// ============================================

export type CongestionLevel = 'low' | 'medium' | 'high';

export interface Shop {
  shopId: string;
  name: string;
  address: string;
  imageUrl?: string;
  currentPlayers: number;
  activeTables: number;
  totalTables: number;
  congestionLevel: CongestionLevel;
  latitude?: number;
  longitude?: number;
  openTime?: string;
  closeTime?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 卓関連
// ============================================

export interface Table {
  tableId: string;
  shopId: string;
  name: string;
  qrCode: string;
  maxSeats: number;
  isActive: boolean;
  currentPlayers: number;
  createdAt: string;
}

// ============================================
// 着席関連
// ============================================

export type SeatingStatus = 'active' | 'left';

export interface Seating {
  seatingId: string;
  playerId: string;
  shopId: string;
  tableId: string;
  seatNumber?: number;
  status: SeatingStatus;
  seatedAt: string;
  leftAt?: string;
}

// ============================================
// トーナメント関連
// ============================================

export type TournamentStatus = 'waiting' | 'running' | 'paused' | 'break' | 'finished';

export interface TournamentStructure {
  level: number;
  smallBlind: number;
  bigBlind: number;
  ante?: number;
  duration: number; // 分
  isBreak: boolean;
}

export interface Tournament {
  tournamentId: string;
  shopId: string;
  name: string;
  status: TournamentStatus;
  currentLevel: number;
  remainingSeconds: number;
  structure: TournamentStructure[];
  entryFee?: number;
  startingStack?: number;
  createdAt: string;
  startedAt?: string;
}

// ============================================
// イベント関連
// ============================================

export interface Event {
  eventId: string;
  shopId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  createdAt: string;
}

// ============================================
// ナビゲーション関連
// ============================================

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

// ============================================
// API関連
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
