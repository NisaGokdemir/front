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
  CoronavirusOutlined as DiseaseIcon,
  Description as DescriptionIcon,
  MedicalServices as MedicalIcon,
  Category as CategoryIcon,
  Pets as PetsIcon
} from '@mui/icons-material';

/**
 * Hastalık ekleme ve düzenleme formu
 * 
 * @param {Object} props
 * @param {'add'|'edit'} props.mode - Form modu (ekleme veya düzenleme)
 * @param {Object} props.initialData - Düzenleme modunda başlangıç verileri
 * @param {Function} props.onSubmit - Form gönderildiğinde çağrılacak fonksiyon
 * @param {Function} props.onCancel - İptal edildiğinde çağrılacak fonksiyon
 * @param {boolean} props.loading - Yükleniyor durumu
 */
const DiseaseForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symptoms: '',
    category: '',
    animalTypes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Düzenleme modunda form verilerini doldur
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        symptoms: initialData.symptoms || '',
        category: initialData.category || '',
        animalTypes: initialData.animalTypes || ''
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
          error = 'Hastalık adı boş olamaz';
        } else if (value.trim().length < 2) {
          error = 'Hastalık adı en az 2 karakter olmalıdır';
        } else if (value.trim().length > 100) {
          error = 'Hastalık adı en fazla 100 karakter olmalıdır';
        }
        break;
      case 'category':
        if (!value.trim()) {
          error = 'Kategori boş olamaz';
        }
        break;
      case 'animalTypes':
        // Daha güvenli bir kontrol yapalım
        // console.log kontrolü ile değerin tipini ve içeriğini görelim
        console.log('animalTypes değeri:', value, 'tip:', typeof value);
        
        // Null, undefined veya boş string kontrolü
        if (value === null || value === undefined || value === '') {
          error = 'En az bir hayvan türü seçilmelidir';
        } 
        // Virgülle ayrılmış değer, sadece boşluk veya virgüllerden oluşuyor mu?
        else if (typeof value === 'string' && value.split(',').every(type => type.trim() === '')) {
          error = 'En az bir hayvan türü seçilmelidir';
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
    const categoryValid = validateField('category', formData.category);
    const animalTypesValid = validateField('animalTypes', formData.animalTypes);
    
    return nameValid && categoryValid && animalTypesValid;
  };

  /**
   * Form gönderimini yönetir
   * 
   * @param {Object} e - Event nesnesi
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form gönderilmeden önce hayvan türlerinin kontrolünü yapalım
    if (!formData.animalTypes || formData.animalTypes.trim() === '') {
      setFormErrors(prev => ({
        ...prev,
        animalTypes: 'En az bir hayvan türü seçilmelidir'
      }));
      return; // Form gönderimini durdur
    }
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Kategori önerileri
  const categoryOptions = [
    'Enfeksiyon',
    'Paraziter',
    'Genetik',
    'Metabolik',
    'Ortopedik',
    'Kardiyovasküler',
    'Solunum',
    'Sindirim',
    'Nörolojik',
    'Dermatolojik',
    'Göz',
    'Diş',
    'Üriner',
    'Onkoloji',
    'Davranışsal',
    'Diğer'
  ];

  // Hayvan türü önerileri
  const animalTypeOptions = [
    'Kedi',
    'Köpek',
    'Kuş',
    'Kemirgen',
    'Tavşan',
    'At',
    'İnek',
    'Koyun',
    'Keçi',
    'Kümes Hayvanları',
    'Balık',
    'Egzotik Hayvanlar',
    'Sürüngenler'
  ];

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
        {mode === 'add' ? 'Yeni Hastalık Ekle' : 'Hastalığı Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Hastalık Adı"
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
                      <DiseaseIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Hastalık Açıklaması"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
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
                name="symptoms"
                label="Semptomlar"
                fullWidth
                multiline
                rows={3}
                value={formData.symptoms}
                onChange={handleChange}
                disabled={loading}
                placeholder="Hastalığın belirtilerini girin"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MedicalIcon color="primary" />
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
                error={!!formErrors.category}
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="category-label">Kategori</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Kategori"
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                id="animal-types"
                options={animalTypeOptions}
                freeSolo
                disabled={loading}
                value={(formData.animalTypes && formData.animalTypes.length > 0) 
                  ? formData.animalTypes.split(',').filter(type => type.trim() !== '') 
                  : []}
                onChange={(event, newValue) => {
                  console.log('Seçilen hayvan türleri:', newValue);
                  // Boş dizi kontrolü ekleyelim
                  const value = newValue && newValue.length > 0 ? newValue.join(',') : '';
                  console.log('Birleştirilmiş değer:', value);
                  
                  setFormData(prev => ({
                    ...prev,
                    animalTypes: value
                  }));
                  
                  // Doğrulama için değeri aktif olarak geçirelim
                  setTimeout(() => validateField('animalTypes', value), 0);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Hayvan Türleri"
                    error={!!formErrors.animalTypes}
                    helperText={formErrors.animalTypes}
                    placeholder="Hayvan türü ekle"
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

export default DiseaseForm; 