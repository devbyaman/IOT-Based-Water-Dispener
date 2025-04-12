import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired, clearAuthState } from '../../utils/axios';

// Function to get token from cookies
const getTokenFromCookies = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('token=')) {
      return cookie.substring(6);
    }
  }
  return null;
};

const ProtectedRoute = ({ children }) => {
    // Try to get token from localStorage first, then cookies
    let token = localStorage.getItem('token');
    
    if (!token) {
        token = getTokenFromCookies();
        console.log('Using token from cookies:', token);
        
        // If found in cookies, store it in localStorage for future use
        if (token) {
            localStorage.setItem('token', token);
        }
    }
    
    console.log("Token in ProtectedRoute:", token ? "Token exists" : "No token found");

    // Check if token is missing or expired
    if (!token || isTokenExpired(token)) {
        console.log("No valid authentication token found, redirecting to login");
        
        // Clear auth state if token is expired (not just missing)
        if (token) {
            console.log("Token expired, clearing authentication state");
            clearAuthState();
        }
        
        return <Navigate to='/signin' />
    }

    return children;
};

export default ProtectedRoute;
