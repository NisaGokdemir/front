import { fetchWithAuth } from './apiService';

const API_URL = 'http://localhost:8081/api';

const patientService = {
  // Hastaları sayfalama ile getir
  async getPatients(page = 0, size = 10) {
    return fetchWithAuth(`patients?page=${page}&size=${size}`);
  },

  // Hasta detayını getir
  async getPatientById(id) {
    return fetchWithAuth(`patients/${id}`);
  },

  // Yeni hasta ekle
  async createPatient(patientData) {
    return fetchWithAuth('patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  // Hastayı güncelle
  async updatePatient(id, patientData) {
    return fetchWithAuth(`patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  },

  // Hastayı sil
  async deletePatient(id) {
    return fetchWithAuth(`patients/${id}`, {
      method: 'DELETE',
    });
  },
};

export default patientService; 