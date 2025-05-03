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

const PrescriptionItemForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  mode, 
  prescriptionItem, 
  prescriptions, 
  medications,
  medicationBatches
}) => {
  const [formData, setFormData] = useState({
    prescriptionId: '',
    medicationId: '',
    medicationBatchId: '',
    dailyDose: '',
    durationDays: '',
    totalAmount: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [filteredBatches, setFilteredBatches] = useState([]);

  // Form açıldığında verileri doldur (düzenleme modunda)
  useEffect(() => {
    if (prescriptionItem && mode === 'edit') {
      setFormData({
        prescriptionId: prescriptionItem.prescription?.id || '',
        medicationId: prescriptionItem.medication?.id || '',
        medicationBatchId: prescriptionItem.medicationBatchId || '',
        dailyDose: prescriptionItem.dailyDose || '',
        durationDays: prescriptionItem.durationDays || '',
        totalAmount: prescriptionItem.totalAmount || ''
      });
      
      if (prescriptionItem.medication?.id) {
        filterBatchesByMedication(prescriptionItem.medication.id);
      }
    } else {
      // Ekleme modunda formu sıfırla
      setFormData({
        prescriptionId: prescriptions && prescriptions.length === 1 ? prescriptions[0].id : '',
        medicationId: '',
        medicationBatchId: '',
        dailyDose: '',
        durationDays: '',
        totalAmount: ''
      });
      setFilteredBatches([]);
    }
    // Hataları sıfırla
    setErrors({});
  }, [prescriptionItem, mode, open, prescriptions]);

  // İlaçlar veya ilaç partileri değiştiğinde, filtreyi güncelle
  useEffect(() => {
    if (formData.medicationId) {
      filterBatchesByMedication(formData.medicationId);
    }
  }, [medicationBatches, formData.medicationId]);

  const filterBatchesByMedication = (medicationId) => {
    if (!medicationId || !medicationBatches || medicationBatches.length === 0) {
      setFilteredBatches([]);
      console.log('İlaç partisi filtrelenemedi: Geçersiz ilaç ID veya parti yok', {
        medicationId,
        medicationBatchesLength: medicationBatches?.length || 0
      });
      return;
    }
    
    console.log('İlaç partisi filtreleniyor:', {
      medicationId,
      allBatches: medicationBatches
    });
    
    const filtered = medicationBatches.filter(batch => 
      batch.medication && Number(batch.medication.id) === Number(medicationId)
    );
    
    console.log('Filtrelenmiş partiler:', filtered);
    setFilteredBatches(filtered);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.prescriptionId) {
      newErrors.prescriptionId = 'Reçete seçimi zorunludur';
    }
    
    if (!formData.medicationId) {
      newErrors.medicationId = 'İlaç seçimi zorunludur';
    }
    
    if (!formData.medicationBatchId) {
      newErrors.medicationBatchId = 'İlaç partisi seçimi zorunludur';
    }
    
    if (!formData.dailyDose || formData.dailyDose.trim() === '') {
      newErrors.dailyDose = 'Günlük doz zorunludur';
    }
    
    if (!formData.durationDays) {
      newErrors.durationDays = 'Tedavi süresi zorunludur';
    } else if (isNaN(formData.durationDays) || formData.durationDays <= 0) {
      newErrors.durationDays = 'Tedavi süresi pozitif bir sayı olmalıdır';
    }
    
    if (!formData.totalAmount) {
      newErrors.totalAmount = 'Toplam miktar zorunludur';
    } else if (isNaN(formData.totalAmount) || formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Toplam miktar pozitif bir sayı olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalAmount = () => {
    const { dailyDose, durationDays } = formData;
    
    if (dailyDose && durationDays && !isNaN(durationDays)) {
      const dailyDoseNum = parseFloat(dailyDose);
      const durationDaysNum = parseInt(durationDays, 10);
      
      if (!isNaN(dailyDoseNum)) {
        const total = dailyDoseNum * durationDaysNum;
        setFormData(prev => ({ ...prev, totalAmount: total }));
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // İlaç değiştiğinde parti listesini filtrele
    if (name === 'medicationId') {
      console.log(`İlaç seçildi, ID: ${value}`);
      
      // İlaç ID'si değiştiğinde ilaç partisini sıfırla
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        medicationBatchId: ''
      }));
      
      // Geçerli bir değer seçildiyse filtreleme yap
      if (value) {
        filterBatchesByMedication(value);
      } else {
        setFilteredBatches([]);
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    // Günlük doz veya süre değiştiğinde toplam miktarı hesapla
    if (name === 'dailyDose' || name === 'durationDays') {
      const updatedData = {
        ...formData,
        [name]: value
      };
      
      if (updatedData.dailyDose && updatedData.durationDays && !isNaN(updatedData.durationDays)) {
        const dailyDoseNum = parseFloat(updatedData.dailyDose);
        const durationDaysNum = parseInt(updatedData.durationDays, 10);
        
        if (!isNaN(dailyDoseNum)) {
          const total = dailyDoseNum * durationDaysNum;
          updatedData.totalAmount = total;
        }
      }
      
      setFormData(updatedData);
    }
    
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

  const dialogTitle = mode === 'add' ? 'Yeni İlaç Ekle' : 'İlacı Düzenle';

  // İlaç ve parti seçeneklerinin durumunu konsola yaz
  console.log('Form durumu:', {
    medicationsCount: medications?.length || 0,
    batchesCount: medicationBatches?.length || 0,
    filteredBatchesCount: filteredBatches?.length || 0,
    selectedMedicationId: formData.medicationId,
    selectedBatchId: formData.medicationBatchId
  });

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
              error={!!errors.prescriptionId}
              disabled={mode === 'edit'} // Düzenleme modunda reçete değiştirilemez
            >
              <InputLabel id="prescription-select-label">Reçete</InputLabel>
              <Select
                labelId="prescription-select-label"
                id="prescriptionId"
                name="prescriptionId"
                value={formData.prescriptionId}
                onChange={handleChange}
                label="Reçete"
              >
                {prescriptions && prescriptions.length > 0 ? (
                  prescriptions.map((prescription) => (
                    <MenuItem key={prescription.id} value={prescription.id}>
                      {prescription.diagnosis?.patient?.name 
                        ? `${prescription.diagnosis.patient.name} - ${prescription.notes}` 
                        : `ID: ${prescription.id} - ${prescription.notes}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Reçete bulunamadı</MenuItem>
                )}
              </Select>
              {errors.prescriptionId && (
                <FormHelperText>{errors.prescriptionId}</FormHelperText>
              )}
            </FormControl>

            <FormControl 
              fullWidth 
              error={!!errors.medicationId}
            >
              <InputLabel id="medication-select-label">İlaç</InputLabel>
              <Select
                labelId="medication-select-label"
                id="medicationId"
                name="medicationId"
                value={formData.medicationId}
                onChange={handleChange}
                label="İlaç"
              >
                <MenuItem value="">
                  <em>İlaç Seçiniz</em>
                </MenuItem>
                {medications && medications.length > 0 ? (
                  medications.map((medication) => (
                    <MenuItem key={medication.id} value={medication.id}>
                      {medication.name} ({medication.unit})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>İlaç bulunamadı</MenuItem>
                )}
              </Select>
              {errors.medicationId && (
                <FormHelperText>{errors.medicationId}</FormHelperText>
              )}
            </FormControl>

            <FormControl 
              fullWidth 
              error={!!errors.medicationBatchId}
              disabled={!formData.medicationId}
            >
              <InputLabel id="medication-batch-select-label">İlaç Partisi</InputLabel>
              <Select
                labelId="medication-batch-select-label"
                id="medicationBatchId"
                name="medicationBatchId"
                value={formData.medicationBatchId}
                onChange={handleChange}
                label="İlaç Partisi"
              >
                <MenuItem value="">
                  <em>Parti Seçiniz</em>
                </MenuItem>
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <MenuItem key={batch.id} value={batch.id}>
                      Parti No: {batch.batchNumber} - SKT: {new Date(batch.expiryDate).toLocaleDateString()} - Stok: {batch.currentStock}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>İlaç partisi bulunamadı</MenuItem>
                )}
              </Select>
              {errors.medicationBatchId && (
                <FormHelperText>{errors.medicationBatchId}</FormHelperText>
              )}
              {formData.medicationId && filteredBatches.length === 0 && (
                <FormHelperText error>Bu ilaç için parti bulunmamaktadır</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              id="dailyDose"
              name="dailyDose"
              label="Günlük Doz"
              value={formData.dailyDose}
              onChange={handleChange}
              error={!!errors.dailyDose}
              helperText={errors.dailyDose}
            />

            <TextField
              fullWidth
              id="durationDays"
              name="durationDays"
              label="Tedavi Süresi (Gün)"
              type="number"
              value={formData.durationDays}
              onChange={handleChange}
              error={!!errors.durationDays}
              helperText={errors.durationDays}
              InputProps={{ inputProps: { min: 1 } }}
            />

            <TextField
              fullWidth
              id="totalAmount"
              name="totalAmount"
              label="Toplam Miktar"
              type="number"
              value={formData.totalAmount}
              onChange={handleChange}
              error={!!errors.totalAmount}
              helperText={errors.totalAmount}
              InputProps={{ inputProps: { min: 1 } }}
            />

            {mode === 'edit' && prescriptionItem && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary">
                  Reçete Öğesi Bilgileri
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Hasta: {prescriptionItem.prescription?.diagnosis?.patient?.name || 'Bilinmiyor'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  İlaç: {prescriptionItem.medication?.name || 'Bilinmiyor'}
                </Typography>
                <Typography variant="body2">
                  Reçete: {prescriptionItem.prescription?.notes || 'Bilinmiyor'}
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

PrescriptionItemForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
  prescriptionItem: PropTypes.object,
  prescriptions: PropTypes.array,
  medications: PropTypes.array,
  medicationBatches: PropTypes.array
};

PrescriptionItemForm.defaultProps = {
  prescriptionItem: null,
  prescriptions: [],
  medications: [],
  medicationBatches: []
};

export default PrescriptionItemForm; 