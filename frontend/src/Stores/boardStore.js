import { create } from "zustand";

export const boardStore = create((set, get) => ({
    board: null,
    cards: [],
    users: [], // Заглушка

    isConnected: false,
    isLoading: false,
    error: null,

    setBoard: (board) => set({ board }),
    setCards: (cards) => set({ cards }),
    setUsers: (users) => set({ users }),

    addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),

    updateCard: (cardId, updates) => set((state) => ({
        cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, ...updates } : c
        ),
    })),

    removeCard: (cardId) => set((state) => ({
        cards: state.cards.filter((c) => c.id !== cardId),
    })),


    moveCard: (cardId, columnId, position) =>
        get().updateCard(cardId, { columnId, position }),


    init: (data) => set({
        board: data.board,
        cards: data.cards || [],
        isLoading: false,
    }),


    setConnected: (isConnected) => set({ isConnected }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),


    clear: () => set({
        board: null,
        cards: [],
        users: [],
        isConnected: false,
        isLoading: false,
        error: null,
    }),
}));