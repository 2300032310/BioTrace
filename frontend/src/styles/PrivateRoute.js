import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/PrivateRoute.css';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="private-route-loading">
        {/* Floating dots for visual interest */}
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        
        {/* DNA helix decoration - biotech theme */}
        <div className="dna-helix"></div>
        
        {/* Wave effect - bio-inspired */}
        <div className="wave-bg"></div>
        
        {/* BioTrace Logo */}
        <svg
          className="loading-logo"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        
        {/* Main spinner */}
        <div className="private-route-spinner"></div>
        
        {/* Progress bar alternative */}
        <div className="private-route-progress"></div>
        
        {/* Loading message container */}
        <div className="loading-message-container">
          <div className="loading-message">Verifying Credentials</div>
          <div className="loading-submessage">Securely connecting to BioTrace</div>
        </div>
        
        {/* Simple loading text */}
        <div className="private-route-loading-text">Loading BioTrace</div>
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