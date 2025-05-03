import { jwtDecode } from 'jwt-decode';

const API_URL = '/api';

// Token ile authenticated istek gönderme
    export const fetchWithAuth = async (endpoint, options = {}) => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      console.log('fetchWithAuth çağrıldı:', endpoint);
      console.log('localStorage token:', token ? 'Mevcut' : 'Yok');
      console.log('localStorage refreshToken:', refreshToken ? 'Mevcut' : 'Yok');

      if (!token || !refreshToken) {
        console.error('Kimlik doğrulama hatası: Token veya refreshToken eksik.'); // Hata logu ekle
        throw new Error('Kimlik doğrulama gerekli');
      }
  
  try {
    // Token'ın geçerliliğini kontrol et
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    let validToken = token;
    
    // Token süresi dolduysa yenile
    if (decoded.exp < currentTime) {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      validToken = data.token;
    }
    
    // İstek gönder
    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${validToken}`,
        'Content-Type': options.headers?.['Content-Type'] || 'application/json',
      },
    });
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      throw new Error('Oturumunuz sonlandı veya yetkiniz bulunmuyor. Lütfen tekrar giriş yapın.');
    }

    if (response.status === 403) {
      throw new Error('Bu işlem için yetkiniz bulunmuyor.');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = extractErrorMessage(errorData);
      throw new Error(errorMessage || 'İşlem sırasında bir hata oluştu');
    }
    
    // Boş cevap kontrolü
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  } catch (error) {
    console.error('API isteği hatası:', error);
    throw error;
  }
};

// Hata mesajını çıkarır
const extractErrorMessage = (errorData) => {
  if (!errorData || !errorData.exception) return 'İşlem sırasında bir hata oluştu';
  
  const { message } = errorData.exception;
  
  // Basit string mesaj
  if (typeof message === 'string') return message;
  
  // Obje içinde alan hataları
  if (typeof message === 'object') {
    const errors = [];
    Object.keys(message).forEach(field => {
      if (Array.isArray(message[field])) {
        errors.push(...message[field]);
      } else {
        errors.push(`${field}: ${message[field]}`);
      }
    });
    return errors.join('\n');
  }
  
  return 'İşlem sırasında bir hata oluştu';
};

// Genel CRUD işlemleri için servis oluşturucu
export const createService = (resource) => {
  return {
    getAll: (page = 0, size = 10) => fetchWithAuth(`${resource}?page=${page}&size=${size}`),
    getById: (id) => fetchWithAuth(`${resource}/${id}`),
    create: (data) => fetchWithAuth(resource, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => fetchWithAuth(`${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => fetchWithAuth(`${resource}/${id}`, {
      method: 'DELETE',
    }),
  };
};

// Servis örnekleri
export const ownerService = createService('owners');
export const patientService = createService('patients');
export const bloodTypeService = createService('bloodTypes');
export const speciesService = createService('species');
export const breedService = createService('breeds');
export const diagnosisService = createService('diagnosis');
export const prescriptionService = createService('prescriptions');
export const medicationService = createService('medication');
export const medicationBatchService = createService('medication-batch');
export const familyService = createService('families');
export const vaccineService = createService('vaccines');
export const allergyService = createService('allergies');
export const diseaseService = createService('v1/diseases');
export const clinicService = createService('clinics'); 