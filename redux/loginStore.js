import { create } from 'zustand'
import { persist } from 'zustand/middleware';


const useLoginStore = create(
    persist(
        (set) => ({
            isAuthenticated: false,
            accessToken: null,
            toggleAuth: () => set((state) => ({ isAuthenticated: !state.isAuthenticated })),
            setAccessToken: (token) => set(() => ({ accessToken: token })),
            clearLogin: () => set(() => ({ isAuthenticated: false, accessToken: null })),
        }),
        {
            name: 'auth-storage',
            // getStorage: () => localStorage, // Default it is localStorage
        }
    )
);

export default useLoginStore