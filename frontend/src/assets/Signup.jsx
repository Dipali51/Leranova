import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { TOAST_TYPES } from '../utils/constants';
import { API_ENDPOINTS } from '../utils/constants';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = enter details, 2 = enter code
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const { post, loading } = useApi();

  const validateStep1 = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requestVerification = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    try {
      await post(API_ENDPOINTS.REQUEST_VERIFICATION, {
        username: name,
        email,
        password,
        role,
      }, { showErrorToast: false });
      
      showToast(TOAST_TYPES.SUCCESS, 'Verification code sent to your email! Please check your inbox (and spam folder).');
      setStep(2);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to request verification';
      showToast(TOAST_TYPES.ERROR, errorMessage);
      setErrors({ submit: errorMessage });
    }
  };

  const confirmVerification = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrors({ code: 'Verification code is required' });
      return;
    }

    try {
      const res = await post(API_ENDPOINTS.CONFIRM_VERIFICATION, { email, code }, { showErrorToast: false });
      showToast(TOAST_TYPES.SUCCESS, res.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Verification failed. Please check your code.';
      showToast(TOAST_TYPES.ERROR, errorMessage);
      setErrors({ code: errorMessage });
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
              Create Account
            </h2>
            <p className="text-gray-600">Join Learnova and start learning today</p>
          </div>

          {step === 1 ? (
            <form onSubmit={requestVerification}>
              <FormInput
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: '' });
                }}
                placeholder="Enter your full name"
                error={errors.name}
                required
              />

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
                placeholder="Enter password (min 6 characters)"
                error={errors.password}
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

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
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={confirmVerification}>
              <div className="mb-4 p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  We sent a 6-digit verification code to <strong className="text-violet-700">{email}</strong>.
                  Please check your inbox (and spam folder) and enter the code below.
                </p>
              </div>
              
              <FormInput
                label="Verification Code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErrors({ ...errors, code: '' });
                }}
                placeholder="Enter 6-digit code"
                error={errors.code}
                required
                maxLength={6}
              />
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    'Verify & Register'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrors({});
                    setCode('');
                  }}
                  disabled={loading}
                  className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit Details
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
