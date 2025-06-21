import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={currentUser?.isAdmin ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;