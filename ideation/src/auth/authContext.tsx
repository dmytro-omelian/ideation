import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { User } from "../account/Account";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      const { access_token, user } = data;

      if (access_token == null) {
        throw Error("Password is wrong!");
      }

      localStorage.setItem("token", access_token);
      setAuth({ isLoggedIn: true, user, token: access_token });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ isLoggedIn: false, user: null, token: null });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally verify token and fetch user details
      setAuth((auth) => ({ ...auth, isLoggedIn: true, token }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
