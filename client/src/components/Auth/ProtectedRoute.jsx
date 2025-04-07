import React from 'react';
import { Navigate } from 'react-router-dom';

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

    if (!token) {
        console.log("No authentication token found, redirecting to login");
        return <Navigate to='/signin' />
    }

    return children;
};

export default ProtectedRoute;
