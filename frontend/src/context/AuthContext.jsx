import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });
  const [admin, setAdmin] = useState(() => !!localStorage.getItem("adminToken"));

  const loginUser = (token, userInfo) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  const loginAdmin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdmin(true);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, admin, loginUser, logoutUser, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
