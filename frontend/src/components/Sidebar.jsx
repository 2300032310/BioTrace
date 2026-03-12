import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const hospitalMenuItems = [
    { path: '/hospital/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/hospital/generate-waste', label: 'Generate Waste', icon: '➕' },
    { path: '/hospital/waste-records', label: 'My Records', icon: '📋' },
  ];

  const agencyMenuItems = [
    { path: '/agency/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/agency/pickup-requests', label: 'Pickup Requests', icon: '🚚' },
    { path: '/agency/my-collections', label: 'My Collections', icon: '📦' },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/hospitals', label: 'Hospitals', icon: '🏥' },
    { path: '/admin/compliance', label: 'Compliance', icon: '⚖️' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'HOSPITAL_STAFF':
        return hospitalMenuItems;
      case 'COLLECTION_AGENCY':
        return agencyMenuItems;
      case 'ADMIN':
        return adminMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white shadow-md min-h-screen">
      <nav className="mt-5 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1 ${
                isActive
                  ? 'bg-brand-100 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
