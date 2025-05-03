/**
 * Alerji (Allergy) ile ilgili API isteklerini yöneten servis.
 * /api/allergies endpoint'i üzerinden CRUD ve arama işlemlerini gerçekleştirir.
 */

import { fetchWithAuth } from './apiService';

const allergyService = {
  /**
   * Tüm alerjileri sayfalama ile getirir
   * 
   * @param {number} page - Sayfa numarası (0-tabanlı)
   * @param {number} size - Sayfa başına kayıt sayısı
   * @returns {Promise<Object>} - Sayfalanmış alerji listesi
   */
  async getAllergies(page = 0, size = 10) {
    return fetchWithAuth(`allergies?page=${page}&size=${size}`);
  },

  /**
   * Belirli bir ID'ye sahip alerjinin detaylarını getirir
   * 
   * @param {number} id - Alerji ID'si
   * @returns {Promise<Object>} - Alerji detayları
   */
  async getAllergyById(id) {
    return fetchWithAuth(`allergies/${id}`);
  },

  /**
   * Yeni bir alerji kaydı oluşturur
   * 
   * @param {Object} allergyData - Alerji verileri
   * @param {string} allergyData.name - Alerji adı
   * @param {string} allergyData.description - Alerji açıklaması
   * @param {number} allergyData.patientId - Hasta ID'si
   * @param {string} allergyData.severity - Şiddet derecesi (Hafif, Orta, Şiddetli)
   * @param {string} allergyData.reactionType - Reaksiyon tipi 
   * @param {string} allergyData.notes - Ek notlar
   * @returns {Promise<Object>} - Oluşturulan alerji bilgileri
   */
  async createAllergy(allergyData) {
    return fetchWithAuth('allergies', {
      method: 'POST',
      body: JSON.stringify(allergyData),
    });
  },

  /**
   * Mevcut bir alerjiyi günceller
   * 
   * @param {number} id - Güncellenecek alerji ID'si
   * @param {Object} allergyData - Güncellenmiş alerji verileri
   * @returns {Promise<Object>} - Güncellenmiş alerji bilgileri
   */
  async updateAllergy(id, allergyData) {
    return fetchWithAuth(`allergies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(allergyData),
    });
  },

  /**
   * Bir alerjiyi ID'sine göre siler
   * 
   * @param {number} id - Silinecek alerji ID'si
   * @returns {Promise<void>}
   */
  async deleteAllergy(id) {
    return fetchWithAuth(`allergies/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Belirli bir hasta için alerjileri getirir
   * 
   * @param {number} patientId - Hasta ID'si
   * @returns {Promise<Array>} - Hastaya ait alerji listesi
   */
  async getAllergiesByPatient(patientId) {
    return fetchWithAuth(`allergies/patient/${patientId}`);
  },
  
  /**
   * Alerji adına göre arama yapar
   * 
   * @param {string} name - Aranacak alerji adı
   * @returns {Promise<Array>} - Eşleşen alerji listesi
   */
  async searchAllergiesByName(name) {
    return fetchWithAuth(`allergies/search?name=${encodeURIComponent(name)}`);
  },
  
  /**
   * Şiddet derecesine göre alerjileri filtreler
   * 
   * @param {string} severity - Şiddet derecesi (Hafif, Orta, Şiddetli)
   * @returns {Promise<Array>} - Şiddet derecesine uygun alerji listesi
   */
  async getAllergiesBySeverity(severity) {
    return fetchWithAuth(`allergies/severity/${encodeURIComponent(severity)}`);
  }
};

export default allergyService; 