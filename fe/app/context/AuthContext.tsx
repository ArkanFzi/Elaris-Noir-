"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  user: { id: string; email: string } | null;
  login: (token: string, user: { id?: string; email: string }) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: { id?: string; email: string }) => {
    setToken(newToken);
    const userData = {
      id: newUser.id || "unknown",
      email: newUser.email,
    };
    setUser(userData);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Return a default empty context if not within provider (for server rendering)
  if (context === undefined) {
    return {
      token: null,
      user: null,
      login: () => {},
      logout: () => {},
      isLoading: false,
    } as AuthContextType;
  }
  return context;
}
