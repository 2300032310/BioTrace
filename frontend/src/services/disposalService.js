import api from './api';

export const disposalService = {
  createDisposal: async (disposalData) => {
    const response = await api.post('/disposals', disposalData);
    return response.data;
  },

  getAllDisposals: async () => {
    const response = await api.get('/disposals');
    return response.data;
  },

  getDisposalById: async (id) => {
    const response = await api.get(`/disposals/${id}`);
    return response.data;
  },

  getDisposalByWasteRecordId: async (wasteRecordId) => {
    const response = await api.get(`/disposals/waste/${wasteRecordId}`);
    return response.data;
  }
};