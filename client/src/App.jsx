// import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Report from './pages/Report'
import Live_data from './pages/Live_data'
import Consumption from './pages/Consumption'
import Header from './components/Header'
import { useEffect } from 'react';

function App() {
  // Initialize theme from localStorage or default to light
  useEffect(() => {
    // Add any app initialization code here
    const root = document.documentElement;
    root.style.setProperty('--app-height', `${window.innerHeight}px`);

    const handleResize = () => {
      root.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected routes */}
            <Route path="/report" element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } />
            <Route path="/live-data" element={
              <ProtectedRoute>
                <Live_data />
              </ProtectedRoute>
            } />
            <Route path="/consumption" element={
              <ProtectedRoute>
                <Consumption />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Redirect to home for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
