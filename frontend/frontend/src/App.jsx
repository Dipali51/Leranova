import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Landingpage from './assets/pages/Landingpage';
import Signup from './assets/Signup';
import Signin from './assets/Login';
import Courses from './assets/pages/Courses';
import Home from "./assets/pages/Home";
import CreateCourse from './assets/pages/CreateCourse';
import CourseContent from './assets/pages/CourseContent';
import AddCourseContent from './assets/pages/CourseContent';
import CoursePreview from './assets/pages/CoursePreview';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ import

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />

        {/* ✅ Protected Routes for Teacher Only */}
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
      </Routes>
    </Router>
  );
}

export default App;
