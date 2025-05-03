import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  Snackbar,
  Alert, 
  Card,
  CardContent,
  Dialog,
  useTheme,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Badge,
  Chip,
  Drawer,
  AppBar,
  Toolbar,
  Container,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon,
  Pets as PetsIcon,
  MedicalServices as MedicalIcon,
  ArrowBack as ArrowBackIcon,
  MedicalInformation as MedicalInfoIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import patientService from '../services/patientService';
import diagnosisService from '../services/diagnosisService';
import prescriptionService from '../services/prescriptionService';
import PatientList from '../components/patients/PatientList';
import PatientForm from '../components/patients/PatientForm';
import DiagnosisList from '../components/diagnoses/DiagnosisList';
import DiagnosisForm from '../components/diagnoses/DiagnosisForm';
import PrescriptionForm from '../components/prescriptions/PrescriptionForm';
import PrescriptionList from '../components/prescriptions/PrescriptionList';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// TabPanel bileşeni
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PatientPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [patientForDiagnosis, setPatientForDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diagnosisError, setDiagnosisError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Sayfalama - Hastalar
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog - Hastalar
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' veya 'edit'
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Dialog - Tanılar
  const [openDiagnosisDialog, setOpenDiagnosisDialog] = useState(false);
  const [diagnosisDialogMode, setDiagnosisDialogMode] = useState('add');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  
  // Dialog - Reçeteler
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [selectedDiagnosisForPrescription, setSelectedDiagnosisForPrescription] = useState(null);
  
  // Drawer - Reçeteler
  const [isPatientPrescriptionsDrawerOpen, setIsPatientPrescriptionsDrawerOpen] = useState(false);
  const [diagnosisPrescriptions, setDiagnosisPrescriptions] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState(null);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [diagnosisSearchTerm, setDiagnosisSearchTerm] = useState('');
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);

  // Tabs
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();
  const isVeterinarian = user?.roles?.includes('ROLE_VETERINARIAN') || user?.roles?.includes('ROLE_ADMIN');

  // Hasta Tanı Yönetimi
  const [selectedPatientForDiagnoses, setSelectedPatientForDiagnoses] = useState(null);
  const [patientDiagnoses, setPatientDiagnoses] = useState([]);
  const [isPatientDiagnosesDrawerOpen, setIsPatientDiagnosesDrawerOpen] = useState(false);
  
  // Reçete Sayıları
  const [prescriptionCounts, setPrescriptionCounts] = useState({});

  // Hastaları API'den yükle
  useEffect(() => {
    fetchPatients();
  }, [page, size]);
  
  // Tanıları API'den yükle
  useEffect(() => {
    if (tabValue === 1 && isVeterinarian) {
      fetchDiagnoses();
    }
  }, [tabValue, isVeterinarian]);

  // Hasta arama filtreleme
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.chipNumber.includes(searchTerm) ||
        (patient.owner && patient.owner.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  // Tanı arama filtreleme
  useEffect(() => {
    if (diagnosisSearchTerm.trim() === '') {
      setFilteredDiagnoses(diagnoses);
    } else {
      const filtered = diagnoses.filter(diagnosis => 
        diagnosis.diagnosis.toLowerCase().includes(diagnosisSearchTerm.toLowerCase()) ||
        diagnosis.treatmentPlan.toLowerCase().includes(diagnosisSearchTerm.toLowerCase()) ||
        (diagnosis.patient && diagnosis.patient.name.toLowerCase().includes(diagnosisSearchTerm.toLowerCase()))
      );
      setFilteredDiagnoses(filtered);
    }
  }, [diagnosisSearchTerm, diagnoses]);

  // Hasta seçildiğinde onun tanılarını getir
  useEffect(() => {
    if (selectedPatientForDiagnoses) {
      fetchPatientDiagnoses(selectedPatientForDiagnoses.id);
    }
  }, [selectedPatientForDiagnoses]);

  // Reçete sayılarını güncelleme
  useEffect(() => {
    // Tanılar yüklendiğinde, her tanı için reçete sayısını al
    if (patientDiagnoses.length > 0) {
      fetchPrescriptionCounts();
    }
  }, [patientDiagnoses]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientService.getPatients(page, size);
      
      setPatients(response.content || []);
      setFilteredPatients(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Hastalar yüklenirken hata oluştu:', error);
      setError(error.message || 'Hastalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiagnoses = async () => {
    try {
      setDiagnosisLoading(true);
      setDiagnosisError(null);
      
      const response = await diagnosisService.getDiagnoses();
      
      setDiagnoses(response.content || []);
      setFilteredDiagnoses(response.content || []);
    } catch (error) {
      console.error('Tanılar yüklenirken hata oluştu:', error);
      setDiagnosisError(error.message || 'Tanılar yüklenemedi');
    } finally {
      setDiagnosisLoading(false);
    }
  };

  const fetchPatientDiagnoses = async (patientId) => {
    try {
      setDiagnosisLoading(true);
      setDiagnosisError(null);
      
      // API'de hastaya göre tanı getirme fonksiyonu 
      const response = await diagnosisService.getDiagnosesByPatientId(patientId);
      
      setPatientDiagnoses(response.content || response || []);
    } catch (error) {
      console.error('Hasta tanıları yüklenirken hata oluştu:', error);
      setDiagnosisError(error.message || 'Hasta tanıları yüklenemedi');
    } finally {
      setDiagnosisLoading(false);
    }
  };

  const fetchPrescriptionCounts = async () => {
    const counts = {};
    
    try {
      for (const diagnosis of patientDiagnoses) {
        const response = await prescriptionService.getPrescriptionsByDiagnosisId(diagnosis.id);
        counts[diagnosis.id] = (response.content || response || []).length;
      }
      
      setPrescriptionCounts(counts);
    } catch (error) {
      console.error('Reçete sayıları yüklenirken hata oluştu:', error);
    }
  };

  // Tanıya ait reçeteleri getir
  const fetchDiagnosisPrescriptions = async (diagnosisId) => {
    try {
      setPrescriptionLoading(true);
      setPrescriptionError(null);
      
      const response = await prescriptionService.getPrescriptionsByDiagnosisId(diagnosisId);
      setDiagnosisPrescriptions(response.content || response || []);
    } catch (error) {
      console.error('Tanı reçeteleri yüklenirken hata oluştu:', error);
      setPrescriptionError(error.message || 'Reçeteler yüklenemedi');
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // Hasta işlemleri
  const handleDialogOpen = (mode, patient = null) => {
    setDialogMode(mode);
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleDiagnosisSearch = (value) => {
    setDiagnosisSearchTerm(value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFormSubmit = async (patientData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await patientService.createPatient(patientData);
        setNotification({
          open: true,
          message: 'Hasta başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await patientService.updatePatient(selectedPatient.id, patientData);
        setNotification({
          open: true,
          message: 'Hasta başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchPatients();
    } catch (error) {
      console.error('İşlem sırasında hata oluştu:', error);
      setNotification({
        open: true,
        message: error.message || 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      setLoading(true);
      
      await patientService.deletePatient(id);
      
      setNotification({
        open: true,
        message: 'Hasta başarıyla silindi',
        severity: 'success'
      });
      
      fetchPatients();
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu:', error);
      setNotification({
        open: true,
        message: error.message || 'Silme işlemi sırasında bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Tanı işlemleri
  const handleDiagnosisDialogOpen = (mode, diagnosis = null, patientId = null) => {
    setDiagnosisDialogMode(mode);
    setSelectedDiagnosis(diagnosis);
    setPatientForDiagnosis(patientId);
    setOpenDiagnosisDialog(true);
  };

  const handleDiagnosisDialogClose = () => {
    setOpenDiagnosisDialog(false);
    setSelectedDiagnosis(null);
    setPatientForDiagnosis(null);
  };

  const handleDiagnosisFormSubmit = async (diagnosisData) => {
    try {
      setDiagnosisLoading(true);
      
      console.log("Diagnosis Data being submitted:", diagnosisData);
      
      if (diagnosisDialogMode === 'add') {
        const response = await diagnosisService.createDiagnosis(diagnosisData);
        console.log("Response from diagnosis creation:", response);
        
        setNotification({
          open: true,
          message: 'Tanı başarıyla eklendi',
          severity: 'success'
        });
      } else {
        const response = await diagnosisService.updateDiagnosis(selectedDiagnosis.id, diagnosisData);
        console.log("Response from diagnosis update:", response);
        
        setNotification({
          open: true,
          message: 'Tanı başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDiagnosisDialogClose();
      
      // Eğer hasta detay sayfasındaysak o hastanın tanılarını güncelle
      if (selectedPatientForDiagnoses) {
        fetchPatientDiagnoses(selectedPatientForDiagnoses.id);
      } else {
        // Genel tanı listesindeyse tüm tanıları yenile
        fetchDiagnoses();
      }
    } catch (error) {
      console.error('İşlem sırasında hata oluştu:', error);
      setNotification({
        open: true,
        message: error.message || 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setDiagnosisLoading(false);
    }
  };

  const handleDeleteDiagnosis = async (id) => {
    try {
      setDiagnosisLoading(true);
      
      await diagnosisService.deleteDiagnosis(id);
      
      setNotification({
        open: true,
        message: 'Tanı başarıyla silindi',
        severity: 'success'
      });
      
      // Eğer hasta detay sayfasındaysak o hastanın tanılarını güncelle
      if (selectedPatientForDiagnoses) {
        fetchPatientDiagnoses(selectedPatientForDiagnoses.id);
      } else {
        // Genel tanı listesindeyse tüm tanıları yenile
        fetchDiagnoses();
      }
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu:', error);
      setNotification({
        open: true,
        message: error.message || 'Silme işlemi sırasında bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setDiagnosisLoading(false);
    }
  };

  const handleViewPatientDiagnoses = (patient) => {
    setSelectedPatientForDiagnoses(patient);
    setIsPatientDiagnosesDrawerOpen(true);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handlePatientDiagnosesDrawerClose = () => {
    setIsPatientDiagnosesDrawerOpen(false);
    setSelectedPatientForDiagnoses(null);
    setPatientDiagnoses([]);
  };

  // Reçete oluşturma dialog'unu aç
  const handleCreatePrescription = (diagnosis) => {
    setSelectedDiagnosisForPrescription(diagnosis);
    setOpenPrescriptionDialog(true);
  };

  // Reçete dialog'unu kapat
  const handlePrescriptionDialogClose = () => {
    setOpenPrescriptionDialog(false);
    setSelectedDiagnosisForPrescription(null);
  };

  // Reçete formunu gönder
  const handlePrescriptionFormSubmit = async (prescriptionData) => {
    try {
      setPrescriptionLoading(true);
      setPrescriptionError(null);
      
      // Reçeteyi oluştur
      await prescriptionService.createPrescription(prescriptionData);
      
      // Başarı bildirimi göster
      setNotification({
        open: true,
        message: 'Reçete başarıyla oluşturuldu',
        severity: 'success'
      });
      
      // Reçete sayılarını güncelle
      fetchPrescriptionCounts();
      
      // Dialog'u kapat
      handlePrescriptionDialogClose();
    } catch (error) {
      console.error('Reçete oluşturulurken hata oluştu:', error);
      setPrescriptionError(error.message || 'Reçete oluşturulamadı');
      
      setNotification({
        open: true,
        message: 'Reçete oluşturulurken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // Reçeteleri görüntüleme
  const handleViewPrescriptions = (diagnosis) => {
    fetchDiagnosisPrescriptions(diagnosis.id);
    setSelectedDiagnosisForPrescription(diagnosis);
    setIsPatientPrescriptionsDrawerOpen(true);
  };

  // Reçete silme işlemi
  const handleDeletePrescription = async (id) => {
    try {
      setPrescriptionLoading(true);
      setPrescriptionError(null);
      
      // Reçeteyi sil
      await prescriptionService.deletePrescription(id);
      
      // Başarı bildirimi göster
      setNotification({
        open: true,
        message: 'Reçete başarıyla silindi',
        severity: 'success'
      });
      
      // Güncel reçeteleri getir
      if (selectedDiagnosisForPrescription) {
        fetchDiagnosisPrescriptions(selectedDiagnosisForPrescription.id);
      }
      
      // Reçete sayılarını güncelle
      fetchPrescriptionCounts();
    } catch (error) {
      console.error('Reçete silinirken hata oluştu:', error);
      setPrescriptionError(error.message || 'Reçete silinemedi');
      
      setNotification({
        open: true,
        message: 'Reçete silinirken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // Reçete düzenleme
  const handleEditPrescription = async (prescription) => {
    navigate(`/prescriptions?id=${prescription.id}`);
  };

  // Reçete drawer'ını kapat
  const handlePatientPrescriptionsDrawerClose = () => {
    setIsPatientPrescriptionsDrawerOpen(false);
    setSelectedDiagnosisForPrescription(null);
    setDiagnosisPrescriptions([]);
  };

  // Hasta Tanı Detay Sayfası
  const renderPatientDiagnosesDrawer = () => {
    return (
      <Drawer
        anchor="right"
        open={isPatientDiagnosesDrawerOpen}
        onClose={handlePatientDiagnosesDrawerClose}
        PaperProps={{
          sx: { 
            width: { xs: '100%', sm: '80%', md: '70%' },
            maxWidth: '1000px'
          }
        }}
      >
        {selectedPatientForDiagnoses && (
          <>
            <AppBar position="static" color="primary" sx={{ boxShadow: 'none' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handlePatientDiagnosesDrawerClose}
                  sx={{ mr: 2 }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {selectedPatientForDiagnoses.name} - Tanılar
                </Typography>
                {isVeterinarian && (
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => handleDiagnosisDialogOpen('add', null, selectedPatientForDiagnoses.id)}
                    color="secondary"
                  >
                    Yeni Tanı
                  </Button>
                )}
              </Toolbar>
            </AppBar>
            
            <Box sx={{ p: 3 }}>
              <Card elevation={2} sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: theme.palette.primary.light, 
                  color: theme.palette.primary.contrastText,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <MedicalInfoIcon />
                  <Typography variant="h6">Hasta Bilgileri</Typography>
                </Box>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Ad</Typography>
                      <Typography variant="body1">{selectedPatientForDiagnoses.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Yaş</Typography>
                      <Typography variant="body1">{selectedPatientForDiagnoses.age}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Ağırlık</Typography>
                      <Typography variant="body1">{selectedPatientForDiagnoses.weight} kg</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Çip Numarası</Typography>
                      <Typography variant="body1">{selectedPatientForDiagnoses.chipNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Kan Grubu</Typography>
                      <Typography variant="body1">{selectedPatientForDiagnoses.bloodType?.type}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Tür / Irk</Typography>
                      <Typography variant="body1">
                        {selectedPatientForDiagnoses.species?.name} / {selectedPatientForDiagnoses.breed?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Sahibi</Typography>
                      <Typography variant="body1">
                        {selectedPatientForDiagnoses.owner?.fullName} - {selectedPatientForDiagnoses.owner?.phone}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                  Tanı Geçmişi
                </Typography>
                <Chip 
                  label={`${patientDiagnoses.length} Tanı`} 
                  color="primary"
                  icon={<MedicalIcon />}
                />
              </Box>
              
              {diagnosisLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : diagnosisError ? (
                <Alert severity="error" sx={{ my: 2 }}>
                  {diagnosisError}
                </Alert>
              ) : patientDiagnoses.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '12px' }}>
                  <MedicalIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Kayıtlı tanı bulunamadı
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Bu hasta için henüz tanı eklenmemiş. Yeni tanı eklemek için "Yeni Tanı" butonunu kullanabilirsiniz.
                  </Typography>
                </Paper>
              ) : (
                <DiagnosisList 
                  diagnoses={patientDiagnoses}
                  onEdit={(diagnosis) => handleDiagnosisDialogOpen('edit', diagnosis)}
                  onDelete={handleDeleteDiagnosis}
                  loading={diagnosisLoading}
                  onCreatePrescription={handleCreatePrescription}
                  onViewPrescriptions={handleViewPrescriptions}
                  prescriptionCounts={prescriptionCounts}
                />
              )}
            </Box>
          </>
        )}
      </Drawer>
    );
  };

  // Render Reçete Drawer
  const renderPrescriptionsDrawer = () => {
    return (
      <Drawer
        anchor="right"
        open={isPatientPrescriptionsDrawerOpen}
        onClose={handlePatientPrescriptionsDrawerClose}
        sx={{
          width: '60%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '60%',
            boxSizing: 'border-box',
          },
        }}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handlePatientPrescriptionsDrawerClose}
              aria-label="close"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {selectedDiagnosisForPrescription?.patient?.name} - Reçeteler
              </Typography>
              <Chip
                label={selectedDiagnosisForPrescription?.diagnosis || ''}
                size="small"
                color="primary"
                sx={{ ml: 2 }}
              />
            </Box>
            <Button 
              color="primary" 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleCreatePrescription(selectedDiagnosisForPrescription)}
            >
              Yeni Reçete
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container sx={{ py: 3 }}>
          {prescriptionLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : prescriptionError ? (
            <Alert severity="error">{prescriptionError}</Alert>
          ) : (
            <PrescriptionList
              prescriptions={diagnosisPrescriptions}
              onEdit={handleEditPrescription}
              onDelete={handleDeletePrescription}
            />
          )}
        </Container>
      </Drawer>
    );
  };

  // Ana Sayfa Render
  return (
    <Box sx={{ position: 'relative' }}>
      <Card 
        elevation={2} 
        className="mb-6 overflow-hidden"
        sx={{ 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box 
          className="bg-gradient-to-r from-blue-600 to-indigo-500 py-5 px-6"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.8) 0%, transparent 70%)'
            }}
          />
          
          <Box 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              borderRadius: '50%', 
              p: 1.5,
              display: 'flex',
              zIndex: 1
            }}
          >
            <PetsIcon fontSize="large" sx={{ color: 'white' }} />
          </Box>
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" component="h1" className="font-medium text-white">
              Hastalar
            </Typography>
            <Typography variant="subtitle2" className="text-blue-100">
              Hasta kayıtlarını ve tanılarını yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="patient tabs"
            sx={{ px: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label="Hasta Listesi" 
              id="patient-tab-0" 
              icon={<PetsIcon />} 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            {isVeterinarian && (
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Tanılar
                    <Chip 
                      label={diagnoses.length} 
                      size="small" 
                      color="primary" 
                      sx={{ height: 20, fontSize: '0.7rem' }} 
                    />
                  </Box>
                } 
                id="patient-tab-1" 
                icon={<MedicalIcon />} 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            )}
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <SearchBar
              placeholder="Ad, çip numarası veya sahibi ile ara..."
              onSearch={handleSearch}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpen('add')}
              disabled={loading}
              sx={{ 
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
              }}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              Yeni Hasta
            </Button>
          </Box>
          
          {loading && <Box className="flex justify-center my-6"><CircularProgress /></Box>}
          
          {error && (
            <Alert severity="error" className="my-4">
              {error}
            </Alert>
          )}
          
          {!loading && !error && (
            <>
              <PatientList 
                patients={filteredPatients}
                onEdit={(patient) => handleDialogOpen('edit', patient)}
                onDelete={handleDeletePatient}
                onAddDiagnosis={isVeterinarian ? (patientId) => handleDiagnosisDialogOpen('add', null, patientId) : null}
                onViewDiagnoses={handleViewPatientDiagnoses}
                loading={loading}
              />
              
              {totalElements > 0 && (
                <Box className="mt-4 flex justify-center">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    size={size}
                    onPageChange={handlePageChange}
                    onSizeChange={handleSizeChange}
                  />
                </Box>
              )}
            </>
          )}
        </TabPanel>
        
        {isVeterinarian && (
          <TabPanel value={tabValue} index={1}>
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <SearchBar
                placeholder="Tanı, tedavi planı veya hasta adı ile ara..."
                onSearch={handleDiagnosisSearch}
              />
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleDiagnosisDialogOpen('add')}
                disabled={diagnosisLoading}
                sx={{ 
                  borderRadius: '8px',
                  px: 3,
                  py: 1.2,
                  boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
                }}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                Yeni Tanı
              </Button>
            </Box>
            
            {diagnosisLoading && <Box className="flex justify-center my-6"><CircularProgress /></Box>}
            
            {diagnosisError && (
              <Alert severity="error" className="my-4">
                {diagnosisError}
              </Alert>
            )}
            
            {!diagnosisLoading && !diagnosisError && (
              <DiagnosisList 
                diagnoses={filteredDiagnoses}
                onEdit={(diagnosis) => handleDiagnosisDialogOpen('edit', diagnosis)}
                onDelete={handleDeleteDiagnosis}
                loading={diagnosisLoading}
              />
            )}
          </TabPanel>
        )}
      </Card>
      
      {/* Hasta Ekleme/Düzenleme Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <PatientForm 
          mode={dialogMode}
          patient={selectedPatient}
          onSubmit={handleFormSubmit}
          onCancel={handleDialogClose}
          loading={loading}
        />
      </Dialog>
      
      {/* Tanı Ekleme/Düzenleme Dialog */}
      {isVeterinarian && (
        <Dialog 
          open={openDiagnosisDialog} 
          onClose={handleDiagnosisDialogClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <DiagnosisForm 
            mode={diagnosisDialogMode}
            diagnosis={selectedDiagnosis}
            patientId={patientForDiagnosis}
            onSubmit={handleDiagnosisFormSubmit}
            onCancel={handleDiagnosisDialogClose}
            loading={diagnosisLoading}
          />
        </Dialog>
      )}
      
      {/* Hasta Tanı Detay Çekmecesi */}
      {renderPatientDiagnosesDrawer()}
      
      {/* Reçete drawer */}
      {renderPrescriptionsDrawer()}
      
      {/* Reçete formu */}
      <PrescriptionForm
        open={openPrescriptionDialog}
        onClose={handlePrescriptionDialogClose}
        onSubmit={handlePrescriptionFormSubmit}
        mode="add"
        prescription={null}
        diagnoses={[selectedDiagnosisForPrescription].filter(Boolean)}
      />
      
      {/* Bildirim */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientPage; 