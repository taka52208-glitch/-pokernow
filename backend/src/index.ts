import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

// ルートのインポート
import { authRoutes } from './routes/auth.js';
import { shopsRoutes } from './routes/shops.js';
import { tablesRoutes } from './routes/tables.js';
import { seatingsRoutes } from './routes/seatings.js';
import { eventsRoutes } from './routes/events.js';
import { tournamentsRoutes } from './routes/tournaments.js';
import { dashboardRoutes } from './routes/dashboard.js';

// アプリケーション作成
const app = new Hono();

// 環境設定
const isProduction = process.env.NODE_ENV === 'production';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3247';

// 許可するオリジン
const allowedOrigins = isProduction
  ? [frontendUrl]
  : ['http://localhost:3247', 'http://localhost:3249', 'http://localhost:5173'];

// ミドルウェア
app.use('*', logger());
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ヘルスチェック
app.get('/', (c) => {
  return c.json({
    name: 'PokerNow API',
    version: '1.0.0',
    status: 'running',
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// APIルート
app.route('/api/auth', authRoutes);
app.route('/api/shops', shopsRoutes);
app.route('/api/shops/:shopId/tables', tablesRoutes);
app.route('/api/seatings', seatingsRoutes);
app.route('/api/shops/:shopId/events', eventsRoutes);
app.route('/api/shops/:shopId/tournaments', tournamentsRoutes);
app.route('/api/shops/:shopId/dashboard', dashboardRoutes);

// 404ハンドラー
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

// エラーハンドラー
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message,
    },
    500
  );
});

// サーバー起動
const port = Number(process.env.PORT) || 3248;

console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🎰 PokerNow API Server                           ║
║                                                    ║
║   Port: ${port}                                      ║
║   Environment: ${isProduction ? 'production' : 'development'}                     ║
║                                                    ║
╚════════════════════════════════════════════════════╝
`);

serve({
  fetch: app.fetch,
  port,
});
