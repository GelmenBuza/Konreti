import { Server, Socket } from "socket.io";
import { io } from "@/server.ts";
// Импортируй свои сервисы для работы с БД
// import { getBoardById, getCardsByBoardId } from "@/services";

export function registerBoardHandlers(server: Server) {
    server.on('connection', (socket: Socket) => {

        // ⚠️ УДАЛИ этот дубликат, если он есть в начале файла!
        // socket.on('card:created', (card) => { io.emit('card:created', card); });

        // === Глобальные события доски (опционально) ===
        socket.on('board:created', (board) => {
            io.emit('board:created', board);
        });

        socket.on('board:updated', (updatedBoard) => {
            io.emit('board:updated', updatedBoard);
        });

        socket.on('board:deleted', (boardId: string) => {
            io.emit('board:deleted', boardId);
        });

        // === Присоединение к комнате доски ===
        socket.on("board:join", async (boardId: string) => {
            try {
                await socket.join(`board:${boardId}`);
                console.log(`Socket ${socket.id} joined board:${boardId}`);

                // 🔥 Отправляем начальные данные
                // Замени на реальные запросы к БД
                const board = { id: boardId, title: "Demo Board", columns: [] }; // await getBoardById(boardId)
                const cards = [ // await getCardsByBoardId(boardId)
                    { id: "1", title: "Card 1", columnId: "col-1", position: 0 },
                    { id: "2", title: "Card 2", columnId: "col-2", position: 1 },
                ];

                socket.emit('board:init', { board, cards });
                socket.emit('board:joined', { success: true, boardId });
                
            } catch (error) {
                console.error('Join error:', error);
                socket.emit('board:joined', { success: false, error: "Access denied" });
            }
        });

        // === Карточки ===
        socket.on("card:moved", async (data: {
            boardId: string; cardId: string; columnId: string;
            position: number; movedBy: string;
        }) => {
            // TODO: Сохранить в БД
            socket.to(`board:${data.boardId}`).emit("card:moved:broadcast", {
                cardId: data.cardId,
                columnId: data.columnId,
                position: data.position,
                movedBy: data.movedBy,
                timestamp: new Date().toISOString(),
            });
        });

        socket.on("card:updated", async (data: {
            boardId: string; cardId: string;
            updates: Partial<{ title: string; description: string }>;
            updatedBy: string;
        }) => {
            // TODO: Сохранить в БД
            socket.to(`board:${data.boardId}`).emit("card:updated:broadcast", {
                cardId: data.cardId,
                updates: data.updates,
                updatedBy: data.updatedBy,
                timestamp: new Date().toISOString(),
            });
        });

        socket.on("card:created", async (data: {
            boardId: string;
            card: { id: string; title: string; columnId: string; position: number };
            createdBy: string;
        }) => {
            // TODO: Сохранить в БД, сгенерировать id если нет
            socket.to(`board:${data.boardId}`).emit("card:created:broadcast", {
                card: data.card,
                createdBy: data.createdBy,
                timestamp: new Date().toISOString(),
            });
        });

        // Опционально: удаление карточки
        socket.on("card:deleted", async (data: { boardId: string; cardId: string; deletedBy: string }) => {
            // TODO: Удалить из БД
            socket.to(`board:${data.boardId}`).emit("card:deleted:broadcast", {
                cardId: data.cardId,
                deletedBy: data.deletedBy,
                timestamp: new Date().toISOString(),
            });
        });

        // === Присутствие пользователей (заглушка) ===
        socket.on('user:presence', async (data: { 
            boardId: string; userId: string; status: 'online' | 'typing' 
        }) => {
            socket.to(`board:${data.boardId}`).emit("user:presence:broadcast", {
                userId: data.userId,
                status: data.status,
                socketId: socket.id,
            });
        });

        // === Дисконнект ===
        socket.on('disconnect', (reason) => {
            console.log(`Client disconnected: ${socket.id} (${reason})`);
            // Опционально: оставить комнату
            // socket.leave(`board:${boardId}`);
        });
    });
}