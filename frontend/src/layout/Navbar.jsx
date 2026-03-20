import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import JoinCourseModal from "../components/JoinCourseModal";
import JoinPackageModal from "../components/JoinPackageModal";
import JoinWebinarModal from "../components/JoinWebinarModal";
import NotificationBell from "../components/NotificationBell";
import { useAuthStore } from "../stores/authStore";

export default function Navbar({ userType, variant = 'dark', landing = false }) {
  const [modalType, setModalType] = useState(null); // 'course' | 'package' | 'webinar' | null
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { token, role, name, logout } = useAuthStore();
  const navigate = useNavigate();

  // Use Zustand role if available, fallback to prop
  const userRole = role || userType;
  const isLight = variant === 'light';
  const isTeacher = userRole === 'teacher';
  const isAuthenticated = !!token;
  const location = useLocation();

  // Ensure landing-only view if we're at the app root path — tolerate common root variants
  const pathname = location?.pathname || '/';
  const isLandingLocal = landing || pathname === '/' || pathname === '' || pathname === '/index.html';

  // Modern glassmorphism navbar - always use solid background for better visibility
  const navClass = `w-full fixed top-0 left-0 z-40 backdrop-blur-lg p-4 flex justify-between items-center transition-all ${isTeacher
    ? 'bg-white shadow-lg border-b border-gray-200'
    : isLight
      ? 'bg-white shadow-lg border-b border-gray-200'
      : 'bg-white/95 shadow-lg border-b border-gray-200'
    }`;

  // Logo always visible with gradient
  const logoClass = 'text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent';

  // Links always visible with good contrast
  const linkBase = 'text-gray-800 font-medium';
  const linkHover = 'hover:text-violet-600 transition-colors';

  return (
    <nav className={navClass}>
      {/* Logo */}
      <Link to="/" className={`${logoClass} hover:opacity-80 transition-opacity`}>
        Learnova
      </Link>

      {/* Right side links */}
      <div className="space-x-3 md:space-x-4 lg:space-x-6 flex items-center flex-wrap gap-2">
        {isLandingLocal ? (
          <>
            <Link to="/login" className={`${linkBase} ${linkHover}`}>
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">
              Get Started
            </Link>
          </>
        ) : (
          <>
            {!isAuthenticated && (
              <>
                <Link to="/login" className={`${linkBase} ${linkHover}`}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </>
            )}

            {userRole === "student" && isAuthenticated && (
              <>
                <Link to="/my-courses" className={`${linkBase} ${linkHover}`}>My Courses</Link>
                <Link to="/webinar" className={`${linkBase} ${linkHover}`}>Webinars</Link>
                <NotificationBell />
                <button
                  onClick={() => setModalType('course')}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  Join Course
                </button>
                <button
                  onClick={() => setModalType('package')}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  Join Package
                </button>
                <button
                  onClick={() => setModalType('webinar')}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  Join Webinar
                </button>
                {name && name !== 'undefined' && name !== 'null' && name.trim() !== '' && (
                  <Link to="/profile" className={`${linkBase} text-sm hidden sm:inline hover:text-violet-600`}>
                    {name}
                  </Link>
                )}
              </>
            )}

            {userRole === "teacher" && isAuthenticated && (
              <>
                <Link to="/home" className={`${linkBase} ${linkHover}`}>Dashboard</Link>
                <Link to="/courses" className={`${linkBase} ${linkHover}`}>Courses</Link>
                <Link to="/packages" className={`${linkBase} ${linkHover}`}>Packages</Link>
                <NotificationBell />
                {name && name !== 'undefined' && name !== 'null' && name.trim() !== '' && (
                  <Link to="/profile" className={`${linkBase} text-sm hidden sm:inline hover:text-violet-600`}>
                    {name}
                  </Link>
                )}
              </>
            )}

            {/* Logout button when user is logged in */}
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  Logout
                </button>

                {showLogoutConfirm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-24">
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
                          onClick={() => {
                            logout();
                            setShowLogoutConfirm(false);
                            navigate('/login');
                          }}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {modalType === 'course' && (
        <JoinCourseModal onClose={() => setModalType(null)} onJoined={() => setModalType(null)} />
      )}
      {modalType === 'package' && (
        <JoinPackageModal onClose={() => setModalType(null)} onJoined={() => setModalType(null)} />
      )}
      {modalType === 'webinar' && (
        <JoinWebinarModal onClose={() => setModalType(null)} onJoined={() => setModalType(null)} />
      )}
    </nav>
  );
}
