import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/PrivateRoute.css';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="private-route-loading">
        <div className="private-route-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'HOSPITAL_STAFF':
        return <Navigate to="/hospital/dashboard" replace />;
      case 'COLLECTION_AGENCY':
        return <Navigate to="/agency/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
