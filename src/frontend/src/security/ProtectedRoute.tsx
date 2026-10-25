import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../api/authService';

interface Props {
  children: React.ReactNode
  roles?: string[]
}

const  ProtectedRoute = ({ children, roles }: Props) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/welcome" replace />;
  }

  if (roles && !roles.some(r => authService.hasRole(r))) {
    return <Navigate to="/forbidden" />
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;