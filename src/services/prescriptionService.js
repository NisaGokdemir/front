import { fetchWithAuth } from './apiService';

const prescriptionService = {
  // Tüm reçeteleri getir
  async getAllPrescriptions() {
    return fetchWithAuth('prescriptions/all');
  },

  // Reçete detayını getir
  async getPrescriptionById(id) {
    return fetchWithAuth(`prescriptions/find/${id}`);
  },

  // Tanıya göre reçeteleri getir
  async getPrescriptionsByDiagnosisId(diagnosisId) {
    return fetchWithAuth(`prescriptions/diagnosis/${diagnosisId}`);
  },

  // Yeni reçete ekle
  async createPrescription(prescriptionData) {
    return fetchWithAuth('prescriptions/create', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  },

  // Reçeteyi güncelle
  async updatePrescription(id, prescriptionData) {
    return fetchWithAuth(`prescriptions/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prescriptionData),
    });
  },

  // Reçeteyi sil
  async deletePrescription(id) {
    return fetchWithAuth(`prescriptions/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

export default prescriptionService; 