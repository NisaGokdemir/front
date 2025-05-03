const API_URL = 'http://localhost:8081/api';

const specializationService = {
  async getAllSpecializations() {
    try {
      const response = await fetch(`${API_URL}/specializations/all`);
      
      if (!response.ok) {
        throw new Error('Uzmanlık alanları alınamadı');
      }
      
      const data = await response.json();
      return data.content || [];
    } catch (error) {
      console.error('Uzmanlık alanları getirme hatası:', error);
      throw error;
    }
  }
};

export default specializationService; 