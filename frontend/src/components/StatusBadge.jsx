import React from 'react';
import { getStatusColor, getPriorityColor, getWasteTypeColor } from '../utils/helpers';
import '../styles/StatusBadge.css';

const StatusBadge = ({ status, type = 'waste_status' }) => {
  let badgeClass = '';

  switch (type) {
    case 'waste_status':
      badgeClass = getStatusColor(status);
      break;
    case 'request_status':
      badgeClass = getStatusColor(status);
      break;
    case 'priority':
      badgeClass = getPriorityColor(status);
      break;
    case 'waste_type':
      badgeClass = getWasteTypeColor(status);
      break;
    default:
      badgeClass = 'status-default';
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
