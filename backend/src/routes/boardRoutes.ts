import express from "express";
import { createBoard, updateBoard, deleteBoard } from "@/controllers/boardController.ts";
import authMiddleware from "@/middleware/authMiddleware.ts";

const router = express.Router();

router.post("/create", authMiddleware, createBoard);
router.put("/update/:id", authMiddleware, updateBoard);
router.delete("/delete/:id", authMiddleware, deleteBoard);

export default router;