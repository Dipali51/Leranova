import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaCloudUploadAlt, FaCloud } from "react-icons/fa";
import UpgradeModal from "../components/UpgradeModal";

export default function CourseTopbar({ courseTitle = "Untitled Course" }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const handleSave = () => {
    // Just show the save alert modal instead of saving
    setShowSaveAlert(true);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        {/* Left: Back and Title */}
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="text-blue-600 text-xl">
            ←
          </button>
          <h2 className="text-lg font-medium">{courseTitle}</h2>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center space-x-2">
          <button className="flex items-center border px-3 py-1 rounded hover:bg-gray-100">
            <FaEye className="mr-1" /> Preview
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center border px-3 py-1 rounded hover:bg-gray-100"
          >
            <FaCloudUploadAlt className="mr-1" /> Publish course
          </button>
          <button
            onClick={handleSave}
            className="flex items-center bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            <FaCloud className="mr-1" /> Save course
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && <UpgradeModal onClose={() => setShowModal(false)} />}

      {/* Save Alert Modal */}
      {showSaveAlert && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Save Progress</h2>
            <p className="text-gray-600 mb-4">You have nothing to save.</p>
            <button
              onClick={() => setShowSaveAlert(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
