import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component that protects routes from unauthorized access.
 * @param {*} param0 - The children components
 * @returns - The rendered component if the user is authenticated, otherwise a redirect to the login page.
 */
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
