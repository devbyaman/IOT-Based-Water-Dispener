import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    
    if (username && email) {
      setUserData({ username, email });
      setFormData({
        username,
        email,
        password: '',
      });
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simple validation
      if (!formData.username.trim()) {
        throw new Error("Username is required");
      }
      
      if (formData.password && formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // For now, just update localStorage
      localStorage.setItem('username', formData.username);
      if (formData.email) localStorage.setItem('email', formData.email);
      
      setUserData({
        username: formData.username,
        email: formData.email
      });
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    
    // Dispatch logout action
    dispatch({ type: 'auth/logout' });
    
    // Navigate to home
    navigate('/');
  };

  const styles = {
    container: {
      backgroundColor: '#F4F4F4',
      padding: '2rem',
      minHeight: 'calc(100vh - 100px)',
    },
    card: {
      padding: '1rem',
      maxWidth: '30rem',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      textAlign: 'center',
      margin: '1.5rem 0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    input: {
      backgroundColor: '#F3F4F6',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      fontSize: '1rem',
      border: '1px solid #D1D5DB',
    },
    submitButton: {
      backgroundColor: '#1F2937',
      color: '#fff',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      textTransform: 'uppercase',
      cursor: 'pointer',
      border: 'none',
      transition: 'opacity 0.3s',
    },
    signOutButton: {
      backgroundColor: '#EF4444',
      color: '#fff',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      border: 'none',
      transition: 'opacity 0.3s',
      marginTop: '1rem',
      width: '100%'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1rem',
    },
    errorText: {
      color: '#DC2626',
      textAlign: 'center',
      marginTop: '0.5rem',
    },
    successText: {
      color: '#10B981',
      textAlign: 'center',
      marginTop: '0.5rem',
    },
    loadingText: {
      color: '#9CA3AF',
      textAlign: 'center',
      marginTop: '0.5rem',
    },
  };

  if (!userData) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Profile</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={formData.username}
            style={styles.input}
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            style={styles.input}
            onChange={handleChange}
            disabled
          />
          <input
            type="password"
            id="password"
            placeholder="New Password (leave empty to keep current)"
            style={styles.input}
            onChange={handleChange}
          />
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        
        <button 
          onClick={handleSignOut} 
          style={styles.signOutButton}
        >
          Sign Out
        </button>
        
        {error && <p style={styles.errorText}>{error}</p>}
        {updateSuccess && <p style={styles.successText}>Profile updated successfully!</p>}
      </div>
    </div>
  );
};

export default Profile;
