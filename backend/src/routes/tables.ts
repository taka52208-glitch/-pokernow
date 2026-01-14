import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

export const tablesRoutes = new Hono();

// 卓作成スキーマ
const createTableSchema = z.object({
  name: z.string().min(1).max(50),
  maxSeats: z.number().int().min(1).max(10).default(9),
});

// 卓更新スキーマ
const updateTableSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  maxSeats: z.number().int().min(1).max(10).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/shops/:shopId/tables - 卓一覧取得
tablesRoutes.get('/', async (c) => {
  const shopId = c.req.param('shopId');

  const tables = await prisma.table.findMany({
    where: { shopId },
    include: {
      seatings: {
        where: { status: 'active' },
        include: {
          player: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const tableList = tables.map((table) => ({
    tableId: table.id,
    shopId: table.shopId,
    name: table.name,
    qrCode: table.qrCode,
    maxSeats: table.maxSeats,
    isActive: table.isActive,
    currentPlayers: table.seatings.length,
    createdAt: table.createdAt.toISOString(),
  }));

  return c.json({ success: true, tables: tableList });
});

// POST /api/shops/:shopId/tables - 卓追加（管理者）
tablesRoutes.post('/', async (c) => {
  const shopId = c.req.param('shopId');
  const body = await c.req.json();
  const result = createTableSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid request', details: result.error }, 400);
  }

  // 店舗存在確認
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) {
    return c.json({ error: 'Shop not found' }, 404);
  }

  // QRコード生成
  const qrCode = `pokernow://${shop.id}/table/${Date.now()}`;

  const table = await prisma.table.create({
    data: {
      shopId: shop.id,
      name: result.data.name,
      qrCode,
      maxSeats: result.data.maxSeats,
    },
  });

  return c.json(
    {
      success: true,
      table: {
        tableId: table.id,
        shopId: table.shopId,
        name: table.name,
        qrCode: table.qrCode,
        maxSeats: table.maxSeats,
        isActive: table.isActive,
        currentPlayers: 0,
        createdAt: table.createdAt.toISOString(),
      },
    },
    201
  );
});

// PUT /api/shops/:shopId/tables/:tableId - 卓情報更新（管理者）
tablesRoutes.put('/:tableId', async (c) => {
  const shopId = c.req.param('shopId');
  const tableId = c.req.param('tableId');
  const body = await c.req.json();
  const result = updateTableSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid request', details: result.error }, 400);
  }

  try {
    const table = await prisma.table.update({
      where: { id: tableId, shopId },
      data: result.data,
    });

    return c.json({
      success: true,
      table: {
        tableId: table.id,
        shopId: table.shopId,
        name: table.name,
        qrCode: table.qrCode,
        maxSeats: table.maxSeats,
        isActive: table.isActive,
        createdAt: table.createdAt.toISOString(),
      },
    });
  } catch {
    return c.json({ error: 'Table not found' }, 404);
  }
});

// DELETE /api/shops/:shopId/tables/:tableId - 卓削除（管理者）
tablesRoutes.delete('/:tableId', async (c) => {
  const shopId = c.req.param('shopId');
  const tableId = c.req.param('tableId');

  try {
    await prisma.table.delete({
      where: { id: tableId, shopId },
    });

    return c.json({ success: true, message: 'Table deleted' });
  } catch {
    return c.json({ error: 'Table not found' }, 404);
  }
});

// GET /api/shops/:shopId/tables/:tableId/seatings - 卓の着席者一覧
tablesRoutes.get('/:tableId/seatings', async (c) => {
  const shopId = c.req.param('shopId');
  const tableId = c.req.param('tableId');

  // 卓の存在確認
  const table = await prisma.table.findUnique({
    where: { id: tableId, shopId },
  });

  if (!table) {
    return c.json({ error: 'Table not found' }, 404);
  }

  const seatings = await prisma.seating.findMany({
    where: { tableId, status: 'active' },
    include: {
      player: true,
    },
    orderBy: { seatNumber: 'asc' },
  });

  const seatingList = seatings.map((seating) => ({
    seatingId: seating.id,
    playerId: seating.playerId,
    seatNumber: seating.seatNumber,
    seatedAt: seating.seatedAt.toISOString(),
    player: {
      playerId: seating.player.id,
      pokerName: seating.player.pokerName,
      displaySetting: seating.player.displaySetting,
    },
  }));

  return c.json({
    success: true,
    table: {
      tableId: table.id,
      name: table.name,
      maxSeats: table.maxSeats,
    },
    seatings: seatingList,
  });
});

// DELETE /api/shops/:shopId/tables/:tableId/seatings - 卓全員退席（管理者）
tablesRoutes.delete('/:tableId/seatings', async (c) => {
  const shopId = c.req.param('shopId');
  const tableId = c.req.param('tableId');

  // 卓の存在確認
  const table = await prisma.table.findUnique({
    where: { id: tableId, shopId },
  });

  if (!table) {
    return c.json({ error: 'Table not found' }, 404);
  }

  // 全ての着席者を退席に更新
  const result = await prisma.seating.updateMany({
    where: { tableId, status: 'active' },
    data: { status: 'left', leftAt: new Date() },
  });

  return c.json({
    success: true,
    message: `${result.count} players removed from table`,
    count: result.count,
  });
});
