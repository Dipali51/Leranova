import React from "react";
import { FaLock, FaCalendarAlt } from "react-icons/fa";

export default function UpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[800px] rounded-xl overflow-hidden shadow-lg flex">
        {/* Left section */}
        <div className="flex-1 p-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-bold mb-2">Upgrade to publish your course</h2>
          <p className="text-gray-600 text-sm">
            You're currently on a trial plan. To publish your digital product and unlock powerful features,
            you'll need to upgrade to a premium plan.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 border rounded">
              <FaCalendarAlt /> Book a Demo
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              <FaLock /> Upgrade Plan
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="bg-indigo-50 p-6 w-[50%] relative">
          <h3 className="text-indigo-600 font-semibold mb-4">Unlock all features</h3>
          <ul className="text-sm text-indigo-700 space-y-2 list-disc list-inside">
            <li>Build your own Android & iOS app</li>
            <li>Custom domain for your website</li>
            <li>Third party apps integration</li>
            <li>Link payment gateway</li>
            <li>Host 3 live sessions at the same time</li>
            <li>Remove branding</li>
            <li>Host and teach unlimited learners</li>
            <li>Unlimited live sessions</li>
            <li>Live chat and email support</li>
          </ul>
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-lg text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}
