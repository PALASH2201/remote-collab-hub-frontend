import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, registerApi, getUser } from "../lib/api";
import UserModel from "../lib/models/UserModel";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved token on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem("authToken");
        if (savedToken) {
            const userJson = localStorage.getItem('user');
            if (userJson) {
              const userData = JSON.parse(userJson);
              setUser(new UserModel({ ...userData, token: savedToken }));
            }
          return;
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const resp = await loginApi(email, password);
      if (resp !== null) {
        localStorage.setItem("authToken", resp);
      } else {
        throw new Error("Login failed");
      }
      const userResp = await getUser();
      if (userResp !== null) {
        localStorage.setItem("user", JSON.stringify(userResp));
        setUser(userResp);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await registerApi(userData);
      if (response !== "success"){
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!localStorage.getItem("authToken"),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
