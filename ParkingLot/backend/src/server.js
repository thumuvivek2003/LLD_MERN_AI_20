import 'dotenv/config';
import { app } from './app.js';
import { serverConfig } from './config/server.config.js';
import { seedDb } from './config/db.config.js';

seedDb();

app.listen(serverConfig.port, () => {
  console.log(`Parking Lot API listening on :${serverConfig.port}`);
});
