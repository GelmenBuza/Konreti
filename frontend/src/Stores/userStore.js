import { create } from "zustand";

export const userStore = create((set, get) => ({

    // Сброс всех значений
    clearUser: () => set({ user: null }),
    // clearProjects: () => set({ projects: [] }),

    user: null,
    setUser: (newUser) => set({ user: newUser }),
    isLoggedIn: () => get().user !== null,
}));