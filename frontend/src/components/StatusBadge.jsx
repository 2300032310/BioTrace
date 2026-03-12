import React from 'react';
import { getStatusColor, getPriorityColor, getWasteTypeColor } from '../utils/helpers';

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
      badgeClass = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
