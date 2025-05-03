import { fetchWithAuth } from './apiService';

const prescriptionItemService = {
  // Tüm reçete öğelerini getir
  async getAllPrescriptionItems() {
    return fetchWithAuth('prescription-items/all');
  },

  // Reçete öğesi detayını getir
  async getPrescriptionItemById(id) {
    return fetchWithAuth(`prescription-items/${id}`);
  },

  // Reçeteye göre reçete öğelerini getir
  async getPrescriptionItemsByPrescriptionId(prescriptionId) {
    return fetchWithAuth(`prescription-items/prescription/${prescriptionId}`);
  },

  // Yeni reçete öğesi ekle
  async createPrescriptionItem(prescriptionItemData) {
    return fetchWithAuth('prescription-items/create', {
      method: 'POST',
      body: JSON.stringify(prescriptionItemData),
    });
  },

  // Reçete öğesini güncelle
  async updatePrescriptionItem(id, prescriptionItemData) {
    return fetchWithAuth(`prescription-items/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prescriptionItemData),
    });
  },

  // Reçete öğesini sil
  async deletePrescriptionItem(id) {
    return fetchWithAuth(`prescription-items/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

export default prescriptionItemService; 