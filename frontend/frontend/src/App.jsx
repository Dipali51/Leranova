import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Signup from './assets/Signup';
import Signin from './assets/Login';
import Courses from './assets/pages/Courses';
import Home from "./assets/pages/Home";
import CreateCourse from './assets/pages/CreateCourse';
import CourseContent from './assets/pages/CourseContent';
import AddCourseContent from './assets/pages/CourseContent';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/create" element={<CreateCourse />} />
        <Route path="/courses/edit/:id" element={<CreateCourse />} /> {/* ✅ fixed */}
        <Route path="/add-content" element={<AddCourseContent />} />
        <Route path="/course-content/:courseId" element={<CourseContent />} />
      </Routes>
    </Router>
  );
}

export default App;
