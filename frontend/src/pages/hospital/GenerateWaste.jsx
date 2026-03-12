import React, { useState, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { wasteService } from '../../services/wasteService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
    { value: 'YELLOW', label: 'Yellow (Infectious)', color: 'bg-yellow-100 border-yellow-500' },
    { value: 'RED', label: 'Red (Contaminated Plastic)', color: 'bg-red-100 border-red-500' },
    { value: 'WHITE', label: 'White (Sharp Objects)', color: 'bg-gray-100 border-gray-500' },
    { value: 'BLUE', label: 'Blue (Glassware)', color: 'bg-blue-100 border-blue-500' }
  ];

  const departments = ['ICU', 'OPD', 'Surgery', 'Lab', 'Emergency', 'Pharmacy', 'Radiology'];

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Generate Waste Record</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Waste Type</label>
          <select
            name="wasteType"
            value={formData.wasteType}
            onChange={handleChange}
            className={`w-full p-2 border-2 rounded ${
              wasteTypes.find(w => w.value === formData.wasteType)?.color
            }`}
            required
          >
            {wasteTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Quantity (kg)</label>
          <input
            type="number"
            name="quantityKg"
            value={formData.quantityKg}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            className="w-full p-2 border rounded"
            placeholder="Enter quantity in kg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Generation Date</label>
            <input
              type="date"
              name="generationDate"
              value={formData.generationDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Generation Time</label>
            <input
              type="time"
              name="generationTime"
              value={formData.generationTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Create Waste Record
        </button>
      </form>
    </div>
  );
}