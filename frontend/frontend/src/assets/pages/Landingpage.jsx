import React from "react";
import Navbar from "../../layout/Navbar";
import Learnovaimg from "../../image/Learnova.jpg";

export default function Landingpage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-indigo-100 overflow-hidden">
      {/* Decorative Top Wave Background */}
      <div className="absolute top-0 left-0 w-full">
        <svg
          className="w-full h-48 text-indigo-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,96L80,117.3C160,139,320,181,480,186.7C640,192,800,160,960,154.7C1120,149,1280,171,1360,181.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 pt-20 relative z-10 max-w-6xl mx-auto">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Learnova 🚀 <br />
            <span className="text-indigo-600">Host & Monetize</span> Your Knowledge
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl">
            Turn your expertise into income. Upload courses, PDFs, webinars, and 
            digital products. Build your learning community with Learnova.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <button className="px-8 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 transition shadow-lg">
              Get Started Free
            </button>
            <button className="px-8 py-4 rounded-2xl bg-gray-200 text-gray-700 text-lg font-semibold hover:bg-gray-300 transition">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="flex-1 mt-10 md:mt-12 md:ml-10">
          <img
            src={Learnovaimg}
            alt="Learnova Illustration"
            className="w-full max-w-lg mx-auto"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-8 rounded-2xl shadow-md hover:shadow-xl transition bg-indigo-50">
            <img
              src="https://img.icons8.com/color/96/000000/classroom.png"
              alt="Upload Courses"
              className="mx-auto mb-4 w-20 h-20"
            />
            <h3 className="text-2xl font-bold text-indigo-700">📚 Upload Courses</h3>
            <p className="mt-4 text-gray-600">
              Host video lectures, PDFs, and quizzes in one place.
            </p>
          </div>
          <div className="p-8 rounded-2xl shadow-md hover:shadow-xl transition bg-indigo-50">
            <img
              src="https://img.icons8.com/color/96/000000/money-bag.png"
              alt="Monetize Content"
              className="mx-auto mb-4 w-20 h-20"
            />
            <h3 className="text-2xl font-bold text-indigo-700">💰 Monetize Content</h3>
            <p className="mt-4 text-gray-600">
              Charge for access and grow your income effortlessly.
            </p>
          </div>
          <div className="p-8 rounded-2xl shadow-md hover:shadow-xl transition bg-indigo-50">
            <img
              src="https://img.icons8.com/color/96/000000/conference.png"
              alt="Build Community"
              className="mx-auto mb-4 w-20 h-20"
            />
            <h3 className="text-2xl font-bold text-indigo-700">🌍 Build Community</h3>
            <p className="mt-4 text-gray-600">
              Engage learners with discussions, webinars, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-indigo-900 text-white text-center relative z-10">
        <p>© {new Date().getFullYear()} Learnova. All rights reserved.</p>
      </footer>
    </div>
  );
}
