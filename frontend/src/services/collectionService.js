import api from './api';

export const collectionService = {
  getAllCollectionRequests: async () => {
    const response = await api.get('/collections');
    return response.data;
  },

  getCollectionRequestById: async (id) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },

  getCollectionRequestsByStatus: async (status) => {
    const response = await api.get(`/collections/status/${status}`);
    return response.data;
  },

  getCollectionRequestsByAgency: async (agencyId) => {
    const response = await api.get(`/collections/agency/${agencyId}`);
    return response.data;
  },

  assignCollection: async (id, userId) => {
    const response = await api.put(`/collections/${id}/assign`, { userId });
    return response.data;
  },

  completeCollection: async (id, collectionData) => {
    const response = await api.put(`/collections/${id}/complete`, collectionData);
    return response.data;
  },

  getCollectionStats: async () => {
    const response = await api.get('/collections/stats');
    return response.data;
  }
};

export default collectionService;
