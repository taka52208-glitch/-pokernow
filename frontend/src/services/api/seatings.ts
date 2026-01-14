// 着席API サービス
import { api } from './client';
import type { Seating, Table, Shop } from '../../types';

// 拡張着席情報型
export interface SeatingWithDetails extends Seating {
  table: Pick<Table, 'tableId' | 'name' | 'maxSeats'>;
  shop: Pick<Shop, 'shopId' | 'name' | 'address'>;
}

// レスポンス型
interface MySeatingResponse {
  success: boolean;
  seating: SeatingWithDetails | null;
}

interface SeatingResponse {
  success: boolean;
  seating: Seating;
}

// 自分の着席情報取得
export async function getMySeating(): Promise<SeatingWithDetails | null> {
  const response = await api.get<MySeatingResponse>('/api/seatings/my');
  return response.seating;
}

// 着席登録
export async function createSeating(
  shopId: string,
  tableId: string,
  seatNumber?: number
): Promise<Seating> {
  const response = await api.post<SeatingResponse>('/api/seatings', {
    shopId,
    tableId,
    seatNumber,
  });
  return response.seating;
}

// 退席（自分）
export async function leaveSeating(seatingId: string): Promise<void> {
  await api.delete(`/api/seatings/${seatingId}`);
}

// 退席（管理者による強制）
export async function adminRemoveSeating(seatingId: string): Promise<void> {
  await api.delete(`/api/seatings/${seatingId}/admin`);
}

// 卓全員退席（管理者）
export async function adminRemoveAllSeatings(
  shopId: string,
  tableId: string
): Promise<void> {
  await api.delete(`/api/shops/${shopId}/tables/${tableId}/seatings`);
}
