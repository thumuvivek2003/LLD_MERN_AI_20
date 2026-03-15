import express from "express";
import fileController from "../controllers/FileController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/upload",
    upload.single("file"),
    fileController.uploadFile
);

router.get(
    "/",
    fileController.getFiles
);

router.get(
    "/:id/download",
    fileController.downloadFile
);

router.delete(
    "/:id",
    fileController.deleteFile
);

export default router;