import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { wasteService } from '../../services/wasteService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/GenerateWaste.css';

export default function GenerateWaste() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    wasteType: 'YELLOW',
    quantityKg: '',
    department: 'ICU',
    generationDate: new Date().toISOString().split('T')[0],
    generationTime: new Date().toTimeString().split(' ')[0].substring(0, 5)
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate user exists
    if (!user) {
      toast.error('Please login first');
      return;
    }
    
    // Use hospitalId if available, otherwise use userId as fallback
    const hospitalId = user.hospitalId || user.userId;
    
    if (!hospitalId) {
      toast.error('User not associated with a hospital. Please contact administrator.');
      return;
    }
    
    try {
      const wasteData = {
        hospitalId: hospitalId,
        wasteType: formData.wasteType,
        quantityKg: parseFloat(formData.quantityKg),
        generationDate: formData.generationDate,
        generationTime: formData.generationTime,
        department: formData.department
      };
      
      await wasteService.createWaste(wasteData);
      toast.success('Waste record created successfully!');
      
      // Navigate to waste records page to see the new record
      navigate('/hospital/waste-records');
      
      // Reset form (won't be seen due to navigation)
      setFormData({
        wasteType: 'YELLOW',
        quantityKg: '',
        department: 'ICU',
        generationDate: new Date().toISOString().split('T')[0],
        generationTime: new Date().toTimeString().split(' ')[0].substring(0, 5)
      });
    } catch (error) {
      console.error('Failed to create waste record:', error);
      toast.error('Failed to create waste record');
    }
  };

  const wasteTypes = [
    { value: 'YELLOW', label: 'Yellow (Infectious)', color: 'waste-type-yellow' },
    { value: 'RED', label: 'Red (Contaminated Plastic)', color: 'waste-type-red' },
    { value: 'WHITE', label: 'White (Sharp Objects)', color: 'waste-type-white' },
    { value: 'BLUE', label: 'Blue (Glassware)', color: 'waste-type-blue' }
  ];

  const departments = ['ICU', 'OPD', 'Surgery', 'Lab', 'Emergency', 'Pharmacy', 'Radiology'];

  const getWasteTypeClass = () => {
    const wasteType = wasteTypes.find(w => w.value === formData.wasteType);
    return wasteType ? wasteType.color : '';
  };

  return (
    <div className="generate-waste-container">
      <h2 className="generate-waste-title">Generate Waste Record</h2>
      
      <form onSubmit={handleSubmit} className="generate-waste-form">
        <div className="generate-waste-field">
          <label className="generate-waste-label">Waste Type</label>
          <select
            name="wasteType"
            value={formData.wasteType}
            onChange={handleChange}
            className={`generate-waste-select ${getWasteTypeClass()}`}
            required
          >
            {wasteTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="generate-waste-field">
          <label className="generate-waste-label">Quantity (kg)</label>
          <input
            type="number"
            name="quantityKg"
            value={formData.quantityKg}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            className="generate-waste-input"
            placeholder="Enter quantity in kg"
            required
          />
        </div>

        <div className="generate-waste-field">
          <label className="generate-waste-label">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="generate-waste-select"
            required
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="generate-waste-row">
          <div className="generate-waste-field">
            <label className="generate-waste-label">Generation Date</label>
            <input
              type="date"
              name="generationDate"
              value={formData.generationDate}
              onChange={handleChange}
              className="generate-waste-input"
              required
            />
          </div>

          <div className="generate-waste-field">
            <label className="generate-waste-label">Generation Time</label>
            <input
              type="time"
              name="generationTime"
              value={formData.generationTime}
              onChange={handleChange}
              className="generate-waste-input"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="generate-waste-submit"
        >
          Create Waste Record
        </button>
      </form>
    </div>
  );
}
