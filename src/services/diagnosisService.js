import { fetchWithAuth } from './apiService';

const API_URL = '/api';

const diagnosisService = {
  // Tüm tanıları getir
  async getDiagnoses() {
    return fetchWithAuth('diagnosis/all');
  },

  // Tanı detayını getir
  async getDiagnosisById(id) {
    return fetchWithAuth(`diagnosis/find/${id}`);
  },

  // Hastaya ait tanıları getir
  async getDiagnosesByPatientId(patientId) {
    return fetchWithAuth(`diagnosis/patient/${patientId}`);
  },

  // Yeni tanı ekle
  async createDiagnosis(diagnosisData) {
    return fetchWithAuth('diagnosis/create', {
      method: 'POST',
      body: JSON.stringify(diagnosisData),
    });
  },

  // Tanıyı güncelle
  async updateDiagnosis(id, diagnosisData) {
    return fetchWithAuth(`diagnosis/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(diagnosisData),
    });
  },

  // Tanıyı sil
  async deleteDiagnosis(id) {
    return fetchWithAuth(`diagnosis/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

export default diagnosisService; 