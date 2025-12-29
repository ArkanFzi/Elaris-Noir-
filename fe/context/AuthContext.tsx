import { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  user: { firstName: string; lastName: string } | null;
  setToken: (token: string | null) => void;
  setUser: (user: { firstName: string; lastName: string } | null) => void;
  login: (
    newToken: string,
    user: { firstName: string; lastName: string }
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  const login = (
    newToken: string,
    user: { firstName: string; lastName: string }
  ) => {
    setToken(newToken);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, setToken, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
