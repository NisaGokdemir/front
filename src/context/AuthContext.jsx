import { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserFromStorage = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!token || !refreshToken) {
        setLoading(false);
        return;
      }

      // Token'ın geçerli olup olmadığını kontrol et
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token süresi dolmuş, refresh token ile yenile
          const response = await authService.refreshToken(refreshToken);
          localStorage.setItem('token', response.token);
          
          const newDecoded = jwtDecode(response.token);
          setUser({
            username: newDecoded.sub,
            roles: newDecoded.roles,
            token: response.token,
            refreshToken: response.refreshToken
          });
        } else {
          // Token geçerli
          setUser({
            username: decoded.sub,
            roles: decoded.roles,
            token,
            refreshToken
          });
        }
      } catch (error) {
        // Token decode edilemedi veya refresh başarısız oldu
        console.error('Token validation error:', error);
        logout();
      }
    } catch (error) {
      console.error('Load user error:', error);
      setError('Kimlik doğrulama hatası');
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!username || !password) {
        setError('Kullanıcı adı ve şifre zorunludur');
        return false;
      }
      
      const response = await authService.login({ username, password });
      
      const { token, refreshToken } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      const decoded = jwtDecode(token);
      
      setUser({
        username: decoded.sub,
        roles: decoded.roles,
        token,
        refreshToken
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Giriş başarısız. Kullanıcı adı veya şifre hatalı.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Zorunlu alanları kontrol et
      if (!userData.username || !userData.password || !userData.specializationId) {
        setError('Kullanıcı adı, şifre ve uzmanlık alanı zorunludur');
        return false;
      }
      
      await authService.register(userData);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      setError(error.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const hasRole = (requiredRoles) => {
    if (!user || !user.roles) return false;
    
    if (!Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
    }
    
    return requiredRoles.some(role => user.roles.includes(role));
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    hasRole,
    refreshUser: loadUserFromStorage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 