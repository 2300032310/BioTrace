import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import hospitalService from '../../services/hospitalService';
import { formatDate } from '../../utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/HospitalManagement.css';

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    registrationNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await hospitalService.getAllHospitals();
      setHospitals(data);
    } catch (error) {
      toast.error('Failed to fetch hospitals.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingHospital(null);
    setFormData({
      name: '',
      address: '',
      contactPerson: '',
      phone: '',
      email: '',
      registrationNumber: '',
    });
    setShowModal(true);
  };

  const handleEdit = (hospital) => {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name,
      address: hospital.address || '',
      contactPerson: hospital.contactPerson || '',
      phone: hospital.phone || '',
      email: hospital.email || '',
      registrationNumber: hospital.registrationNumber,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;
    
    try {
      await hospitalService.deleteHospital(id);
      toast.success('Hospital deleted successfully!');
      fetchHospitals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete hospital.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingHospital) {
        await hospitalService.updateHospital(editingHospital.id, formData);
        toast.success('Hospital updated successfully!');
      } else {
        await hospitalService.createHospital(formData);
        toast.success('Hospital created successfully!');
      }
      setShowModal(false);
      fetchHospitals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save hospital.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Hospital Name',
    },
    {
      key: 'registrationNumber',
      header: 'Registration No.',
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'address',
      header: 'Address',
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, record) => (
        <div className="hospital-actions-group">
          <button
            onClick={() => handleEdit(record)}
            className="hospital-edit-btn"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="hospital-delete-btn"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="hospital-management-header">
        <h1 className="hospital-management-title">
          Hospital Management
        </h1>
        <button
          onClick={handleAddNew}
          className="hospital-management-add-btn"
        >
          Add Hospital
        </button>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={hospitals}
          itemsPerPage={10}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {editingHospital ? 'Edit Hospital' : 'Add Hospital'}
            </h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-field">
                <label htmlFor="name" className="modal-label">
                  Hospital Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label htmlFor="registrationNumber" className="modal-label">
                  Registration Number *
                </label>
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label htmlFor="contactPerson" className="modal-label">
                  Contact Person
                </label>
                <input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label htmlFor="phone" className="modal-label">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label htmlFor="email" className="modal-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label htmlFor="address" className="modal-label">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  className="modal-input"
                />
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
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalManagement;
