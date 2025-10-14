import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:3001/api/admin/login', credentials);

            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token);
                localStorage.setItem('role', res.data.role);
                navigate('/admin');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow p-8 rounded w-full max-w-md">
                <h2 className="text-2xl mb-6 font-bold">Admin Login</h2>

                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;