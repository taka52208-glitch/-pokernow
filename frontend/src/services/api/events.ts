// イベントAPI サービス
import { api } from './client';
import type { Event } from '../../types';

// レスポンス型
interface EventsResponse {
  success: boolean;
  events: Event[];
}

// イベント一覧取得
export async function getEvents(shopId: string): Promise<Event[]> {
  const response = await api.get<EventsResponse>(`/api/shops/${shopId}/events`);
  return response.events;
}
