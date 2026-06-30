// src/context/AuthContext.tsx
import {
  createContext,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { apiService } from "../api/api";

interface AuthContextType {
  user: User | null;
  login: (nickName: string, passwordFixed: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storedUser = () => {
  try {
    const stored = localStorage.getItem("buzzu_user");
    return stored ? JSON.parse(stored) as User : null;
  } catch {
    localStorage.removeItem("buzzu_user");
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(storedUser);
  const loading = false;

  const login = async (nickName: string, password: string) => {
    try {
      const foundUser = await apiService.loginUser(nickName, password);

      setUser(foundUser);
      localStorage.setItem("buzzu_user", JSON.stringify(foundUser));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error de conexión al servidor.";
      throw new Error(message, { cause: err });
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const updatedUser = await apiService.getUserByNickName(user.nickName);
      setUser(updatedUser);
      localStorage.setItem("buzzu_user", JSON.stringify(updatedUser));
    } catch {
      // Si falla, mantener el usuario actual
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("buzzu_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
