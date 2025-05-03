/**
 * Hastalık (Disease) ile ilgili API isteklerini yöneten servis.
 * /api/v1/diseases endpoint'i üzerinden CRUD ve arama işlemlerini gerçekleştirir.
 */

import { fetchWithAuth } from './apiService';

const diseaseService = {
  /**
   * Tüm hastalıkları getirir
   * 
   * @returns {Promise<Array>} - Hastalık listesi
   */
  async getAllDiseases() {
    return fetchWithAuth('v1/diseases');
  },

  /**
   * Belirli bir ID'ye sahip hastalığın detaylarını getirir
   * 
   * @param {number} id - Hastalık ID'si
   * @returns {Promise<Object>} - Hastalık detayları
   */
  async getDiseaseById(id) {
    return fetchWithAuth(`v1/diseases/${id}`);
  },

  /**
   * Yeni bir hastalık kaydı oluşturur
   * 
   * @param {Object} diseaseData - Hastalık verileri
   * @param {string} diseaseData.name - Hastalık adı
   * @param {string} diseaseData.description - Hastalık açıklaması
   * @param {string} diseaseData.symptoms - Semptomlar
   * @param {string} diseaseData.category - Hastalık kategorisi
   * @param {string} diseaseData.animalTypes - Etkilenen hayvan türleri
   * @returns {Promise<Object>} - Oluşturulan hastalık bilgileri
   */
  async createDisease(diseaseData) {
    return fetchWithAuth('v1/diseases', {
      method: 'POST',
      body: JSON.stringify(diseaseData),
    });
  },

  /**
   * Mevcut bir hastalığı günceller
   * 
   * @param {number} id - Güncellenecek hastalık ID'si
   * @param {Object} diseaseData - Güncellenmiş hastalık verileri
   * @param {string} diseaseData.name - Hastalık adı
   * @param {string} diseaseData.description - Hastalık açıklaması
   * @param {string} diseaseData.symptoms - Semptomlar
   * @param {string} diseaseData.category - Hastalık kategorisi
   * @param {string} diseaseData.animalTypes - Etkilenen hayvan türleri
   * @returns {Promise<Object>} - Güncellenmiş hastalık bilgileri
   */
  async updateDisease(id, diseaseData) {
    return fetchWithAuth(`v1/diseases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(diseaseData),
    });
  },

  /**
   * Bir hastalığı ID'sine göre siler
   * 
   * @param {number} id - Silinecek hastalık ID'si
   * @returns {Promise<void>}
   */
  async deleteDisease(id) {
    return fetchWithAuth(`v1/diseases/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Hastalık adına göre arama yapar
   * 
   * @param {string} name - Aranacak hastalık adı
   * @returns {Promise<Array>} - Eşleşen hastalık listesi
   */
  async searchDiseasesByName(name) {
    return fetchWithAuth(`v1/diseases/search?name=${encodeURIComponent(name)}`);
  },

  /**
   * Belirli bir kategorideki hastalıkları getirir
   * 
   * @param {string} category - Hastalık kategorisi
   * @returns {Promise<Array>} - Kategori bazlı hastalık listesi
   */
  async getDiseasesByCategory(category) {
    return fetchWithAuth(`v1/diseases/category/${encodeURIComponent(category)}`);
  },

  /**
   * Belirli bir hayvan türüne ait hastalıkları getirir
   * 
   * @param {string} animalType - Hayvan türü
   * @returns {Promise<Array>} - Hayvan türüne göre hastalık listesi
   */
  async getDiseasesByAnimalType(animalType) {
    return fetchWithAuth(`v1/diseases/animal-type/${encodeURIComponent(animalType)}`);
  }
};

export default diseaseService; 