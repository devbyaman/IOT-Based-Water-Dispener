import axios from 'axios';

// Function to check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        // Extract the payload part of the JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Check if the exp field exists and the token has expired
        return payload.exp ? payload.exp * 1000 < Date.now() : false;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // If we can't decode the token, consider it expired
    }
};

// Function to clear authentication state
const clearAuthState = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

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

// Array of authentication endpoints that don't require token
const authEndpoints = [
    '/auth/signin',
    '/auth/signup',
    '/auth/google',
    '/auth/forgot-password',
    '/auth/reset-password'
];

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Check if the request is to an auth endpoint that doesn't need authentication
        const isAuthEndpoint = authEndpoints.some(endpoint => 
            config.url.includes(endpoint)
        );
        
        if (isAuthEndpoint) {
            console.log('Request to auth endpoint, skipping token validation');
            return config;
        }
        
        const token = localStorage.getItem('token');
        console.log('Request interceptor - Token from localStorage:', token);
        
        if (token) {
            // Check if token is expired before using it
            if (isTokenExpired(token)) {
                console.log('Request interceptor - Token is expired, clearing auth state');
                clearAuthState();
                window.location.href = '/signin';
                return Promise.reject(new Error('Token expired'));
            }
            
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
            console.log('Response interceptor - 401 Unauthorized, clearing auth state');
            clearAuthState();
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export { api as default, isTokenExpired, clearAuthState }; 