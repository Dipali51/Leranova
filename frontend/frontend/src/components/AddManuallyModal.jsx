import React, { useState } from "react";
import { useParams } from "react-router-dom"; // ✅ for extracting courseId from URL
import PdfUploadModal from "./PdfUploadModal";

export default function AddManuallyModal({ onClose }) {
  const { courseId } = useParams();
console.log("✅ Got courseId from URL:", courseId); // ✅ get courseId from URL like /course-content/:id
  const [selectedUploadType, setSelectedUploadType] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-xl font-bold"
        >
          ✖
        </button>

        <div className="grid grid-cols-3 gap-8 p-6">
          {/* Upload new item */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload new item</h2>
            <ul className="space-y-2">
              <li>
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    onChange={() => setSelectedUploadType("pdf")}
                  />{" "}
                  <strong>PDF:</strong> Add a PDF file in the course.
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    onChange={() => setSelectedUploadType("video")}
                  />{" "}
                  <strong>Video:</strong> Upload or embed videos securely.
                </label>
              </li>
              <li><input type="radio" name="uploadType" /> <strong>Audio</strong></li>
              <li><input type="radio" name="uploadType" /> <strong>SCORM:</strong> Import SCORM packages</li>
              <li><input type="radio" name="uploadType" /> <strong>File:</strong> Add any file type</li>
            </ul>
          </div>

          {/* Create new item */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Create new item</h2>
            <ul className="space-y-2">
              <li><input type="radio" name="createType" /> <strong>Heading:</strong> Define chapter or section headings</li>
              <li><input type="radio" name="createType" /> <strong>Text:</strong> Add custom HTML or iFrame</li>
              <li><input type="radio" name="createType" /> <strong>Link:</strong> Embed a link in iFrame</li>
              <li><input type="radio" name="createType" /> <strong>Quiz:</strong> Learners can attempt any time</li>
              <li><input type="radio" name="createType" /> <strong>Live test:</strong> Time-bound test</li>
              <li><input type="radio" name="createType" /> <strong>Live class:</strong> Webinars or sessions</li>
              <li><input type="radio" name="createType" /> <strong>Assignment:</strong> Collect learner assignments</li>
              <li><input type="radio" name="createType" /> <strong>Coding test:</strong> Run code-based tests</li>
              <li><input type="radio" name="createType" /> <strong>Form:</strong> Collect information from learners</li>
            </ul>
          </div>

          {/* Import */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 mb-2">OR</p>
            <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50">
              📁 Import from Asset Library
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Show PDF upload modal and pass courseId */}
      {selectedUploadType === "pdf" && (
        <PdfUploadModal
          courseId={courseId}
          onClose={() => setSelectedUploadType("")}
        />
      )}
    </div>
  );
}
