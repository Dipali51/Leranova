import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/10 shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-800">Graphy</Link>

      <div className="space-x-6 flex items-center relative">
        
        <div className="relative">
          <button
            onClick={() => toggleDropdown('products')}
            className="text-sm font-medium text-black hover:text-black/80"
          >
            Products ▾
          </button>
          {openDropdown === 'products' && (
            <div className="absolute mt-3 p-6 rounded-xl bg-white border border-blue-200 shadow-lg w-80 z-20">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-800">
                <Link to="/" className="hover:underline">Courses</Link>
                <Link to="/about" className="hover:underline">Webinars</Link>
                <Link to="/" className="hover:underline">Membership</Link>
                <Link to="/about" className="hover:underline">Digital Products</Link>
                <Link to="/" className="hover:underline">Telegram Communities</Link>
                <div className="flex items-center gap-1">
                  <Link to="/ai-avatars" className="hover:underline">AI Avatars</Link>
                  <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 font-medium">NEW</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('features')}
            className="text-sm font-medium text-black hover:text-black/80"
          >
            Features ▾
          </button>
          {openDropdown === 'features' && (
            <div className="absolute mt-3 p-8 rounded-xl bg-white border border-blue-200 shadow-lg w-96 z-20">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-800">
                <Link to="/" className="hover:underline">Website builder</Link>
                <Link to="/about" className="hover:underline">Website builder</Link>
                <Link to="/" className="hover:underline">Most secure platform</Link>
                <Link to="/about" className="hover:underline">Integrated payment gateways</Link>
                <Link to="/" className="hover:underline">Advanced sales insights</Link>
                <Link to="/" className="hover:underline">Mobile app</Link>
                <Link to="/" className="hover:underline">Chat community</Link>
                <Link to="/" className="hover:underline">Graphy Assist</Link>
                <Link to="/" className="hover:underline">Third party support</Link>
                <Link to="/" className="hover:underline">Email Marketing</Link>
              </div>
            </div>
          )}
        </div>

        {/* Auth Links */}
        <Link to="/" className="text-gray-700 hover:text-purple-600"><b>Stories</b></Link>
        <Link to="/pricing" className="text-gray-700 hover:text-purple-600"><b>Pricing</b></Link>
        <Link to="/Login" className="text-gray-700 hover:text-purple-600"><b>Sign in</b></Link>
      </div>
    </nav>
  );
}
