import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const SvgIcon = ({ path, path2 }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
    style={{ width: '1.1rem', height: '1.1rem' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    {path2 && <path strokeLinecap="round" strokeLinejoin="round" d={path2} />}
  </svg>
);

const ICONS = {
  dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  generate:  "M12 6v6m0 0v6m0-6h6m-6 0H6",
  records:   "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  pickup:    "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  collections: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  hospitals: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  compliance:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  agents: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
};

const Sidebar = () => {
  const { user } = useAuth();

  const hospitalMenuItems = [
    { path: '/hospital/dashboard',    label: 'Dashboard',     iconKey: 'dashboard'   },
    { path: '/hospital/generate-waste', label: 'Generate Waste', iconKey: 'generate' },
    { path: '/hospital/waste-records', label: 'My Records',   iconKey: 'records'     },
  ];

  const agencyMenuItems = [
    { path: '/agency/dashboard',       label: 'Dashboard',        iconKey: 'dashboard'    },
    { path: '/agency/pickup-requests', label: 'Pickup Requests',  iconKey: 'pickup'       },
    { path: '/agency/my-collections',  label: 'My Collections',   iconKey: 'collections'  },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard',   label: 'Dashboard',  iconKey: 'dashboard'  },
    { path: '/admin/hospitals',   label: 'Hospitals',  iconKey: 'hospitals'  },
    { path: '/admin/agents',   label: 'Collection Agents',  iconKey: 'agents'  },
    { path: '/admin/compliance',  label: 'Compliance', iconKey: 'compliance' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'HOSPITAL_STAFF':    return hospitalMenuItems;
      case 'COLLECTION_AGENCY': return agencyMenuItems;
      case 'ADMIN':             return adminMenuItems;
      default:                  return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
            }
          >
            <span className="sidebar-icon">
              <SvgIcon path={ICONS[item.iconKey]} />
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;