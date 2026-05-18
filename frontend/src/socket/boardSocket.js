// hooks/useBoardSocket.js
import { useEffect } from "react";
import io from "socket.io-client";
import { boardStore } from "@/stores/boardStore";

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || "http://localhost:3000";

export const useBoardSocket = (boardId, userId) => {
    useEffect(() => {
        if (!boardId) return;

        const socket = io(SOCKET_URL, {
            reconnection: true,
            auth: userId ? { userId } : undefined,
        });

        boardStore.setLoading(true);
        socket.emit("board:join", boardId);

        // === Обработчики: сокет → стор ===
        socket.on("board:init", (data) => boardStore.init(data));
        socket.on("board:updated", (board) => boardStore.setBoard(board));
        socket.on("board:deleted", (id) => {
            if (id === boardId) boardStore.clear();
        });

        socket.on("card:moved:broadcast", (d) =>
            boardStore.moveCard(d.cardId, d.columnId, d.position)
        );
        socket.on("card:updated:broadcast", (d) =>
            boardStore.updateCard(d.cardId, d.updates)
        );
        socket.on("card:created:broadcast", (d) =>
            boardStore.addCard(d.card)
        );
        socket.on("card:deleted:broadcast", (d) =>
            boardStore.removeCard(d.cardId)
        );

        socket.on("user:presence:broadcast", (d) => {
            // Заглушка: просто логируем, users не трогаем
            console.log(`[Presence] ${d.userId}: ${d.status}`);
        });

        socket.on("connect", () => boardStore.setConnected(true));
        socket.on("disconnect", () => boardStore.setConnected(false));
        socket.on("connect_error", (e) => {
            boardStore.setConnected(false);
            boardStore.setError(e.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [boardId, userId]);

    // === Actions: компонент → сокет ===
    const socket = io(SOCKET_URL); // ⚠️ в реальном проекте вынеси сокет в ref/context

    return {
        // Данные из стора (подписка в компоненте)
        ...boardStore(),

        // Отправка событий на сервер
        emitMoveCard: (cardId, columnId, position) => {
            boardStore.getState().moveCard(cardId, columnId, position); // оптимистично
            socket.emit("card:moved", {
                boardId, cardId, columnId, position, movedBy: userId,
            });
        },
        emitUpdateCard: (cardId, updates) => {
            boardStore.getState().updateCard(cardId, updates);
            socket.emit("card:updated", {
                boardId, cardId, updates, updatedBy: userId,
            });
        },
        emitCreateCard: (card) => {
            const newCard = { id: card.id || `temp-${Date.now()}`, ...card };
            boardStore.getState().addCard(newCard);
            socket.emit("card:created", {
                boardId, card: newCard, createdBy: userId,
            });
        },
        emitDeleteCard: (cardId) => {
            boardStore.getState().removeCard(cardId);
            socket.emit("card:deleted", { boardId, cardId, deletedBy: userId });
        },
    };
};