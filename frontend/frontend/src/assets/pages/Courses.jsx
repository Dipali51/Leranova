import React, { useEffect, useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaInfoCircle, FaWrench, FaPen, FaUsers, FaEye, FaCommentDots } from "react-icons/fa";

export default function Courses() {
  // ✅ define role state properly
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get role from localStorage (or API later)
    const userRole = localStorage.getItem("role"); // e.g., "teacher" or "student"
    setRole(userRole);
  }, []);


  const [courses, setCourses] = useState([]);
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
                <FaInfoCircle className="text-gray-600 cursor-pointer hover:text-purple-600 transition" />
                <FaWrench className="text-gray-600 cursor-pointer hover:text-purple-600 transition" />
                <FaPen className="text-gray-600 cursor-pointer hover:text-purple-600 transition" />
                <FaUsers className="text-gray-600 cursor-pointer hover:text-purple-600 transition" />
                <FaEye
                onClick={() => navigate(`/courses/preview/${course._id}`)}
                className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                />
                <FaCommentDots className="text-gray-600 cursor-pointer hover:text-purple-600 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
