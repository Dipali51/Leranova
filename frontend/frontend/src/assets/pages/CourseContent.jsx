import React, { useEffect, useState, useCallback } from "react";
import CourseSidebar from "../../layout/CourseSidebar";
import AddManuallyModal from "../../components/AddManuallyModal";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CourseContent() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingChapterIndex, setEditingChapterIndex] = useState(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    try {
      const res = await axios.get(`http://localhost:3001/api/course/${courseId}`);
      setCourse(res.data);
    } catch (err) {
      console.warn('Failed to fetch course', err);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const chapters = course?.chapters || [];

  // determine role from localStorage to control edit UI
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let isTeacher = false;
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isTeacher = payload?.role === 'teacher';
    }
  } catch (e) {
    console.warn('Error parsing token', e);
  }

  return (
    <div className="flex">
  <CourseSidebar onSelect={(i) => setActiveChapter(i)} onAddChapter={() => { setEditingChapterIndex(null); setShowUpload(true); }} />

      <div className="flex-1 min-h-screen bg-gray-50">

        <div className="max-w-5xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{course?.title || 'Course Content'}</h2>
            <div>
                  {isTeacher && (
                <>
                  <button onClick={() => { setEditingChapterIndex(activeChapter); setShowUpload(true); }} className="border px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={async () => { try { const token = localStorage.getItem('token'); await axios.post(`http://localhost:3001/api/course/${courseId}/publish`, {}, { headers: { Authorization: token ? token : '' } }); fetchCourse(); alert('Course published'); } catch (e) { console.error(e); alert('Publish failed'); } }} className="border px-3 py-1 rounded">Publish</button>
                </>
              )}
            </div>
          </div>

          {chapters.length === 0 ? (
            <div className="p-8 border rounded text-center text-gray-500">No chapters uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="space-y-2">
                  {chapters.map((ch, idx) => (
                    <div key={idx} className={`p-3 rounded border ${idx === activeChapter ? 'bg-indigo-50 border-indigo-200' : ''} cursor-pointer`} onClick={() => setActiveChapter(idx)}>
                      <div className="font-medium">Chapter {idx + 1}: {ch.title || `Chapter ${idx + 1}`}</div>
                      <div className="text-xs text-gray-500">{ch.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-3">{chapters[activeChapter]?.title || `Chapter ${activeChapter + 1}`}</h3>
                  <div className="mb-4 text-sm text-gray-600">{chapters[activeChapter]?.description || 'Chapter content and files'}</div>

                  {/* Render video viewer if exists */}
                  {chapters[activeChapter]?.videoUrl ? (
                    <video controls src={`http://localhost:3001${chapters[activeChapter].videoUrl}`} className="w-full h-[70vh] bg-black" />
                  ) : (
                    <div className="p-12 text-center text-gray-500">No video to display</div>
                  )}

                  {/* List assignments and notes */}
                  <div className="mt-4">
                    {chapters[activeChapter]?.assignments?.length > 0 && (
                      <div className="mb-2">
                        <div className="font-medium">Assignments</div>
                        <ul className="list-disc ml-6">
                          {chapters[activeChapter].assignments.map((a, i) => (
                            <li key={i}><a href={`http://localhost:3001${a.url}`} target="_blank" rel="noreferrer" className="text-indigo-600">{a.title}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {chapters[activeChapter]?.notes?.length > 0 && (
                      <div>
                        <div className="font-medium">Notes</div>
                        <ul className="list-disc ml-6">
                          {chapters[activeChapter].notes.map((n, i) => (
                            <li key={i}><a href={`http://localhost:3001${n.url}`} target="_blank" rel="noreferrer" className="text-indigo-600">{n.title}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    {chapters[activeChapter]?.videoUrl && <a href={`http://localhost:3001${chapters[activeChapter].videoUrl}`} className="px-3 py-2 bg-indigo-600 text-white rounded">Open in new tab</a>}
                    {chapters[activeChapter]?.videoUrl && <a href={`http://localhost:3001${chapters[activeChapter].videoUrl}`} download className="px-3 py-2 border rounded">Download</a>}
                    {isTeacher && (
                      <button onClick={() => setShowUpload(true)} className="px-3 py-2 border rounded">Add / Edit chapter</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && <AddManuallyModal onClose={() => setShowModal(false)} />}

      {showUpload && isTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Upload Chapter</h3>
            <UploadChapterForm courseId={courseId} chapter={editingChapterIndex !== null ? chapters[editingChapterIndex] : undefined} chapterId={editingChapterIndex !== null ? chapters[editingChapterIndex]?._id : undefined} onClose={() => { setShowUpload(false); setEditingChapterIndex(null); fetchCourse(); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function UploadChapterForm({ courseId, onClose, chapter, chapterId }) {
  const [title, setTitle] = React.useState(chapter?.title || '');
  const [description, setDescription] = React.useState(chapter?.description || '');
  const [videoFile, setVideoFile] = React.useState(null);
  const [assignmentFile, setAssignmentFile] = React.useState(null);
  const [notesFile, setNotesFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const editing = Boolean(chapterId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    if (videoFile) form.append('video', videoFile);
    if (assignmentFile) form.append('assignment', assignmentFile);
    if (notesFile) form.append('notes', notesFile);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (editing) {
        await axios.put(`http://localhost:3001/api/course/${courseId}/chapter/${chapterId}`, form, { headers: { 'Content-Type': 'multipart/form-data', Authorization: token ? token : '' } });
      } else {
        await axios.post(`http://localhost:3001/api/course/${courseId}/upload-chapter`, form, { headers: { 'Content-Type': 'multipart/form-data', Authorization: token ? token : '' } });
      }
      onClose && onClose();
    } catch (err) {
      console.error('Upload chapter failed', err);
      alert('Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm">Video (mp4/mov)</label>
        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
      </div>
      <div>
        <label className="block text-sm">Assignment (pdf)</label>
        <input type="file" accept="application/pdf" onChange={(e) => setAssignmentFile(e.target.files[0])} />
      </div>
      <div>
        <label className="block text-sm">Notes (pdf)</label>
        <input type="file" accept="application/pdf" onChange={(e) => setNotesFile(e.target.files[0])} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Uploading...' : 'Upload'}</button>
      </div>
    </form>
  );
}
