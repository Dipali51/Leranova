import React, { useState } from "react";
import CourseSidebar from "../../layout/CourseSidebar";
import CourseTopbar from "../../layout/CourseTopbar";
import AddManuallyModal from "../../components/AddManuallyModal";
import { useParams } from "react-router-dom";

export default function AddCourseContent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex p-18">
      <CourseSidebar />
      <div className="flex-1 bg-gray-50">
        <CourseTopbar courseTitle="" />

        <div className="flex-1 p-18">
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded">
            <div>
              <p><strong>Add first chapter manually</strong></p>
              <p className="text-sm">
                Use <strong>Headings</strong> for Chapter and{" "}
                <strong>Chapter Item</strong> for content.
              </p>
            </div>
            <button
              className="border px-4 py-2 rounded"
              onClick={() => setShowModal(true)}
            >
              Add manually
            </button>
          </div>

          <button className="fixed bottom-0 left-0 bg-blue-900 text-white w-full py-3">
            ➕ Add new chapter
          </button>
        </div>
      </div>

      {showModal && <AddManuallyModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
