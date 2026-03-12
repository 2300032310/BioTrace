// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time to readable string
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const time = new Date(`2000-01-01T${timeString}`);
  return time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date and time
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get waste type color
export const getWasteTypeColor = (type) => {
  const colors = {
    YELLOW: 'bg-yellow-400 text-yellow-900',
    RED: 'bg-red-500 text-white',
    WHITE: 'bg-gray-100 text-gray-800',
    BLUE: 'bg-blue-500 text-white',
  };
  return colors[type] || 'bg-gray-400 text-white';
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    COLLECTED: 'bg-blue-100 text-blue-800',
    DISPOSED: 'bg-green-100 text-green-800',
    SCHEDULED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    URGENT: 'bg-red-100 text-red-800',
    NORMAL: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colors = {
    URGENT: 'bg-red-500 text-white',
    NORMAL: 'bg-gray-400 text-white',
  };
  return colors[priority] || 'bg-gray-400 text-white';
};

// Calculate time elapsed
export const getTimeElapsed = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
  return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
};

// Check if violation (> 48 hours)
export const isViolation = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours > 48;
};

// Format quantity
export const formatQuantity = (quantity) => {
  if (!quantity) return '0';
  return parseFloat(quantity).toFixed(2);
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roles = {
    HOSPITAL_STAFF: 'Hospital Staff',
    COLLECTION_AGENCY: 'Collection Agency',
    ADMIN: 'Administrator',
  };
  return roles[role] || role;
};

// Department list
export const DEPARTMENTS = [
  'ICU',
  'OPD',
  'Surgery',
  'Lab',
  'Emergency',
  'Radiology',
  'Pharmacy',
  'General Ward',
];

// Waste types
export const WASTE_TYPES = ['YELLOW', 'RED', 'WHITE', 'BLUE'];

// Disposal methods
export const DISPOSAL_METHODS = ['INCINERATION', 'AUTOCLAVING', 'CHEMICAL'];
