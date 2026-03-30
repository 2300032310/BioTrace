import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { wasteService } from '../../services/wasteService';
import { formatDate, getTimeElapsed, isViolation } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/ComplianceMonitor.css';

const ComplianceMonitor = () => {
  const [wasteRecords, setWasteRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterHospital, setFilterHospital] = useState('');
  const [filterViolation, setFilterViolation] = useState('');

  useEffect(() => {
    fetchWasteRecords();
  }, []);

  const fetchWasteRecords = async () => {
    try {
      const data = await wasteService.getAllWaste();
      // Sort by createdAt descending (newest first)
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
        : [];
      setWasteRecords(sortedData);
    } catch (error) {
      console.error('Error fetching waste records:', error);
      toast.error('Failed to fetch waste records.');
      setWasteRecords([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = wasteRecords.filter((record) => {
    if (filterHospital && record.hospitalId?.toString() !== filterHospital) return false;
    if (filterViolation === 'violation' && !isViolation(record)) return false;
    if (filterViolation === 'compliant' && isViolation(record)) return false;
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
    },
    {
      key: 'department',
      header: 'Department',
    },
    {
      key: 'generationDate',
      header: 'Generated',
      render: (value) => formatDate(value),
    },
    {
      key: 'createdAt',
      header: 'Time Elapsed',
      render: (value, record) => {
        const elapsed = getTimeElapsed(record.generationDate || value);
        const violation = isViolation(record);
        return (
          <div className="time-elapsed">
            <span className={violation ? 'time-elapsed-value time-elapsed-value-violation' : 'time-elapsed-value time-elapsed-value-normal'}>
              {elapsed}
            </span>
            {violation && (
              <span className="time-elapsed-badge">
                VIOLATION
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} type="waste_status" />,
    },
  ];

  const violations = wasteRecords.filter(r => isViolation(r));
  const complianceRate = wasteRecords.length > 0 
    ? Math.round(((wasteRecords.length - violations.length) / wasteRecords.length) * 100)
    : 100;

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="compliance-header">
        Compliance Monitor
      </h1>

      {/* Stats */}
      <div className="compliance-stats">
        <div className="compliance-stat-card">
          <p className="compliance-stat-label">Total Records</p>
          <p className="compliance-stat-value">{wasteRecords.length}</p>
        </div>
        <div className="compliance-stat-card">
          <p className="compliance-stat-label">Violations (&gt;48hrs)</p>
          <p className="compliance-stat-value compliance-stat-value-red">{violations.length}</p>
        </div>
        <div className="compliance-stat-card">
          <p className="compliance-stat-label">Compliance Rate</p>
          <p className="compliance-stat-value compliance-stat-value-green">{complianceRate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="compliance-filters">
        <div className="compliance-filters-inner">
          <div className="compliance-filter">
            <label htmlFor="filterHospital" className="compliance-filter-label">
              Hospital
            </label>
            <select
              id="filterHospital"
              value={filterHospital}
              onChange={(e) => setFilterHospital(e.target.value)}
              className="compliance-filter-select"
            >
              <option value="">All Hospitals</option>
              {/* Add hospital options here */}
            </select>
          </div>
          <div className="compliance-filter">
            <label htmlFor="filterViolation" className="compliance-filter-label">
              Compliance Status
            </label>
            <select
              id="filterViolation"
              value={filterViolation}
              onChange={(e) => setFilterViolation(e.target.value)}
              className="compliance-filter-select"
            >
              <option value="">All</option>
              <option value="violation">Violations Only</option>
              <option value="compliant">Compliant Only</option>
            </select>
          </div>
          <div className="compliance-filter-btn">
            <button
              onClick={() => setFilterHospital('') || setFilterViolation('')}
              className="compliance-filter-clear"
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
          itemsPerPage={15}
        />
      )}

      {/* Legend */}
      <div className="compliance-legend">
        <h3 className="compliance-legend-title">Legend</h3>
        <div className="compliance-legend-items">
          <div className="compliance-legend-item">
            <span className="compliance-legend-badge">VIOLATION</span>
            <span className="compliance-legend-text">Waste pending for more than 48 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceMonitor;
