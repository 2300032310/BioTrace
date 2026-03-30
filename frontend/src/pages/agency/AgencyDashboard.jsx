import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import PickupRequests from './PickupRequests';
import MyCollections from './MyCollections';
import collectionService from '../../services/collectionService';
import { wasteService } from '../../services/wasteService';
import { ToastContainer } from 'react-toastify';
import '../../styles/Dashboard.css';
import '../../styles/PickupRequests.css';
import '../../styles/MyCollections.css';
import '../../styles/Icons.css';

const AgencyDashboard = () => {
  const location = useLocation();

  const getTabFromPath = (path) => {
    if (path.includes('pickup-requests')) return 'pickups';
    if (path.includes('my-collections')) return 'collections';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));
  const [stats, setStats] = useState({
    pendingCount: 0,
    completedThisWeek: 0,
    totalCompleted: 0,
    totalWasteKg: 0,
  });
  const [loading, setLoading] = useState(true);

  // Update active tab when URL changes (sidebar click)
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [collections, wasteRecords] = await Promise.all([
          collectionService.getAllCollectionRequests(),
          wasteService.getAllWaste(),
        ]);

        const pendingCount = collections.filter(c => c.status === 'PENDING').length;
        const totalCompleted = collections.filter(c => c.status === 'COMPLETED').length;

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const completedThisWeek = collections.filter(c => {
          if (c.status !== 'COMPLETED') return false;
          const date = new Date(c.scheduledPickupDate || c.createdAt);
          return date >= startOfWeek;
        }).length;

        const totalWasteKg = wasteRecords
          .filter(w => w.status === 'COLLECTED' || w.status === 'DISPOSED')
          .reduce((sum, w) => sum + (parseFloat(w.quantityKg) || 0), 0);

        setStats({
          pendingCount,
          completedThisWeek,
          totalCompleted,
          totalWasteKg: Math.round(totalWasteKg * 100) / 100,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'pickups', label: 'Pickup Requests' },
    { id: 'collections', label: 'My Collections' },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Tabs */}
          <div className="dashboard-tabs">
            <div className="dashboard-tabs-border">
              <nav className="dashboard-tabs-nav">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={activeTab === tab.id ? 'dashboard-tab dashboard-tab-active' : 'dashboard-tab'}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="dashboard-header">Collection Agency Dashboard</h1>

              {loading ? (
                <div className="dashboard-loading">
                  <div className="dashboard-spinner"></div>
                </div>
              ) : (
                <div className="dashboard-stats dashboard-stats-4">

                  <div className="stat-card">
                    <div className="stat-card-inner">
                      <div className="stat-card-icon stat-card-icon-yellow">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="stat-card-content">
                        <p className="stat-card-label">Pending Pickups</p>
                        <p className="stat-card-value">{stats.pendingCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-inner">
                      <div className="stat-card-icon stat-card-icon-green">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="stat-card-content">
                        <p className="stat-card-label">Completed This Week</p>
                        <p className="stat-card-value">{stats.completedThisWeek}</p>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-inner">
                      <div className="stat-card-icon stat-card-icon-blue">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div className="stat-card-content">
                        <p className="stat-card-label">Total Completed</p>
                        <p className="stat-card-value">{stats.totalCompleted}</p>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-inner">
                      <div className="stat-card-icon stat-card-icon-brand">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div className="stat-card-content">
                        <p className="stat-card-label">Total Waste Collected</p>
                        <p className="stat-card-value">{stats.totalWasteKg} kg</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              <div className="dashboard-actions">
                <h2 className="dashboard-actions-title">Quick Actions</h2>
                <div className="dashboard-actions-grid">
                  <button onClick={() => setActiveTab('pickups')} className="action-button">
                    <div className="action-button-icon action-button-icon-yellow">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="action-button-text">View Pickup Requests</span>
                  </button>
                  <button onClick={() => setActiveTab('collections')} className="action-button">
                    <div className="action-button-icon action-button-icon-blue">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <span className="action-button-text">My Collections</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pickups' && <PickupRequests />}
          {activeTab === 'collections' && <MyCollections />}
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;