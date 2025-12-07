// API Base URL
export const API_BASE_URL = 'http://localhost:3001/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/signup',
  REQUEST_VERIFICATION: '/signup/request-verification',
  CONFIRM_VERIFICATION: '/signup/confirm',
  FORGET_PASSWORD: '/forget-password',
  RESET_PASSWORD: '/reset-password',
  ADMIN_LOGIN: '/admin/login',
  
  // Courses
  COURSES: '/courses',
  COURSE: (id) => `/course/${id}`,
  CREATE_COURSE: '/create',
  UPDATE_COURSE: (id) => `/course/${id}`,
  DELETE_COURSE: (id) => `/course/${id}`,
  ENROLL_COURSE: (id) => `/course/${id}/enroll`,
  PURCHASE_COURSE: (id) => `/course/${id}/purchase`,
  CREATE_ORDER: (id) => `/course/${id}/create-order`,
  VERIFY_PAYMENT: (id) => `/course/${id}/verify-payment`,
  COURSE_ENROLLMENTS: (id) => `/course/${id}/enrollments`,
  MY_ENROLLMENTS: '/my-enrollments',
  PUBLISH_COURSE: (id) => `/course/${id}/publish`,
  UPLOAD_CHAPTER: (id) => `/course/${id}/upload-chapter`,
  UPDATE_CHAPTER: (courseId, chapterId) => `/course/${courseId}/chapter/${chapterId}`,
  
  // Assets
  UPLOAD_ASSET: '/assets/upload',
  ASSETS: '/assets',
  DELETE_ASSET: (id) => `/assets/${id}`,
  IMPORT_ASSETS: (id) => `/course/${id}/import-assets`,
  
  // Questions
  QUESTIONS: '/questions',
  DELETE_QUESTION: (id) => `/questions/${id}`,
  
  // Packages
  PACKAGES: '/packages',
  PACKAGE: (id) => `/packages/${id}`,
  
  // Users
  USERS: '/admin/users',
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

// Course Pricing Plans
export const PRICING_PLANS = {
  FREE: 'free',
  ONE_TIME: 'one-time',
};

