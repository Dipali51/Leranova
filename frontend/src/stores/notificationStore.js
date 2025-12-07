import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      type: notification.type || 'info', // For toast notifications
      message: notification.message || notification.text || '',
      read: false,
      timestamp: new Date(),
      duration: notification.duration || (notification.type ? 5000 : undefined), // Auto-dismiss toasts
      ...notification,
    };
    
    set((state) => {
      const isToast = !!newNotification.type; // If it has a type, it's a toast
      const updatedNotifications = [newNotification, ...state.notifications].slice(0, 50);
      
      return {
        notifications: updatedNotifications,
        unreadCount: isToast ? state.unreadCount : state.unreadCount + 1, // Don't count toasts as unread
      };
    });
  },
  
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
  
  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    });
  },
  
  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));

