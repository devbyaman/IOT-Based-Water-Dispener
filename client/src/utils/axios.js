import axios from 'axios';

// Determine the base URL based on environment
const getBaseUrl = () => {
    // Check if we're running on the production domain
    if (window.location.hostname === 'iotdevice.apdp.co.in') {
        return 'https://iotdevice.apdp.co.in/api';
    }
    // In development, use the localhost URL
    return 'http://localhost:3000/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Request interceptor - Token from localStorage:', token);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request interceptor - Headers with token:', config.headers);
        } else {
            console.warn('Request interceptor - No token found in localStorage');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('Response interceptor - Success response:', response);
        return response;
    },
    (error) => {
        console.error('Response interceptor - Error:', error);
        console.error('Response interceptor - Error response:', error.response);
        
        if (error.response?.status === 401) {
            console.log('Response interceptor - 401 Unauthorized, clearing token');
            localStorage.removeItem('token');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default api; 