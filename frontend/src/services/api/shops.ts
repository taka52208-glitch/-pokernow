// 店舗API サービス
import { api } from './client';
import type { Shop } from '../../types';

// レスポンス型
interface ShopsResponse {
  success: boolean;
  shops: Shop[];
}

interface ShopResponse {
  success: boolean;
  shop: Shop;
}

// 店舗一覧取得
export async function getShops(): Promise<Shop[]> {
  const response = await api.get<ShopsResponse>('/api/shops');
  return response.shops;
}

// 店舗詳細取得
export async function getShop(shopId: string): Promise<Shop> {
  const response = await api.get<ShopResponse>(`/api/shops/${shopId}`);
  return response.shop;
}

// 店舗情報更新（管理者）
export async function updateShop(
  shopId: string,
  data: Partial<Shop>
): Promise<Shop> {
  const response = await api.put<ShopResponse>(`/api/shops/${shopId}`, data);
  return response.shop;
}
