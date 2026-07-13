import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// ─── Security & parsing ─────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
// Base64 image payloads can be large; bump the body limit.
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

if (!env.isProd) {
  app.use(morgan('dev'));
}

// ─── Rate limiting (global) ─────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  })
);

// ─── Health check ───────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ success: true, message: 'VisionCraft AI API is running 🚀' })
);
// ─── Health check ───────────────────────────────────────
app.get('/', (req, res) =>
  res.json({ success: true, message: 'Welcome to VisionCraft AI API' })
);

// ─── API routes ─────────────────────────────────────────
app.use('/api', routes);

// ─── 404 + error handling ───────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
