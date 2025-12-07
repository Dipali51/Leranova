import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { TOAST_TYPES } from '../utils/constants';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../layout/Sidebar';

export default function Profile() {
  const { user, name, role, token } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const { put } = useApi();

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Add API endpoint for updating profile
      // await put('/profile', formData);
      showToast(TOAST_TYPES.SUCCESS, 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      showToast(TOAST_TYPES.ERROR, 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-violet-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-8">
            My Profile
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{name || 'User'}</h2>
              <p className="text-gray-600 capitalize">{role || 'Student'}</p>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <FormInput
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />

              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />

              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : null}
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ username: name || '', email: user?.email || '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="btn-primary">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Course History Section */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Course History</h3>
            <p className="text-gray-600">Your enrolled courses and learning progress will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

