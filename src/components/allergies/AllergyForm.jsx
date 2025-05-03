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
  FormHelperText,
  Autocomplete
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  HealthAndSafety as AllergyIcon,
  Description as DescriptionIcon,
  Pets as PetIcon,
  LocalHospital as SeverityIcon,
  Bolt as ReactionIcon,
  Note as NoteIcon
} from '@mui/icons-material';
// Hasta verisi artık props olarak geliyor, API çağrısı yapılmıyor

/**
 * Alerji ekleme ve düzenleme formu
 * 
 * @param {Object} props
 * @param {'add'|'edit'} props.mode - Form modu (ekleme veya düzenleme)
 * @param {Object} props.initialData - Düzenleme modunda başlangıç verileri
 * @param {Function} props.onSubmit - Form gönderildiğinde çağrılacak fonksiyon
 * @param {Function} props.onCancel - İptal edildiğinde çağrılacak fonksiyon
 * @param {boolean} props.loading - Yükleniyor durumu
 * @param {Array} props.patients - Hasta listesi (opsiyonel)
 */
const AllergyForm = ({ mode, initialData, onSubmit, onCancel, loading, patients = [] }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    patientId: 101, // Varsayılan olarak ilk hastayı seçiyoruz
    severity: '',
    reactionType: '',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Şiddet dereceleri
  const severityOptions = [
    { value: 'MILD', label: 'Hafif' },
    { value: 'MODERATE', label: 'Orta' },
    { value: 'SEVERE', label: 'Şiddetli' }
  ];
  
  // Reaksiyon tipleri
  const reactionTypes = [
    { value: 'SKIN', label: 'Deri (Kaşıntı, Kızarıklık)' },
    { value: 'RESPIRATORY', label: 'Solunum (Öksürük, Nefes Darlığı)' },
    { value: 'DIGESTIVE', label: 'Sindirim (Kusma, İshal)' },
    { value: 'ANAPHYLAXIS', label: 'Anafilaksi' },
    { value: 'OTHER', label: 'Diğer' }
  ];
  
  // Düzenleme modunda form verilerini doldur
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        patientId: initialData.patientId || 101,
        severity: initialData.severity || '',
        reactionType: initialData.reactionType || '',
        notes: initialData.notes || ''
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
          error = 'Alerji adı boş olamaz';
        } else if (value.trim().length < 2) {
          error = 'Alerji adı en az 2 karakter olmalıdır';
        } else if (value.trim().length > 100) {
          error = 'Alerji adı en fazla 100 karakter olmalıdır';
        }
        break;
      case 'severity':
        if (!value) {
          error = 'Şiddet derecesi seçimi zorunludur';
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
    // Tüm alanları doğrula
    const nameValid = validateField('name', formData.name);
    const severityValid = validateField('severity', formData.severity);
    
    return nameValid && severityValid;
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
        {mode === 'add' ? 'Yeni Alerji Ekle' : 'Alerjiyi Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Alerji Adı"
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
                      <AllergyIcon color="primary" />
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
                error={!!formErrors.severity}
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="severity-select-label">Şiddet Derecesi</InputLabel>
                <Select
                  labelId="severity-select-label"
                  id="severity-select"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  label="Şiddet Derecesi"
                  startAdornment={
                    <InputAdornment position="start">
                      <SeverityIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {severityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.severity && (
                  <FormHelperText>{formErrors.severity}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="reaction-select-label">Reaksiyon Tipi</InputLabel>
                <Select
                  labelId="reaction-select-label"
                  id="reaction-select"
                  name="reactionType"
                  value={formData.reactionType}
                  onChange={handleChange}
                  label="Reaksiyon Tipi"
                  startAdornment={
                    <InputAdornment position="start">
                      <ReactionIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>Seçiniz</em>
                  </MenuItem>
                  {reactionTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Alerji Açıklaması"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                placeholder="Alerjinin detayları, belirtileri..."
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
            
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Ek Notlar"
                fullWidth
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                placeholder="Tedavi önerileri, dikkat edilmesi gereken durumlar..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NoteIcon color="primary" />
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

export default AllergyForm; 