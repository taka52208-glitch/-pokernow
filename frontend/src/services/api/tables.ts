// 卓API サービス
import { api } from './client';
import type { Table } from '../../types';

// レスポンス型
interface TablesResponse {
  success: boolean;
  tables: Table[];
}

interface TableResponse {
  success: boolean;
  table: Table;
}

// 卓一覧取得
export async function getTables(shopId: string): Promise<Table[]> {
  const response = await api.get<TablesResponse>(`/api/shops/${shopId}/tables`);
  return response.tables;
}

// 卓追加（管理者）
export async function createTable(
  shopId: string,
  data: { name: string; maxSeats?: number }
): Promise<Table> {
  const response = await api.post<TableResponse>(`/api/shops/${shopId}/tables`, data);
  return response.table;
}

// 卓更新（管理者）
export async function updateTable(
  shopId: string,
  tableId: string,
  data: Partial<Table>
): Promise<Table> {
  const response = await api.put<TableResponse>(
    `/api/shops/${shopId}/tables/${tableId}`,
    data
  );
  return response.table;
}

// 卓削除（管理者）
export async function deleteTable(shopId: string, tableId: string): Promise<void> {
  await api.delete(`/api/shops/${shopId}/tables/${tableId}`);
}
