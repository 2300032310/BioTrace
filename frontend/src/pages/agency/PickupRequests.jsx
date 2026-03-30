import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import collectionService from '../../services/collectionService';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime, formatQuantity } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/PickupRequests.css';

const STATUS_ORDER = { PENDING: 0, SCHEDULED: 1, COMPLETED: 2 };

const PickupRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await collectionService.getAllCollectionRequests();
      const sorted = [...data].sort((a, b) => {
        const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
      setRequests(sorted);
    } catch (error) {
      toast.error('Failed to fetch pickup requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (requestId) => {
    try {
      await collectionService.assignCollection(requestId, user.id);
      toast.success('Request assigned to you!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign request.');
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await collectionService.completeCollection(requestId, {
        collectionDate: new Date().toISOString(),
      });
      toast.success('Collection marked as complete!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete collection.');
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (filterStatus && request.status !== filterStatus) return false;
    return true;
  });

  const columns = [
    { key: 'hospitalName', header: 'Hospital' },
    {
      key: 'wasteType',
      header: 'Waste Type',
      render: (value) => <StatusBadge status={value} type="waste_type" />,
    },
    {
      key: 'quantityKg',
      header: 'Quantity (kg)',
      render: (value) => formatQuantity(value),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (value) => <StatusBadge status={value} type="priority" />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} type="request_status" />,
    },
    {
      key: 'requestedDate',
      header: 'Requested',
      render: (value) => formatDateTime(value),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, record) => (
        <div className="pickup-actions-group">
          {record.status === 'PENDING' && (
            <button onClick={() => handleAssign(record.id)} className="pickup-action-btn">
              Assign to Me
            </button>
          )}
          {record.status === 'SCHEDULED' && (
            <button onClick={() => handleComplete(record.id)} className="pickup-action-btn pickup-action-btn-complete">
              Mark Collected
            </button>
          )}
          {record.status === 'COMPLETED' && (
            <span className="pickup-done-label">✓ Done</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="pickup-requests-header">
        <h1 className="pickup-requests-title">Pickup Requests</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="pickup-requests-filter"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredRequests} itemsPerPage={10} />
      )}

      <div className="pickup-requests-summary">
        <h3 className="pickup-requests-summary-title">Summary</h3>
        <div className="pickup-requests-summary-grid">
          <div>
            <span className="pickup-requests-summary-label">Total Requests:</span>
            <span className="pickup-requests-summary-value">{filteredRequests.length}</span>
          </div>
          <div>
            <span className="pickup-requests-summary-label">Pending:</span>
            <span className="pickup-requests-summary-value pickup-requests-summary-pending">
              {filteredRequests.filter(r => r.status === 'PENDING').length}
            </span>
          </div>
          <div>
            <span className="pickup-requests-summary-label">Scheduled:</span>
            <span className="pickup-requests-summary-value pickup-requests-summary-scheduled">
              {filteredRequests.filter(r => r.status === 'SCHEDULED').length}
            </span>
          </div>
          <div>
            <span className="pickup-requests-summary-label">Completed:</span>
            <span className="pickup-requests-summary-value pickup-requests-summary-completed">
              {filteredRequests.filter(r => r.status === 'COMPLETED').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupRequests;
