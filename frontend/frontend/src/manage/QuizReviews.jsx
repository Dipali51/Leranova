import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function QuizReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const apiBase = '/api';

  const showMessage = (msg) => {
    setSystemMessage(msg);
    setTimeout(() => setSystemMessage(null), 3000);
  };

  const authHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [authHeader]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/reviews?targetType=quiz`, { headers: authHeader() });
      console.log('[QuizReviews] fetchReviews response:', res?.data);
      const payload = res && res.data;
      if (Array.isArray(payload)) setReviews(payload);
      else if (payload && Array.isArray(payload.reviews)) setReviews(payload.reviews);
      else if (payload && Array.isArray(payload.data)) setReviews(payload.data);
      else setReviews([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  async function delConfirmed() {
    if (!deleteId) return;
    setShowConfirmModal(false);
    try {
      await axios.delete(`${apiBase}/reviews/${deleteId}`, { headers: authHeader() });
      setReviews((r) => r.filter((x) => x._id !== deleteId));
      showMessage('Review deleted.');
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      showMessage('Failed to delete review.');
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-16">
        <h2 className="text-2xl font-semibold mb-4">Quiz Reviews</h2>
        {systemMessage && (
          <div className="mb-4 text-sm text-green-600">{systemMessage}</div>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.length === 0 && <div>No reviews found.</div>}
            {reviews.map((r) => (
              <div key={r._id} className="p-4 border rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{r.userName || r.user || 'Unknown'}</div>
                    <div className="text-sm text-gray-600">{r.comment}</div>
                  </div>
                  <div>
                    <button className="text-red-500" onClick={() => handleDeleteClick(r._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded">
              <div className="mb-4">Are you sure you want to delete this review?</div>
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-red-500 text-white" onClick={delConfirmed}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
