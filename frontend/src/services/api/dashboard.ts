// ダッシュボードAPI サービス
import { api } from './client';

// ダッシュボード統計型
export interface DashboardStats {
  currentPlayers: number;
  totalTables: number;
  activeTables: number;
  totalSeats: number;
  occupancyRate: number;
}

export interface TableStat {
  tableId: string;
  name: string;
  isActive: boolean;
  currentPlayers: number;
  maxSeats: number;
  occupancy: number;
}

export interface ActiveTournament {
  tournamentId: string;
  name: string;
  status: string;
  currentLevel: number;
  remainingSeconds: number;
}

export interface DashboardData {
  shop: {
    shopId: string;
    name: string;
  };
  stats: DashboardStats;
  tables: TableStat[];
  tournaments: ActiveTournament[];
}

// レスポンス型
interface DashboardResponse {
  success: boolean;
  dashboard: DashboardData;
}

// ダッシュボード情報取得
export async function getDashboard(shopId: string): Promise<DashboardData> {
  const response = await api.get<DashboardResponse>(
    `/api/shops/${shopId}/dashboard`
  );
  return response.dashboard;
}
