import { Hono } from 'hono';
import { prisma } from '../utils/prisma.js';

export const dashboardRoutes = new Hono();

// GET /api/shops/:shopId/dashboard - ダッシュボード統計情報
dashboardRoutes.get('/', async (c) => {
  const shopId = c.req.param('shopId');

  // 店舗情報取得
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      tables: {
        include: {
          seatings: {
            where: { status: 'active' },
          },
        },
      },
      tournaments: {
        where: {
          status: { in: ['waiting', 'running', 'paused', 'break'] },
        },
      },
    },
  });

  if (!shop) {
    return c.json({ error: 'Shop not found' }, 404);
  }

  // 統計計算
  const totalTables = shop.tables.length;
  const activeTables = shop.tables.filter((t) => t.isActive).length;
  const currentPlayers = shop.tables.reduce(
    (sum, t) => sum + t.seatings.length,
    0
  );
  const totalSeats = shop.tables.reduce((sum, t) => sum + t.maxSeats, 0);
  const occupancyRate = totalSeats > 0 ? (currentPlayers / totalSeats) * 100 : 0;

  // 卓ごとの状況
  const tableStats = shop.tables.map((table) => ({
    tableId: table.id,
    name: table.name,
    isActive: table.isActive,
    currentPlayers: table.seatings.length,
    maxSeats: table.maxSeats,
    occupancy: (table.seatings.length / table.maxSeats) * 100,
  }));

  // 開催中トーナメント
  const activeTournaments = shop.tournaments.map((t) => ({
    tournamentId: t.id,
    name: t.name,
    status: t.status,
    currentLevel: t.currentLevel,
    remainingSeconds: t.remainingSeconds,
  }));

  return c.json({
    success: true,
    dashboard: {
      shop: {
        shopId: shop.id,
        name: shop.name,
      },
      stats: {
        currentPlayers,
        totalTables,
        activeTables,
        totalSeats,
        occupancyRate: Math.round(occupancyRate),
      },
      tables: tableStats,
      tournaments: activeTournaments,
    },
  });
});
