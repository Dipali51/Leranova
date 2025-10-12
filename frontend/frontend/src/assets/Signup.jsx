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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3001/api/signup', {
        username: name,
        email,
        password,
        role, // 👈 send role also
      });

      alert(res.data.message || 'Registration successful');
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err);
      alert(err.response?.data?.error || 'Registration failed');
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

          <form onSubmit={handleRegister}>
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

            {/* 👇 Role Dropdown */}
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
            >
              Register
            </button>
          </form>

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
