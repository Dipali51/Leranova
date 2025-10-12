import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Landingpage from './assets/pages/Landingpage';
import Signup from './assets/Signup';
import Signin from './assets/Login';
import Courses from './assets/pages/Courses';
import Packages from './assets/pages/Packages';
import Webinar from './assets/pages/Webinar';
import CreateWebinar from './assets/pages/CreateWebinar';
import Home from "./assets/pages/Home";
import CreateCourse from './assets/pages/CreateCourse';
import CourseContent from './assets/pages/CourseContent';
import AddCourseContent from './assets/pages/CourseContent';
import CoursePreview from './assets/pages/CoursePreview';
import MyCourses from './assets/pages/MyCourses';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ import

function ConditionalNavbar() {
  const location = useLocation();
  const hideNavbarRoutes = ['/packages', '/courses', '/home', '/courses/create', '/course-content', '/courses/preview', '/webinar', '/webinars', '/webinar/create'];

  // Check if current route should hide navbar
  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname === route || location.pathname.startsWith(route)
  );

  // read role from localStorage so Navbar can render role-specific links
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  return !shouldHideNavbar ? <Navbar userType={userRole} /> : null;
}

function App() {
  return (
    <Router>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/webinar" element={<Webinar />} />

        <Route
          path="/webinar/create"
          element={
            <ProtectedRoute role="teacher">
              <CreateWebinar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/create"
          element={
            <ProtectedRoute role="teacher">
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/edit/:id"
          element={
            <ProtectedRoute role="teacher">
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route path="/add-content" element={<AddCourseContent />} />
        <Route path="/course-content/:courseId" element={<CourseContent />} />
        <Route path="/courses/preview/:id" element={<CoursePreview />} />
        <Route path="/my-courses" element={<MyCourses />} />
      </Routes>
    </Router>
  );
}

export default App;
