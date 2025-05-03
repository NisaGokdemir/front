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
  Stack,
  Typography
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  Category as CategoryIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import speciesService from '../../services/speciesService';

/**
 * Irk ekleme ve düzenleme formu
 * 
 * @param {Object} props
 * @param {'add'|'edit'} props.mode - Form modu (ekleme veya düzenleme)
 * @param {Object} props.initialData - Düzenleme modunda başlangıç verileri
 * @param {Function} props.onSubmit - Form gönderildiğinde çağrılacak fonksiyon
 * @param {Function} props.onCancel - İptal edildiğinde çağrılacak fonksiyon
 * @param {boolean} props.loading - Yükleniyor durumu
 */
const BreedForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    speciesId: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [species, setSpecies] = useState([]);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  
  // Türleri yükle
  useEffect(() => {
    fetchSpecies();
  }, []);

  // Düzenleme modunda form verilerini doldur
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        speciesId: initialData.species?.id || ''
      });
    }
  }, [mode, initialData]);

  /**
   * Türleri API'den getirir
   */
  const fetchSpecies = async () => {
    try {
      setLoadingSpecies(true);
      const response = await speciesService.getSpecies(0, 100);
      setSpecies(response.content || []);
    } catch (error) {
      console.error('Türler yüklenirken hata oluştu:', error);
    } finally {
      setLoadingSpecies(false);
    }
  };

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
          error = 'Irk adı boş olamaz';
        } else if (value.trim().length < 2) {
          error = 'Irk adı en az 2 karakter olmalıdır';
        } else if (value.trim().length > 50) {
          error = 'Irk adı en fazla 50 karakter olmalıdır';
        }
        break;
      case 'speciesId':
        if (!value) {
          error = 'Tür seçimi zorunludur';
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
    const speciesValid = validateField('speciesId', formData.speciesId);
    
    return nameValid && speciesValid;
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

  /**
   * Seçilen türe göre yaygın ırk önerileri
   * 
   * @param {number} speciesId - Tür ID'si 
   * @returns {string[]} Irk önerileri
   */
  const getBreedSuggestions = (speciesId) => {
    // Seçilen türe göre yaygın ırklar
    const suggestions = {
      // Köpek
      1: ['Golden Retriever', 'Labrador', 'Alman Çoban Köpeği', 'Bulldog', 'Husky', 'Pug'],
      // Kedi
      2: ['Tekir', 'Scottish Fold', 'British Shorthair', 'Siyam', 'Maine Coon', 'Persian'],
      // Kuş
      3: ['Muhabbet Kuşu', 'Papağan', 'Kanarya', 'Hint Bülbülü'],
      // Tavşan
      4: ['Hollanda Lop', 'Rex', 'Angora', 'Flander'],
      // Hamster
      5: ['Suriye Hamsteri', 'Cüce Hamster', 'Campbell Cüce Hamsteri']
    };
    
    return suggestions[speciesId] || [];
  };
  
  /**
   * Öneri çipine tıklandığında ırk adı alanını doldurur
   * 
   * @param {string} breedName - Irk adı
   */
  const handleSuggestionClick = (breedName) => {
    setFormData(prev => ({
      ...prev,
      name: breedName
    }));
    validateField('name', breedName);
  };

  // Seçilen türe göre ırk önerilerini al
  const breedSuggestions = formData.speciesId ? getBreedSuggestions(parseInt(formData.speciesId)) : [];

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
        {mode === 'add' ? 'Yeni Irk Ekle' : 'Irkı Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Irk Adı"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading}
                inputProps={{ maxLength: 50 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                required
                error={!!formErrors.speciesId}
                disabled={loading || loadingSpecies}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="species-label">Tür</InputLabel>
                <Select
                  labelId="species-label"
                  name="speciesId"
                  value={formData.speciesId}
                  onChange={handleChange}
                  label="Tür"
                  startAdornment={
                    <InputAdornment position="start">
                      <PetsIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {loadingSpecies ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Türler yükleniyor...
                    </MenuItem>
                  ) : species.length === 0 ? (
                    <MenuItem disabled>
                      Hiç tür bulunamadı
                    </MenuItem>
                  ) : (
                    species.map((species) => (
                      <MenuItem key={species.id} value={species.id}>
                        {species.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {formErrors.speciesId && <FormHelperText>{formErrors.speciesId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {breedSuggestions.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Yaygın ırk önerileri:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {breedSuggestions.map((breed) => (
                      <Chip
                        key={breed}
                        label={breed}
                        color="primary"
                        variant="outlined"
                        onClick={() => handleSuggestionClick(breed)}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            )}
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
            disabled={loading || loadingSpecies || Object.keys(formErrors).some(key => formErrors[key])}
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

export default BreedForm;