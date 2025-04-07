import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import OAuth from '../components/OAuth';
import api from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      console.log('Attempting to sign in with:', formData);
      const response = await api.post('/auth/signin', formData);
      console.log('Signin response:', response);

      if (response.data.success && response.data.token) {
        const { token, user } = response.data;
        console.log('Login successful, token:', token);
        console.log('User data:', user);
        
        // Dispatch success action
        dispatch(loginSuccess({ token, role: user.role }));
        
        // Store user data in localStorage
        localStorage.setItem('token', token);
        console.log('Token stored in localStorage:', localStorage.getItem('token'));
        localStorage.setItem('role', user.role);
        localStorage.setItem('email', user.email);
        localStorage.setItem('username', user.username);
        
        // Redirect to report page
        navigate('/report');
      } else {
        console.log('Invalid response format:', response.data);
        setError('Invalid credentials');
        dispatch(loginFailure('Invalid credentials'));
      }
    } catch (error) {
      console.error('Signin error:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Invalid credentials';
        console.log('Error response:', error.response.data);
        setError(errorMessage);
        dispatch(loginFailure(errorMessage));
      } else {
        const errorMessage = 'Network error. Please try again.';
        setError(errorMessage);
        dispatch(loginFailure(errorMessage));
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToOtp = () => {
    if (formData.email) {
      // Logic for OTP navigation (assuming you have defined it elsewhere)
    } else {
      alert("Please enter your email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? <LoadingSpinner size={20} /> : 'Sign in'}
            </button>
          </div>
        </form>
        <OAuth />
        <div style={styles.footer}>
          <p>Don't have an account?</p>
          <Link to="/signup" style={styles.link}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem'
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none'
  }
};

export default SignIn;
