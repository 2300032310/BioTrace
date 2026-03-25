import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Login.css';
import '../../styles/Icons.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success('Login successful!');
      
      // Redirect based on role
      setTimeout(() => {
        switch (user.role) {
          case 'HOSPITAL_STAFF':
            navigate('/hospital/dashboard');
            break;
          case 'COLLECTION_AGENCY':
            navigate('/agency/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/login');
        }
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="flex-center">
              <svg
                className="login-logo"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="login-title">
              BioTrace
            </h2>
            <p className="login-subtitle">
              Medical Waste Management System
            </p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-fields">
              <div className="login-input-group">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input login-input-email"
                  placeholder="Email address"
                />
              </div>
              <div className="login-input-group">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input login-input-password"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="login-submit"
              >
                {loading ? (
                  <span className="login-submit-loading">
                    <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="login-footer">
              <p className="login-footer-text">
                Don't have an account?{' '}
                <Link to="/register" className="login-register-link">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
