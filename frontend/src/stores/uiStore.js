import { create } from 'zustand';

export const useUIStore = create((set) => ({
  loading: false,
  loadingMessage: '',
  sidebarOpen: false,
  modals: {},
  
  setLoading: (loading, message = '') => {
    set({ loading, loadingMessage: message });
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
  
  openModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
    }));
  },
  
  closeModal: (modalName) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
    }));
  },
  
  isModalOpen: (modalName) => {
    return useUIStore.getState().modals[modalName] || false;
  },
}));

