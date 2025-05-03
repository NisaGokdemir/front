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
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Autocomplete
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  MedicalServices as MedicalIcon,
  Description as DescriptionIcon,
  Healing as HealingIcon
} from '@mui/icons-material';
import patientService from '../../services/patientService';
import { useAuth } from '../../hooks/useAuth';

const DiagnosisForm = ({ mode, diagnosis, patientId, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // Kullanıcı bilgilerini konsola yazdır (Debug için)
  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);
  
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    vetId: user?.id || 12, // Eğer user.id yoksa, default olarak 12 kullan (request örneğindeki gibi)
    diagnosis: '',
    treatmentPlan: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [patients, setPatients] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Form verilerini yükle
  useEffect(() => {
    if (mode === 'edit' && diagnosis) {
      setFormData({
        patientId: diagnosis.patient?.id || '',
        vetId: diagnosis.vet?.id || user?.id || 12, // Burada da aynı mantık
        diagnosis: diagnosis.diagnosis || '',
        treatmentPlan: diagnosis.treatmentPlan || ''
      });
    } else if (patientId) {
      setFormData(prev => ({
        ...prev,
        patientId
      }));
    }
  }, [mode, diagnosis, patientId, user]);

  // Hastaları yükle
  useEffect(() => {
    const fetchPatients = async () => {
      if (!patientId) { // Eğer spesifik bir hasta ID'si verilmemişse tüm hastaları getir
        setDataLoading(true);
        try {
          const response = await patientService.getPatients(0, 100);
          setPatients(response.content || []);
        } catch (error) {
          console.error('Hastalar yüklenirken hata oluştu:', error);
        } finally {
          setDataLoading(false);
        }
      }
    };
    
    fetchPatients();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Anlık doğrulama
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'patientId':
        if (!value) {
          setFormErrors(prev => ({ ...prev, patientId: 'Hasta seçilmelidir' }));
        } else {
          setFormErrors(prev => ({ ...prev, patientId: null }));
        }
        break;
      case 'diagnosis':
        if (!value.trim()) {
          setFormErrors(prev => ({ ...prev, diagnosis: 'Tanı boş olamaz' }));
        } else {
          setFormErrors(prev => ({ ...prev, diagnosis: null }));
        }
        break;
      case 'treatmentPlan':
        if (!value.trim()) {
          setFormErrors(prev => ({ ...prev, treatmentPlan: 'Tedavi planı boş olamaz' }));
        } else {
          setFormErrors(prev => ({ ...prev, treatmentPlan: null }));
        }
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.patientId) {
      errors.patientId = 'Hasta seçilmelidir';
      isValid = false;
    }

    if (!formData.diagnosis.trim()) {
      errors.diagnosis = 'Tanı boş olamaz';
      isValid = false;
    }

    if (!formData.treatmentPlan.trim()) {
      errors.treatmentPlan = 'Tedavi planı boş olamaz';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Debug için veri kontrolü
      console.log("Submitting data:", formData);
      
      const submittingData = {
        ...formData,
        patientId: parseInt(formData.patientId),
        vetId: parseInt(formData.vetId || 12) // user id yoksa 12 kullan
      };
      
      // Debug için son kontrol
      console.log("Final submitting data:", submittingData);
      
      onSubmit(submittingData);
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
        {mode === 'add' ? 'Yeni Tanı Ekle' : 'Tanıyı Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {!patientId && (
              <Grid item xs={12}>
                <FormControl 
                  fullWidth 
                  required 
                  error={!!formErrors.patientId}
                  disabled={loading || dataLoading || mode === 'edit'}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
                  <InputLabel id="patient-label">Hasta</InputLabel>
                  <Select
                    labelId="patient-label"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    label="Hasta"
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.owner?.fullName || ''}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.patientId && <FormHelperText>{formErrors.patientId}</FormHelperText>}
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                name="diagnosis"
                label="Tanı"
                fullWidth
                required
                multiline
                rows={3}
                value={formData.diagnosis}
                onChange={handleChange}
                error={!!formErrors.diagnosis}
                helperText={formErrors.diagnosis}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1.5 }}>
                      <MedicalIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="treatmentPlan"
                label="Tedavi Planı"
                fullWidth
                required
                multiline
                rows={4}
                value={formData.treatmentPlan}
                onChange={handleChange}
                error={!!formErrors.treatmentPlan}
                helperText={formErrors.treatmentPlan}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1.5 }}>
                      <HealingIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          </Grid>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          
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

export default DiagnosisForm; 