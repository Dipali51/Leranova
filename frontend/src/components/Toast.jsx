import React, { useEffect } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import { TOAST_TYPES } from '../utils/constants';

const Toast = ({ notification, onClose }) => {
  const { type = TOAST_TYPES.INFO, message, duration = 5000 } = notification;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColors = {
    [TOAST_TYPES.SUCCESS]: 'bg-green-500',
    [TOAST_TYPES.ERROR]: 'bg-red-500',
    [TOAST_TYPES.WARNING]: 'bg-yellow-500',
    [TOAST_TYPES.INFO]: 'bg-blue-500',
  };

  const icons = {
    [TOAST_TYPES.SUCCESS]: '✓',
    [TOAST_TYPES.ERROR]: '✕',
    [TOAST_TYPES.WARNING]: '⚠',
    [TOAST_TYPES.INFO]: 'ℹ',
  };

  return (
    <div
      className={`${bgColors[type] || bgColors[TOAST_TYPES.INFO]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in-right`}
      role="alert"
    >
      <span className="text-xl font-bold">{icons[type]}</span>
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 font-bold text-xl leading-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
      {notifications
        .filter((n) => n.type) // Only show toast notifications
        .slice(0, 5)
        .map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
    </div>
  );
};

// Helper function to show toast (can be called from anywhere)
export const showToast = (type, message, duration = 5000) => {
  if (typeof window !== 'undefined') {
    const { addNotification } = useNotificationStore.getState();
    addNotification({ type, message, duration });
  }
};

