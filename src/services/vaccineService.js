/**
 * Aşı (Vaccine) ile ilgili API isteklerini yöneten servis.
 * /api/vaccines endpoint'i üzerinden CRUD ve arama işlemlerini gerçekleştirir.
 */

import { fetchWithAuth } from './apiService';

const vaccineService = {
  /**
   * Tüm aşıları sayfalama ile getirir
   * 
   * @param {number} page - Sayfa numarası (0-tabanlı)
   * @param {number} size - Sayfa başına kayıt sayısı
   * @returns {Promise<Object>} - Sayfalanmış aşı listesi
   */
  async getVaccines(page = 0, size = 10) {
    return fetchWithAuth(`vaccines?page=${page}&size=${size}`);
  },

  /**
   * Belirli bir ID'ye sahip aşının detaylarını getirir
   * 
   * @param {number} id - Aşı ID'si
   * @returns {Promise<Object>} - Aşı detayları
   */
  async getVaccineById(id) {
    return fetchWithAuth(`vaccines/${id}`);
  },

  /**
   * Yeni bir aşı kaydı oluşturur
   * 
   * @param {Object} vaccineData - Aşı verileri
   * @param {string} vaccineData.name - Aşı adı
   * @param {string} vaccineData.manufacturer - Üretici firma
   * @param {string} vaccineData.description - Aşı açıklaması
   * @param {string} vaccineData.targetSpecies - Hedef türler (ör: "Kedi,Köpek")
   * @param {string} vaccineData.schedule - Uygulama takvimi
   * @param {string} vaccineData.dosage - Doz bilgisi 
   * @returns {Promise<Object>} - Oluşturulan aşı bilgileri
   */
  async createVaccine(vaccineData) {
    return fetchWithAuth('vaccines', {
      method: 'POST',
      body: JSON.stringify(vaccineData),
    });
  },

  /**
   * Mevcut bir aşıyı günceller
   * 
   * @param {number} id - Güncellenecek aşı ID'si
   * @param {Object} vaccineData - Güncellenmiş aşı verileri
   * @returns {Promise<Object>} - Güncellenmiş aşı bilgileri
   */
  async updateVaccine(id, vaccineData) {
    return fetchWithAuth(`vaccines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vaccineData),
    });
  },

  /**
   * Bir aşıyı ID'sine göre siler
   * 
   * @param {number} id - Silinecek aşı ID'si
   * @returns {Promise<void>}
   */
  async deleteVaccine(id) {
    return fetchWithAuth(`vaccines/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Aşı adına göre arama yapar
   * 
   * @param {string} name - Aranacak aşı adı
   * @returns {Promise<Array>} - Eşleşen aşı listesi
   */
  async searchVaccinesByName(name) {
    return fetchWithAuth(`vaccines/search?name=${encodeURIComponent(name)}`);
  },
  
  /**
   * Belirli bir hayvan türüne göre aşıları filtreler
   * 
   * @param {string} species - Hayvan türü (ör: "Kedi")
   * @returns {Promise<Array>} - Türe uygun aşı listesi
   */
  async getVaccinesBySpecies(species) {
    return fetchWithAuth(`vaccines/species/${encodeURIComponent(species)}`);
  }
};

export default vaccineService; 