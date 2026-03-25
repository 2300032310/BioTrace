import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { wasteService } from '../../services/wasteService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatQuantity } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/WasteRecords.css';

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

      <h1 className="waste-records-header">
        My Waste Records
      </h1>

      {/* Filters */}
      <div className="waste-records-filters">
        <div className="waste-records-filters-inner">
          <div className="waste-records-filter">
            <label htmlFor="status" className="waste-records-filter-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="waste-records-filter-select"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COLLECTED">Collected</option>
              <option value="DISPOSED">Disposed</option>
            </select>
          </div>
          <div className="waste-records-filter">
            <label htmlFor="wasteType" className="waste-records-filter-label">
              Waste Type
            </label>
            <select
              id="wasteType"
              name="wasteType"
              value={filters.wasteType}
              onChange={handleFilterChange}
              className="waste-records-filter-select"
            >
              <option value="">All Types</option>
              <option value="YELLOW">Yellow</option>
              <option value="RED">Red</option>
              <option value="WHITE">White</option>
              <option value="BLUE">Blue</option>
            </select>
          </div>
          <div className="waste-records-filter-btn">
            <button
              onClick={() => setFilters({ status: '', wasteType: '' })}
              className="waste-records-filter-clear"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredRecords}
          itemsPerPage={10}
        />
      )}

      {/* Summary */}
      <div className="waste-records-summary">
        <h3 className="waste-records-summary-title">Summary</h3>
        <div className="waste-records-summary-grid">
          <div>
            <span className="waste-records-summary-label">Total Records:</span>
            <span className="waste-records-summary-value">{filteredRecords.length}</span>
          </div>
          <div>
            <span className="waste-records-summary-label">Pending:</span>
            <span className="waste-records-summary-value waste-records-summary-pending">
              {filteredRecords.filter(r => r.status === 'PENDING').length}
            </span>
          </div>
          <div>
            <span className="waste-records-summary-label">Collected:</span>
            <span className="waste-records-summary-value waste-records-summary-collected">
              {filteredRecords.filter(r => r.status === 'COLLECTED').length}
            </span>
          </div>
          <div>
            <span className="waste-records-summary-label">Disposed:</span>
            <span className="waste-records-summary-value waste-records-summary-disposed">
              {filteredRecords.filter(r => r.status === 'DISPOSED').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteRecords;
