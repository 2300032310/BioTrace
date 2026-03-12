import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { wasteService } from '../../services/wasteService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatQuantity } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';

const WasteRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    wasteType: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await wasteService.getWasteByHospital(user.hospitalId);
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to fetch waste records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredRecords = records.filter((record) => {
    if (filters.status && record.status !== filters.status) return false;
    if (filters.wasteType && record.wasteType !== filters.wasteType) return false;
    return true;
  });

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      key: 'generationDate',
      header: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'wasteType',
      header: 'Type',
      render: (value) => <StatusBadge status={value} type="waste_type" />,
    },
    {
      key: 'quantityKg',
      header: 'Quantity (kg)',
      render: (value) => formatQuantity(value),
    },
    {
      key: 'department',
      header: 'Department',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} type="waste_status" />,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (value) => formatDateTime(value),
    },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        My Waste Records
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COLLECTED">Collected</option>
              <option value="DISPOSED">Disposed</option>
            </select>
          </div>
          <div>
            <label htmlFor="wasteType" className="block text-sm font-medium text-gray-700 mb-1">
              Waste Type
            </label>
            <select
              id="wasteType"
              name="wasteType"
              value={filters.wasteType}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="YELLOW">Yellow</option>
              <option value="RED">Red</option>
              <option value="WHITE">White</option>
              <option value="BLUE">Blue</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', wasteType: '' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredRecords}
          itemsPerPage={10}
        />
      )}

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Records:</span>
            <span className="ml-2 font-semibold">{filteredRecords.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Pending:</span>
            <span className="ml-2 font-semibold text-yellow-600">
              {filteredRecords.filter(r => r.status === 'PENDING').length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Collected:</span>
            <span className="ml-2 font-semibold text-blue-600">
              {filteredRecords.filter(r => r.status === 'COLLECTED').length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Disposed:</span>
            <span className="ml-2 font-semibold text-green-600">
              {filteredRecords.filter(r => r.status === 'DISPOSED').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteRecords;