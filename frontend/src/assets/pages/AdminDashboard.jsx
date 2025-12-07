import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState({ teachers: [], students: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }
            const res = await axios.get('http://localhost:3001/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            if (err.response?.status === 403) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [navigate]); // fetchUsers is stable, no need to add

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-extrabold text-gray-800 mb-4">Admin Dashboard</h2>
                    <p className="text-lg text-gray-600">Manage teachers and students with ease</p>
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Teachers Section */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Teachers</h3>
                        </div>
                        {users.teachers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 animate-pulse">No teachers registered yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                        <tr>
                                            <th className="py-3 px-4 text-left font-semibold">Username</th>
                                            <th className="py-3 px-4 text-left font-semibold">Email</th>
                                            <th className="py-3 px-4 text-left font-semibold">Courses</th>
                                            <th className="py-3 px-4 text-left font-semibold">Webinars</th>
                                            <th className="py-3 px-4 text-left font-semibold">Packages</th>
                                            <th className="py-3 px-4 text-left font-semibold">Enrollments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.teachers.map((user, index) => (
                                            <tr key={user._id} className={`hover:bg-indigo-50 transition-colors duration-200`} style={{ animationDelay: `${index * 0.1}s` }}>
                                                <td className="py-3 px-4 border-b border-gray-200">{user.username}</td>
                                                <td className="py-3 px-4 border-b border-gray-200">{user.email}</td>
                                                <td className="py-3 px-4 border-b border-gray-200">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {user.courseCount}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200">
                                                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {user.webinarCount}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200">
                                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {user.packageCount}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200">
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {user.enrollmentCount}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Students Section */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-pink-400 to-red-500 p-3 rounded-full mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Students</h3>
                        </div>
                        {users.students.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 animate-pulse">No students registered yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                                    <thead className="bg-gradient-to-r from-pink-500 to-red-600 text-white">
                                        <tr>
                                            <th className="py-3 px-4 text-left font-semibold">Username</th>
                                            <th className="py-3 px-4 text-left font-semibold">Email</th>
                                            <th className="py-3 px-4 text-left font-semibold">Enrolled</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.students.map((user, index) => (
                                            <tr key={user._id} className={`hover:bg-pink-50 transition-colors duration-200`} style={{ animationDelay: `${(index + users.teachers.length) * 0.1}s` }}>
                                                <td className="py-3 px-4 border-b border-gray-200">{user.username}</td>
                                                <td className="py-3 px-4 border-b border-gray-200">{user.email}</td>
                                                <td className="py-3 px-4 border-b border-gray-200">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {user.enrolledCoursesCount}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-blue-100">Total Users</p>
                                <p className="text-3xl font-bold">{users.teachers.length + users.students.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.5s' }}>
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-green-100">Total Courses</p>
                                <p className="text-3xl font-bold">{users.teachers.reduce((sum, t) => sum + t.courseCount, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.6s' }}>
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-cyan-100">Total Webinars</p>
                                <p className="text-3xl font-bold">{users.teachers.reduce((sum, t) => sum + t.webinarCount, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.7s' }}>
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-orange-100">Total Packages</p>
                                <p className="text-3xl font-bold">{users.teachers.reduce((sum, t) => sum + t.packageCount, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.8s' }}>
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-purple-100">Total Enrollments</p>
                                <p className="text-3xl font-bold">{users.teachers.reduce((sum, t) => sum + t.enrollmentCount, 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;