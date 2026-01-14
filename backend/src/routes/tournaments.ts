import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

export const tournamentsRoutes = new Hono();

// ストラクチャースキーマ
const structureSchema = z.array(
  z.object({
    level: z.number().int(),
    smallBlind: z.number().int(),
    bigBlind: z.number().int(),
    ante: z.number().int().optional(),
    duration: z.number().int(),
    isBreak: z.boolean(),
  })
);

// トーナメント作成スキーマ
const createTournamentSchema = z.object({
  name: z.string().min(1).max(100),
  structure: structureSchema,
  entryFee: z.number().int().optional(),
  startingStack: z.number().int().optional(),
});

// トーナメント更新スキーマ
const updateTournamentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  structure: structureSchema.optional(),
  entryFee: z.number().int().optional().nullable(),
  startingStack: z.number().int().optional().nullable(),
});

// トーナメント操作スキーマ
const controlSchema = z.object({
  action: z.enum(['start', 'pause', 'resume', 'break', 'next', 'end']),
});

// GET /api/shops/:shopId/tournaments - トーナメント一覧取得
tournamentsRoutes.get('/', async (c) => {
  const shopId = c.req.param('shopId');

  const tournaments = await prisma.tournament.findMany({
    where: { shopId },
    orderBy: { createdAt: 'desc' },
  });

  const tournamentList = tournaments.map((t) => ({
    tournamentId: t.id,
    shopId: t.shopId,
    name: t.name,
    status: t.status,
    currentLevel: t.currentLevel,
    remainingSeconds: t.remainingSeconds,
    structure: JSON.parse(t.structure),
    entryFee: t.entryFee,
    startingStack: t.startingStack,
    createdAt: t.createdAt.toISOString(),
    startedAt: t.startedAt?.toISOString(),
  }));

  return c.json({ success: true, tournaments: tournamentList });
});

// POST /api/shops/:shopId/tournaments - トーナメント作成（管理者）
tournamentsRoutes.post('/', async (c) => {
  const shopId = c.req.param('shopId');
  const body = await c.req.json();
  const result = createTournamentSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid request', details: result.error }, 400);
  }

  // 店舗存在確認
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) {
    return c.json({ error: 'Shop not found' }, 404);
  }

  const firstLevel = result.data.structure.find((s) => !s.isBreak);
  const remainingSeconds = (firstLevel?.duration || 20) * 60;

  const tournament = await prisma.tournament.create({
    data: {
      shopId: shop.id,
      name: result.data.name,
      structure: JSON.stringify(result.data.structure),
      remainingSeconds,
      entryFee: result.data.entryFee,
      startingStack: result.data.startingStack,
    },
  });

  return c.json(
    {
      success: true,
      tournament: {
        tournamentId: tournament.id,
        shopId: tournament.shopId,
        name: tournament.name,
        status: tournament.status,
        currentLevel: tournament.currentLevel,
        remainingSeconds: tournament.remainingSeconds,
        structure: JSON.parse(tournament.structure),
        entryFee: tournament.entryFee,
        startingStack: tournament.startingStack,
        createdAt: tournament.createdAt.toISOString(),
      },
    },
    201
  );
});

// GET /api/shops/:shopId/tournaments/:tournamentId - トーナメント詳細取得
tournamentsRoutes.get('/:tournamentId', async (c) => {
  const shopId = c.req.param('shopId');
  const tournamentId = c.req.param('tournamentId');

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId, shopId },
  });

  if (!tournament) {
    return c.json({ error: 'Tournament not found' }, 404);
  }

  return c.json({
    success: true,
    tournament: {
      tournamentId: tournament.id,
      shopId: tournament.shopId,
      name: tournament.name,
      status: tournament.status,
      currentLevel: tournament.currentLevel,
      remainingSeconds: tournament.remainingSeconds,
      structure: JSON.parse(tournament.structure),
      entryFee: tournament.entryFee,
      startingStack: tournament.startingStack,
      createdAt: tournament.createdAt.toISOString(),
      startedAt: tournament.startedAt?.toISOString(),
    },
  });
});

// PUT /api/shops/:shopId/tournaments/:tournamentId - トーナメント更新（管理者）
tournamentsRoutes.put('/:tournamentId', async (c) => {
  const shopId = c.req.param('shopId');
  const tournamentId = c.req.param('tournamentId');
  const body = await c.req.json();
  const result = updateTournamentSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid request', details: result.error }, 400);
  }

  try {
    const updateData: Record<string, unknown> = {};
    if (result.data.name) updateData.name = result.data.name;
    if (result.data.structure)
      updateData.structure = JSON.stringify(result.data.structure);
    if (result.data.entryFee !== undefined)
      updateData.entryFee = result.data.entryFee;
    if (result.data.startingStack !== undefined)
      updateData.startingStack = result.data.startingStack;

    const tournament = await prisma.tournament.update({
      where: { id: tournamentId, shopId },
      data: updateData,
    });

    return c.json({
      success: true,
      tournament: {
        tournamentId: tournament.id,
        shopId: tournament.shopId,
        name: tournament.name,
        status: tournament.status,
        currentLevel: tournament.currentLevel,
        remainingSeconds: tournament.remainingSeconds,
        structure: JSON.parse(tournament.structure),
        entryFee: tournament.entryFee,
        startingStack: tournament.startingStack,
        createdAt: tournament.createdAt.toISOString(),
        startedAt: tournament.startedAt?.toISOString(),
      },
    });
  } catch {
    return c.json({ error: 'Tournament not found' }, 404);
  }
});

// POST /api/shops/:shopId/tournaments/:tournamentId/control - トーナメント操作
tournamentsRoutes.post('/:tournamentId/control', async (c) => {
  const shopId = c.req.param('shopId');
  const tournamentId = c.req.param('tournamentId');
  const body = await c.req.json();
  const result = controlSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid request', details: result.error }, 400);
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId, shopId },
  });

  if (!tournament) {
    return c.json({ error: 'Tournament not found' }, 404);
  }

  const structure = JSON.parse(tournament.structure) as Array<{
    level: number;
    duration: number;
    isBreak: boolean;
  }>;

  let updateData: Record<string, unknown> = {};

  switch (result.data.action) {
    case 'start':
    case 'resume':
      updateData = {
        status: 'running',
        startedAt: tournament.startedAt || new Date(),
      };
      break;
    case 'pause':
      updateData = { status: 'paused' };
      break;
    case 'break':
      updateData = { status: 'break', remainingSeconds: 10 * 60 };
      break;
    case 'next': {
      const currentIndex = structure.findIndex(
        (s) => s.level === tournament.currentLevel && !s.isBreak
      );
      if (currentIndex < structure.length - 1) {
        const nextLevel = structure[currentIndex + 1];
        updateData = {
          currentLevel: nextLevel.isBreak
            ? tournament.currentLevel
            : nextLevel.level,
          remainingSeconds: nextLevel.duration * 60,
          status: nextLevel.isBreak ? 'break' : 'running',
        };
      }
      break;
    }
    case 'end':
      updateData = { status: 'finished' };
      break;
  }

  const updated = await prisma.tournament.update({
    where: { id: tournamentId },
    data: updateData,
  });

  return c.json({
    success: true,
    tournament: {
      tournamentId: updated.id,
      status: updated.status,
      currentLevel: updated.currentLevel,
      remainingSeconds: updated.remainingSeconds,
    },
  });
});
