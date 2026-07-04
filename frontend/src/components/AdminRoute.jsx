import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Redirects to admin login if accessed directly without a valid admin session
const AdminRoute = ({ children }) => {
  const { admin } = useAuth();
  const hasToken = localStorage.getItem("adminToken");
  if (!admin || !hasToken) return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminRoute;
