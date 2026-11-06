import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { requestLogger, errorHandler, notFound } from './middleware/errorHandler.js';

// Route modules
import quoteRoutes       from './routes/quoteRoutes.js';
import gerberRoutes      from './routes/gerberRoutes.js';
import ordersRoutes      from './routes/ordersRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import catalogRoutes     from './routes/catalogRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(requestLogger);

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'PCB Hub Foundry API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  /api/health',
      'POST /api/quote',
      'GET  /api/quote/estimate',
      'POST /api/gerber/upload',
      'POST /api/gerber/sample-dfm',
      'GET  /api/orders',
      'GET  /api/orders/:orderId',
      'POST /api/orders',
      'POST /api/consultations',
      'GET  /api/consultations',
      'GET  /api/catalog/products',
      'GET  /api/catalog/surface-finishes',
      'GET  /api/catalog/turnaround',
      'POST /api/catalog/newsletter'
    ]
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────
app.use('/api/quote',          quoteRoutes);
app.use('/api/gerber',         gerberRoutes);
app.use('/api/orders',         ordersRoutes);
app.use('/api/consultations',  consultationRoutes);
app.use('/api/catalog',        catalogRoutes);

// ─── Error Handling ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   PCB HUB FOUNDRY — Node.js REST API Server   ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n  🟢  Server running at   http://localhost:${PORT}`);
  console.log(`  🌐  CORS allowed from   ${CLIENT_URL}`);
  console.log(`  🏭  Environment         ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n  📌  API Health Check:   http://localhost:${PORT}/api/health`);
  console.log(`  📦  Orders API:         http://localhost:${PORT}/api/orders`);
  console.log(`  💰  Quote Engine:       http://localhost:${PORT}/api/quote`);
  console.log(`  🔬  Gerber DFM:         http://localhost:${PORT}/api/gerber/sample-dfm`);
  console.log('\n  Press Ctrl+C to stop.\n');
});

export default app;

