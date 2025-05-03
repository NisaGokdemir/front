const API_URL = '/api';

const authService = {
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = 'Giriş başarısız';
        
        if (response.status === 401) {
          errorMessage = 'Kullanıcı adı veya şifre hatalı';
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = 'Kayıt başarısız';
        
        if (response.status === 400) {
          errorMessage = 'Kullanıcı adı eksik veya zaten kullanımda';
        } else if (response.status === 401) {
          errorMessage = 'Giriş bilgileri eksik';
        } else if (response.status === 500) {
          errorMessage = 'Sunucu hatası, kayıt oluşturulamadı';
        }
        
        throw new Error(errorMessage);
      }

      return response.text();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token yenileme başarısız');
      }

      return response.json();
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },
};

export default authService; 