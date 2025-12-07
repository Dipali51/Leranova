import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from './Toast';
import { TOAST_TYPES } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

export default function RatingModal({ courseId, courseTitle, onClose, onRated }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { post, loading } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast(TOAST_TYPES.ERROR, 'Please select a rating');
      return;
    }

    try {
      // TODO: Add API endpoint for ratings
      // await post(`/courses/${courseId}/rate`, { rating, review });
      showToast(TOAST_TYPES.SUCCESS, 'Thank you for your rating!');
      if (onRated) onRated();
      onClose();
    } catch (error) {
      showToast(TOAST_TYPES.ERROR, 'Failed to submit rating');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate This Course</h3>
        <p className="text-gray-600 mb-6">{courseTitle}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {star <= (hoveredRating || rating) ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-2 text-sm text-gray-600">
                {rating === 5 && 'Excellent!'}
                {rating === 4 && 'Very Good!'}
                {rating === 3 && 'Good'}
                {rating === 2 && 'Fair'}
                {rating === 1 && 'Poor'}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="Share your thoughts about this course..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : null}
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

