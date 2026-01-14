import { Hono } from 'hono';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

export const seatingsRoutes = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// 着席スキーマ
const createSeatingSchema = z.object({
  tableId: z.string(),
  shopId: z.string(),
  seatNumber: z.number().int().min(1).max(10).optional(),
});

// ヘルパー: トークンからプレイヤーID取得
function getPlayerIdFromToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as {
      playerId: string;
    };
    return decoded.playerId;
  } catch {
    return null;
  }
}

// GET /api/seatings/my - 自分の着席情報取得
seatingsRoutes.get('/my', async (c) => {
  const playerId = getPlayerIdFromToken(c.req.header('Authorization'));
  if (!playerId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const seating = await prisma.seating.findFirst({
    where: { playerId, status: 'active' },
    include: {
      table: {
        include: {
          shop: true,
        },
      },
    },
  });

  if (!seating) {
    return c.json({ success: true, seating: null });
  }

  return c.json({
    success: true,
    seating: {
      seatingId: seating.id,
      playerId: seating.playerId,
      shopId: seating.shopId,
      tableId: seating.tableId,
      seatNumber: seating.seatNumber,
      status: seating.status,
      seatedAt: seating.seatedAt.toISOString(),
      table: {
        tableId: seating.table.id,
        name: seating.table.name,
        maxSeats: seating.table.maxSeats,
      },
      shop: {
        shopId: seating.table.shop.id,
        name: seating.table.shop.name,
        address: seating.table.shop.address,
      },
    },
  });
});

// POST /api/seatings - 着席登録
seatingsRoutes.post('/', async (c) => {
  const playerId = getPlayerIdFromToken(c.req.header('Authorization'));
  if (!playerId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const body = await c.req.json();
  const result = createSeatingSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid request', details: result.error }, 400);
  }

  // 既に着席中かチェック
  const existingSeating = await prisma.seating.findFirst({
    where: { playerId, status: 'active' },
  });

  if (existingSeating) {
    return c.json({ error: 'Already seated at another table' }, 409);
  }

  // 卓の存在確認
  const table = await prisma.table.findUnique({
    where: { id: result.data.tableId },
    include: {
      seatings: { where: { status: 'active' } },
    },
  });

  if (!table || !table.isActive) {
    return c.json({ error: 'Table not found or inactive' }, 404);
  }

  // 満席チェック
  if (table.seatings.length >= table.maxSeats) {
    return c.json({ error: 'Table is full' }, 409);
  }

  const seating = await prisma.seating.create({
    data: {
      playerId,
      shopId: result.data.shopId,
      tableId: result.data.tableId,
      seatNumber: result.data.seatNumber,
    },
  });

  return c.json(
    {
      success: true,
      seating: {
        seatingId: seating.id,
        playerId: seating.playerId,
        shopId: seating.shopId,
        tableId: seating.tableId,
        seatNumber: seating.seatNumber,
        status: seating.status,
        seatedAt: seating.seatedAt.toISOString(),
      },
    },
    201
  );
});

// DELETE /api/seatings/:seatingId - 退席（自分）
seatingsRoutes.delete('/:seatingId', async (c) => {
  const playerId = getPlayerIdFromToken(c.req.header('Authorization'));
  if (!playerId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const seatingId = c.req.param('seatingId');

  try {
    const seating = await prisma.seating.update({
      where: { id: seatingId, playerId, status: 'active' },
      data: { status: 'left', leftAt: new Date() },
    });

    return c.json({
      success: true,
      seating: {
        seatingId: seating.id,
        status: seating.status,
        leftAt: seating.leftAt?.toISOString(),
      },
    });
  } catch {
    return c.json({ error: 'Seating not found' }, 404);
  }
});

// DELETE /api/seatings/:seatingId/admin - 退席（管理者による強制）
seatingsRoutes.delete('/:seatingId/admin', async (c) => {
  // TODO: 管理者権限チェック
  const seatingId = c.req.param('seatingId');

  try {
    const seating = await prisma.seating.update({
      where: { id: seatingId, status: 'active' },
      data: { status: 'left', leftAt: new Date() },
    });

    return c.json({
      success: true,
      seating: {
        seatingId: seating.id,
        status: seating.status,
        leftAt: seating.leftAt?.toISOString(),
      },
    });
  } catch {
    return c.json({ error: 'Seating not found' }, 404);
  }
});
