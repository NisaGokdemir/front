import { fetchWithAuth } from './apiService';

const speciesService = {
  // Tüm türleri sayfalama ile getir
  async getSpecies(page = 0, size = 10) {
    return fetchWithAuth(`species?page=${page}&size=${size}`);
  },

  // Tek bir tür detayını getir
  async getSpeciesById(id) {
    return fetchWithAuth(`species/${id}`);
  },

  // Yeni tür ekle
  async createSpecies(speciesData) {
    return fetchWithAuth('species', {
      method: 'POST',
      body: JSON.stringify(speciesData),
    });
  },

  // Türü güncelle
  async updateSpecies(id, speciesData) {
    return fetchWithAuth(`species/${id}`, {
      method: 'PUT',
      body: JSON.stringify(speciesData),
    });
  },

  // Türü sil
  async deleteSpecies(id) {
    return fetchWithAuth(`species/${id}`, {
      method: 'DELETE',
    });
  },
};

export default speciesService; 