import { create } from 'zustand';

// Helper to clean up values
const cleanValue = (value) => {
  if (!value || value === 'undefined' || value === 'null') return null;
  return value;
};

// Initialize from localStorage if available
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, role: null, name: null };
  }
  return {
    token: cleanValue(localStorage.getItem('token')),
    user: null,
    role: cleanValue(localStorage.getItem('role')),
    name: cleanValue(localStorage.getItem('name')),
  };
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),
  
  setAuth: (token, user, role, name) => {
    const cleanName = cleanValue(name);
    set({ token, user, role, name: cleanName });
    // Also update localStorage for backward compatibility
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('token', token);
      if (role) localStorage.setItem('role', role);
      if (cleanName) {
        localStorage.setItem('name', cleanName);
      } else {
        localStorage.removeItem('name');
      }
    }
  },
  
  logout: () => {
    set({ token: null, user: null, role: null, name: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
    }
  },
  
  isAuthenticated: () => {
    const state = useAuthStore.getState();
    return !!state.token;
  },
}));

