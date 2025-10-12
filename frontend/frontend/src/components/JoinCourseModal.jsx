import React, { useState } from "react";
import axios from "axios";

export default function JoinCourseModal({ onClose, onJoined }) {
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        // expect link like http://localhost:5173/courses/enroll/<courseId> or just the id
        let courseId = link.trim();
        try {
            const maybe = courseId.match(/([a-f0-9]{24})$/i);
            if (maybe) courseId = maybe[1];
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.post(`http://localhost:3001/api/course/${courseId}/enroll`, {}, { headers: { Authorization: `Bearer ${token}` } });
            alert(res.data.message || "Enrolled");
            setLoading(false);
            if (onJoined) onJoined();
            onClose();
        } catch (err) {
            setLoading(false);
            console.error(err);
            alert(err.response?.data?.error || "Failed to enroll. Check the link and that you're logged in as a student.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-80">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Join Course by Link</h3>
                    <button onClick={onClose}>✖</button>
                </div>
                <p className="text-sm text-gray-600 mb-3">Paste the course link or course ID shared by the teacher.</p>
                <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full border p-2 rounded mb-3" placeholder="https://.../courses/enroll/<id> or <courseId>" />
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 px-4 py-2 border rounded">Cancel</button>
                    <button onClick={handleJoin} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Joining...' : 'Join'}</button>
                </div>
            </div>
        </div>
    );
}
