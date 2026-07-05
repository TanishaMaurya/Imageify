import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ Imageify API listening on port ${env.port} [${env.nodeEnv}]`);
});

// Graceful shutdown: close DB connections and the HTTP server.
const shutdown = async (signal) => {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', err);
});
