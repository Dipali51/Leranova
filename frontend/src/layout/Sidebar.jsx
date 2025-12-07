import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Sidebar() {
  const [showProducts, setShowProducts] = useState(true);
  const [showManage, setShowManage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { role, name, logout } = useAuthStore();

  // helper to navigate
  const navigateTo = (path) => {
    navigate(path);
    setShowManage(false);
    setShowProducts(false);
  };

  const ChevronIcon = ({ open }) => (
    <svg
      className={`w-4 h-4 ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  function handleLogout() {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  }

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
            {name ? name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{name || 'Teacher'}</div>
            <div className="text-xs text-gray-500">Instructor</div>
          </div>
        </div>
      </div>

      <ul className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Home */}
        <li>
          <Link
            to="/home"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive('/home')
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75v9.75a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 19.5V9.75z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
            </svg>
            Home
          </Link>
        </li>

        {/* Products */}
        <li>
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
            Products
            <ChevronIcon open={showProducts} />
          </button>
          {showProducts && (
            <ul className="ml-4 mt-1 space-y-1 border-l-2 border-violet-100 pl-4">
              <li>
                <Link
                  to="/courses"
                  className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive('/courses')
                      ? 'text-violet-700 font-semibold bg-violet-50'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive('/packages')
                      ? 'text-violet-700 font-semibold bg-violet-50'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/webinar"
                  className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive('/webinar')
                      ? 'text-violet-700 font-semibold bg-violet-50'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  Webinars
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Manage */}
        <li>
          <button
            onClick={() => setShowManage(!showManage)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3v1.5M11.25 19.5V21M4.5 11.25H3m18 0h-1.5M6.364 6.364l-1.06-1.06M17.657 17.657l-1.06-1.06M6.364 17.657l-1.06 1.06M17.657 6.343l-1.06 1.06M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
            </svg>
            Manage
            <ChevronIcon open={showManage} />
          </button>
          {showManage && (
            <ul className="ml-4 mt-1 space-y-1 border-l-2 border-violet-100 pl-4">
              <li>
                <button
                  onClick={() => navigateTo('/asset-library')}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive('/asset-library')
                      ? 'text-violet-700 font-semibold bg-violet-50'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  Asset Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/question-bank')}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive('/question-bank')
                      ? 'text-violet-700 font-semibold bg-violet-50'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  Question Bank
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/quiz-reviews')}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive('/quiz-reviews')
                      ? 'text-violet-700 font-semibold bg-violet-50'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  Quiz Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/assignments')}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive('/assignments')
                      ? 'text-violet-700 font-semibold bg-violet-50'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  Assignments
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Logout button pinned to bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="bg-white rounded-xl p-6 shadow-2xl z-10 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Confirm logout</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
