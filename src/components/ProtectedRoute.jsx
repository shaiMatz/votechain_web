/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role, redirectPath = "/" }) => {
  const { user, loading } = useContext(AuthContext);

  // Handle loading state with a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // If the user is not authenticated, redirect to the specified redirect path
  if (!user) {
    return <Navigate to={redirectPath} />;
  }

  // If the user's role does not match the required role, redirect
  if (role && user.role !== role) {
    return <Navigate to={redirectPath} />;
  }

  // If everything is fine, render the children components
  return children;
};

export default ProtectedRoute;
