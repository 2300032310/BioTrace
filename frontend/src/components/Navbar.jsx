import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleDisplayName } from '../utils/helpers';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  // Static notifications for now — replace with API call later
  const [notifications] = useState([
    { id: 1, text: 'New waste record created', time: '2m ago', unread: true },
    { id: 2, text: 'Pickup scheduled for today', time: '1h ago', unread: true },
    { id: 3, text: 'Agency confirmed disposal', time: '3h ago', unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">

          {/* Brand */}
          <div className="navbar-brand">
            <div className="flex-shrink-0">
              <svg className="navbar-logo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="navbar-title">BioTrace</span>
            </div>
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <div className="navbar-user">

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="navbar-notification-badge"
                  aria-label="Notifications"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: 0, right: 0,
                      background: '#D45C5C', color: 'white',
                      fontSize: '0.625rem', fontWeight: 700,
                      borderRadius: '9999px', minWidth: '1rem', height: '1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid white', padding: '0 3px',
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {notifOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '2.5rem',
                    width: '18rem', background: 'white', borderRadius: '1rem',
                    boxShadow: '0 20px 40px rgba(11,79,108,0.2)',
                    border: '1px solid rgba(11,79,108,0.08)', overflow: 'hidden', zIndex: 100,
                  }}>
                    <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #E9EEF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#0B4F6C', fontSize: '0.875rem' }}>Notifications</span>
                      <span style={{ fontSize: '0.75rem', color: '#19A7CE', cursor: 'pointer', fontWeight: 600 }}>Mark all read</span>
                    </div>
                    {notifications.map((n) => (
                      <div key={n.id} style={{
                        padding: '0.875rem 1.25rem',
                        background: n.unread ? 'rgba(25,167,206,0.04)' : 'white',
                        borderBottom: '1px solid #F8FAFC',
                        display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                        cursor: 'pointer',
                      }}>
                        <div style={{
                          marginTop: '0.25rem', width: '0.5rem', height: '0.5rem',
                          borderRadius: '50%', flexShrink: 0,
                          background: n.unread ? '#19A7CE' : '#DCE5EB',
                        }} />
                        <div>
                          <p style={{ fontSize: '0.8125rem', color: '#13293D', margin: 0 }}>{n.text}</p>
                          <p style={{ fontSize: '0.75rem', color: '#647B8C', margin: '0.25rem 0 0' }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid #E9EEF2' }}>
                      <span style={{ fontSize: '0.75rem', color: '#647B8C', cursor: 'pointer' }}>View all notifications</span>
                    </div>
                  </div>
                )}
              </div>

              {/* User info + Avatar */}
              <div className="text-white">
                <span className="navbar-user-name">{user?.name}</span>
                <span className="navbar-user-role">{getRoleDisplayName(user?.role)}</span>
              </div>

              {/* Avatar Circle */}
              <div style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
                backdropFilter: 'blur(4px)',
              }}>
                {getInitials(user?.name)}
              </div>

              {/* Logout */}
              <button onClick={handleLogout} className="navbar-logout">
                Logout
              </button>

            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;