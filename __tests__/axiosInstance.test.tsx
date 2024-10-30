import axiosInstance, { clearUser } from '../api/axiosInstance';
import AxiosMockAdapter from 'axios-mock-adapter';

const mock = new AxiosMockAdapter(axiosInstance);

describe('axiosInstance', () => {
    afterEach(() => {
        mock.reset();
        localStorage.clear();
    });

    test('should set Authorization header if user is authenticated', async () => {
        const token = JSON.stringify({
            state: {
                isAuthenticated: true,
                accessToken: 'mockAccessToken',
            },
        });
        localStorage.setItem('auth-storage', token);

        mock.onGet('https://www.googleapis.com/oauth2/v2/userinfo').reply(200, {
            email: 'Himanshu84688@gmail.com',
        });
        const response = await axiosInstance.get('https://www.googleapis.com/oauth2/v2/userinfo');
        expect(response.status).toBe(200);
        expect(response.data).toEqual({ email: 'Himanshu84688@gmail.com' });
        expect(mock.history.get[0].headers['Authorization']).toBe('Bearer mockAccessToken');
    });

    test('should not set Authorization header if user is not authenticated', async () => {
        localStorage.setItem('auth-storage', JSON.stringify({ state: { isAuthenticated: false } }));
        mock.onGet('https://www.googleapis.com/oauth2/v2/userinfo').reply(200);
        const response = await axiosInstance.get('https://www.googleapis.com/oauth2/v2/userinfo');
        expect(response.status).toBe(200);
        expect(mock.history.get[0].headers['Authorization']).toBeUndefined();
    });

    test('should not set Authorization header if auth-storage is not set', async () => {
        mock.onGet('https://www.googleapis.com/oauth2/v2/userinfo').reply(200);
        const response = await axiosInstance.get('https://www.googleapis.com/oauth2/v2/userinfo');
        expect(response.status).toBe(200);
        expect(mock.history.get[0].headers['Authorization']).toBeUndefined();
    });

    // test('should call clearUser on 401 error response', async () => {
    //     const clearUserMock = jest.fn(clearUser); // Mock the clearUser function
    //     jest.mock('../api/axiosInstance', () => ({
    //         ...jest.requireActual('../api/axiosInstance'),
    //         clearUser: clearUserMock,
    //     }));

    //     mock.onGet('https://www.googleapis.com/oauth2/v2/userinfo').reply(401);
    //     await expect(axiosInstance.get('https://www.googleapis.com/oauth2/v2/userinfo')).rejects.toThrow();
    //     expect(clearUserMock).toHaveBeenCalled();
    // });

    test('should not call clearUser on 404 error response', async () => {
        const clearUserMock = jest.spyOn({ clearUser }, 'clearUser');
        mock.onGet('https://www.googleapis.com/oauth2/v2/userinfo').reply(404);
        await expect(axiosInstance.get('https://www.googleapis.com/oauth2/v2/userinfo')).rejects.toThrow();
        expect(clearUserMock).not.toHaveBeenCalled();
    });

    test('should clear user storage correctly', () => {
        localStorage.setItem('auth-storage', 'someAuthToken');
        localStorage.setItem('user-storage', 'someUserData');
        clearUser();
        expect(localStorage.getItem('auth-storage')).toBeNull();
        expect(localStorage.getItem('user-storage')).toBeNull();
    });

    test('should handle 500 error response', async () => {
        mock.onGet('https://www.googleapis.com/oauth2/v2/userinfo').reply(500);
        await expect(axiosInstance.get('https://www.googleapis.com/oauth2/v2/userinfo')).rejects.toThrow();
    });

    test('should handle successful response with data', async () => {
        const userData = { email: 'Himanshu84688@gmail.com' };
        mock.onGet('https://www.googleapis.com/oauth2/v2/userinfo').reply(200, userData);
        const response = await axiosInstance.get('https://www.googleapis.com/oauth2/v2/userinfo');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(userData);
    });
});
