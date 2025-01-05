import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User, authApi } from '../services/api';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  verifyAuth: () => Promise<void>;
  isVerified: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: false,
  verifyAuth: async () => {},
  isVerified: false,
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const verifyAuth = async () => {
    setIsLoading(true);
    try {
      const { user: userData } = await authApi.verify();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsVerified(true);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData } = await authApi.login({ email, password });
      setUser(userData);
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isLoading,
      verifyAuth,
      isVerified,
    }),
    [user, isLoading, isVerified],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
