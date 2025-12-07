import { create } from 'zustand';

export const useCourseStore = create((set) => ({
  courses: [],
  searchQuery: '',
  filters: {
    pricingPlan: 'all', // 'all', 'free', 'one-time'
    sortBy: 'date', // 'date', 'title', 'price'
    sortOrder: 'desc', // 'asc', 'desc'
  },
  
  setCourses: (courses) => {
    set({ courses });
  },
  
  addCourse: (course) => {
    set((state) => ({
      courses: [course, ...state.courses],
    }));
  },
  
  updateCourse: (courseId, updates) => {
    set((state) => ({
      courses: state.courses.map((c) =>
        c._id === courseId ? { ...c, ...updates } : c
      ),
    }));
  },
  
  removeCourse: (courseId) => {
    set((state) => ({
      courses: state.courses.filter((c) => c._id !== courseId),
    }));
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
  
  clearFilters: () => {
    set({
      searchQuery: '',
      filters: {
        pricingPlan: 'all',
        sortBy: 'date',
        sortOrder: 'desc',
      },
    });
  },
  
  getFilteredCourses: () => {
    const state = useCourseStore.getState();
    let filtered = [...state.courses];
    
    // Apply search
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply pricing filter
    if (state.filters.pricingPlan !== 'all') {
      filtered = filtered.filter(
        (course) => course.pricingPlan === state.filters.pricingPlan
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (state.filters.sortBy) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'price':
          comparison = (a.discountedPrice || a.totalPrice || 0) - (b.discountedPrice || b.totalPrice || 0);
          break;
        case 'date':
        default:
          comparison = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          break;
      }
      
      return state.filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  },
}));

