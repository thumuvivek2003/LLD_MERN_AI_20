import express from 'express';
import cors from 'cors';
import router from './routes/index.routes.js';
import { errorMiddleware } from './shared/middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorMiddleware);

export default app;
