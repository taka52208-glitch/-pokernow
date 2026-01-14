import { Hono } from 'hono';
import { prisma } from '../utils/prisma.js';

export const eventsRoutes = new Hono();

// GET /api/shops/:shopId/events - 店舗のイベント一覧取得
eventsRoutes.get('/', async (c) => {
  const shopId = c.req.param('shopId');

  const events = await prisma.event.findMany({
    where: { shopId },
    orderBy: { startTime: 'asc' },
  });

  const eventList = events.map((event) => ({
    eventId: event.id,
    shopId: event.shopId,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    createdAt: event.createdAt.toISOString(),
  }));

  return c.json({ success: true, events: eventList });
});
