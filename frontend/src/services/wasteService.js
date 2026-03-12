import api from './api';

export const wasteService = {
  createWaste: async (wasteData) => {
    const response = await api.post('/waste', wasteData);
    return response.data;
  },

  getAllWaste: async () => {
    const response = await api.get('/waste');
    return response.data;
  },

  getWasteById: async (id) => {
    const response = await api.get(`/waste/${id}`);
    return response.data;
  },

  getWasteByHospital: async (hospitalId) => {
    const response = await api.get(`/waste/hospital/${hospitalId}`);
    return response.data;
  },

  updateWasteStatus: async (id, status) => {
    const response = await api.put(`/waste/${id}/status?status=${status}`);
    return response.data;
  },

  getWasteStats: async () => {
    const response = await api.get('/waste/stats');
    return response.data;
  }
};