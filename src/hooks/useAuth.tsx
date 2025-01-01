import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User, authApi } from '../services/api';

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  verifyAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
  verifyAuth: async () => {},
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const verifyAuth = async () => {
    setIsLoading(true);
    try {
      const { user: userData } = await authApi.verify();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    navigate('/');
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isLoading,
      verifyAuth,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
