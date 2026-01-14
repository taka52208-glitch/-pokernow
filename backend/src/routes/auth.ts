import { Hono } from 'hono';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

export const authRoutes = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// ログインスキーマ
const loginSchema = z.object({
  provider: z.enum(['apple', 'google', 'phone']),
  email: z.string().email().optional(),
});

// プロフィール更新スキーマ
const profileSchema = z.object({
  pokerName: z.string().min(1).max(20),
  displaySetting: z.enum(['public', 'masked', 'hidden']),
});

// POST /api/auth/login - ログイン（モック認証）
authRoutes.post('/login', async (c) => {
  const body = await c.req.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: 'Invalid request', details: result.error }, 400);
  }

  const { provider, email } = result.data;

  // 既存ユーザーを検索、なければ作成（モック認証）
  let player = await prisma.player.findFirst({
    where: { email: email || `mock-${provider}@pokernow.local` },
  });

  if (!player) {
    player = await prisma.player.create({
      data: {
        pokerName: `Player${Date.now().toString().slice(-4)}`,
        displaySetting: 'public',
        authProvider: provider,
        email: email || `mock-${provider}@pokernow.local`,
        role: 'player',
      },
    });
  }

  // JWTトークン生成
  const token = jwt.sign(
    { playerId: player.id, role: player.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return c.json({
    success: true,
    token,
    player: {
      playerId: player.id,
      pokerName: player.pokerName,
      displaySetting: player.displaySetting,
      authProvider: player.authProvider,
      email: player.email,
      role: player.role,
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
    },
  });
});

// POST /api/auth/logout - ログアウト
authRoutes.post('/logout', (c) => {
  // JWTはステートレスなので、クライアント側でトークンを削除するだけ
  return c.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me - 現在のユーザー情報取得
authRoutes.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { playerId: string };

    const player = await prisma.player.findUnique({
      where: { id: decoded.playerId },
    });

    if (!player) {
      return c.json({ error: 'Player not found' }, 404);
    }

    return c.json({
      success: true,
      player: {
        playerId: player.id,
        pokerName: player.pokerName,
        displaySetting: player.displaySetting,
        authProvider: player.authProvider,
        email: player.email,
        role: player.role,
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
      },
    });
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// PUT /api/auth/profile - プロフィール更新
authRoutes.put('/profile', async (c) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { playerId: string };
    const body = await c.req.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return c.json({ error: 'Invalid request', details: result.error }, 400);
    }

    const player = await prisma.player.update({
      where: { id: decoded.playerId },
      data: {
        pokerName: result.data.pokerName,
        displaySetting: result.data.displaySetting,
      },
    });

    return c.json({
      success: true,
      player: {
        playerId: player.id,
        pokerName: player.pokerName,
        displaySetting: player.displaySetting,
        authProvider: player.authProvider,
        email: player.email,
        role: player.role,
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
      },
    });
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
});
