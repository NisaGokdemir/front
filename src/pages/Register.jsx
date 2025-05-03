import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import specializationService from '../services/specializationService';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Card,
  CardContent,
  Divider,
  useTheme,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Pets as PetsIcon,
  PersonAdd as PersonAddIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const steps = ['Hesap Bilgileri', 'Kişisel Bilgiler'];

const Register = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    specializationId: '' // Boş başlatıyoruz, API'den veri gelince seçilecek
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();
  
  // Specializations state'ini ekliyoruz
  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [specializationError, setSpecializationError] = useState(null);

  // Uzmanlık alanlarını yükleme
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoadingSpecializations(true);
        setSpecializationError(null);
        const data = await specializationService.getAllSpecializations();
        setSpecializations(data);
        
        // İlk elemanı varsayılan değer olarak atayabiliriz
        if (data.length > 0 && !formData.specializationId) {
          setFormData(prev => ({
            ...prev,
            specializationId: data[0].id
          }));
        }
      } catch (error) {
        console.error('Uzmanlık alanları yüklenirken hata oluştu:', error);
        setSpecializationError('Uzmanlık alanları yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    if (step === 0) {
      // Kullanıcı adı kontrolü
      if (!formData.username.trim()) {
        errors.username = 'Kullanıcı adı gerekli';
        isValid = false;
      }

      // Şifre kontrolü
      if (!formData.password) {
        errors.password = 'Şifre gerekli';
        isValid = false;
      }

      // Şifre eşleşme kontrolü
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Şifreler eşleşmiyor';
        isValid = false;
      }
    } else if (step === 1) {
      // E-posta kontrolü (zorunlu değil ama formatı doğrulanmalı)
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Geçerli bir e-posta adresi girin';
        isValid = false;
      }

      // Uzmanlık alanı kontrolü
      if (!formData.specializationId) {
        errors.specializationId = 'Uzmanlık alanı gerekli';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleNext = (e) => {
    e.preventDefault(); // Form submit'i önle
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    // confirmPassword'ü API'ye göndermeden önce kaldır
    const { confirmPassword, ...registerData } = formData;
    
    const success = await register(registerData);
    if (success) {
      navigate('/login', { state: { registered: true } });
    }
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
        className="w-full max-w-2xl overflow-hidden"
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
          <Typography variant="h5" component="h2" className="text-center mb-4 font-medium" color="text.primary">
            Yeni Hesap Oluştur
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" className="mb-4" variant="filled">
              {error}
            </Alert>
          )}
          
          {specializationError && (
            <Alert severity="warning" className="mb-4">
              {specializationError}
            </Alert>
          )}
          
          {activeStep === 0 ? (
            <Box component="form" onSubmit={handleNext}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Kullanıcı Adı"
                    variant="outlined"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    disabled={loading}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Şifre"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    disabled={loading}
                    required
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
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Şifre Tekrar"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    disabled={loading}
                    required
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ 
                    py: 1.2, 
                    px: 3,
                    borderRadius: 2,
                    boxShadow: '0 4px 10px rgba(63, 81, 181, 0.4)'
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Devam Et
                </Button>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="Ad"
                    variant="outlined"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Soyad"
                    variant="outlined"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="E-posta Adresi"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!formErrors.specializationId} required>
                    <InputLabel id="specialization-label">Uzmanlık Alanı</InputLabel>
                    <Select
                      labelId="specialization-label"
                      id="specializationId"
                      name="specializationId"
                      value={formData.specializationId}
                      onChange={handleChange}
                      label="Uzmanlık Alanı"
                      disabled={loading || loadingSpecializations}
                    >
                      {loadingSpecializations ? (
                        <MenuItem disabled>Yükleniyor...</MenuItem>
                      ) : (
                        specializations.map((specialization) => (
                          <MenuItem key={specialization.id} value={specialization.id}>
                            {specialization.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {formErrors.specializationId && (
                      <FormHelperText>{formErrors.specializationId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  disabled={loading}
                >
                  Geri
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ 
                    py: 1.2, 
                    px: 3,
                    borderRadius: 2,
                    boxShadow: '0 4px 10px rgba(63, 81, 181, 0.4)'
                  }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                >
                  {loading ? 'İşleniyor...' : 'Kayıt Ol'}
                </Button>
              </Box>
            </Box>
          )}
          
          <Divider sx={{ my: 4 }} />
          
          <Box className="text-center">
            <Typography variant="body2" color="text.secondary">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="font-medium" style={{ color: theme.palette.primary.main }}>
                Giriş Yap
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4} className="flex items-center justify-center text-center">
        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} Veteriner Klinik Yönetim Sistemi. Tüm hakları saklıdır.
        </Typography>
      </Box>
    </Box>
  );
};

export default Register; 