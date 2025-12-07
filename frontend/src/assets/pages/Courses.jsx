import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../layout/Sidebar';
import { Link, useNavigate } from "react-router-dom";
import { FaInfoCircle, FaWrench, FaPen, FaUsers, FaCommentDots, FaLink, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { useAuthStore } from '../../stores/authStore';
import { useCourseStore } from '../../stores/courseStore';
import { useApi } from '../../hooks/useApi';
import { showToast } from '../../components/Toast';
import { TOAST_TYPES } from '../../utils/constants';
import { API_ENDPOINTS } from '../../utils/constants';
import CourseCardSkeleton from '../../components/CourseCardSkeleton';
import { debounce } from '../../utils/debounce';

export default function Courses() {
  const role = useAuthStore((state) => state.role);
  const { courses, setCourses, searchQuery, setSearchQuery, filters, setFilters, getFilteredCourses } = useCourseStore();
  const [studentsModal, setStudentsModal] = useState({ open: false, courseTitle: '', students: [], count: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { get, loading } = useApi();

  const fetchCourses = useCallback(async () => {
    try {
      const data = await get(API_ENDPOINTS.COURSES, { showErrorToast: false });
      setCourses(data || []);
    } catch (err) {
      if (err.response?.status !== 401) {
        showToast(TOAST_TYPES.ERROR, 'Failed to load courses. Please try again.');
      }
    }
  }, [get, setCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    [setSearchQuery]
  );

  const handleViewStudents = async (courseId, courseTitle) => {
    try {
      const data = await get(API_ENDPOINTS.COURSE_ENROLLMENTS(courseId), { showErrorToast: false });
      setStudentsModal({
        open: true,
        courseTitle,
        students: data.students || [],
        count: data.count || 0,
      });
    } catch (err) {
      showToast(TOAST_TYPES.ERROR, 'Failed to load enrollments');
    }
  };

  const handleCopyLink = (courseId) => {
    const link = `${window.location.origin}/courses/enroll/${courseId}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        showToast(TOAST_TYPES.SUCCESS, 'Enrollment link copied to clipboard!');
      }).catch(() => {
        showToast(TOAST_TYPES.ERROR, 'Failed to copy link');
      });
    } else {
      showToast(TOAST_TYPES.INFO, `Link: ${link}`);
    }
  };

  const filteredCourses = getFilteredCourses();

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-violet-50 min-h-screen">
        {/* Topbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              My Courses
            </h2>
            <p className="text-gray-600 mt-1">{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}</p>
          </div>
          {role === "teacher" && (
            <Link to="/courses/create">
              <button className="btn-primary flex items-center gap-2">
                <span className="text-xl">+</span>
                Create Course
              </button>
            </Link>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title or description..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchQuery}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border-2 border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all flex items-center gap-2 font-medium"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pricing Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Plan</label>
                <select
                  value={filters.pricingPlan}
                  onChange={(e) => setFilters({ pricingPlan: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="one-time">Paid</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ sortBy: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="date">Date Created</option>
                  <option value="title">Title</option>
                  <option value="price">Price</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({ sortOrder: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || filters.pricingPlan !== 'all' || filters.sortBy !== 'date') && (
                <div className="md:col-span-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ pricingPlan: 'all', sortBy: 'date', sortOrder: 'desc' });
                      const input = document.querySelector('input[type="text"]');
                      if (input) input.value = '';
                    }}
                    className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-2"
                  >
                    <FaTimes />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Course Cards */}
        {loading ? (
          <CourseCardSkeleton count={8} />
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filters.pricingPlan !== 'all'
                ? 'Try adjusting your search or filters'
                : role === 'teacher'
                ? 'Create your first course to get started!'
                : 'No courses available at the moment.'}
            </p>
            {role === 'teacher' && !searchQuery && (
              <Link to="/courses/create">
                <button className="btn-primary">Create Your First Course</button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="card-modern group cursor-pointer"
                onClick={() => role === 'teacher' && navigate(`/courses/edit/${course._id}`)}
              >
                {/* Cover */}
                <div className="h-48 bg-gradient-to-br from-violet-200 to-fuchsia-200 relative overflow-hidden">
                  {course.coverImage ? (
                    <img
                      src={`http://localhost:3001${course.coverImage}`}
                      alt={course.title}
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📖</div>
                        <div className="text-sm">No Cover</div>
                      </div>
                    </div>
                  )}
                  {course.pricingPlan === 'one-time' && (
                    <div className="absolute top-2 right-2 bg-violet-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      ₹{course.discountedPrice || course.totalPrice}
                    </div>
                  )}
                  {course.pricingPlan === 'free' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      FREE
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{course.pricingPlan}</span>
                    <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Icon Bar - Only for teachers */}
                {role === "teacher" && (
                  <div className="border-t border-gray-100 flex justify-around items-center px-4 py-3 bg-gray-50">
                    <FaInfoCircle
                      className="text-gray-500 hover:text-violet-600 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(TOAST_TYPES.INFO, `${course.title}\n${course.description}\nCreated: ${new Date(course.createdAt).toLocaleDateString()}`);
                      }}
                      title="Course Information"
                    />
                    <FaWrench
                      className="text-gray-500 hover:text-violet-600 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/courses/edit/${course._id}`);
                      }}
                      title="Edit Course"
                    />
                    <FaPen
                      className="text-gray-500 hover:text-violet-600 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course-content/${course._id}`);
                      }}
                      title="Edit Content"
                    />
                    <FaUsers
                      className="text-gray-500 hover:text-violet-600 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewStudents(course._id, course.title);
                      }}
                      title="View Students"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(course._id);
                      }}
                      className="text-gray-500 hover:text-violet-600 transition"
                      title="Copy enroll link"
                    >
                      <FaLink />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Students Modal */}
        {studentsModal.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Students enrolled in {studentsModal.courseTitle}</h3>
                <button
                  onClick={() => setStudentsModal({ open: false, courseTitle: '', students: [], count: 0 })}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-6 border-b bg-violet-50">
                <p className="text-sm font-semibold text-violet-700">Total students: {studentsModal.count}</p>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {studentsModal.students.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">👥</div>
                    <p>No students enrolled yet</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {studentsModal.students.map((s, i) => (
                      <li key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div>
                          <div className="font-medium text-gray-900">{s.username || s.name || s.email}</div>
                          <div className="text-xs text-gray-500">{s.email}</div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">{s._id.slice(-6)}</div>
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
