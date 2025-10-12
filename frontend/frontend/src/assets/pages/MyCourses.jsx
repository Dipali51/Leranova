import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attempt, setAttempt] = useState(0);

    const fetchEnrollments = useCallback(async () => {
        setLoading(true);
        try {
            const role = localStorage.getItem("role");
            if (role !== "student") {
                // don't attempt fetch if not student
                setEnrollments([]);
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                // token might not be set immediately after navigation; allow one retry
                if (attempt < 1) {
                    setAttempt((a) => a + 1);
                    setTimeout(fetchEnrollments, 300);
                    return;
                }
                setEnrollments([]);
                setLoading(false);
                return;
            }

            const res = await axios.get("http://localhost:3001/api/my-enrollments", { headers: { Authorization: `Bearer ${token}` } });
            console.debug('my-enrollments response:', res.data);
            setEnrollments(res.data || []);
        } catch (err) {
            console.error(err);
            setEnrollments([]);
        }
        setLoading(false);
    }, [attempt]);

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
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Courses</h1>
                    <p className="text-gray-600">All the courses you're enrolled in appear here.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchEnrollments} className="px-4 py-2 border rounded hover:bg-gray-50">Refresh</button>
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                </div>
            ) : enrollments.length === 0 ? (
                <div className="text-center py-16">
                    <div className="mx-auto mb-6 w-48 h-48 bg-indigo-50 rounded-full flex items-center justify-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3v4" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12h-4" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 21v-4" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 12h4" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                    <p className="text-gray-500 mb-4">Looks like you haven't joined any courses. Use the Join Course button to get started.</p>
                    <div className="flex items-center justify-center gap-3">
                        <a href="/" className="px-4 py-2 border rounded">Browse Courses</a>
                        <button onClick={fetchEnrollments} className="px-4 py-2 bg-indigo-600 text-white rounded">Refresh</button>
                    </div>
                    <details className="mt-6 p-3 bg-gray-50 border rounded text-xs text-gray-600">
                        <summary className="cursor-pointer">Debug: show raw enrollments</summary>
                        <pre className="whitespace-pre-wrap text-left">{JSON.stringify(enrollments, null, 2)}</pre>
                    </details>
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
                            <div key={e._id || courseId || Math.random()} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden">
                                <div className="h-40 bg-gray-100 flex items-center justify-center">
                                    {/* placeholder image; if courseObj.coverImage exists, use it */}
                                    {courseObj?.coverImage ? (
                                        (() => {
                                            const src = courseObj.coverImage;
                                            const imageUrl = src.startsWith('/') ? `http://localhost:3001${src}` : src;
                                            return <img src={imageUrl} alt={title} className="object-cover h-full w-full" />;
                                        })()
                                    ) : (
                                        <div className="text-gray-400">No image</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="font-semibold text-lg mb-1">{title}</div>
                                    <div className="text-sm text-gray-500 mb-3">Enrolled: {new Date(enrolledAt).toLocaleDateString()}</div>

                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.floor(Math.random() * 70) + 10}%` }} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Link to={`/courses/preview/${courseId}`} className="px-3 py-2 bg-indigo-600 text-white rounded">Open</Link>
                                        <Link to={`/courses/preview/${courseId}`} className="text-sm text-gray-500 underline">View details</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
