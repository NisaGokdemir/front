import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Pets as PetsIcon,
  LoginOutlined as LoginIcon
} from '@mui/icons-material';

const Login = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kayıt başarılı mesajını kontrol et
    if (location.state?.registered) {
      setNotification({
        open: true,
        message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.',
        severity: 'success'
      });
    }
  }, [location.state]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Kullanıcı adı gerekli';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Şifre gerekli';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
      sx={{ 
        backgroundColor: theme.palette.background.default,
        py: 8,
        px: 2
      }}
    >
      <Card 
        elevation={4} 
        className="w-full max-w-md overflow-hidden"
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}
      >
        <Box 
          className="bg-gradient-to-r from-indigo-600 to-blue-500 py-6 px-4 text-center"
          sx={{
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)'
            }}
          />
          
          <PetsIcon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
          <Typography variant="h4" component="h1" className="font-bold text-white mb-1">
            Veteriner Klinik
          </Typography>
          <Typography variant="subtitle1" className="text-blue-100">
            Yönetim Paneli
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" className="text-center mb-6 font-medium" color="text.primary">
            Giriş Yap
          </Typography>
          
          {error && (
            <Alert severity="error" className="mb-4" variant="filled">
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              id="username"
              label="Kullanıcı Adı"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!formErrors.username}
              helperText={formErrors.username}
              disabled={loading}
              required
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              id="password"
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              required
              sx={{ mb: 4 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className="py-3"
              sx={{ 
                py: 1.5, 
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(63, 81, 181, 0.4)'
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
            <Box className="text-center">
              <Typography variant="body2" color="text.secondary">
                Hesabınız yok mu?{' '}
                <Link to="/register" className="font-medium" style={{ color: theme.palette.primary.main }}>
                  Kayıt Ol
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4} className="flex items-center justify-center text-center">
        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} Veteriner Klinik Yönetim Sistemi. Tüm hakları saklıdır.
        </Typography>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login; 