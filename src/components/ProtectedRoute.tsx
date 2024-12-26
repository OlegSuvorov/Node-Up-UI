import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


type Props = {
  children: ReactElement;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuth();
  console.log('user ==============', user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
