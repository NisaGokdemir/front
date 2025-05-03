import { fetchWithAuth } from './apiService';

const familyService = {
  // Tüm familyaları sayfalama ile getir
  async getFamilies(page = 0, size = 10) {
    return fetchWithAuth(`families/all?page=${page}&size=${size}`);
  },

  // Tek bir familya detayını getir
  async getFamilyById(id) {
    return fetchWithAuth(`families/${id}`);
  },

  // Yeni familya ekle
  async createFamily(familyData) {
    return fetchWithAuth('families/create', {
      method: 'POST',
      body: JSON.stringify(familyData),
    });
  },

  // Familyayı güncelle
  async updateFamily(id, familyData) {
    return fetchWithAuth(`families/${id}`, {
      method: 'PUT',
      body: JSON.stringify(familyData),
    });
  },

  // Familyayı sil
  async deleteFamily(id) {
    return fetchWithAuth(`families/${id}`, {
      method: 'DELETE',
    });
  },
};

export default familyService; 