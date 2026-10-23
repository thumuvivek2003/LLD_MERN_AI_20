import express from "express";
import boardRoutes from "./routes/boardRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import listRoutes from "./routes/listRoutes.js";

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/lists", listRoutes);

export default app;