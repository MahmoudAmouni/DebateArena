import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
