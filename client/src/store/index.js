import { create } from 'zustand';

const useStore = create((set) => ({
    theme: localStorage.getItem('theme') ?? 'light',
    user: JSON.parse(localStorage.getItem('user')) ?? null,
    setUser: (user) => set({ user }),
    setTheme: (value) => set({ theme: value }),
    setCredentials: (user) => set({ user }),
    signOut: () => set({ user: null }),
}));

export default useStore;