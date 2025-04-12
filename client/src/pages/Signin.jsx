import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import OAuth from '../components/OAuth';
import api, { isTokenExpired, clearAuthState } from '../utils/axios';
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

  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingToken = () => {
      const token = localStorage.getItem('token');
      
      // If a token exists but is expired, clear it
      if (token && isTokenExpired(token)) {
        console.log('Found expired token during signin, clearing authentication state');
        clearAuthState();
      } else if (token && !isTokenExpired(token)) {
        // If token exists and is valid, redirect to report page
        console.log('Valid token found, redirecting to protected area');
        navigate('/report');
      }
    };
    
    checkExistingToken();
  }, [navigate]);

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
      console.log('Attempting signin with credentials:', { email: formData.email });
      
      const response = await api.post('/auth/signin', formData);
      console.log('Signin response:', response.data);

      if (response.data.success && response.data.token) {
        const { token, user } = response.data;
        console.log('Login successful, storing token and user data');

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role || 'user');
        localStorage.setItem('email', user.email);
        localStorage.setItem('username', user.username || user.name || '');

        // Update Redux store
        dispatch(loginSuccess({ token, role: user.role || 'user' }));

        // Navigate to protected area
        navigate('/report');
      } else {
        console.error('Server returned success but no token:', response.data);
        setError('Invalid response from server. Please try again.');
        dispatch(loginFailure('Invalid response from server'));
      }
    } catch (error) {
      console.error('Signin error:', error);
      
      let errorMessage = 'Network error. Please try again.';
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        errorMessage = error.response.data?.message || 
                      (error.response.status === 401 ? 'Invalid credentials' : 
                       'Server error. Please try again later.');
      }
      
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-200 flex flex-col items-center justify-start m-0 p-0 overflow-x-hidden w-screen absolute top-0 left-0">
      <div className="w-full bg-black py-4 px-2">
        <div className="max-w-5xl mx-auto bg-white rounded-lg py-3 px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-black-600">IOT BASED WATER DISPENSER</h1>
        </div>
      </div>

      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6 mt-8 mx-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-700">Welcome User</h2>
          <p className="mt-1 text-gray-600 text-sm">Sign in to your account</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? <LoadingSpinner size={20} /> : 'Sign In'}
          </button>
        </form>
        <OAuth />
      </div>
    </div>
  );
};

export default SignIn;