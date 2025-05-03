import { fetchWithAuth } from './apiService';

/**
 * Hasta Sahibi Servisi
 * 
 * Backend tarafında /api/owners endpoint'i üzerinden hasta sahipleri için CRUD işlemleri yapar
 */
const ownerService = {
  /**
   * Hasta sahiplerini sayfalama ile getir
   * @param {number} page - Sayfa numarası
   * @param {number} size - Sayfa başına kayıt sayısı
   * @returns {Promise<Object>} - Hasta sahipleri listesi ve sayfalama bilgileri
   */
  async getOwners(page = 0, size = 10) {
    return fetchWithAuth(`owners?page=${page}&size=${size}`);
  },

  /**
   * Hasta sahibi detayını getir
   * @param {number} id - Hasta sahibi ID'si
   * @returns {Promise<Object>} - Hasta sahibi detayı
   */
  async getOwnerById(id) {
    return fetchWithAuth(`owners/${id}`);
  },

  /**
   * Yeni hasta sahibi ekle
   * @param {Object} ownerData - Hasta sahibi verileri
   * @returns {Promise<Object>} - Eklenen hasta sahibi bilgileri
   */
  async createOwner(ownerData) {
    // Backend tarafına firstName ve lastName olarak ayrı gönderiliyor
    // Eğer frontend'de fullName olarak geliyorsa bunu parçalayabiliriz
    let finalData = { ...ownerData };
    
    if (ownerData.fullName && !ownerData.firstName) {
      const nameParts = ownerData.fullName.split(' ');
      if (nameParts.length > 1) {
        finalData.firstName = nameParts[0];
        finalData.lastName = nameParts.slice(1).join(' ');
      } else {
        finalData.firstName = ownerData.fullName;
        finalData.lastName = '';
      }
      delete finalData.fullName;
    }
    
    return fetchWithAuth('owners', {
      method: 'POST',
      body: JSON.stringify(finalData),
    });
  },

  /**
   * Hasta sahibini güncelle
   * @param {number} id - Güncellenecek hasta sahibi ID'si
   * @param {Object} ownerData - Güncellenen hasta sahibi verileri
   * @returns {Promise<Object>} - Güncellenen hasta sahibi bilgileri
   */
  async updateOwner(id, ownerData) {
    // Backend tarafına firstName ve lastName olarak ayrı gönderiliyor
    // Eğer frontend'de fullName olarak geliyorsa bunu parçalayabiliriz
    let finalData = { ...ownerData };
    
    if (ownerData.fullName && !ownerData.firstName) {
      const nameParts = ownerData.fullName.split(' ');
      if (nameParts.length > 1) {
        finalData.firstName = nameParts[0];
        finalData.lastName = nameParts.slice(1).join(' ');
      } else {
        finalData.firstName = ownerData.fullName;
        finalData.lastName = '';
      }
      delete finalData.fullName;
    }
    
    return fetchWithAuth(`owners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(finalData),
    });
  },

  /**
   * Hasta sahibini sil
   * @param {number} id - Silinecek hasta sahibi ID'si
   * @returns {Promise<void>}
   */
  async deleteOwner(id) {
    return fetchWithAuth(`owners/${id}`, {
      method: 'DELETE',
    });
  },
};

export default ownerService; 