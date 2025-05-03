/**
 * Irk (Breed) ile ilgili API isteklerini yöneten servis.
 * /api/breeds endpoint'i üzerinden CRUD işlemlerini gerçekleştirir.
 */

import { fetchWithAuth } from './apiService';

const breedService = {
  /**
   * Tüm ırkları sayfalama parametreleriyle getirir
   * 
   * @param {number} page - Sayfa numarası (0'dan başlar)
   * @param {number} size - Sayfadaki kayıt sayısı
   * @returns {Promise<Object>} - Sayfalanmış ırk listesi ve meta veriler
   */
  async getBreeds(page = 0, size = 10) {
    return fetchWithAuth(`breeds?page=${page}&size=${size}`);
  },

  /**
   * Belirli bir ID'ye sahip ırkın detaylarını getirir
   * 
   * @param {number} id - Irk ID'si
   * @returns {Promise<Object>} - Irk detayları
   */
  async getBreedById(id) {
    return fetchWithAuth(`breeds/${id}`);
  },

  /**
   * Yeni bir ırk kaydı oluşturur
   * 
   * @param {Object} breedData - Irk verileri
   * @param {string} breedData.name - Irk adı
   * @param {number} breedData.speciesId - Tür ID'si
   * @returns {Promise<Object>} - Oluşturulan ırk bilgileri
   */
  async createBreed(breedData) {
    return fetchWithAuth('breeds', {
      method: 'POST',
      body: JSON.stringify(breedData),
    });
  },

  /**
   * Mevcut bir ırkı günceller
   * 
   * @param {number} id - Güncellenecek ırk ID'si
   * @param {Object} breedData - Güncellenmiş ırk verileri
   * @param {string} breedData.name - Irk adı
   * @param {number} breedData.speciesId - Tür ID'si
   * @returns {Promise<Object>} - Güncellenmiş ırk bilgileri
   */
  async updateBreed(id, breedData) {
    return fetchWithAuth(`breeds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(breedData),
    });
  },

  /**
   * Bir ırkı ID'sine göre siler
   * 
   * @param {number} id - Silinecek ırk ID'si
   * @returns {Promise<void>}
   */
  async deleteBreed(id) {
    return fetchWithAuth(`breeds/${id}`, {
      method: 'DELETE',
    });
  },
};

export default breedService; 