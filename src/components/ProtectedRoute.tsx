import React, { ReactElement, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type Props = {
  children: ReactElement;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { user, isLoading, verifyAuth } = useAuth();
  const [isVerifying, setIsVerifying] = useState(!user);

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        await verifyAuth();
      }
      setIsVerifying(false);
    };

    verify();
  }, [user, verifyAuth]);

  if (isLoading || isVerifying) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
