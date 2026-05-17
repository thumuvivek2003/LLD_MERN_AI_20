import { createApp } from './app.js';
import { connectDB } from './config/db.config.js';
import { PORT } from './config/env.config.js';

export async function startServer() {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[server] Ecommerce API listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[server] bootstrap failed:', err);
  process.exit(1);
});
