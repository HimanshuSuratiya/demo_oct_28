import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'https://api.example.com',
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-storage');
    const { isAuthenticated, accessToken } = JSON.parse(token)?.state || {}
    if (isAuthenticated && accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response && response.status === 401) {
            clearUser()
        }

        return Promise.reject(error);
    }
);
export default axiosInstance;


export const clearUser = () => {
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('user-storage');
}