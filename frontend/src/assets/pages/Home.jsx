import React from 'react';
import Sidebar from "../../layout/Sidebar";
import { useState, useEffect } from "react";
import JoinCourseModal from "../../components/JoinCourseModal";
import { useAuthStore } from "../../stores/authStore";
import { useApi } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/constants";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import CourseCardSkeleton from "../../components/CourseCardSkeleton";

export default function Home() {
  const [showJoin, setShowJoin] = useState(false);
  const { role } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  const fetchEnrollments = async () => {
    if (role !== "student") {
      setLoading(false);
      return;
    }
    
    try {
      const data = await get(API_ENDPOINTS.MY_ENROLLMENTS, { showErrorToast: false });
      setEnrollments(data || []);
    } catch (err) {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [role]);
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 home-light relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -left-40 -top-40 w-80 h-80 home-blob opacity-60" />
        </div>
        <style>{`
          .home-light { background: linear-gradient(180deg,#fffafc 0%, #fbf8ff 40%, #f7f3ff 100%); }
          .home-light .bg-white { background-color: #ffffff !important; color: #0f172a !important; }
          .home-light [class*="bg-gray-"] { background-color: #fbf7ff !important; }
          .home-light .text-gray-500, .home-light .text-gray-600 { color: #6b7280 !important; }
          .home-light .home-blob { border-radius: 9999px; background: radial-gradient(circle at 30% 30%, rgba(124,58,237,0.18), rgba(99,102,241,0.10) 40%, transparent 60%); filter: blur(36px); }
        `}</style>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Here's what's happening with your courses today.</p>
        </div>

        {/* Stats Cards for Teachers */}
        {role === "teacher" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-violet-100">
              <div className="text-3xl font-bold text-violet-600">0</div>
              <div className="text-gray-600 mt-1">Total Courses</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-fuchsia-100">
              <div className="text-3xl font-bold text-fuchsia-600">0</div>
              <div className="text-gray-600 mt-1">Total Students</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-100">
              <div className="text-3xl font-bold text-purple-600">₹0</div>
              <div className="text-gray-600 mt-1">Total Earnings</div>
            </div>
          </div>
        )}

        {/* Student Section */}
        {role === "student" && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Continue Learning</h2>
                <p className="text-gray-600">Pick up where you left off</p>
              </div>
              <button
                onClick={() => setShowJoin(true)}
                className="btn-primary"
              >
                + Join Course
              </button>
            </div>

            {loading ? (
              <CourseCardSkeleton count={3} />
            ) : enrollments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center border-2 border-gray-200">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6">Start your learning journey by joining a course!</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setShowJoin(true)} className="btn-primary">
                    Join Course
                  </button>
                  <Link to="/courses" className="btn-secondary">
                    Browse Courses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.slice(0, 6).map((e) => {
                  const courseObj = e.course || e;
                  const courseId = courseObj?._id;
                  const title = courseObj?.title || 'Course';
                  const enrolledAt = e.enrolledAt || e.createdAt;

                  return (
                    <Link
                      key={e._id || courseId}
                      to={`/courses/preview/${courseId}`}
                      className="card-modern group"
                    >
                      <div className="h-40 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-t-xl overflow-hidden">
                        {courseObj?.coverImage ? (
                          <img
                            src={`http://localhost:3001${courseObj.coverImage}`}
                            alt={title}
                            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <span className="text-4xl">📖</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{title}</h3>
                        <div className="text-sm text-gray-500 mb-3">
                          Enrolled: {new Date(enrolledAt).toLocaleDateString()}
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.floor(Math.random() * 70) + 10}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {enrollments.length > 6 && (
              <div className="mt-6 text-center">
                <Link to="/my-courses" className="btn-secondary">
                  View All Courses ({enrollments.length})
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Teacher Quick Actions */}
        {role === "teacher" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/courses/create"
              className="bg-white rounded-xl p-8 shadow-md border-2 border-violet-200 hover:border-violet-400 transition text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">➕</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Course</h3>
              <p className="text-gray-600">Start building your next course and share your knowledge</p>
            </Link>
            <Link
              to="/courses"
              className="bg-white rounded-xl p-8 shadow-md border-2 border-fuchsia-200 hover:border-fuchsia-400 transition text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Courses</h3>
              <p className="text-gray-600">View and edit your existing courses</p>
            </Link>
          </div>
        )}
      </div>

      {showJoin && <JoinCourseModal onClose={() => setShowJoin(false)} onJoined={fetchEnrollments} />}
    </div>
  );
}
