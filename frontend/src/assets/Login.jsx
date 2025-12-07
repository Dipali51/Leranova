import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import { useAuthStore } from '../stores/authStore';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { TOAST_TYPES } from '../utils/constants';
import { API_ENDPOINTS } from '../utils/constants';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { post, loading } = useApi();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const data = await post(API_ENDPOINTS.LOGIN, {
        email: email.toLowerCase(),
        password,
      }, { showErrorToast: false });

      if (data.token) {
        setAuth(data.token, data.user, data.role, data.name);
        showToast(TOAST_TYPES.SUCCESS, 'Login successful!');
        
        // Redirect students directly to My Courses, others to Home
        setTimeout(() => {
          if (data.role === 'student') navigate('/my-courses');
          else navigate('/home');
        }, 500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      showToast(TOAST_TYPES.ERROR, errorMessage);
      setErrors({ submit: errorMessage });
    }
  };

  return (
    <div className="dark-page relative h-screen w-screen">
      {/* Background Landing Page */}
      <div className="absolute inset-0 z-0">
        <LandingPage />
      </div>

      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-violet-100">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to continue to Learnova</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: '' });
              }}
              placeholder="Enter your email"
              error={errors.email}
              required
            />

            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter your password"
              error={errors.password}
              required
            />

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-violet-600 hover:text-violet-700 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
