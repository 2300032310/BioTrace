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
    YELLOW: 'waste-type-yellow',
    RED: 'waste-type-red',
    WHITE: 'waste-type-white',
    BLUE: 'waste-type-blue',
  };
  return colors[type] || 'status-default';
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'status-pending',
    COLLECTED: 'status-collected',
    DISPOSED: 'status-disposed',
    SCHEDULED: 'status-scheduled',
    COMPLETED: 'status-completed',
    URGENT: 'priority-high',
    NORMAL: 'priority-low',
  };
  return colors[status] || 'status-default';
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colors = {
    URGENT: 'priority-high',
    NORMAL: 'priority-low',
    HIGH: 'priority-high',
    MEDIUM: 'priority-medium',
    LOW: 'priority-low',
  };
  return colors[priority] || 'status-default';
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

// Check if violation (> 48 hours pending)
export const isViolation = (record) => {
  // If already disposed, it's not a violation
  if (record.status === 'DISPOSED' || record.status === 'COLLECTED') {
    return false;
  }
  
  // Only pending records can be violations
  if (record.status !== 'PENDING') {
    return false;
  }
  
  // Check generation date (when waste was actually generated)
  const generationDate = record.generationDate;
  if (!generationDate) return false;
  
  // Parse the generation date - handle both date and datetime formats
  const genDate = new Date(generationDate);
  if (isNaN(genDate.getTime())) return false;
  
  const now = new Date();
  const diffMs = now - genDate;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Violation if pending for more than 48 hours since generation
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
