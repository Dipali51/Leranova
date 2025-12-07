import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useApi } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/constants";
import { showToast } from "../../components/Toast";
import { TOAST_TYPES } from "../../utils/constants";
import CourseCardSkeleton from "../../components/CourseCardSkeleton";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const { role, token } = useAuthStore();
    const { get, loading } = useApi();

    const fetchEnrollments = useCallback(async () => {
        if (role !== "student") {
            setEnrollments([]);
            return;
        }

        if (!token) {
            setEnrollments([]);
            return;
        }

        try {
            const data = await get(API_ENDPOINTS.MY_ENROLLMENTS, { showErrorToast: false });
            setEnrollments(data || []);
        } catch (err) {
            if (err.response?.status !== 401) {
                showToast(TOAST_TYPES.ERROR, 'Failed to load your courses. Please try again.');
            }
            setEnrollments([]);
        }
    }, [role, token, get]);

    useEffect(() => {
        fetchEnrollments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="p-18 light-page relative overflow-hidden">
            {/* Decorative background layers for an attractive light look. They are
                absolutely positioned and non-interactive (aria-hidden). */}
            <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute -left-32 -top-32 w-96 h-96 light-blob opacity-60" />
                <div className="absolute -right-28 -bottom-24 w-80 h-80 light-blob-2 opacity-50" />
            </div>

            {/* Per-page light-theme overrides. These rules load after the global
                dark overrides and re-apply light colors and softer visuals for
                this page only. */}
            <style>{`
                /* Light purple theme */
                .light-page { background: linear-gradient(180deg,#fbf8ff 0%, #f3e8ff 40%, #fdf6ff 100%); color: #0f172a; }
                .light-page h1, .light-page h2, .light-page h3, .light-page h4 { color: #1f2937 !important; }
                .light-page .bg-white { background-color: #ffffff !important; color: #0f172a !important; }
                .light-page [class*="bg-gray-"] { background-color: #fbf7ff !important; }
                .light-page .bg-indigo-50 { background-color: #f5f3ff !important; }
                .light-page .text-gray-600, .light-page .text-gray-500, .light-page .text-gray-700, .light-page .text-gray-800, .light-page .text-gray-900 {
                    color: #52525b !important;
                }
                .light-page a, .light-page a:hover { color: #4c1d95 !important; }
                .light-page .light-card { background: #ffffff !important; color: #0f172a !important; border: 1px solid rgba(76,29,149,0.06); box-shadow: 0 10px 30px rgba(76,29,149,0.06); }
                .light-page .light-progress { background: rgba(76,29,149,0.08) !important; }

                /* decorative blobs: purple hues */
                .light-page .light-blob { border-radius: 9999px; background: radial-gradient(circle at 30% 30%, rgba(124,58,237,0.28), rgba(99,102,241,0.22) 40%, transparent 60%); filter: blur(36px); }
                .light-page .light-blob-2 { border-radius: 9999px; background: radial-gradient(circle at 70% 70%, rgba(167,139,250,0.18), rgba(124,58,237,0.14) 40%, transparent 60%); filter: blur(28px); }

                /* make outlines and controls subtle */
                .light-page .border { border-color: rgba(76,29,149,0.06) !important; }
                .light-page .rounded-lg { border-radius: 12px !important; }
            `}</style>
            <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                        My Courses
                    </h1>
                    <p className="text-gray-600">All the courses you're enrolled in appear here.</p>
                </div>
                <button 
                    onClick={fetchEnrollments} 
                    disabled={loading}
                    className="btn-secondary flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <LoadingSpinner size="sm" /> : '↻'}
                    Refresh
                </button>
            </header>

            {loading ? (
                <CourseCardSkeleton count={6} />
            ) : enrollments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="mx-auto mb-6 w-32 h-32 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center">
                        <div className="text-6xl">📚</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Looks like you haven't joined any courses yet. Use the Join Course button in the navbar to get started!
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link to="/" className="btn-secondary">Browse Courses</Link>
                        <button onClick={fetchEnrollments} className="btn-primary">Refresh</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((e) => {
                        // support multiple shapes:
                        // 1) Enrollment object: { _id, course: { _id, title }, enrolledAt }
                        // 2) Legacy course object: { _id, title, createdAt }
                        const courseObj = e.course || e; // if e is a course, use it
                        const title = courseObj?.title || courseObj?.name || 'Course';
                        const courseId = courseObj?._id || courseObj?.id;
                        const enrolledAt = e.enrolledAt || e.createdAt || new Date().toISOString();

                        return (
                            <div key={e._id || courseId || Math.random()} className="card-modern group">
                                <Link to={`/courses/preview/${courseId}`}>
                                    <div className="h-48 bg-gradient-to-br from-violet-200 to-fuchsia-200 relative overflow-hidden">
                                        {courseObj?.coverImage ? (
                                            (() => {
                                                const src = courseObj.coverImage;
                                                const imageUrl = src.startsWith('/') ? `http://localhost:3001${src}` : src;
                                                return (
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={title} 
                                                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" 
                                                    />
                                                );
                                            })()
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                <div className="text-center">
                                                    <div className="text-4xl mb-2">📖</div>
                                                    <div className="text-sm">No Cover</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{title}</h3>
                                        <div className="text-sm text-gray-500 mb-4">Enrolled: {new Date(enrolledAt).toLocaleDateString()}</div>

                                        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                                            <div 
                                                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 h-2.5 rounded-full transition-all duration-300" 
                                                style={{ width: `${Math.floor(Math.random() * 70) + 10}%` }} 
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-violet-600 font-semibold text-sm group-hover:text-violet-700 transition">
                                                Continue Learning →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
