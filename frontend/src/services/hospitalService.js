import api from './api';

export const hospitalService = {
  getAllHospitals: async () => {
    const response = await api.get('/hospitals');
    return response.data;
  },

  getHospitalById: async (id) => {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },

  createHospital: async (hospitalData) => {
    const response = await api.post('/hospitals', hospitalData);
    return response.data;
  },

  updateHospital: async (id, hospitalData) => {
    const response = await api.put(`/hospitals/${id}`, hospitalData);
    return response.data;
  },

  deleteHospital: async (id) => {
    const response = await api.delete(`/hospitals/${id}`);
    return response.data;
  },

  getHospitalStats: async () => {
    const response = await api.get('/hospitals/stats');
    return response.data;
  }
};

export default hospitalService;
