import { renderHook, act } from '@testing-library/react';
import useLoginStore from '../redux/loginStore';

beforeEach(() => {
    localStorage.clear();
});

describe('useLoginStore', () => {
    test('should initialize with isAuthenticated as false and accessToken as null', () => {
        const { result } = renderHook(() => useLoginStore());
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.accessToken).toBeNull();
    });

    test('should toggle isAuthenticated state when toggleAuth is called', () => {
        const { result } = renderHook(() => useLoginStore());
        act(() => {
            result.current.toggleAuth();
        });
        expect(result.current.isAuthenticated).toBe(true);
        act(() => {
            result.current.toggleAuth();
        });
        expect(result.current.isAuthenticated).toBe(false);
    });

    test('should set the accessToken when setAccessToken is called', () => {
        const { result } = renderHook(() => useLoginStore());
        const testToken = '12345';
        act(() => {
            result.current.setAccessToken(testToken);
        });
        expect(result.current.accessToken).toBe(testToken);
    });

    test('should clear isAuthenticated and accessToken when clearLogin is called', () => {
        const { result } = renderHook(() => useLoginStore());
        const testToken = '12345';
        act(() => {
            result.current.setAccessToken(testToken);
            result.current.toggleAuth();
        });
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.accessToken).toBe(testToken);
        act(() => {
            result.current.clearLogin();
        });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.accessToken).toBeNull();
    });

    test('should persist isAuthenticated and accessToken when set and retrieve them upon remounting', () => {
        const { result, unmount } = renderHook(() => useLoginStore());
        const testToken = '12345';
        act(() => {
            result.current.setAccessToken(testToken);
            result.current.toggleAuth();
        });
        unmount();
        const { result: resultAfterRemount } = renderHook(() => useLoginStore());
        expect(resultAfterRemount.current.isAuthenticated).toBe(true);
        expect(resultAfterRemount.current.accessToken).toBe(testToken);
    });
});
