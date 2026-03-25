import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import hospitalService from '../../services/hospitalService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Register.css';  // Make sure this import is here!

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'HOSPITAL_STAFF',
    phone: '',
    hospitalId: '',
  });
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hospitalsLoading, setHospitalsLoading] = useState(true);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await hospitalService.getAllHospitals();
        setHospitals(data);
      } catch (error) {
        console.error('Failed to fetch hospitals:', error);
      } finally {
        setHospitalsLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        hospitalId: formData.role === 'HOSPITAL_STAFF' ? formData.hospitalId : null,
      };
      await register(userData);
      toast.success('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="register-container">
        <div className="register-box">
          <div className="register-header">
            <div className="flex-center">
              <svg className="register-logo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="register-title">Register</h2>
            <p className="register-subtitle">Create your BioTrace account</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-form-fields">
              <div className="register-field">
                <label htmlFor="name" className="register-label">Full Name</label>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                  className="register-input" placeholder="Enter your full name" />
              </div>

              <div className="register-field">
                <label htmlFor="email" className="register-label">Email</label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                  className="register-input" placeholder="Enter your email" />
              </div>

              <div className="register-field">
                <label htmlFor="password" className="register-label">Password</label>
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange}
                  className="register-input" placeholder="Enter password" />
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                  className="register-input" placeholder="Confirm your password" />
              </div>

              <div className="register-field">
                <label htmlFor="role" className="register-label">Role</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="register-select">
                  <option value="HOSPITAL_STAFF">Hospital Staff</option>
                  <option value="COLLECTION_AGENCY">Collection Agency</option>
                </select>
              </div>

              <div className="register-field">
                <label htmlFor="phone" className="register-label">Phone</label>
                <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange}
                  className="register-input" placeholder="Enter phone number" />
              </div>

              {formData.role === 'HOSPITAL_STAFF' && (
                <div className="register-field">
                  <label htmlFor="hospitalId" className="register-label">Hospital</label>
                  <select id="hospitalId" name="hospitalId" value={formData.hospitalId} onChange={handleChange}
                    required={formData.role === 'HOSPITAL_STAFF'} disabled={hospitalsLoading} className="register-select">
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="register-submit">
              {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="register-footer">
              <p className="register-footer-text">
                Already have an account?{' '}
                <Link to="/login" className="register-login-link">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;