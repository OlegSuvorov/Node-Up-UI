import React, { ReactElement, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  children: ReactElement;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { user, isLoading, verifyAuth, isVerified } = useAuth();

  useEffect(() => {
    if (!isVerified) {
      verifyAuth();
    }
  }, [isVerified, verifyAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isVerified && !user) {
    return <Navigate to="/login" />;
  }

  return children;
};
