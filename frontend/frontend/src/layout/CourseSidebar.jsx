import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CourseSidebar() {
  const { courseId } = useParams();
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/course/${courseId}`);
        const courseData = res.data;

        if (Array.isArray(courseData.pdfs)) {
          setPdfs(courseData.pdfs);
        } else {
          console.warn("⚠️ `pdfs` is not an array:", courseData.pdfs);
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
          {pdfs.length > 0 ? (
            pdfs.map((pdf, index) => (
              <div
                key={index}
                className="border p-2 rounded text-sm hover:bg-blue-100 cursor-pointer"
                onClick={() => window.open(`http://localhost:3001${pdf.url}`, "_blank")}
              >
                📘 Chapter {index + 1}: {pdf.title || "Untitled PDF"}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 italic">No chapters added yet</div>
          )}
        </div>
      </div>

      <div className="bg-blue-900 text-white py-3 text-center rounded cursor-pointer mt-6">
        ➕ Add new chapter
      </div>
    </div>
  );
}
