import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { User } from "../account/Account";
import { getBackendUrl } from "../common/get-backend-url";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
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
    loading: true,
  });
  const serverUrl = getBackendUrl();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${serverUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      const { access_token, user } = data;
      console.log("User: ", user);

      if (!access_token) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("token", access_token);
      setAuth({ isLoggedIn: true, user, token: access_token, loading: false });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ isLoggedIn: false, user: null, token: null, loading: false });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuth((prev) => ({ ...prev, loading: true }));
        try {
          const response = await axios.get(`${serverUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAuth({
            isLoggedIn: true,
            user: response.data,
            token: token,
            loading: false,
          });
        } catch (error) {
          console.error("Error verifying token:", error);
          logout();
        }
      } else {
        setAuth((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  console.log(context);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
