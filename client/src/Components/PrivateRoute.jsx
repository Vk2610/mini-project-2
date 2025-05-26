import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the user is authenticated
  const userRole = localStorage.getItem("role"); // Get the user's role from localStorage

  // Check if the user's role is allowed
  const isAuthorized = allowedRoles.includes(userRole);

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page if not authorized
  }

  return <Outlet />; // Render child routes if authenticated and authorized
};

export default PrivateRoute;