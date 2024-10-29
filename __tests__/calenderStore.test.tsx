import { renderHook, act } from '@testing-library/react';
import useCalendarStore from '../redux/calendarStore';

beforeEach(() => {
    localStorage.clear();
});

describe('useCalendarStore', () => {
    it('should initialize with the current date', () => {
        const { result } = renderHook(() => useCalendarStore());
        const currentDate = new Date().toISOString();
        expect(new Date(result.current.date).toISOString().slice(0, 10))
            .toBe(currentDate.slice(0, 10));
    });

    it('should update the date when setDate is called', () => {
        const { result } = renderHook(() => useCalendarStore());
        const newDate = '2023-01-01T00:00:00.000Z';
        act(() => {
            result.current.setDate(newDate);
        });
        expect(result.current.date).toBe(newDate);
    });

    it('should persist the date when setDate is called', () => {
        const { result, unmount } = renderHook(() => useCalendarStore());
        const newDate = '2023-01-01T00:00:00.000Z';
        act(() => {
            result.current.setDate(newDate);
        });
        unmount();
        const { result: resultAfterRemount } = renderHook(() => useCalendarStore());
        expect(resultAfterRemount.current.date).toBe(newDate);
    });
});