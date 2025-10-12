import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [showProducts, setShowProducts] = useState(true);
  const [showManage, setShowManage] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get user role from localStorage (or backend)
  useEffect(() => {
    const savedRole = localStorage.getItem("role"); // 👈 store role at login
    setRole(savedRole);
  }, []);

  const ChevronIcon = ({ open }) => (
    <svg
      className={`w-4 h-4 ml-auto transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  // Only show if role === teacher
  if (role !== "teacher") return null;

  function handleLogout() {
    // clear auth and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setShowLogoutConfirm(false);
    navigate('/login');
  }

  return (
    <div className="w-64 min-h-screen border-r border-gray-200 p-4 text-sm text-gray-800 flex flex-col">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <img
          src="https://placehold.co/40x40"
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>

      <ul className="space-y-2 flex-1">
        {/* Home */}
        <li className="flex items-center gap-3 bg-indigo-100 text-indigo-600 px-3 py-2 rounded-md font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75v9.75a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 19.5V9.75z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
          </svg>
          Home
        </li>

        {/* Products */}
        <li className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => setShowProducts(!showProducts)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          Products
          <ChevronIcon open={showProducts} />
        </li>
        {showProducts && (
          <ul className="ml-8 space-y-5 text-black-500">
            <li><Link to="/courses" className="hover:text-indigo-600">Courses</Link></li>
            <li><Link to="/packages" className="hover:text-indigo-600">Packages</Link></li>
            <li><Link to="/webinar" className="hover:text-indigo-600">Webinars</Link></li>
          </ul>
        )}

        {/* Manage */}
        <li className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => setShowManage(!showManage)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3v1.5M11.25 19.5V21M4.5 11.25H3m18 0h-1.5M6.364 6.364l-1.06-1.06M17.657 17.657l-1.06-1.06M6.364 17.657l-1.06 1.06M17.657 6.343l-1.06 1.06M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
          </svg>
          Manage
          <ChevronIcon open={showManage} />
        </li>
        {showManage && (
          <ul className="ml-8 space-y-5 text-black-500">
            <li>Asset library</li>
            <li>Discussions</li>
            <li>Question bank</li>
            <li>Quiz reviews</li>
            <li>Assignments</li>
            <li>Live tests</li>
            <li>Live classes</li>
            <li>Ratings & reviews</li>
          </ul>
        )}

        {/* Users */}
        <li className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => setShowUsers(!showUsers)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 21v-1.125a5.625 5.625 0 0111.25 0V21" />
          </svg>
          Users
          <ChevronIcon open={showUsers} />
        </li>
        {showUsers && (
          <ul className="ml-8 space-y-5 text-black-500">
            <li>Learner</li>
            <li>Admin</li>
            <li>Instructor</li>
            <li>Affiliates</li>
            <li>Enquiries</li>
          </ul>
        )}

        {/* Reports */}
        <li className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => setShowReports(!showReports)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6m6 6V9m3-4.5H6a2.25 2.25 0 00-2.25 2.25v11.25A2.25 2.25 0 006 21h12a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5z" />
          </svg>
          Reports
          <ChevronIcon open={showReports} />
        </li>
        {showReports && (
          <ul className="ml-8 space-y-5 text-black-500">
            <li>Overview</li>
            <li>Transactions</li>
            <li>Settlement</li>
            <li>Webinar</li>
          </ul>
        )}
      </ul>

      {/* Logout button pinned to bottom */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50">
          <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            {/* nicer logout icon (box arrow right) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8v8" />
            </svg>
          </span>
          <span>Logout</span>
        </button>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLogoutConfirm(false)} />
          <div className="bg-white rounded-lg p-6 shadow-lg z-10 w-80">
            <h3 className="text-lg font-semibold mb-2">Confirm logout</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-3 py-2 rounded bg-gray-100">Cancel</button>
              <button onClick={handleLogout} className="px-3 py-2 rounded bg-red-600 text-white">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
