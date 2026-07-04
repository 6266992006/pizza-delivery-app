import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, admin, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    if (isAdminArea) {
      logoutAdmin();
      navigate("/admin/login");
    } else {
      logoutUser();
      navigate("/login");
    }
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">🍕 Pizza Hub</Link>
      <nav>
        {!isAdminArea && !user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {!isAdminArea && user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/build">Build a Pizza</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
        {isAdminArea && admin && (
          <button className="logout-btn" onClick={handleLogout}>Admin Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
