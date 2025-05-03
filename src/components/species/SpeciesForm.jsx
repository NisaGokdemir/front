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
  Pets as PetsIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import familyService from '../../services/familyService';

const SpeciesForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    familyId: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [families, setFamilies] = useState([]);
  const [loadingFamilies, setLoadingFamilies] = useState(false);
  
  useEffect(() => {
    fetchFamilies();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        familyId: initialData.family?.id || ''
      });
    }
  }, [mode, initialData]);

  const fetchFamilies = async () => {
    try {
      setLoadingFamilies(true);
      const response = await familyService.getFamilies(0, 100);
      setFamilies(response.content || []);
      
      // İlk familya varsa ve form boşsa, ilk familyayı seç
      if (response.content && response.content.length > 0 && !formData.familyId) {
        setFormData(prev => ({
          ...prev,
          familyId: response.content[0].id
        }));
      }
    } catch (error) {
      console.error('Familyalar yüklenirken hata oluştu:', error);
    } finally {
      setLoadingFamilies(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Anlık doğrulama
    if (name === 'name' && !value.trim()) {
      setFormErrors(prev => ({ ...prev, name: 'Tür adı boş olamaz' }));
    } else if (name === 'familyId' && !value) {
      setFormErrors(prev => ({ ...prev, familyId: 'Familya seçimi gerekli' }));
    } else {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Tür adı boş olamaz';
      isValid = false;
    }

    if (!formData.familyId) {
      errors.familyId = 'Familya seçimi gerekli';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

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
        {mode === 'add' ? 'Yeni Tür Ekle' : 'Türü Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Tür Adı"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PetsIcon color="primary" />
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
                error={!!formErrors.familyId}
                disabled={loading || loadingFamilies}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="family-label">Familya</InputLabel>
                <Select
                  labelId="family-label"
                  name="familyId"
                  value={formData.familyId}
                  onChange={handleChange}
                  label="Familya"
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {loadingFamilies ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Familyalar yükleniyor...
                    </MenuItem>
                  ) : (
                    families.map((family) => (
                      <MenuItem key={family.id} value={family.id}>
                        {family.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {formErrors.familyId && <FormHelperText>{formErrors.familyId}</FormHelperText>}
              </FormControl>
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

export default SpeciesForm; 