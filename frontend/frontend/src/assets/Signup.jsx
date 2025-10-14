import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/Landingpage';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 👈 default role = student
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = enter details, 2 = enter code
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const requestVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/signup/request-verification', {
        username: name,
        email,
        password,
        role,
      });
      alert('Verification code sent to your email (check spam)');
      setStep(2);
    } catch (err) {
      console.error('Request verification error:', err);
      alert(err.response?.data?.error || 'Failed to request verification');
    } finally {
      setLoading(false);
    }
  };

  const confirmVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/signup/confirm', { email, code });
      alert(res.data.message || 'Registration successful');
      navigate('/login');
    } catch (err) {
      console.error('Confirm verification error:', err);
      alert(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark-page relative h-screen w-screen">
      {/* Background Landing Page */}
      <div className="absolute inset-0 z-0">
        <LandingPage />
      </div>

      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">

        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Register</h2>

          {step === 1 ? (
            <form onSubmit={requestVerification}>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                required
              />

              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                required
              />

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-6 p-2 border border-gray-300 rounded"
                required
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mb-6 p-2 border border-gray-300 rounded"
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={confirmVerification}>
              <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to <strong>{email}</strong>. Enter it below to complete registration.</p>
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Register'}
                </button>
                <button type="button" className="flex-1 bg-gray-200 text-gray-700 py-2 rounded" onClick={() => setStep(1)} disabled={loading}>
                  Edit Details
                </button>
              </div>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
