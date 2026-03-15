import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/files", fileRoutes);

export default app;