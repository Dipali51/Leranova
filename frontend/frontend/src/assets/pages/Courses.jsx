import React, { useEffect, useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import { Link, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import axios from 'axios';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); // ✅ initialize navigate

  useEffect(() => {
    axios.get("http://localhost:3001/api/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error fetching courses", err));
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-18 bg-gray-50 min-h-screen">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Courses ({courses.length})</h2>
          <Link to="/courses/create">
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              + Create Course
            </button>
          </Link>
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
              onClick={() => navigate(`/courses/edit/${course._id}`)} // ✅ go to edit page
              className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
            >
              <div className="h-40 bg-gray-200">
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
              <div className="p-4">
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                <div className="text-sm mt-2 font-medium">
                  Plan: {course.pricingPlan}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
