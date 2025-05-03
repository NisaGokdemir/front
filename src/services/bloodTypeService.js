import { fetchWithAuth } from './apiService';

/**
 * Kan Grubu Servisi
 * 
 * Backend tarafında /api/bloodTypes endpoint'i üzerinden kan grupları için CRUD işlemleri yapar
 */
const bloodTypeService = {
  /**
   * Kan gruplarını sayfalama ile getir
   * @param {number} page - Sayfa numarası
   * @param {number} size - Sayfa başına kayıt sayısı
   * @returns {Promise<Object>} - Kan grupları listesi ve sayfalama bilgileri
   */
  async getBloodTypes(page = 0, size = 10) {
    return fetchWithAuth(`bloodTypes?page=${page}&size=${size}`);
  },

  /**
   * Kan grubu detayını getir
   * @param {number} id - Kan grubu ID'si
   * @returns {Promise<Object>} - Kan grubu detayı
   */
  async getBloodTypeById(id) {
    return fetchWithAuth(`bloodTypes/${id}`);
  },

  /**
   * Yeni kan grubu ekle
   * @param {Object} bloodTypeData - Kan grubu verileri { type, speciesId }
   * @returns {Promise<Object>} - Eklenen kan grubu bilgileri
   */
  async createBloodType(bloodTypeData) {
    // Backend'e gönderilecek veri yapısı: { type, speciesId }
    return fetchWithAuth('bloodTypes', {
      method: 'POST',
      body: JSON.stringify(bloodTypeData),
    });
  },

  /**
   * Kan grubunu güncelle
   * @param {number} id - Güncellenecek kan grubu ID'si
   * @param {Object} bloodTypeData - Güncellenen kan grubu verileri { type, speciesId }
   * @returns {Promise<Object>} - Güncellenen kan grubu bilgileri
   */
  async updateBloodType(id, bloodTypeData) {
    return fetchWithAuth(`bloodTypes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bloodTypeData),
    });
  },

  /**
   * Kan grubunu sil
   * @param {number} id - Silinecek kan grubu ID'si
   * @returns {Promise<void>}
   */
  async deleteBloodType(id) {
    return fetchWithAuth(`bloodTypes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default bloodTypeService; 