import React, {createContext, ReactNode, useContext, useMemo} from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
type UserContextType = {
  user: any;
  login: (data: any) => void;
  logout: () => void;
};
const AuthContext = createContext<UserContextType>({
  user: '',
  login: () => {},
  logout: () => {},
});

type Props = {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useLocalStorage("user", '');
  const navigate = useNavigate();

  const login = async (data: any) => {
    setUser(data);
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
