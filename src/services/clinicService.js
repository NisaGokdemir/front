import { clinicService } from './apiService';

/**
 * Klinik servisi - Backend API entegrasyonu
 * Tüm klinik işlemleri için API fonksiyonları
 */
const clinicAPI = {
  /**
   * Tüm klinikleri getirir (sayfalama seçenekleriyle)
   * 
   * @param {Object} options - Sayfalama seçenekleri
   * @param {number} options.page - Sayfa numarası (0-tabanlı)
   * @param {number} options.size - Sayfa başına öğe sayısı
   * @returns {Promise<Object>} - Klinik listesi ve sayfalama bilgileri
   */
  getClinics: async (options = {}) => {
    const { page = 0, size = 10, sort = 'name,asc' } = options;
    try {
      return await clinicService.getAll(page, size, sort);
    } catch (error) {
      console.error('Klinikler getirilemedi:', error);
      throw error;
    }
  },

  /**
   * Belirli bir kliniğin detaylarını getirir
   * 
   * @param {number} id - Klinik ID
   * @returns {Promise<Object>} - Klinik detayları
   */
  getClinicById: async (id) => {
    try {
      return await clinicService.getById(id);
    } catch (error) {
      console.error(`ID: ${id} olan klinik getirilemedi:`, error);
      throw error;
    }
  },

  /**
   * Yeni bir klinik oluşturur
   * 
   * @param {Object} clinicData - Yeni klinik verileri
   * @returns {Promise<Object>} - Oluşturulan klinik
   */
  createClinic: async (clinicData) => {
    try {
      return await clinicService.create(clinicData);
    } catch (error) {
      console.error('Klinik oluşturulamadı:', error);
      throw error;
    }
  },

  /**
   * Mevcut bir kliniği günceller
   * 
   * @param {number} id - Klinik ID
   * @param {Object} clinicData - Güncellenecek klinik verileri
   * @returns {Promise<Object>} - Güncellenmiş klinik
   */
  updateClinic: async (id, clinicData) => {
    try {
      return await clinicService.update(id, clinicData);
    } catch (error) {
      console.error(`ID: ${id} olan klinik güncellenemedi:`, error);
      throw error;
    }
  },

  /**
   * Bir kliniği siler
   * 
   * @param {number} id - Silinecek klinik ID
   * @returns {Promise<void>}
   */
  deleteClinic: async (id) => {
    try {
      await clinicService.delete(id);
    } catch (error) {
      console.error(`ID: ${id} olan klinik silinemedi:`, error);
      throw error;
    }
  },

  /**
   * İsme göre kliniği arar
   * 
   * @param {string} name - Aranacak klinik adı
   * @returns {Promise<Array>} - Eşleşen klinikler listesi
   */
  searchClinicsByName: async (name) => {
    try {
      // Arama için özel endpoint kullanımı, mevcut API yapınıza göre ayarlayabilirsiniz
      return await clinicService.getAll(0, 100, 'name,asc', { name });
    } catch (error) {
      console.error(`"${name}" adı ile klinik araması başarısız oldu:`, error);
      throw error;
    }
  },

  /**
   * Şehre göre klinikleri filtreler
   * 
   * @param {string} city - Şehir adı
   * @returns {Promise<Array>} - Filtrelenmiş klinikler listesi
   */
  getClinicsByCity: async (city) => {
    try {
      // Filtreleme için özel endpoint kullanımı, mevcut API yapınıza göre ayarlayabilirsiniz
      return await clinicService.getAll(0, 100, 'name,asc', { city });
    } catch (error) {
      console.error(`"${city}" şehri için klinikler getirilemedi:`, error);
      throw error;
    }
  }
};

export default clinicAPI; 