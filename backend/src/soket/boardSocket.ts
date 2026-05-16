import {Server, Socket} from "socket.io";
import {io} from "@/server.ts";

export function registerBoardHandlers(server: Server) {
    server.on('connection', (socket: Socket) => {

        socket.on('board:created', (board) => {
            // Handle board creation event
            io.emit('board:created', board);
        });

        socket.on('board:updated', (updatedBoard) => {
            // Handle board update event
            io.emit('board:updated', updatedBoard);
        });

        socket.on('board:deleted', (boardId) => {
            // Handle board deletion event
            io.emit('board:deleted', boardId);
        });

        socket.on('card:created', (card) => {
            // Handle card creation event
            io.emit('card:created', card);
        })

        socket.on("board:join", async (boardId: string) => {
            try {
                socket.join(`board:${boardId}`);
                console.log(`Socket ${socket.id} joined board:${boardId}`);

                socket.emit('board:joined', {success: true, boardId: boardId});
            } catch (error) {
                socket.emit('board:joined', {success: false, error: "Access denied"});
            }
        });

        socket.on("card:moved", async (data: {
            boardId: string,
            cardId: string,
            columnId: string,
            position: number,
            movedBy: string,
        }) => {
            socket.to(`board:${data.boardId}`).emit("card:moved:broadcast", {
                cardId: data.cardId,
                columnId: data.columnId,
                position: data.position,
                movedBy: data.movedBy,
                timestamp: new Date().toISOString(),
            });
        })

        socket.on("card:updated", async (data: {
            boardId: string,
            cardId: string,
            updates: Partial<{ title: string, description: string }>,
            updatedBy: string,

        }) => {
            socket.to(`board:${data.boardId}`).emit("card:updated:broadcast", {
                cardId: data.cardId,
                updates: data.updates,
                updatedBy: data.updatedBy,
                timestamp: new Date().toISOString(),
            })
        })

        socket.on("card:created", async (data: {
            boardId: string,
            card: { id: string, title: string, columnId: string, position: number, },
            createdBy: string,
        }) => {
            socket.to(`board:${data.boardId}`).emit("card:created:broadcast", {
                card: data.card,
                createdBy: data.createdBy,
                timestamp: new Date().toISOString(),
            })
        })

        socket.on('user:presence', async (data: { boardId: string, userId: string, status: 'online' | 'typing' }) => {
            socket.to(`board:${data.boardId}`).emit("user:presence:broadcast", {
                userId: data.userId,
                status: data.status,
                socketId: socket.id,
            })
        })

        socket.on('disconnect', async (reason) => {
            console.log(`Client disconnected: ${socket.id} (${reason})`);
        })
    })
}
