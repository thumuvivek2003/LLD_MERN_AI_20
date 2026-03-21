
import express from "express";
import cors from 'cors';
import errorMiddleware from "./middlewares/error.middleware.js";

// routes
import userRoutes from "./features/user/route.js";
import boardRoutes from "./features/board/route.js";
import boardMemberRoutes from "./features/boardMember/route.js";
import roleRoutes from "./features/role/route.js";
import permissionRoutes from "./features/permission/route.js";
import rolePermissionRoutes from "./features/rolePermission/route.js";
import columnRoutes from "./features/column/route.js";
import cardRoutes from "./features/card/route.js";
import cardMemberRoutes from "./features/cardMember/route.js";
import commentRoutes from "./features/comment/route.js";
import labelRoutes from "./features/label/route.js";
import cardLabelRoutes from "./features/cardLabel/route.js";
import authMiddleware from "./middlewares/auth.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * 🔥 Public Routes
 */
app.use("/api/users", userRoutes);

/**
 * 🔥 Protected Routes (we will add auth + RBAC)
 */
app.use(authMiddleware)
app.use("/api/boards", boardRoutes);
app.use("/api/board-members", boardMemberRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/card-members", cardMemberRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/card-labels", cardLabelRoutes);

/**
 * ❌ Global Error Handler
 */
app.use(errorMiddleware);

export default app;