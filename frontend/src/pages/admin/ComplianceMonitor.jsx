import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { wasteService } from '../../services/wasteService';
import { formatDate, getTimeElapsed, isViolation } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';

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
    setWasteRecords(Array.isArray(data) ? data : []);
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
    if (filterViolation === 'violation' && !isViolation(record.createdAt)) return false;
    if (filterViolation === 'compliant' && isViolation(record.createdAt)) return false;
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
      render: (value) => {
        const elapsed = getTimeElapsed(value);
        const violation = isViolation(value);
        return (
          <div className="flex items-center gap-2">
            <span className={violation ? 'text-red-600 font-medium' : 'text-gray-600'}>
              {elapsed}
            </span>
            {violation && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
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

  const violations = wasteRecords.filter(r => isViolation(r.createdAt));
  const complianceRate = wasteRecords.length > 0 
    ? Math.round(((wasteRecords.length - violations.length) / wasteRecords.length) * 100)
    : 100;

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Compliance Monitor
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Records</p>
          <p className="text-2xl font-semibold text-gray-900">{wasteRecords.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Violations (&gt;48hrs)</p>
          <p className="text-2xl font-semibold text-red-600">{violations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
          <p className="text-2xl font-semibold text-green-600">{complianceRate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="filterHospital" className="block text-sm font-medium text-gray-700 mb-1">
              Hospital
            </label>
            <select
              id="filterHospital"
              value={filterHospital}
              onChange={(e) => setFilterHospital(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            >
              <option value="">All Hospitals</option>
              {/* Add hospital options here */}
            </select>
          </div>
          <div>
            <label htmlFor="filterViolation" className="block text-sm font-medium text-gray-700 mb-1">
              Compliance Status
            </label>
            <select
              id="filterViolation"
              value={filterViolation}
              onChange={(e) => setFilterViolation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="violation">Violations Only</option>
              <option value="compliant">Compliant Only</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilterHospital('') || setFilterViolation('')}
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
          itemsPerPage={15}
        />
      )}

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Legend</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">VIOLATION</span>
            <span className="text-gray-500">Waste pending for more than 48 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceMonitor;
