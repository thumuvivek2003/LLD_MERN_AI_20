import express from "express";
import cors from "cors";
import noteRoutes from "./src/routes/noteRoutes.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(cors())
app.use("/notes", noteRoutes);

app.use(errorMiddleware);

export default app;