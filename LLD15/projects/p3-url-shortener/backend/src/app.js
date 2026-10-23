import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import urlRoutes from './routes/urlRoutes.js'


dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());

app.use("/", urlRoutes);


export default app;
