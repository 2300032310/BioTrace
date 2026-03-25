import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import AgencyDashboard from './pages/agency/AgencyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Hospital Staff */}
          <Route path="/hospital/dashboard" element={<PrivateRoute role="HOSPITAL_STAFF"><HospitalDashboard /></PrivateRoute>} />
          <Route path="/hospital/generate-waste" element={<PrivateRoute role="HOSPITAL_STAFF"><HospitalDashboard /></PrivateRoute>} />
          <Route path="/hospital/waste-records" element={<PrivateRoute role="HOSPITAL_STAFF"><HospitalDashboard /></PrivateRoute>} />

          {/* Collection Agency */}
          <Route path="/agency/dashboard" element={<PrivateRoute role="COLLECTION_AGENCY"><AgencyDashboard /></PrivateRoute>} />
          <Route path="/agency/pickup-requests" element={<PrivateRoute role="COLLECTION_AGENCY"><AgencyDashboard /></PrivateRoute>} />
          <Route path="/agency/my-collections" element={<PrivateRoute role="COLLECTION_AGENCY"><AgencyDashboard /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/hospitals" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/agents" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/compliance" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;