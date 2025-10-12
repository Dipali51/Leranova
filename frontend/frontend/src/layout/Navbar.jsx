import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JoinCourseModal from "../components/JoinCourseModal";

export default function Navbar({ userType, variant = 'dark' }) {
  const [showJoin, setShowJoin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isLight = variant === 'light';
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const navClass = `w-full fixed top-0 left-0 z-50 backdrop-blur-md p-4 flex justify-between items-center ${isLight ? 'bg-white/90 shadow-md' : 'bg-white/10 shadow-sm'}`;
  const logoClass = isLight ? 'text-xl font-bold text-gray-900' : 'text-xl font-bold text-gray-100';
  const linkBase = isLight ? 'text-gray-800' : 'text-gray-200';
  const linkHover = 'hover:text-violet-600';

  return (
    <nav className={navClass}>
      {/* Logo */}
      <Link to="/" className={logoClass}>
        Learnova
      </Link>

      {/* Right side links */}
      <div className="space-x-6 flex items-center">
        {!userType && (
          <>
            <Link to="/login" className={`${linkBase} ${linkHover}`}>
              Sign In
            </Link>
            <Link to="/signup" className={`${isLight ? 'bg-violet-600 hover:bg-violet-700' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-2 rounded-lg transition`}>
              Get Started
            </Link>
          </>
        )}

        {userType === "student" && (
          <>
            <Link to="/my-courses" className={`text-gray-800 ${linkHover}`}>My Courses</Link>
            <Link to="/webinars" className={`text-gray-800 ${linkHover}`}>Webinars</Link>
            <Link to="/profile" className={`text-gray-800 ${linkHover}`}>Profile</Link>
            <button onClick={() => setShowJoin(true)} className={`ml-2 ${isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-1 rounded`}>Join Course</button>
          </>
        )}

        {userType === "teacher" && (
          <>
            <Link to="/dashboard" className={`${linkBase} ${linkHover}`}>Dashboard</Link>
            <Link to="/courses" className={`${linkBase} ${linkHover}`}>Courses</Link>
            <Link to="/packages" className={`${linkBase} ${linkHover}`}>Packages</Link>
            <Link to="/webinars" className={`${linkBase} ${linkHover}`}>Webinars</Link>
            <Link to="/assets" className={`${linkBase} ${linkHover}`}>Asset Library</Link>
            <Link to="/profile" className={`${linkBase} ${linkHover}`}>Profile</Link>
          </>
        )}

        {/* Logout button when user is logged in */}
        {token && (
          <>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`ml-3 ${isLight ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 rounded`}
            >
              Logout
            </button>

            {showLogoutConfirm && (
              <div className="fixed inset-0 z-50 pt-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setShowLogoutConfirm(false)} />
                <div className="bg-white rounded-lg p-6 shadow-lg z-10 w-80">
                  <h3 className="text-lg font-semibold mb-2">Confirm logout</h3>
                  <p className="text-sm text-gray-600 mb-4">Are you sure you want to logout?</p>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowLogoutConfirm(false)} className="px-3 py-2 rounded bg-gray-100">Cancel</button>
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('name'); navigate('/login'); }} className="px-3 py-2 rounded bg-red-600 text-white">Logout</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {showJoin && <JoinCourseModal onClose={() => setShowJoin(false)} />}
    </nav>
  );
}
