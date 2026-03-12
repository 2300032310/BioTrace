import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import collectionService from '../../services/collectionService';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime, formatQuantity } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';

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
      setRequests(data);
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
    {
      key: 'hospitalName',
      header: 'Hospital',
    },
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
      render: (_, record) => (
        <div className="flex gap-2">
          {record.status === 'PENDING' && (
            <button
              onClick={() => handleAssign(record.id)}
              className="px-3 py-1 text-xs font-medium text-white bg-brand-600 rounded hover:bg-brand-700"
            >
              Assign to Me
            </button>
          )}
          {record.status === 'SCHEDULED' && (
            <button
              onClick={() => handleComplete(record.id)}
              className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
            >
              Mark Collected
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Pickup Requests
        </h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredRequests}
          itemsPerPage={10}
        />
      )}

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Requests:</span>
            <span className="ml-2 font-semibold">{filteredRequests.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Pending:</span>
            <span className="ml-2 font-semibold text-yellow-600">
              {filteredRequests.filter(r => r.status === 'PENDING').length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Scheduled:</span>
            <span className="ml-2 font-semibold text-purple-600">
              {filteredRequests.filter(r => r.status === 'SCHEDULED').length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Completed:</span>
            <span className="ml-2 font-semibold text-green-600">
              {filteredRequests.filter(r => r.status === 'COMPLETED').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupRequests;
