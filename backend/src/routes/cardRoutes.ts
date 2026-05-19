import express from "express";
import { createCard, updateCard, deleteCard, moveCard, getCardsOnBoard } from "@/controllers/cardController.ts";
import authMiddleware from "@/middleware/authMiddleware.ts";

const router = express.Router();

router.post("/create", authMiddleware, createCard);
router.put("/update/:id", authMiddleware, updateCard);
router.delete("/delete/:id", authMiddleware, deleteCard);
router.get('/board/:id', authMiddleware, getCardsOnBoard);
router.put('/move/:id', authMiddleware, moveCard);

export default router;