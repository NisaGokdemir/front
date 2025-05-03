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
  Chip,
  Autocomplete
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  Vaccines as VaccineIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Factory as ManufacturerIcon,
  Pets as PetsIcon,
  Science as DosageIcon
} from '@mui/icons-material';
import { speciesService } from '../../services/apiService';

/**
 * Aşı ekleme ve düzenleme formu
 * 
 * @param {Object} props
 * @param {'add'|'edit'} props.mode - Form modu (ekleme veya düzenleme)
 * @param {Object} props.initialData - Düzenleme modunda başlangıç verileri
 * @param {Function} props.onSubmit - Form gönderildiğinde çağrılacak fonksiyon
 * @param {Function} props.onCancel - İptal edildiğinde çağrılacak fonksiyon
 * @param {boolean} props.loading - Yükleniyor durumu
 */
const VaccineForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    description: '',
    targetSpecies: '',
    schedule: '',
    dosage: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [speciesList, setSpeciesList] = useState([]);
  const [speciesLoading, setSpeciesLoading] = useState(false);
  
  // Tür verilerini yükle
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        setSpeciesLoading(true);
        const response = await speciesService.getAll(0, 100);
        const speciesData = Array.isArray(response) 
          ? response 
          : response.content || [];
          
        setSpeciesList(speciesData.map(s => s.name || ''));
      } catch (error) {
        console.error('Tür verileri yüklenirken hata oluştu:', error);
      } finally {
        setSpeciesLoading(false);
      }
    };
    
    fetchSpecies();
  }, []);
  
  // Düzenleme modunda form verilerini doldur
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        manufacturer: initialData.manufacturer || '',
        description: initialData.description || '',
        targetSpecies: initialData.targetSpecies || '',
        schedule: initialData.schedule || '',
        dosage: initialData.dosage || ''
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
          error = 'Aşı adı boş olamaz';
        } else if (value.trim().length < 2) {
          error = 'Aşı adı en az 2 karakter olmalıdır';
        } else if (value.trim().length > 100) {
          error = 'Aşı adı en fazla 100 karakter olmalıdır';
        }
        break;
      case 'manufacturer':
        if (!value.trim()) {
          error = 'Üretici firma boş olamaz';
        }
        break;
      case 'targetSpecies':
        // Daha güvenli bir kontrol yapalım
        if (value === null || value === undefined || value === '') {
          error = 'En az bir tür seçilmelidir';
        } 
        // Virgülle ayrılmış değer, sadece boşluk veya virgüllerden oluşuyor mu?
        else if (typeof value === 'string' && value.split(',').every(type => type.trim() === '')) {
          error = 'En az bir tür seçilmelidir';
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
    const manufacturerValid = validateField('manufacturer', formData.manufacturer);
    const targetSpeciesValid = validateField('targetSpecies', formData.targetSpecies);
    
    return nameValid && manufacturerValid && targetSpeciesValid;
  };

  /**
   * Form gönderimini yönetir
   * 
   * @param {Object} e - Event nesnesi
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form gönderilmeden önce hedef türlerin kontrolünü yapalım
    if (!formData.targetSpecies || formData.targetSpecies.trim() === '') {
      setFormErrors(prev => ({
        ...prev,
        targetSpecies: 'En az bir tür seçilmelidir'
      }));
      return; // Form gönderimini durdur
    }
    
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
        {mode === 'add' ? 'Yeni Aşı Ekle' : 'Aşıyı Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                name="name"
                label="Aşı Adı"
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
                      <VaccineIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="manufacturer"
                label="Üretici Firma"
                fullWidth
                required
                value={formData.manufacturer}
                onChange={handleChange}
                error={!!formErrors.manufacturer}
                helperText={formErrors.manufacturer}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ManufacturerIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Aşı Açıklaması"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                placeholder="Aşının kullanım amacı, içeriği vb. bilgiler..."
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
            
            <Grid item xs={12} md={6}>
              <TextField
                name="schedule"
                label="Uygulama Takvimi"
                fullWidth
                value={formData.schedule}
                onChange={handleChange}
                disabled={loading}
                placeholder="Örn: 2-4-6 haftalık, yılda bir tekrar"
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
                name="dosage"
                label="Doz Bilgisi"
                fullWidth
                value={formData.dosage}
                onChange={handleChange}
                disabled={loading}
                placeholder="Örn: Kedi: 0.5ml, Köpek: 1ml"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DosageIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="target-species"
                options={speciesList}
                freeSolo
                disabled={loading || speciesLoading}
                value={(formData.targetSpecies && formData.targetSpecies.length > 0) 
                  ? formData.targetSpecies.split(',').filter(type => type.trim() !== '') 
                  : []}
                onChange={(event, newValue) => {
                  // Boş dizi kontrolü ekleyelim
                  const value = newValue && newValue.length > 0 ? newValue.join(',') : '';
                  
                  setFormData(prev => ({
                    ...prev,
                    targetSpecies: value
                  }));
                  
                  // Doğrulama için değeri aktif olarak geçirelim
                  setTimeout(() => validateField('targetSpecies', value), 0);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      variant="outlined"
                      color="primary"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Hedef Türler"
                    error={!!formErrors.targetSpecies}
                    helperText={formErrors.targetSpecies || 'Aşının uygulanabileceği hayvan türlerini seçin'}
                    placeholder="Tür ekle"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <PetsIcon color="primary" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <>
                          {speciesLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
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

export default VaccineForm; 