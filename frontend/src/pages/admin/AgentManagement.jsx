import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/users/role/COLLECTION_AGENCY');
      setAgents(response.data);
    } catch (error) {
      toast.error('Failed to fetch collection agents.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'phone',
      header: 'Phone',
      render: (value) => value || '—',
    },
    {
      key: 'createdAt',
      header: 'Registered',
      render: (value) => formatDate(value),
    },
    {
      key: 'active',
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collection Agents</h1>
          <p className="text-sm text-gray-500 mt-1">All registered collection agency accounts</p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow">
          Total: <span className="font-semibold text-gray-900">{agents.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      ) : agents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">🚚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No collection agents yet</h3>
          <p className="text-sm text-gray-500">Collection agency accounts will appear here once they register.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={agents} itemsPerPage={10} />
      )}
    </div>
  );
};

export default AgentManagement;