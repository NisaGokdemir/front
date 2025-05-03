import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import PrescriptionList from '../components/prescriptions/PrescriptionList';
import PrescriptionForm from '../components/prescriptions/PrescriptionForm';
import prescriptionService from '../services/prescriptionService';
import diagnosisService from '../services/diagnosisService';
import { useLocation, useNavigate } from 'react-router-dom';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const SearchBox = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  width: '100%',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
}));

const PrescriptionPage = () => {
  // State tanımlamaları
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // URL parametrelerini işleme
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL'den id parametresini al
  const getIdFromUrl = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('id');
  }, [location.search]);

  // Reçeteleri filtrele
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPrescriptions(prescriptions);
    } else {
      const filtered = prescriptions.filter(prescription =>
        prescription.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prescription.diagnosis && prescription.diagnosis.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prescription.diagnosis && prescription.diagnosis.patient && 
          prescription.diagnosis.patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPrescriptions(filtered);
    }
  }, [searchTerm, prescriptions]);

  // URL'den id varsa ilgili reçeteyi yükle
  useEffect(() => {
    const prescriptionId = getIdFromUrl();
    if (prescriptionId) {
      // Bu etki, komponent yüklendiğinde ve URL değiştiğinde çalışacak
      fetchPrescriptionById(prescriptionId);
    }
  }, [getIdFromUrl]);

  // Reçete detayını yükle
  const fetchPrescriptionById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const prescription = await prescriptionService.getPrescriptionById(id);
      setSelectedPrescription(prescription);
      
      // Düzenleme modalini aç
      setDialogMode('edit');
      setOpenDialog(true);
      
      // Tanıları da yükle (form için gerekli)
      await fetchDiagnoses();
    } catch (error) {
      console.error('Reçete yüklenirken hata oluştu:', error);
      setError(`Reçete yüklenemedi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reçeteleri yükle
  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await prescriptionService.getAllPrescriptions();
      setPrescriptions(response.content || response);
      
    } catch (error) {
      console.error('Reçeteler yüklenirken hata oluştu:', error);
      setError(error.message || 'Reçeteler yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  // Tanıları yükle
  const fetchDiagnoses = useCallback(async () => {
    try {
      const response = await diagnosisService.getDiagnoses();
      setDiagnoses(response.content || response);
    } catch (error) {
      console.error('Tanılar yüklenirken hata oluştu:', error);
    }
  }, []);

  // Sayfa yüklendiğinde reçeteleri ve tanıları getir
  useEffect(() => {
    fetchPrescriptions();
    fetchDiagnoses();
  }, [fetchPrescriptions, fetchDiagnoses]);

  // Arama işlemi
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Dialog açma
  const handleDialogOpen = (mode, prescription = null) => {
    setDialogMode(mode);
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  // Dialog kapatma
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedPrescription(null);
    
    // URL'den gelen id parametresini temizle
    const prescriptionId = getIdFromUrl();
    if (prescriptionId) {
      navigate('/prescriptions');
    }
  };

  // Form gönderme (ekleme/güncelleme)
  const handleFormSubmit = async (prescriptionData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await prescriptionService.createPrescription(prescriptionData);
      } else {
        await prescriptionService.updatePrescription(selectedPrescription.id, prescriptionData);
      }
      
      // İşlem başarılıysa listeyi güncelle
      await fetchPrescriptions();
      handleDialogClose();
      
    } catch (error) {
      console.error('Reçete kaydedilirken hata oluştu:', error);
      setError(error.message || 'Reçete kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  // Reçete silme
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await prescriptionService.deletePrescription(id);
      await fetchPrescriptions();
    } catch (error) {
      console.error('Reçete silinirken hata oluştu:', error);
      setError(error.message || 'Reçete silinemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="lg">
      <Header>
        <Typography variant="h4" component="h1" gutterBottom>
          Reçete Yönetimi
        </Typography>
        <Box>
          <IconButton color="primary" onClick={fetchPrescriptions} disabled={loading}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleDialogOpen('add')}
            disabled={loading}
            sx={{ ml: 1 }}
          >
            Yeni Reçete
          </Button>
        </Box>
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <SearchBox
          label="Reçetelerde Ara"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          disabled={loading}
        />

        {loading && !openDialog ? (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        ) : (
          <PrescriptionList
            prescriptions={filteredPrescriptions}
            onEdit={(prescription) => handleDialogOpen('edit', prescription)}
            onDelete={handleDelete}
          />
        )}
      </Paper>

      <PrescriptionForm
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        mode={dialogMode}
        prescription={selectedPrescription}
        diagnoses={diagnoses}
      />
    </PageContainer>
  );
};

export default PrescriptionPage; 