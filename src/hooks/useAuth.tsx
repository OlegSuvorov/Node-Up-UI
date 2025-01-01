import React, { createContext, ReactNode, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, authApi } from '../services/api';

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await authApi.verify();
        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

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
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
