"use client";

import { useGet } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  role: string;
};

type AuthContextProps = {
  isLoggedIn: boolean;
  logout: () => void;
  isInitialized: boolean;
  role: string;
  user: User | null;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data } = useGet("/auth/profile", { useToken: true });
  const user =
    data && "id" in data && "username" in data && "role" in data
      ? (data as User)
      : null;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(role || "");
    }
    setIsInitialized(true);
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, logout, isInitialized, role, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
