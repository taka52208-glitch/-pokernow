// トーナメントAPI サービス
import { api } from './client';
import type { Tournament, TournamentStructure } from '../../types';

// レスポンス型
interface TournamentsResponse {
  success: boolean;
  tournaments: Tournament[];
}

interface TournamentResponse {
  success: boolean;
  tournament: Tournament;
}

// トーナメント操作タイプ
export type TournamentAction = 'start' | 'pause' | 'resume' | 'break' | 'next' | 'end';

// トーナメント一覧取得
export async function getTournaments(shopId: string): Promise<Tournament[]> {
  const response = await api.get<TournamentsResponse>(
    `/api/shops/${shopId}/tournaments`
  );
  return response.tournaments;
}

// トーナメント詳細取得
export async function getTournament(
  shopId: string,
  tournamentId: string
): Promise<Tournament> {
  const response = await api.get<TournamentResponse>(
    `/api/shops/${shopId}/tournaments/${tournamentId}`
  );
  return response.tournament;
}

// トーナメント作成（管理者）
export async function createTournament(
  shopId: string,
  data: {
    name: string;
    structure: TournamentStructure[];
    entryFee?: number;
    startingStack?: number;
  }
): Promise<Tournament> {
  const response = await api.post<TournamentResponse>(
    `/api/shops/${shopId}/tournaments`,
    data
  );
  return response.tournament;
}

// トーナメント更新（管理者）
export async function updateTournament(
  shopId: string,
  tournamentId: string,
  data: Partial<Tournament>
): Promise<Tournament> {
  const response = await api.put<TournamentResponse>(
    `/api/shops/${shopId}/tournaments/${tournamentId}`,
    data
  );
  return response.tournament;
}

// トーナメント操作（管理者）
export async function controlTournament(
  shopId: string,
  tournamentId: string,
  action: TournamentAction
): Promise<Tournament> {
  const response = await api.post<TournamentResponse>(
    `/api/shops/${shopId}/tournaments/${tournamentId}/control`,
    { action }
  );
  return response.tournament;
}
