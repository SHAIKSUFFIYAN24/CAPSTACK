import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import jwt from "jsonwebtoken";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app startup
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Validate token structure (basic check)
          const decoded = jwt.decode(token);
          if (decoded && typeof decoded === 'object' && decoded.exp) {
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (decoded.exp > currentTime) {
              // Token is valid, extract user info
              const userData = {
                id: (decoded as any).userId?.toString() || "1",
                email: (decoded as any).email || "user@example.com",
                name: (decoded as any).name || "User"
              };
              setUser(userData);
            } else {
              // Token expired, remove it
              localStorage.removeItem("token");
              // Set mock user for demo
              setUser({
                id: "demo",
                email: "demo@capstack.com",
                name: "Demo User"
              });
            }
          } else {
            // Set mock user for demo
            setUser({
              id: "demo",
              email: "demo@capstack.com",
              name: "Demo User"
            });
          }
        } else {
          // No token, set mock user for demo
          setUser({
            id: "demo",
            email: "demo@capstack.com",
            name: "Demo User"
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        // Set mock user for demo
        setUser({
          id: "demo",
          email: "demo@capstack.com",
          name: "Demo User"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
