import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  useTheme,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
  MonetizationOn as DebtIcon
} from '@mui/icons-material';

/**
 * Hasta Sahibi Form Bileşeni
 * 
 * Bu bileşen, hasta sahibi ekleme ve düzenleme işlemleri için kullanılır.
 * Backend veri yapısına uygun olarak firstName, lastName, phone, email, address, debt ve notes alanlarını içerir.
 */
const OwnerForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  
  // Backend ile uyumlu form veri yapısı
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    debt: '',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  // initialData değiştiğinde form verilerini güncelle
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        debt: initialData.debt || '',
        notes: initialData.notes || ''
      });
    }
  }, [mode, initialData]);

  // Form alanları değiştiğinde çalışır
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Form alanlarının anlık doğrulaması
    validateField(name, value);
  };
  
  // Tek bir form alanını doğrular
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'Ad boş olamaz';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          error = 'Soyad boş olamaz';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Telefon numarası boş olamaz';
        } else if (!/^(05)([0-9]{9})$/.test(value)) {
          error = 'Geçerli bir Türkiye telefon numarası girin (05xxxxxxxxx)';
        }
        break;
      case 'email':
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          error = 'Geçerli bir e-posta adresi girin';
        }
        break;
      default:
        break;
    }
    
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  // Tüm formu doğrular
  const validateForm = () => {
    const fieldResults = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      phone: validateField('phone', formData.phone),
      email: validateField('email', formData.email),
    };
    
    return Object.values(fieldResults).every(isValid => isValid);
  };

  // Form gönderildiğinde çalışır
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <DialogTitle sx={{ 
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 0
      }}>
        {mode === 'add' ? <AddIcon /> : <EditIcon />}
        {mode === 'add' ? 'Yeni Hasta Sahibi Ekle' : 'Hasta Sahibini Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Ad */}
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                name="firstName"
                label="Ad"
                fullWidth
                required
                value={formData.firstName}
                onChange={handleChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* Soyad */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Soyad"
                fullWidth
                required
                value={formData.lastName}
                onChange={handleChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* Telefon */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Telefon"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                disabled={loading}
                placeholder="05xxxxxxxxx"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* E-posta */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="E-posta"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* Adres */}
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Adres"
                fullWidth
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1.5 }}>
                      <LocationIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* Borç */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="debt"
                label="Borç Durumu"
                fullWidth
                value={formData.debt}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DebtIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* Notlar */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="notes"
                label="Notlar"
                fullWidth
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1 }}>
                      <NotesIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          </Grid>
          
          {Object.keys(formErrors).some(key => formErrors[key]) && (
            <Box mt={2}>
              <Alert 
                severity="error"
                variant="filled"
                sx={{ borderRadius: '8px' }}
              >
                Lütfen form hatalarını düzeltin
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={onCancel} 
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || Object.keys(formErrors).some(key => formErrors[key])}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ 
              borderRadius: '8px',
              px: 3,
              boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
            }}
          >
            {loading ? 'Kaydediliyor...' : mode === 'add' ? 'Ekle' : 'Güncelle'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default OwnerForm; 