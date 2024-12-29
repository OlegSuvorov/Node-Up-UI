import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { User } from "../services/api";

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

type Props = {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useLocalStorage("user", '');
  const [token, setToken] = useLocalStorage("token", '');
  const navigate = useNavigate();

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    navigate("/");
  };

  const logout = () => {
    setUser('');
    setToken('');
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    [user, token]
  );
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
