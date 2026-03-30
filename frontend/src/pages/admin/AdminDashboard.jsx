import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import HospitalManagement from './HospitalManagement';
import ComplianceMonitor from './ComplianceMonitor';
import AgentManagement from './AgentManagement';
import hospitalService from '../../services/hospitalService';
import { ToastContainer, toast } from 'react-toastify';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (path) => {
    if (path.includes('hospitals')) return 'hospitals';
    if (path.includes('agents')) return 'agents';
    if (path.includes('compliance')) return 'compliance';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));
  const [stats, setStats] = useState({
    totalHospitals: 0,
    totalWasteThisMonth: 0,
    complianceRate: 0,
    violationsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const hospitalData = await hospitalService.getHospitalStats();
        setStats({
          totalHospitals: hospitalData.totalHospitals || 0,
          totalWasteThisMonth: hospitalData.totalWasteThisMonth || 0,
          complianceRate: hospitalData.complianceRate || 0,
          violationsCount: hospitalData.violations || 0,
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
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'hospitals', label: 'Hospitals', path: '/admin/hospitals' },
    { id: 'agents', label: 'Collection Agents', path: '/admin/agents' },
    { id: 'compliance', label: 'Compliance', path: '/admin/compliance' },
  ];

  const handleTabChange = (tabId, tabPath) => {
    setActiveTab(tabId);
    navigate(tabPath);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id, tab.path)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Hospitals */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-brand-100 text-brand-600">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Hospitals</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalHospitals}</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Waste This Month */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Waste This Month</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalWasteThisMonth} kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Rate */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.complianceRate}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Violations */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-red-100 text-red-600">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Violations (&gt;48hrs)</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.violationsCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button onClick={() => handleTabChange('hospitals', '/admin/hospitals')}
                    className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="p-2 rounded-full bg-brand-100 text-brand-600 mr-4">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">Add Hospital</span>
                  </button>

                  <button onClick={() => handleTabChange('agents', '/admin/agents')}
                    className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">View Collection Agents</span>
                  </button>

                  <button onClick={() => handleTabChange('compliance', '/admin/compliance')}
                    className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="p-2 rounded-full bg-red-100 text-red-600 mr-4">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">View Compliance</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hospitals' && <HospitalManagement />}
          {activeTab === 'agents' && <AgentManagement />}
          {activeTab === 'compliance' && <ComplianceMonitor />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;