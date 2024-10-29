import { create } from 'zustand'
import { persist } from 'zustand/middleware';


const useUserStore = create(
    persist((set) => ({
        name: '',
        email: '',
        picture: '',
        setUser: ({ name, email, picture }) => set(() => ({ name, email, picture }))
    }),
        {
            name: 'user-storage',
        })
);

export default useUserStore