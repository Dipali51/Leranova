import React from 'react';
import Sidebar from "../../layout/Sidebar";
import { useState, useEffect } from "react";
import JoinCourseModal from "../../components/JoinCourseModal";
import axios from "axios";

export default function Home() {
  const [showJoin, setShowJoin] = useState(false);
  const userRole = localStorage.getItem("role");
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/my-enrollments", { headers: { Authorization: `Bearer ${token}` } });
      setEnrollments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userRole === "student") fetchEnrollments();
  }, [userRole]);
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
        {userRole === "student" && (
          <div className="mb-4">
            <button onClick={() => setShowJoin(true)} className="bg-green-600 text-white px-4 py-2 rounded">Join Course</button>
            {/* Enrolled courses list */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold mb-2">My Courses</h3>
                <a href="/my-courses" className="text-sm text-blue-600">View all</a>
              </div>
              {enrollments.length === 0 ? (
                <div className="text-sm text-gray-500">You have not enrolled in any courses yet.</div>
              ) : (
                <ul className="space-y-2">
                  {enrollments.map((e) => (
                    <li key={e._id} className="border p-2 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{e.course?.title || 'Course'}</div>
                        <div className="text-xs text-gray-500">Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <a href={`/courses/preview/${e.course?._id}`} className="text-blue-600">Open</a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {/* rest of home page content remains unchanged */}
      </div>

      {showJoin && <JoinCourseModal onClose={() => setShowJoin(false)} onJoined={fetchEnrollments} />}
    </div>
  );
}
