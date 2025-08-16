import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ userType }) {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/10 shadow-sm p-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-gray-800">
        Learnova
      </Link>

      {/* Right side links */}
      <div className="space-x-6 flex items-center">
        {!userType && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-purple-600">
              Sign In
            </Link>
            <Link to="/signup" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              Get Started
            </Link>
          </>
        )}

        {userType === "student" && (
          <>
            <Link to="/my-courses" className="hover:text-purple-600">My Courses</Link>
            <Link to="/webinars" className="hover:text-purple-600">Webinars</Link>
            <Link to="/profile" className="hover:text-purple-600">Profile</Link>
          </>
        )}

        {userType === "teacher" && (
          <>
            <Link to="/dashboard" className="hover:text-purple-600">Dashboard</Link>
            <Link to="/courses" className="hover:text-purple-600">Courses</Link>
            <Link to="/packages" className="hover:text-purple-600">Packages</Link>
            <Link to="/webinars" className="hover:text-purple-600">Webinars</Link>
            <Link to="/assets" className="hover:text-purple-600">Asset Library</Link>
            <Link to="/profile" className="hover:text-purple-600">Profile</Link>
          </>
        )}
      </div>
    </nav>
  );
}
