import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCalendarStore = create(
    persist(
        (set) => ({
            date: new Date().toISOString(),
            setDate: (date) => set(() => ({ date })),
        }),
        {
            name: 'date-storage', // unique name for local storage
        }
    )
);

export default useCalendarStore;