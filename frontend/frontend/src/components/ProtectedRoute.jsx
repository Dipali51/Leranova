import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role"); // role stored in login
  if (userRole !== role) {
    alert("Access denied! Only teachers can access this page.");
    return <Navigate to="/home" replace />;
  }
  return children;
};

export default ProtectedRoute; // ✅ default export
