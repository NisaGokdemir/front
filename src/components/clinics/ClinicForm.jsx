import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Box,
  useTheme,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  LocalHospital as ClinicIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Web as WebIcon
} from '@mui/icons-material';

/**
 * Klinik ekleme ve düzenleme formu
 * 
 * @param {Object} props
 * @param {'add'|'edit'} props.mode - Form modu (ekleme veya düzenleme)
 * @param {Object} props.initialData - Düzenleme modunda başlangıç verileri
 * @param {Function} props.onSubmit - Form gönderildiğinde çağrılacak fonksiyon
 * @param {Function} props.onCancel - İptal edildiğinde çağrılacak fonksiyon
 * @param {boolean} props.loading - Yükleniyor durumu
 */
const ClinicForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    district: '',
    phone: '',
    email: '',
    website: '',
    openingTime: '',
    closingTime: '',
    description: '',
    status: 'ACTIVE'
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Klinik durumları
  const statusOptions = [
    { value: 'ACTIVE', label: 'Aktif' },
    { value: 'INACTIVE', label: 'Pasif' },
    { value: 'UNDER_MAINTENANCE', label: 'Bakımda' }
  ];
  
  // Düzenleme modunda form verilerini doldur
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        city: initialData.city || '',
        district: initialData.district || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        website: initialData.website || '',
        openingTime: initialData.openingTime || '',
        closingTime: initialData.closingTime || '',
        description: initialData.description || '',
        status: initialData.status || 'ACTIVE'
      });
    }
  }, [mode, initialData]);

  /**
   * Form alanlarının değişimini yönetir ve anlık doğrulama yapar
   * 
   * @param {Object} e - Event nesnesi 
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Anlık doğrulama
    validateField(name, value);
  };

  /**
   * Tek bir alanı doğrular
   * 
   * @param {string} fieldName - Alan adı
   * @param {any} value - Alan değeri
   */
  const validateField = (fieldName, value) => {
    let error = null;
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          error = 'Klinik adı boş olamaz';
        } else if (value.trim().length < 2) {
          error = 'Klinik adı en az 2 karakter olmalıdır';
        } else if (value.trim().length > 100) {
          error = 'Klinik adı en fazla 100 karakter olmalıdır';
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Adres alanı boş olamaz';
        }
        break;
      case 'city':
        if (!value.trim()) {
          error = 'Şehir alanı boş olamaz';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Telefon numarası boş olamaz';
        } else if (!/^(\+?[0-9]{10,15})$/.test(value.trim())) {
          error = 'Geçerli bir telefon numarası girin';
        }
        break;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Geçerli bir e-posta adresi girin';
        }
        break;
      case 'website':
        if (value.trim() && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(value.trim())) {
          error = 'Geçerli bir website adresi girin';
        }
        break;
      default:
        break;
    }
    
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return !error;
  };

  /**
   * Tüm formu doğrular
   * 
   * @returns {boolean} - Form geçerli mi
   */
  const validateForm = () => {
    // Tüm zorunlu alanları doğrula
    const nameValid = validateField('name', formData.name);
    const addressValid = validateField('address', formData.address);
    const cityValid = validateField('city', formData.city);
    const phoneValid = validateField('phone', formData.phone);
    
    // İsteğe bağlı alanlar - dolu ise doğrula
    const emailValid = formData.email ? validateField('email', formData.email) : true;
    const websiteValid = formData.website ? validateField('website', formData.website) : true;
    
    return nameValid && addressValid && cityValid && phoneValid && emailValid && websiteValid;
  };

  /**
   * Form gönderimini yönetir
   * 
   * @param {Object} e - Event nesnesi
   */
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
        {mode === 'add' ? 'Yeni Klinik Ekle' : 'Kliniği Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Klinik Adı"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading}
                inputProps={{ maxLength: 100 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ClinicIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="address"
                label="Adres"
                fullWidth
                required
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="city"
                label="Şehir"
                fullWidth
                required
                value={formData.city}
                onChange={handleChange}
                error={!!formErrors.city}
                helperText={formErrors.city}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="district"
                label="İlçe"
                fullWidth
                value={formData.district}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="E-posta"
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

            <Grid item xs={12} md={6}>
              <TextField
                name="website"
                label="Website"
                fullWidth
                value={formData.website}
                onChange={handleChange}
                error={!!formErrors.website}
                helperText={formErrors.website}
                disabled={loading}
                placeholder="www.ornek.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WebIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required 
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="status-select-label">Durum</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Durum"
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="openingTime"
                label="Açılış Saati"
                fullWidth
                value={formData.openingTime}
                onChange={handleChange}
                disabled={loading}
                placeholder="08:00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="closingTime"
                label="Kapanış Saati"
                fullWidth
                value={formData.closingTime}
                onChange={handleChange}
                disabled={loading}
                placeholder="18:00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Açıklama"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                placeholder="Klinik hakkında ek bilgiler..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="primary" />
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

export default ClinicForm; 