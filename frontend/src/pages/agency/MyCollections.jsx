import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import collectionService from '../../services/collectionService';
import { disposalService } from '../../services/disposalService';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime, formatQuantity, DISPOSAL_METHODS } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/MyCollections.css';

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
          className="disposal-btn"
        >
          Log Disposal
        </button>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="my-collections-header">
        My Collections (Ready for Disposal)
      </h1>

      {loading ? (
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              Log Disposal
            </h2>
            <form onSubmit={handleSubmitDisposal} className="modal-form">
              <div className="modal-field">
                <label className="modal-label">
                  Waste Type
                </label>
                <div className="modal-field-readonly">
                  {selectedCollection?.wasteType}
                </div>
              </div>

              <div className="modal-field">
                <label className="modal-label">
                  Quantity (kg)
                </label>
                <div className="modal-field-readonly">
                  {formatQuantity(selectedCollection?.quantityKg)}
                </div>
              </div>

              <div className="modal-field">
                <label htmlFor="disposalMethod" className="modal-label">
                  Disposal Method
                </label>
                <select
                  id="disposalMethod"
                  name="disposalMethod"
                  value={disposalForm.disposalMethod}
                  onChange={handleDisposalChange}
                  className="modal-select"
                >
                  {DISPOSAL_METHODS.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label htmlFor="disposalFacility" className="modal-label">
                  Disposal Facility
                </label>
                <input
                  id="disposalFacility"
                  name="disposalFacility"
                  type="text"
                  required
                  value={disposalForm.disposalFacility}
                  onChange={handleDisposalChange}
                  className="modal-input"
                  placeholder="Enter facility name"
                />
              </div>

              <div className="modal-row">
                <div className="modal-field">
                  <label htmlFor="disposalDate" className="modal-label">
                    Disposal Date
                  </label>
                  <input
                    id="disposalDate"
                    name="disposalDate"
                    type="date"
                    required
                    value={disposalForm.disposalDate}
                    onChange={handleDisposalChange}
                    className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="disposalTime" className="modal-label">
                    Disposal Time
                  </label>
                  <input
                    id="disposalTime"
                    name="disposalTime"
                    type="time"
                    required
                    value={disposalForm.disposalTime}
                    onChange={handleDisposalChange}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="modal-btn modal-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="modal-btn modal-btn-submit"
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
