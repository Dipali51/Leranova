import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JoinCourseModal from "../../components/JoinCourseModal";
import { useApi } from "../../hooks/useApi";
import { useAuthStore } from "../../stores/authStore";
import { API_ENDPOINTS } from "../../utils/constants";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CardSkeleton } from "../../components/SkeletonLoader";

export default function CoursePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const { get } = useApi();
  const { token, role, user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const courseData = await get(API_ENDPOINTS.COURSE(id), { showErrorToast: false });
        setCourse(courseData);

        // determine if user is enrolled or owner
        let enrolled = false;
        if (token) {
          // Check if user is the course creator (teacher)
          if (role === "teacher" && courseData?.createdBy) {
            // We'd need to compare with current user ID - for now, check enrollments
            try {
              const enrollments = await get(API_ENDPOINTS.MY_ENROLLMENTS, { showErrorToast: false });
              const arr = enrollments || [];
              if (arr.find((e) => e.course?._id === id)) {
                enrolled = true;
              }
            } catch {
              // ignore
            }
          } else if (role === "student") {
            try {
              const enrollments = await get(API_ENDPOINTS.MY_ENROLLMENTS, { showErrorToast: false });
              const arr = enrollments || [];
              if (arr.find((e) => e.course?._id === id)) {
                enrolled = true;
              }
            } catch {
              // ignore
            }
          }
        }

        setIsEnrolled(enrolled);
      } catch (err) {
        // Error handled by useApi
      }
      setLoading(false);
    };
    load();
  }, [id, token, role, get]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 p-6">
        <CardSkeleton className="max-w-6xl mx-auto" />
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/courses')} className="btn-primary">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const cover = course.coverImage
    ? course.coverImage.startsWith('/')
      ? `http://localhost:3001${course.coverImage}`
      : course.coverImage
    : null;

  const descriptionPreview = course.description?.substring(0, 200);
  const showExpandButton = course.description && course.description.length > 200;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50">
      {/* Hero */}
      <div className="w-full h-80 md:h-96 relative overflow-hidden">
        {cover ? (
          <img src={cover} alt={course.title} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-200 to-fuchsia-200">
            <div className="text-center">
              <div className="text-6xl mb-2">📖</div>
              <div className="text-gray-600">No cover image</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">{course.title}</h1>
          {course.instructor && (
            <p className="text-lg text-violet-200">By {course.instructor}</p>
          )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto -mt-16 px-6 pb-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">About This Course</h2>
                <div className="text-gray-700 leading-relaxed">
                  {descriptionExpanded || !showExpandButton ? (
                    <p>{course.description}</p>
                  ) : (
                    <p>
                      {descriptionPreview}...
                      <button
                        onClick={() => setDescriptionExpanded(true)}
                        className="text-violet-600 hover:text-violet-700 font-medium ml-1"
                      >
                        Read more
                      </button>
                    </p>
                  )}
                  {descriptionExpanded && showExpandButton && (
                    <button
                      onClick={() => setDescriptionExpanded(false)}
                      className="text-violet-600 hover:text-violet-700 font-medium mt-2"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>

              {/* Course Content */}
              {(course.pdfs?.length > 0 || course.chapters?.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Course Content</h3>
                  {course.chapters && course.chapters.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {course.chapters.map((chapter, idx) => (
                        <div key={idx} className="p-4 border-2 border-gray-200 rounded-lg hover:border-violet-300 transition">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">
                                Chapter {idx + 1}: {chapter.title || `Chapter ${idx + 1}`}
                              </div>
                              {chapter.description && (
                                <div className="text-sm text-gray-600 mt-1">{chapter.description}</div>
                              )}
                            </div>
                            {isEnrolled && (
                              <span className="text-sm text-violet-600 font-medium">✓ Available</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {course.pdfs && course.pdfs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700 mb-2">Course Materials</h4>
                      {course.pdfs.map((p, idx) => {
                        const url = p.url && p.url.startsWith('/') ? `http://localhost:3001${p.url}` : p.url;
                        return (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 transition">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">📄</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{p.title || `PDF ${idx + 1}`}</div>
                                <div className="text-xs text-gray-500">PDF Document</div>
                              </div>
                            </div>
                            {isEnrolled && (
                              <div className="flex items-center gap-2">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition text-sm font-medium"
                                >
                                  View
                                </a>
                                <a
                                  href={url}
                                  download
                                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                                >
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                {!isEnrolled ? (
                  <>
                    <button
                      onClick={() => setShowJoin(true)}
                      className="btn-primary px-8 py-3 text-lg"
                    >
                      {course.pricingPlan === 'free' ? 'Enroll for Free' : `Enroll Now - ₹${course.discountedPrice || course.totalPrice}`}
                    </button>
                    <button
                      onClick={() => navigate(-1)}
                      className="btn-secondary px-6 py-3"
                    >
                      ← Back
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/course-content/${id}`)}
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    Continue Learning →
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 space-y-4">
              <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 border-2 border-violet-200">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Instructor</div>
                  <div className="font-bold text-lg text-gray-900">{course.instructor || 'Instructor'}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Pricing</div>
                  <div className="font-bold text-xl text-violet-600">
                    {course.pricingPlan === 'free' ? (
                      'FREE'
                    ) : (
                      <>
                        ₹{course.discountedPrice || course.totalPrice}
                        {course.totalPrice && course.discountedPrice && course.totalPrice !== course.discountedPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">₹{course.totalPrice}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Created</div>
                  <div className="text-gray-900">{new Date(course.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {course.chapters && course.chapters.length > 0 && (
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Course Structure</div>
                  <div className="font-bold text-2xl text-gray-900">{course.chapters.length}</div>
                  <div className="text-sm text-gray-600">Chapters</div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      {showJoin && <JoinCourseModal onClose={() => setShowJoin(false)} />}
    </div>
  );
}
