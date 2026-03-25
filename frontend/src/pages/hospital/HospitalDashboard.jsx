import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import GenerateWaste from './GenerateWaste';
import WasteRecords from './WasteRecords';
import { wasteService } from '../../services/wasteService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';
import '../../styles/WasteRecords.css';
import '../../styles/GenerateWaste.css';
import '../../styles/Icons.css';

const HospitalDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (path) => {
    if (path.includes('generate-waste')) return 'generate';
    if (path.includes('waste-records')) return 'records';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));
  const [stats, setStats] = useState({
    totalWasteThisMonth: 0,
    pendingCollections: 0,
    complianceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await wasteService.getWasteStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/hospital/dashboard' },
    { id: 'generate', label: 'Generate Waste', path: '/hospital/generate-waste' },
    { id: 'records', label: 'My Records', path: '/hospital/waste-records' },
  ];

  const pathMap = {
    dashboard: '/hospital/dashboard',
    generate: '/hospital/generate-waste',
    records: '/hospital/waste-records',
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(pathMap[tabId]);
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          {/* Tabs */}
          <div className="dashboard-tabs">
            <div className="dashboard-tabs-border">
              <nav className="dashboard-tabs-nav">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
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
              <h1 className="dashboard-header">
                Hospital Dashboard
              </h1>
              
              {loading ? (
                <div className="dashboard-loading">
                  <div className="dashboard-spinner"></div>
                </div>
              ) : (
                <div className="dashboard-stats dashboard-stats-3">
                  <div className="stat-card">
                    <div className="stat-card-inner">
                      <div className="stat-card-icon stat-card-icon-brand">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div className="stat-card-content">
                        <p className="stat-card-label">Total Waste This Month</p>
                        <p className="stat-card-value">{stats.totalWasteThisMonth || 0} kg</p>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-inner">
                      <div className="stat-card-icon stat-card-icon-yellow">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="stat-card-content">
                        <p className="stat-card-label">Pending Collections</p>
                        <p className="stat-card-value">{stats.pendingCollections || 0}</p>
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
                        <p className="stat-card-label">Compliance Rate</p>
                        <p className="stat-card-value">{stats.complianceRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="dashboard-actions">
                <h2 className="dashboard-actions-title">Quick Actions</h2>
                <div className="dashboard-actions-grid">
                  <button
                    onClick={() => handleTabChange('generate')}
                    className="action-button"
                  >
                    <div className="action-button-icon action-button-icon-brand">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="action-button-text">Generate New Waste Record</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('records')}
                    className="action-button"
                  >
                    <div className="action-button-icon action-button-icon-blue">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="action-button-text">View All Records</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'generate' && <GenerateWaste onSuccess={() => handleTabChange('records')} />}

          {activeTab === 'records' && <WasteRecords />}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
