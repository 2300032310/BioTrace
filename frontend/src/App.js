import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import AgencyDashboard from './pages/agency/AgencyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hospital/generate-waste" element={<PrivateRoute role="HOSPITAL_STAFF"><HospitalDashboard /></PrivateRoute>} />
            <Route path="/hospital/waste-records" element={<PrivateRoute role="HOSPITAL_STAFF"><HospitalDashboard /></PrivateRoute>} />
            <Route 
              path="/hospital/dashboard" 
              element={
                <PrivateRoute role="HOSPITAL_STAFF">
                  <HospitalDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/agency/dashboard" 
              element={
                <PrivateRoute role="COLLECTION_AGENCY">
                  <AgencyDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute role="ADMIN">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;