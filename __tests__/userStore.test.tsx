import { renderHook, act } from '@testing-library/react';
import useUserStore from '../redux/userStore';

beforeEach(() => {
    localStorage.clear();
});

describe('useUserStore', () => {
    it('should initialize with an empty user', () => {
        const { result } = renderHook(() => useUserStore());
        expect(result.current.name).toBe('');
        expect(result.current.email).toBe('');
        expect(result.current.picture).toBe('');
    });

    it('should update the user details when setUser is called', () => {
        const { result } = renderHook(() => useUserStore());
        const newUser = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            picture: 'https://example.com/johndoe.jpg',
        };
        act(() => {
            result.current.setUser(newUser);
        });
        expect(result.current.name).toBe(newUser.name);
        expect(result.current.email).toBe(newUser.email);
        expect(result.current.picture).toBe(newUser.picture);
    });

    it('should persist the user details when setUser is called', () => {
        const { result, unmount } = renderHook(() => useUserStore());
        const newUser = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            picture: 'https://example.com/janedoe.jpg',
        };
        act(() => {
            result.current.setUser(newUser);
        });
        unmount();
        const { result: resultAfterRemount } = renderHook(() => useUserStore());
        expect(resultAfterRemount.current.name).toBe(newUser.name);
        expect(resultAfterRemount.current.email).toBe(newUser.email);
        expect(resultAfterRemount.current.picture).toBe(newUser.picture);
    });
});
