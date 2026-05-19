// backend/src/controllers/boardController.ts
import { Request, Response } from "express";
import { prisma } from "@/prismaClient.ts";
import { io } from "@/server.ts";

const createBoard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { title, description } = req.body;

        const newBoard = await prisma.board.create({
            data: {
                title,
                description,
                ownerId: userId,
                columns: {
                    createMany: {
                        data: [
                            { title: 'new', position: 1 },
                            { title: 'working', position: 2 },
                            { title: 'testing', position: 3 },
                            { title: 'done', position: 4 }
                        ]
                    }
                }
            },
        });

        io.emit('board:created', newBoard);

        res.status(201).json(newBoard);
    } catch (error) {
        console.error("Error creating board:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateBoard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let boardId = req.params.id;

        if (Array.isArray(boardId)) {
            boardId = boardId[0]
        }

        const { title, description } = req.body;

        if (!boardId) {
            return res.status(400).json({ message: "Board id is missing" });
        }

        const board = await prisma.board.findUnique({
            where: { id: boardId },
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        if (board.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updatedBoard = await prisma.board.update({
            where: { id: boardId },
            data: {
                title,
                description,
            },
        });

        io.emit('board:updated', updatedBoard);

        res.status(200).json(updatedBoard);
    } catch (error) {
        console.error("Error updating board:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteBoard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let boardId = req.params.id;

        if (Array.isArray(boardId)) {
            boardId = boardId[0]
        }

        const board = await prisma.board.findUnique({
            where: { id: boardId },
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        if (board.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await prisma.board.delete({
            where: { id: boardId },
        });

        io.emit('board:deleted', boardId);

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting board:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBoardsByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const boards = await prisma.board.findMany({
            where: { ownerId: userId },
        });

        // io.emit('boards:fetched', boards);

        res.status(200).json(boards);
    } catch (error) {
        console.error("Error fetching boards:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getColumnsByBoardId = async (req: Request, res: Response) => {
    try {
        let boardId = req.params.id;

        if (!boardId) {
            return res.status(400).json({ message: "Board id is missing" });
        }

        if (Array.isArray(boardId)) {
            boardId = boardId[0]
        }

        const columns = await prisma.column.findMany({
            where: { boardId },
        });

        io.emit('columns:fetched', columns);

        res.status(200).json(columns);
    } catch (error) {
        console.error("Error fetching columns:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBoardById = async (req: Request, res: Response) => {
    try {
        let boardId = req.params.id;

        if (!boardId) {
            return res.status(400).json({ message: "Board id is missing" });
        }

        if (Array.isArray(boardId)) {
            boardId = boardId[0]
        }

        const board = await prisma.board.findUnique({
            where: { id: boardId },
            select: {
                id: true,
                title: true,
                description: true
            }
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        io.emit('board:fetched', board);

        res.status(200).json(board);
    } catch (error) {
        console.error("Error fetching board:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { createBoard, updateBoard, deleteBoard, getBoardsByUser, getColumnsByBoardId, getBoardById };

