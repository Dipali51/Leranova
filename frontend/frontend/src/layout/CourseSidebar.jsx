import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CourseSidebar({ onSelect, onAddChapter }) {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/course/${courseId}`);
        const courseData = res.data;

        if (Array.isArray(courseData.chapters)) {
          setChapters(courseData.chapters);
        } else {
          console.warn("⚠️ `chapters` is not an array:", courseData.chapters);
        }
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  return (
    <div className="w-80 bg-gray-50 p-4 flex flex-col justify-between min-h-screen border-r">
      <div>
        <div className="text-lg font-medium mb-4">Course Content</div>

        <div className="border border-dashed rounded-lg p-8 text-center text-sm text-gray-500 mb-4 cursor-pointer">
          <div className="text-2xl mb-2">📄</div>
          Add course cover
        </div>

        <div className="flex space-x-2 mb-4">
          <button className="flex-1 border py-2 rounded text-sm">Set user preview</button>
          <button className="flex-1 border py-2 rounded text-sm">Set rules</button>
        </div>

        {/* 📚 Render chapters from PDFs */}
        <div className="space-y-2">
          {chapters.length > 0 ? (
            chapters.map((ch, index) => (
              <div
                key={index}
                className="border p-2 rounded text-sm hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  if (typeof onSelect === 'function') onSelect(index);
                  else window.open(ch.videoUrl ? `http://localhost:3001${ch.videoUrl}` : (ch.notes && ch.notes[0] ? `http://localhost:3001${ch.notes[0].url}` : '#'), "_blank");
                }}
              >
                🎬 Chapter {index + 1}: {ch.title || "Untitled Chapter"}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 italic">No chapters added yet</div>
          )}
        </div>
      </div>

      {(() => {
        // show add button only for teachers
        let isTeacher = false;
        try {
          const t = localStorage.getItem('token');
          if (t) {
            const payload = JSON.parse(atob(t.split('.')[1]));
            isTeacher = payload?.role === 'teacher';
          }
        } catch {
          // ignore
        }
        return isTeacher ? (
          <div onClick={() => { if (typeof onAddChapter === 'function') onAddChapter(); }} className="bg-blue-900 text-white py-3 text-center rounded cursor-pointer mt-6">
            ➕ Add new chapter
          </div>
        ) : null;
      })()}
    </div>
  );
}
