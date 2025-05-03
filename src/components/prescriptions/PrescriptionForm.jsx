import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const PrescriptionForm = ({ open, onClose, onSubmit, mode, prescription, diagnoses }) => {
  const [formData, setFormData] = useState({
    diagnosisId: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Form açıldığında verileri doldur (düzenleme modunda)
  useEffect(() => {
    if (prescription && mode === 'edit') {
      setFormData({
        diagnosisId: prescription.diagnosis ? prescription.diagnosis.id : '',
        notes: prescription.notes || ''
      });
    } else {
      // Ekleme modunda formu sıfırla
      setFormData({
        diagnosisId: '',
        notes: ''
      });
    }
    // Hataları sıfırla
    setErrors({});
  }, [prescription, mode, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.diagnosisId) {
      newErrors.diagnosisId = 'Tanı seçimi zorunludur';
    }
    
    if (!formData.notes || formData.notes.trim() === '') {
      newErrors.notes = 'Reçete notları zorunludur';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form gönderme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const dialogTitle = mode === 'add' ? 'Yeni Reçete Ekle' : 'Reçeteyi Düzenle';

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormContainer>
            <FormControl 
              fullWidth 
              error={!!errors.diagnosisId}
              disabled={mode === 'edit'} // Düzenleme modunda tanı değiştirilemez
            >
              <InputLabel id="diagnosis-select-label">Tanı</InputLabel>
              <Select
                labelId="diagnosis-select-label"
                id="diagnosisId"
                name="diagnosisId"
                value={formData.diagnosisId}
                onChange={handleChange}
                label="Tanı"
              >
                {diagnoses && diagnoses.length > 0 ? (
                  diagnoses.map((diagnosis) => (
                    <MenuItem key={diagnosis.id} value={diagnosis.id}>
                      {diagnosis.patient ? `${diagnosis.patient.name} - ` : ''} 
                      {diagnosis.diagnosis}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Tanı bulunamadı</MenuItem>
                )}
              </Select>
              {errors.diagnosisId && (
                <FormHelperText>{errors.diagnosisId}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              id="notes"
              name="notes"
              label="Reçete Notları"
              value={formData.notes}
              onChange={handleChange}
              error={!!errors.notes}
              helperText={errors.notes}
            />

            {mode === 'edit' && prescription && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary">
                  Reçete Bilgileri
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Hasta: {prescription.diagnosis?.patient?.name || 'Bilinmiyor'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Tanı: {prescription.diagnosis?.diagnosis || 'Bilinmiyor'}
                </Typography>
                <Typography variant="body2">
                  Tedavi Planı: {prescription.diagnosis?.treatmentPlan || 'Bilinmiyor'}
                </Typography>
              </Box>
            )}
          </FormContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            İptal
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (mode === 'add' ? 'Ekle' : 'Güncelle')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

PrescriptionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
  prescription: PropTypes.object,
  diagnoses: PropTypes.array
};

PrescriptionForm.defaultProps = {
  prescription: null,
  diagnoses: []
};

export default PrescriptionForm; 