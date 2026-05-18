import express from "express";
import { createBoard, updateBoard, deleteBoard, getBoardsByUser } from "@/controllers/boardController.ts";
import authMiddleware from "@/middleware/authMiddleware.ts";

const router = express.Router();

router.post("/create", authMiddleware, createBoard);
router.put("/update/:id", authMiddleware, updateBoard);
router.delete("/delete/:id", authMiddleware, deleteBoard);
router.get('/', authMiddleware, getBoardsByUser);

export default router;