"use client";

import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
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
  const { getData } = useApi();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(role || "");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getData("/auth/profile", undefined, true);
        if (result) setUser(result);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn, getData]);

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
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
