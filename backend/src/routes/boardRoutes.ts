import express from "express";
import { createBoard, updateBoard, deleteBoard, getBoardsByUser, getColumnsByBoardId, getBoardById } from "@/controllers/boardController.ts";
import authMiddleware from "@/middleware/authMiddleware.ts";

const router = express.Router();

router.post("/create", authMiddleware, createBoard);
router.put("/update/:id", authMiddleware, updateBoard);
router.delete("/delete/:id", authMiddleware, deleteBoard);
router.get('/', authMiddleware, getBoardsByUser);
router.get('/columns/:id', authMiddleware, getColumnsByBoardId)
router.get("/:id", authMiddleware, getBoardById);


export default router;