import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Redirects to login if accessed directly without a valid user session
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const hasToken = localStorage.getItem("userToken");
  if (!user || !hasToken) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
