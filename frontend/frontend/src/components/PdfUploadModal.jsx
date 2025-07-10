import React, { useState } from "react";
import axios from "axios";

export default function PdfUploadModal({ onClose, courseId }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadResult, setUploadResult] = useState("");

  const handleUpload = async () => {
    if (!pdfFile) return alert("Please select a PDF file first.");
    if (!courseId) return alert("Course ID is missing!");

    const formData = new FormData();
    formData.append("pdf", pdfFile); // ⬅️ Append the PDF only

    try {
      const res = await axios.post(
        `http://localhost:3001/api/course/${courseId}/upload-pdf`, // ✅ Use correct route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedPdf =
        res.data?.updatedCourse?.pdfs?.[res.data.updatedCourse.pdfs.length - 1];

      if (uploadedPdf && uploadedPdf.url) {
        setUploadResult(uploadedPdf.url);
        alert("✅ PDF uploaded and linked to course!");
      } else {
        console.error("❌ No valid PDF returned:", res.data);
        alert("Upload succeeded but no PDF data found.");
      }
    } catch (err) {
      console.error("❌ Upload failed", err);
      alert("Upload failed. Please try again.");
    }
  };

  const clearSelection = () => {
    setPdfFile(null);
    setUploadResult("");
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-xl font-bold"
        >
          ✖
        </button>

        <h2 className="text-lg font-bold mb-2">
          Upload PDF <span className="text-sm text-gray-500">(Max size: 250MB)</span>
        </h2>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="file"
            accept="application/pdf"
            className="border px-3 py-2 w-full"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={clearSelection}>
            Clear
          </button>
          <button className="px-4 py-2 bg-blue-900 text-white rounded" onClick={handleUpload}>
            Upload
          </button>
        </div>

        {uploadResult && (
          <p className="text-green-600 mt-4 text-sm text-center">
            PDF uploaded:&nbsp;
            <a
              href={`http://localhost:3001${uploadResult}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              View PDF
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
