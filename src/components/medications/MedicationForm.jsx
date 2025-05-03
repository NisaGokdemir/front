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
  Typography,
  Slider,
  FormControl,
  Chip
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  MedicalServices as MedicalServicesIcon,
  Straighten as StraightenIcon,
  WarningAmber as WarningAmberIcon
} from '@mui/icons-material';

const MedicationForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    stockWarningLevel: 20
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Yaygın birimler
  const commonUnits = ["ml", "mg", "g", "tablet", "kapsül", "damla", "ampul", "şurup"];
  
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        unit: initialData.unit || '',
        stockWarningLevel: initialData.stockWarningLevel || 20
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'stockWarningLevel') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        setFormData(prev => ({
          ...prev,
          [name]: numValue
        }));
        setFormErrors(prev => ({ ...prev, [name]: null }));
      } else if (value === '') {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        setFormErrors(prev => ({ 
          ...prev, 
          [name]: 'Stok uyarı seviyesi 0 veya daha büyük olmalıdır' 
        }));
      } else {
        setFormErrors(prev => ({ 
          ...prev, 
          [name]: 'Geçerli bir sayı giriniz' 
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Anlık doğrulama
      if (name === 'name' && !value.trim()) {
        setFormErrors(prev => ({ ...prev, name: 'İlaç adı boş olamaz' }));
      } else if (name === 'unit' && !value.trim()) {
        setFormErrors(prev => ({ ...prev, unit: 'Birim boş olamaz' }));
      } else {
        setFormErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const handleSliderChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      stockWarningLevel: newValue
    }));
    setFormErrors(prev => ({ ...prev, stockWarningLevel: null }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'İlaç adı boş olamaz';
      isValid = false;
    }

    if (!formData.unit.trim()) {
      errors.unit = 'Birim boş olamaz';
      isValid = false;
    }

    if (formData.stockWarningLevel === '' || formData.stockWarningLevel < 0) {
      errors.stockWarningLevel = 'Stok uyarı seviyesi 0 veya daha büyük olmalıdır';
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

  const handleUnitSelect = (unit) => {
    setFormData(prev => ({ ...prev, unit }));
    setFormErrors(prev => ({ ...prev, unit: null }));
  };

  return (
    <>
      <DialogTitle sx={{ 
        bgcolor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 0
      }}>
        {mode === 'add' ? <AddIcon /> : <EditIcon />}
        {mode === 'add' ? 'Yeni İlaç Ekle' : 'İlacı Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  autoFocus
                  name="name"
                  label="İlaç Adı"
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
                        <MedicalServicesIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  name="unit"
                  label="Ölçü Birimi"
                  fullWidth
                  required
                  value={formData.unit}
                  onChange={handleChange}
                  error={!!formErrors.unit}
                  helperText={formErrors.unit}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StraightenIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Yaygın Ölçü Birimleri:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {commonUnits.map((unit) => (
                      <Chip 
                        key={unit} 
                        label={unit} 
                        size="small"
                        color={formData.unit === unit ? "primary" : "default"}
                        onClick={() => handleUnitSelect(unit)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle2" display="flex" alignItems="center" gutterBottom>
                  <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
                  Stok Uyarı Seviyesi
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={9}>
                    <Slider
                      value={typeof formData.stockWarningLevel === 'number' ? formData.stockWarningLevel : 0}
                      onChange={handleSliderChange}
                      aria-labelledby="stock-warning-level-slider"
                      valueLabelDisplay="auto"
                      step={5}
                      marks
                      min={0}
                      max={100}
                      color="warning"
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      name="stockWarningLevel"
                      value={formData.stockWarningLevel}
                      onChange={handleChange}
                      inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      size="small"
                      error={!!formErrors.stockWarningLevel}
                      disabled={loading}
                      sx={{ width: '100%' }}
                      InputProps={{
                        endAdornment: formData.unit ? (
                          <InputAdornment position="end">
                            {formData.unit}
                          </InputAdornment>
                        ) : null
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Typography variant="caption" color="text.secondary">
                  Stok bu seviyenin altına düştüğünde uyarı verilecektir
                </Typography>
                
                {formErrors.stockWarningLevel && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                    {formErrors.stockWarningLevel}
                  </Typography>
                )}
              </Box>
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
            color="success" 
            disabled={loading || Object.keys(formErrors).some(key => formErrors[key])}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ 
              borderRadius: '8px',
              px: 3,
              boxShadow: '0 4px 10px rgba(76, 175, 80, 0.25)'
            }}
          >
            {loading ? 'Kaydediliyor...' : mode === 'add' ? 'Ekle' : 'Güncelle'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default MedicationForm; 