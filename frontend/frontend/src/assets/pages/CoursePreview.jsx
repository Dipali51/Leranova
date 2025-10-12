import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import JoinCourseModal from "../../components/JoinCourseModal";

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function CoursePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const courseRes = await axios.get(`http://localhost:3001/api/course/${id}`);
        setCourse(courseRes.data);

        // determine if user is enrolled or owner
        let enrolled = false;
        if (token) {
          const me = parseJwt(token);
          const myId = me?.id;
          const role = me?.role;

          if (role === "teacher" && myId && courseRes.data?.createdBy === myId) {
            enrolled = true; // owner can view
          } else if (myId) {
            try {
              const res = await axios.get("http://localhost:3001/api/my-enrollments", { headers: { Authorization: `Bearer ${token}` } });
              const arr = res.data || [];
              if (arr.find((e) => (e.course && e.course._id === id) || (e.course && e.course._id === id))) enrolled = true;
            } catch {
              // ignore
            }
          }
        }

        setIsEnrolled(enrolled);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6">Course not found.</div>;

  const cover = course.coverImage ? (course.coverImage.startsWith('/') ? `http://localhost:3001${course.coverImage}` : course.coverImage) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="w-full h-64 bg-gray-200">
        {cover ? (
          <img src={cover} alt="cover" className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No cover image</div>
        )}
      </div>

      <main className="max-w-6xl mx-auto -mt-12 px-6 pb-12">
        <div className="bg-white rounded-lg shadow p-16">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Course Files</h3>
                {course.pdfs && course.pdfs.length > 0 ? (
                  <div className="space-y-3">
                    {course.pdfs.map((p, idx) => {
                      const url = p.url && p.url.startsWith('/') ? `http://localhost:3001${p.url}` : p.url;
                      return (
                        <div key={idx} className="p-3 border rounded flex justify-between items-center">
                          <div>
                            <div className="font-medium">{p.title || `PDF ${idx + 1}`}</div>
                            <div className="text-xs text-gray-500">{p.url}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={url} target="_blank" rel="noreferrer" className="text-blue-600">Open</a>
                            <a href={url} download className="text-gray-600">Download</a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No course files available.</div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isEnrolled ? (
                  <>
                    <button onClick={() => setShowJoin(true)} className="px-4 py-2 bg-green-600 text-white rounded">Join Course</button>
                    <button onClick={() => navigate('/home')} className="px-4 py-2 border rounded">Back</button>
                  </>
                ) : (
                  <button onClick={() => navigate('/course-content/' + id)} className="px-4 py-2 bg-indigo-600 text-white rounded">Start Course</button>
                )}
              </div>
            </div>

            <aside className="w-full lg:w-80">
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500 mb-2">Instructor</div>
                <div className="font-medium">{course.instructor || 'Instructor name'}</div>
                <div className="mt-4 text-sm text-gray-500">Added: {new Date(course.createdAt).toLocaleDateString()}</div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {showJoin && <JoinCourseModal onClose={() => setShowJoin(false)} />}
    </div>
  );
}
