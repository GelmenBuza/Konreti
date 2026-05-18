import { Request, Response } from 'express';
import { io } from "@/server.ts";
import { prisma } from "@/prismaClient.ts";

const createCard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const cardData = req.body;
        const newCard = await prisma.card.create({
            data: {
                ...cardData,
                createdBy: userId
            }
        })
        io.emit('card:created', newCard);
        res.status(201).json(newCard);
    } catch (error) {
        console.error('Error creating card', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateCard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let cardId = req.params.id; // Changed from req.body.id to req.params.id
        const cardData = req.body;

        if (Array.isArray(cardId)) {
            cardId = cardId[0]
        }

        const existingCard = await prisma.card.findUnique({
            where: { id: cardId }
        })

        if (!existingCard) {
            return res.status(404).json({ message: "Card not found" });
        }

        const updatedCard = await prisma.card.update({
            where: { id: cardId },
            data: {
                ...cardData,
            }
        })
        io.emit('card:updated', updatedCard);
        res.status(200).json(updatedCard);
    } catch (error) {
        console.error('Error updating card', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteCard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let cardId = req.params.id;

        if (Array.isArray(cardId)) {
            cardId = cardId[0]
        }

        const existingCard = await prisma.card.findUnique({
            where: { id: cardId }
        })
        if (!existingCard) {
            return res.status(404).json({ message: "Card not found" });
        }
        await prisma.card.delete({
            where: { id: cardId }
        })

        io.emit('card:deleted', { id: cardId });

        res.status(204).send()
    } catch (error) {
        console.error('Error deleting card', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getCardsOnBoard = async (req: Request, res: Response) => {
    try {
        let boardId = req.params.id;
        if (!boardId) {
            return res.status(400).json({ message: "Board ID is required" });
        }

        if (Array.isArray(boardId)) {
            boardId = boardId[0]
        }

        const columns = await prisma.column.findMany({
            where: { boardId: boardId }
        });

        let cards: any[] = [];
        for (const column of columns) {
            const columnCards = await prisma.card.findMany({
                where: { columnId: column.id }
            });
            cards = [...cards, ...columnCards];
        }

        // Отправляем события через WebSocket
        // io.emit('cards:onBoard', cards);

        res.status(200).json(cards);
    } catch (error) {
        console.error('Error getting cards on board:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { createCard, updateCard, deleteCard, getCardsOnBoard };