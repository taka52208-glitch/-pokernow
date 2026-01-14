import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

export const shopsRoutes = new Hono();

// 店舗更新スキーマ
const updateShopSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  address: z.string().min(1).max(200).optional(),
  imageUrl: z.string().url().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  openTime: z.string().optional().nullable(),
  closeTime: z.string().optional().nullable(),
});

// GET /api/shops - 店舗一覧取得
shopsRoutes.get('/', async (c) => {
  const shops = await prisma.shop.findMany({
    include: {
      tables: {
        include: {
          seatings: {
            where: { status: 'active' },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const shopList = shops.map((shop) => {
    const activeTables = shop.tables.filter((t) => t.isActive).length;
    const currentPlayers = shop.tables.reduce(
      (sum, t) => sum + t.seatings.length,
      0
    );
    const totalSeats = shop.tables.reduce((sum, t) => sum + t.maxSeats, 0);

    // 混雑度計算
    const ratio = totalSeats > 0 ? currentPlayers / totalSeats : 0;
    let congestionLevel: 'low' | 'medium' | 'high' = 'low';
    if (ratio >= 0.8) congestionLevel = 'high';
    else if (ratio >= 0.5) congestionLevel = 'medium';

    return {
      shopId: shop.id,
      name: shop.name,
      address: shop.address,
      imageUrl: shop.imageUrl,
      currentPlayers,
      activeTables,
      totalTables: shop.tables.length,
      congestionLevel,
      createdAt: shop.createdAt.toISOString(),
      updatedAt: shop.updatedAt.toISOString(),
    };
  });

  return c.json({ success: true, shops: shopList });
});

// GET /api/shops/:shopId - 店舗詳細取得
shopsRoutes.get('/:shopId', async (c) => {
  const shopId = c.req.param('shopId');

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
    },
  });

  if (!shop) {
    return c.json({ error: 'Shop not found' }, 404);
  }

  const activeTables = shop.tables.filter((t) => t.isActive).length;
  const currentPlayers = shop.tables.reduce(
    (sum, t) => sum + t.seatings.length,
    0
  );
  const totalSeats = shop.tables.reduce((sum, t) => sum + t.maxSeats, 0);

  const ratio = totalSeats > 0 ? currentPlayers / totalSeats : 0;
  let congestionLevel: 'low' | 'medium' | 'high' = 'low';
  if (ratio >= 0.8) congestionLevel = 'high';
  else if (ratio >= 0.5) congestionLevel = 'medium';

  return c.json({
    success: true,
    shop: {
      shopId: shop.id,
      name: shop.name,
      address: shop.address,
      imageUrl: shop.imageUrl,
      latitude: shop.latitude,
      longitude: shop.longitude,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      currentPlayers,
      activeTables,
      totalTables: shop.tables.length,
      congestionLevel,
      createdAt: shop.createdAt.toISOString(),
      updatedAt: shop.updatedAt.toISOString(),
    },
  });
});

// PUT /api/shops/:shopId - 店舗情報更新（管理者）
shopsRoutes.put('/:shopId', async (c) => {
  const shopId = c.req.param('shopId');
  const body = await c.req.json();
  const result = updateShopSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid request', details: result.error }, 400);
  }

  try {
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: result.data,
    });

    return c.json({
      success: true,
      shop: {
        shopId: shop.id,
        name: shop.name,
        address: shop.address,
        imageUrl: shop.imageUrl,
        latitude: shop.latitude,
        longitude: shop.longitude,
        openTime: shop.openTime,
        closeTime: shop.closeTime,
        createdAt: shop.createdAt.toISOString(),
        updatedAt: shop.updatedAt.toISOString(),
      },
    });
  } catch {
    return c.json({ error: 'Shop not found' }, 404);
  }
});
