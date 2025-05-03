import { fetchWithAuth } from './apiService';

const medicationService = {
  // Tüm ilaçları getir
  async getMedications(page = 0, size = 10) {
    return fetchWithAuth(`medication/all?page=${page}&size=${size}`);
  },

  // Tüm ilaçları getir (pagination olmadan)
  async getAllMedications() {
    return fetchWithAuth('medication/all');
  },

  // Tek bir ilaç detayını getir
  async getMedicationById(id) {
    return fetchWithAuth(`medication/find/${id}`);
  },

  // Yeni ilaç ekle
  async createMedication(medicationData) {
    return fetchWithAuth('medication/create', {
      method: 'POST',
      body: JSON.stringify(medicationData),
    });
  },

  // İlaçı güncelle
  async updateMedication(id, medicationData) {
    return fetchWithAuth(`medication/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicationData),
    });
  },

  // İlacı sil
  async deleteMedication(id) {
    return fetchWithAuth(`medication/delete/${id}`, {
      method: 'DELETE',
    });
  },

  // Tüm ilaç partilerini getir
  async getMedicationBatches(page = 0, size = 10) {
    return fetchWithAuth(`medication-batch/all?page=${page}&size=${size}`);
  },

  // Tüm ilaç partilerini getir (pagination olmadan)
  async getAllMedicationBatches() {
    return fetchWithAuth('medication-batch/all');
  },

  // Tek bir ilaç partisi detayını getir
  async getMedicationBatchById(id) {
    return fetchWithAuth(`medication-batch/find/${id}`);
  },

  // İlaca göre ilaç partilerini getir
  async getMedicationBatchesByMedicationId(medicationId) {
    return fetchWithAuth(`medication-batch/medication/${medicationId}`);
  },
};

export default medicationService; 