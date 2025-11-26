import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("auth_token");
    return !!token;
  });

  const login = (token) => {
    localStorage.setItem("auth_token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
