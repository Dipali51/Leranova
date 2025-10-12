import React, { useEffect, useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaInfoCircle, FaWrench, FaPen, FaUsers, FaCommentDots, FaLink } from "react-icons/fa";

export default function Courses() {
  // ✅ define role state properly
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get role from localStorage (or API later)
    const userRole = localStorage.getItem("role"); // e.g., "teacher" or "student"
    setRole(userRole);
  }, []);


  const [courses, setCourses] = useState([]);
  const [studentsModal, setStudentsModal] = useState({ open: false, courseTitle: '', students: [], count: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ get token

        const res = await axios.get("http://localhost:3001/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
          },
        });

        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
        if (err.response && err.response.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        }
      }
    };

    fetchCourses();
  }, [navigate]);


  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-18 bg-gray-50 min-h-screen">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Courses ({courses.length})</h2>
          {role === "teacher" && (
            <Link to="/courses/create">
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                + Create Course
              </button>
            </Link>
          )}
        </div>

        {/* Filter and Search */}
        <div className="flex justify-between items-center mb-4">
          <button className="border px-4 py-2 rounded">Add Filters</button>
          <input
            type="text"
            placeholder="Search by Course Title"
            className="border p-2 rounded w-1/2"
          />
          <div className="flex space-x-2">
            <button className="border p-2 rounded">List</button>
            <button className="bg-purple-600 text-white p-2 rounded">Grid</button>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {/* Cover */}
              <div className="h-40 bg-gray-200 cursor-pointer" onClick={() => navigate(`/courses/edit/${course._id}`)} >
                {course.coverImage ? (
                  <img
                    src={`http://localhost:3001${course.coverImage}`}
                    alt="Cover"
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">
                    No Cover
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                <div className="text-sm mt-2 font-medium">
                  Plan: {course.pricingPlan}
                </div>
              </div>

              {/* Icon Bar */}
              <div className="border-t flex justify-between items-center px-4 py-2 text-xl">
                <FaInfoCircle
                  className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                  onClick={() => alert(`Course Info:\nTitle: ${course.title}\nDescription: ${course.description}\nPricing: ${course.pricingPlan}\nCreated: ${new Date(course.createdAt).toLocaleDateString()}`)}
                  title="Course Information"
                />
                <FaWrench
                  className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                  onClick={() => navigate(`/courses/edit/${course._id}`)}
                  title="Edit Course"
                />
                <FaPen
                  className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                  onClick={() => navigate(`/course-content/${course._id}`)}
                  title="Edit Content"
                />
                <FaUsers
                  className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const res = await axios.get(`http://localhost:3001/api/course/${course._id}/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
                      setStudentsModal({ open: true, courseTitle: course.title, students: res.data.students || [], count: res.data.count || 0 });
                    } catch (err) {
                      console.error('Failed to fetch enrollments', err);
                      alert('Failed to load enrollments');
                    }
                  }}
                  title="View Students"
                />
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/courses/enroll/${course._id}`;
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(link).then(() => {
                        alert('Enrollment link copied to clipboard:\n' + link);
                      }).catch(() => {
                        prompt('Copy this link:', link);
                      });
                    } else {
                      prompt('Copy this link:', link);
                    }
                  }}
                  className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                  title="Copy enroll link"
                >
                  <FaLink />
                </button>
                <FaCommentDots
                  className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                  onClick={() => alert(`Course Feedback:\nCourse: ${course.title}\nRating: ${course.rating || 'No ratings yet'}\nReviews: ${course.reviewCount || 0} reviews\nComments: ${course.commentCount || 0} comments`)}
                  title="View Comments & Reviews"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Students Modal */}
        {studentsModal.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Students enrolled in {studentsModal.courseTitle}</h3>
                <button onClick={() => setStudentsModal({ open: false, courseTitle: '', students: [], count: 0 })}>✖</button>
              </div>
              <div className="mb-4 text-sm text-gray-600">Total students: {studentsModal.count}</div>
              <div className="max-h-64 overflow-auto">
                {studentsModal.students.length === 0 ? (
                  <div className="text-gray-500">No students found</div>
                ) : (
                  <ul className="space-y-2">
                    {studentsModal.students.map((s, i) => (
                      <li key={i} className="flex items-center justify-between border p-2 rounded">
                        <div>
                          <div className="font-medium">{s.username || s.name || s.email}</div>
                          <div className="text-xs text-gray-500">{s.email}</div>
                        </div>
                        <div className="text-xs text-gray-400">ID: {s._id}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
