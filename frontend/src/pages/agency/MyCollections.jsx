import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import collectionService from '../../services/collectionService';
import { disposalService } from '../../services/disposalService';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime, formatQuantity, DISPOSAL_METHODS } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';

const MyCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [disposalForm, setDisposalForm] = useState({
    disposalMethod: 'INCINERATION',
    disposalFacility: '',
    disposalDate: new Date().toISOString().split('T')[0],
    disposalTime: new Date().toTimeString().slice(0, 5),
  });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await collectionService.getAllCollectionRequests();
      // Filter for completed collections that haven't been disposed yet
      setCollections(data.filter(c => c.status === 'COMPLETED'));
    } catch (error) {
      toast.error('Failed to fetch collections.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogDisposal = (collection) => {
    setSelectedCollection(collection);
    setShowModal(true);
  };

  const handleDisposalChange = (e) => {
    setDisposalForm({
      ...disposalForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitDisposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Combine date and time into DateTime format
      const disposalDateTime = `${disposalForm.disposalDate}T${disposalForm.disposalTime}:00`;
      
      const disposalData = {
        wasteRecordId: selectedCollection.wasteRecordId,
        disposalMethod: disposalForm.disposalMethod,
        disposalFacility: disposalForm.disposalFacility,
        disposalDate: disposalDateTime,
      };

      await disposalService.createDisposal(disposalData);
      toast.success('Disposal logged successfully!');
      setShowModal(false);
      fetchCollections();
      
      // Reset form
      setDisposalForm({
        disposalMethod: 'INCINERATION',
        disposalFacility: '',
        disposalDate: new Date().toISOString().split('T')[0],
        disposalTime: new Date().toTimeString().slice(0, 5),
      });
    } catch (error) {
      console.error('Disposal error:', error);
      toast.error(error.response?.data?.message || 'Failed to log disposal.');
    } finally {
      setSubmitting(false);
    }
  };

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
      key: 'scheduledPickupDate',
      header: 'Collection Date',
      render: (value) => value ? formatDateTime(value) : '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} type="request_status" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, record) => (
        <button
          onClick={() => handleLogDisposal(record)}
          className="px-3 py-1 text-xs font-medium text-white bg-brand-600 rounded hover:bg-brand-700"
        >
          Log Disposal
        </button>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        My Collections (Ready for Disposal)
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={collections}
          itemsPerPage={10}
        />
      )}

      {/* Disposal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Log Disposal
            </h2>
            <form onSubmit={handleSubmitDisposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waste Type
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-md">
                  {selectedCollection?.wasteType}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (kg)
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-md">
                  {formatQuantity(selectedCollection?.quantityKg)}
                </div>
              </div>

              <div>
                <label htmlFor="disposalMethod" className="block text-sm font-medium text-gray-700">
                  Disposal Method
                </label>
                <select
                  id="disposalMethod"
                  name="disposalMethod"
                  value={disposalForm.disposalMethod}
                  onChange={handleDisposalChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                >
                  {DISPOSAL_METHODS.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="disposalFacility" className="block text-sm font-medium text-gray-700">
                  Disposal Facility
                </label>
                <input
                  id="disposalFacility"
                  name="disposalFacility"
                  type="text"
                  required
                  value={disposalForm.disposalFacility}
                  onChange={handleDisposalChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Enter facility name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="disposalDate" className="block text-sm font-medium text-gray-700">
                    Disposal Date
                  </label>
                  <input
                    id="disposalDate"
                    name="disposalDate"
                    type="date"
                    required
                    value={disposalForm.disposalDate}
                    onChange={handleDisposalChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="disposalTime" className="block text-sm font-medium text-gray-700">
                    Disposal Time
                  </label>
                  <input
                    id="disposalTime"
                    name="disposalTime"
                    type="time"
                    required
                    value={disposalForm.disposalTime}
                    onChange={handleDisposalChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCollections;