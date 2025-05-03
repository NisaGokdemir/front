import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Breadcrumbs,
  Paper,
  Divider,
  Fab,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import PrescriptionItemList from './PrescriptionItemList';
import PrescriptionItemForm from './PrescriptionItemForm';
import prescriptionItemService from '../../services/prescriptionItemService';
import prescriptionService from '../../services/prescriptionService';
import medicationService from '../../services/medicationService';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const PrescriptionDetailsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const BackFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
}));

const PrescriptionItemsPage = () => {
  const { id } = useParams(); // Reçete ID'si
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medicationBatches, setMedicationBatches] = useState([]);
  
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const loadPrescriptionItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = id
        ? await prescriptionItemService.getPrescriptionItemsByPrescriptionId(id)
        : await prescriptionItemService.getAllPrescriptionItems();
      
      setPrescriptionItems(id ? response.content : response.content || response);
      setError(null);
    } catch (err) {
      console.error('Reçete öğeleri yüklenirken hata:', err);
      setError('Reçete öğeleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      showNotification('Reçete öğeleri yüklenirken bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Belirli bir reçeteye ait detayları yükle
  const loadPrescription = useCallback(async () => {
    if (!id) return;
    
    try {
      const data = await prescriptionService.getPrescriptionById(id);
      setPrescription(data);
    } catch (err) {
      console.error('Reçete yüklenirken hata:', err);
      setError('Reçete detayları yüklenirken bir hata oluştu.');
      showNotification('Reçete detayları yüklenirken bir hata oluştu.', 'error');
    }
  }, [id]);

  // Tüm reçeteleri yükle (form için)
  const loadAllPrescriptions = useCallback(async () => {
    try {
      const response = await prescriptionService.getAllPrescriptions();
      setAllPrescriptions(response.content || response);
    } catch (err) {
      console.error('Tüm reçeteler yüklenirken hata:', err);
      showNotification('Reçeteler yüklenirken bir hata oluştu.', 'error');
    }
  }, []);

  // Tüm ilaçları yükle
  const loadMedications = useCallback(async () => {
    try {
      // Doğru API çağrısı ile ilaçları yükle
      const response = await medicationService.getAllMedications();
      console.log('Yüklenen ilaçlar:', response);
      setMedications(response.content || response);
    } catch (err) {
      console.error('İlaçlar yüklenirken hata:', err);
      showNotification('İlaçlar yüklenirken bir hata oluştu.', 'error');
    }
  }, []);

  // Tüm ilaç partilerini yükle
  const loadMedicationBatches = useCallback(async () => {
    try {
      // Doğru API çağrısı ile ilaç partilerini yükle
      const response = await medicationService.getAllMedicationBatches();
      console.log('Yüklenen ilaç partileri:', response);
      setMedicationBatches(response.content || response);
    } catch (err) {
      console.error('İlaç partileri yüklenirken hata:', err);
      showNotification('İlaç partileri yüklenirken bir hata oluştu.', 'error');
    }
  }, []);

  useEffect(() => {
    // Sıralı API çağrıları ile veri yükleme
    const loadData = async () => {
      setLoading(true);
      try {
        // Önce ilaçları ve reçeteleri yükle
        await Promise.all([
          loadAllPrescriptions(),
          loadMedications(),
          loadMedicationBatches()
        ]);
        
        // Sonra spesifik bir reçete varsa onu yükle
        if (id) {
          await loadPrescription();
        }
        
        // En son reçete öğelerini yükle
        await loadPrescriptionItems();
      } catch (err) {
        console.error('Veri yüklenirken hata:', err);
        setError('Veriler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, loadPrescriptionItems, loadPrescription, loadAllPrescriptions, loadMedications, loadMedicationBatches]);

  const handleAddClick = () => {
    setFormMode('add');
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEditClick = (item) => {
    setFormMode('edit');
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (formMode === 'add') {
        await prescriptionItemService.createPrescriptionItem(formData);
        showNotification('Reçete öğesi başarıyla eklendi.');
      } else {
        await prescriptionItemService.updatePrescriptionItem(selectedItem.id, formData);
        showNotification('Reçete öğesi başarıyla güncellendi.');
      }
      
      loadPrescriptionItems();
      handleFormClose();
    } catch (err) {
      console.error('İşlem sırasında hata:', err);
      showNotification('İşlem sırasında bir hata oluştu.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await prescriptionItemService.deletePrescriptionItem(id);
      showNotification('Reçete öğesi başarıyla silindi.');
      loadPrescriptionItems();
    } catch (err) {
      console.error('Silme sırasında hata:', err);
      showNotification('Silme işlemi sırasında bir hata oluştu.', 'error');
    }
  };

  const handleBack = () => {
    // Geri dön
    if (id) {
      navigate('/prescriptions');
    } else {
      navigate(-1);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Typography color="text.primary">Reçeteler</Typography>
            {id && prescription && (
              <Typography color="text.primary">
                {prescription.diagnosis?.patient?.name || 'Hasta'} - {prescription.notes || 'Reçete'}
              </Typography>
            )}
            <Typography color="text.primary">Reçete Öğeleri</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom>
            {id ? 'Reçete Öğeleri' : 'Tüm Reçete Öğeleri'}
          </Typography>
        </Box>
        <ActionButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Yeni Ekle
        </ActionButton>
      </Header>

      {id && prescription && (
        <PrescriptionDetailsCard>
          <Typography variant="h6" gutterBottom>
            Reçete Detayları
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Typography variant="body1">
              <strong>Hasta:</strong> {prescription.diagnosis?.patient?.name || 'Bilinmiyor'}
            </Typography>
            <Typography variant="body1">
              <strong>Tür:</strong> {prescription.diagnosis?.patient?.species?.name || 'Bilinmiyor'}
            </Typography>
            <Typography variant="body1">
              <strong>Irk:</strong> {prescription.diagnosis?.patient?.breed?.name || 'Bilinmiyor'}
            </Typography>
            <Typography variant="body1">
              <strong>Sahibi:</strong> {prescription.diagnosis?.patient?.owner?.fullName || 'Bilinmiyor'}
            </Typography>
            <Typography variant="body1">
              <strong>Tanı:</strong> {prescription.diagnosis?.diagnosis || 'Bilinmiyor'}
            </Typography>
            <Typography variant="body1">
              <strong>Reçete Notları:</strong> {prescription.notes || 'Belirtilmemiş'}
            </Typography>
          </Box>
        </PrescriptionDetailsCard>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PrescriptionItemList
          prescriptionItems={prescriptionItems}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}

      <PrescriptionItemForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
        mode={formMode}
        prescriptionItem={selectedItem}
        prescriptions={id ? [prescription].filter(Boolean) : allPrescriptions}
        medications={medications}
        medicationBatches={medicationBatches}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <BackFab
        color="primary"
        aria-label="geri"
        onClick={handleBack}
      >
        <ArrowBackIcon />
      </BackFab>
    </PageContainer>
  );
};

export default PrescriptionItemsPage; 