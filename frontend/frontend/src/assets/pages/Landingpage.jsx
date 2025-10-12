import React, { useState } from "react";
import Navbar from "../../layout/Navbar";
import Learnovaimg from "../../image/Learnova.jpg";
import { Link } from "react-router-dom";

export default function Landingpage() {
  return (
    <div className="dark-page relative min-h-screen flex flex-col overflow-hidden">
      {/* Decorative Top Wave Background */}
      <div className="absolute top-0 left-0 w-full">
        <svg
          className="w-full h-48 text-violet-800"
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
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-violet-700 text-white font-medium text-sm">New • Updated</span>
            <span className="text-sm text-violet-300">Trusted by teachers across India</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-300 to-fuchsia-300">
            Learnova <span className="inline-block transform translate-y-0.5">🚀</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-violet-300">Host & Monetize</span> Your Knowledge
          </h1>

          <p className="mt-6 text-lg md:text-xl text-violet-200 max-w-xl leading-relaxed">
            Turn your expertise into income. Upload courses, PDFs, webinars, and digital products. Build a vibrant learning community and earn from your content.
          </p>

          {/* Hero CTAs removed (kept intentionally minimal) */}
        </div>

        {/* Right Hero Image */}
        <div className="flex-1 mt-10 md:mt-12 md:ml-10 relative">
          <div className="absolute -left-16 -top-6 w-40 h-40 bg-gradient-to-br from-violet-700 to-purple-700 rounded-full opacity-30 blur-3xl transform -rotate-12"></div>
          <div className="absolute right-0 top-24 w-36 h-36 bg-gradient-to-br from-fuchsia-700 to-purple-700 rounded-full opacity-30 blur-3xl"></div>
          <img
            src={Learnovaimg}
            alt="Learnova Illustration"
            className="w-full max-w-lg mx-auto shadow-2xl rounded-xl border border-white/30"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-transparent relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-2xl shadow-2xl transform hover:-translate-y-3 transition-all bg-gradient-to-br from-white/5 to-white/3 border border-white/10 backdrop-blur-sm">
              <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-white/95 shadow">
                <img src="https://img.icons8.com/color/96/000000/classroom.png" alt="Upload Courses" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white">📚 Upload Courses</h3>
              <p className="mt-4 text-gray-300">Host video lectures, PDFs, and quizzes in one place.</p>
            </div>
            <div className="p-8 rounded-2xl shadow-2xl transform hover:-translate-y-3 transition-all bg-gradient-to-br from-white/5 to-white/3 border border-white/10 backdrop-blur-sm">
              <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-white/95 shadow">
                <img src="https://img.icons8.com/color/96/000000/money-bag.png" alt="Monetize Content" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white">💰 Monetize Content</h3>
              <p className="mt-4 text-gray-300">Charge for access and grow your income effortlessly.</p>
            </div>
            <div className="p-8 rounded-2xl shadow-2xl transform hover:-translate-y-3 transition-all bg-gradient-to-br from-white/5 to-white/3 border border-white/10 backdrop-blur-sm">
              <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-white/95 shadow">
                <img src="https://img.icons8.com/color/96/000000/conference.png" alt="Build Community" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white">🌍 Build Community</h3>
              <p className="mt-4 text-gray-300">Engage learners with discussions, webinars, and more.</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-12 bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
            <h4 className="text-xl font-semibold text-white mb-4">What instructors say</h4>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-4 bg-neutral-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/48?img=12" alt="avatar" className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold text-white">Riya Sharma</div>
                    <div className="text-sm text-violet-300">Data Science Instructor</div>
                  </div>
                </div>
                <p className="mt-3 text-gray-300">"I launched my course in two weeks and started earning within a month. The platform handles everything smoothly."</p>
              </div>
              <div className="flex-1 p-4 bg-neutral-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/48?img=32" alt="avatar" className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold text-white">Amit Patel</div>
                    <div className="text-sm text-violet-300">Design Coach</div>
                  </div>
                </div>
                <p className="mt-3 text-gray-300">"The payout workflow is clear and payouts reflect on time. Support is very responsive."</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Us Section */}
      <section className="py-12 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white">About Learnova 🚀</h2>
          <p className="mt-4 text-white">Learnova is an advanced online education platform designed to help educators, trainers, and learners connect and grow. Our mission is simple — to host, share, and monetize knowledge while making education accessible to everyone.</p>

          {/* Accordion */}
          <Accordion>
            <Accordion.Item title="Our Purpose" accent="teal">
              <p className="mt-2 text-white">Learnova aims to bridge the gap between traditional learning and modern digital education. We empower educators to earn through teaching, and learners to access affordable, high-quality courses across technology, business, arts, communication, and more.</p>
            </Accordion.Item>

            <Accordion.Item title="Benefits of Using Learnova" accent="amber">
              <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-white list-inside">
                <li>🎥 Host & Sell Courses Easily – Upload videos, PDFs and lessons effortlessly.</li>
                <li>💰 Monetize Your Knowledge – Earn by sharing your expertise.</li>
                <li>🎓 Comprehensive Learning System – From beginner to advanced levels.</li>
                <li>👩‍🏫 Expert-Led Courses – Learn from industry professionals.</li>
                <li>⚡ Time-Saving & Accessible – Learn anytime, anywhere.</li>
                <li>🌐 User-Friendly Dashboard – Simple tools for instructors and students.</li>
              </ul>
            </Accordion.Item>

            <Accordion.Item title="Vision & Mission" accent="teal">
              <p className="mt-2 text-white"><strong>Vision:</strong> To become India’s most trusted and empowering digital learning platform, where every individual can teach, learn, and earn from their knowledge.</p>
              <p className="mt-2 text-white"><strong>Mission:</strong> Make education and skill development accessible to all; empower teachers to earn by sharing knowledge; promote digital literacy and online learning adoption in India.</p>
            </Accordion.Item>

            <Accordion.Item title="Our Commitment & Initiatives" accent="amber">
              <p className="mt-2 text-white">Our dedicated support team provides quick and reliable help for all learners and instructors. We’re passionate about education, innovation, and empowerment, and it reflects in the way we assist our community.</p>
              <p className="mt-2 text-white">We support Digital India, Skill India, Startup India, and Make in India — supporting national initiatives and local creators.</p>
            </Accordion.Item>
          </Accordion>

          <aside className="mt-6 p-6 bg-transparent rounded-xl shadow-lg border border-violet-700 flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 bg-violet-700 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white">Support Information</h4>
              <p className="mt-2 text-violet-200">📅 <strong>Support Timing:</strong> 10:30 AM – 06:00 PM (Mon–Sat)</p>
              <p className="mt-1 text-violet-200">📧 <strong>Email:</strong> <a className="text-violet-200 font-medium" href="mailto:hello@learnova.in">hello@learnova.in</a></p>

              <div className="mt-4">
                <h5 className="font-semibold text-white">Why Learnova focuses on rural & semi-urban areas</h5>
                <p className="mt-2 text-violet-200">We focus on empowering students and educators in rural and semi-urban areas, enabling them to teach and learn online without limitations. By providing a centralized learning platform, Learnova helps reduce educational inequality and boosts self-employment through skill monetization.</p>
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <Link to="/contact" className="inline-block px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:opacity-95">Contact Support</Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-violet-900 text-violet-200 text-center relative z-10">
        <p>© {new Date().getFullYear()} Learnova. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Inline Accordion component used by the About section
function Accordion({ children }) {
  return <div className="mt-6 space-y-4">{children}</div>;
}

Accordion.Item = function AccordionItem({ title, children, accent = 'teal' }) {
  const [open, setOpen] = useState(false);
  const accentMap = {
    teal: 'bg-violet-700 text-white border-violet-700',
    amber: 'bg-fuchsia-700 text-white border-fuchsia-700',
  };
  const cls = accentMap[accent] || accentMap.teal;
  return (
    <div className={`border rounded-lg overflow-hidden border-violet-700`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left px-4 py-3 flex items-center justify-between ${open ? 'bg-neutral-700' : 'bg-neutral-800'} text-white hover:bg-neutral-700 transition`}
      >
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-md ${cls}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span className="font-medium text-white">{title}</span>
        </div>
        <div className={`transform transition-transform ${open ? 'rotate-180' : 'rotate-0'} text-white`}>{open ? '−' : '+'}</div>
      </button>
      <div className={`px-4 py-3 bg-neutral-800 text-white transition-all ${open ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};
