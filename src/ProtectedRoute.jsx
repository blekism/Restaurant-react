import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component checks if the user has the required role stored in localStorage
const ProtectedRoute = ({ requiredRole, redirectPath = '/' }) => {
  const userRole = localStorage.getItem('user_role'); // Get role from localStorage

  // Check if the user has the required role
  const hasRequiredRole = userRole === requiredRole;

  if (!hasRequiredRole) {
    // If the role doesn't match, redirect to the specified path (default is '/')
    // You could also redirect to a specific "Unauthorized" page
    alert(`Access Denied: You need the '${requiredRole}' role to access this page.`); // Optional: Inform user
    return <Navigate to={redirectPath} replace />;
  }

  // If the role matches, render the child route's element
  return <Outlet />;
};

export default ProtectedRoute;