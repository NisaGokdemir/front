import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Snackbar,
  Alert, 
  Card,
  CardContent,
  Dialog,
  useTheme,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import { 
  Add as AddIcon,
  Medication as MedicationIcon
} from '@mui/icons-material';
import medicationService from '../services/medicationService';
import MedicationList from '../components/medications/MedicationList';
import MedicationForm from '../components/medications/MedicationForm';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

const MedicationPage = () => {
  const theme = useTheme();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Sayfalama
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' veya 'edit'
  const [selectedMedication, setSelectedMedication] = useState(null);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedications, setFilteredMedications] = useState([]);

  // İlaçları API'den yükle
  useEffect(() => {
    fetchMedications();
  }, [page, size]);
  
  // Arama filtreleme
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedications(medications);
    } else {
      const filtered = medications.filter(medication => 
        medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medication.unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedications(filtered);
    }
  }, [searchTerm, medications]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await medicationService.getMedications(page, size);
      
      setMedications(response.content || []);
      setFilteredMedications(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('İlaçlar yüklenirken hata oluştu:', error);
      setError(error.message || 'İlaçlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (mode, medication = null) => {
    setDialogMode(mode);
    setSelectedMedication(medication);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedMedication(null);
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

  const handleFormSubmit = async (medicationData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await medicationService.createMedication(medicationData);
        setNotification({
          open: true,
          message: 'İlaç başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await medicationService.updateMedication(selectedMedication.id, medicationData);
        setNotification({
          open: true,
          message: 'İlaç başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchMedications();
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

  const handleDeleteMedication = async (id) => {
    try {
      setLoading(true);
      
      await medicationService.deleteMedication(id);
      
      setNotification({
        open: true,
        message: 'İlaç başarıyla silindi',
        severity: 'success'
      });
      
      fetchMedications();
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

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

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
          className="bg-gradient-to-r from-green-600 to-teal-500 py-5 px-6"
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
            <MedicationIcon fontSize="large" sx={{ color: 'white' }} />
          </Box>
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" component="h1" className="font-medium text-white">
              İlaç Yönetimi
            </Typography>
            <Typography variant="subtitle2" className="text-green-100">
              İlaç stok ve bilgilerini yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 4, px: 4 }}>
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <SearchBar
              placeholder="İlaç adı veya birim ile ara..."
              onSearch={handleSearch}
            />
            
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpen('add')}
              disabled={loading}
              sx={{ 
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                boxShadow: '0 4px 10px rgba(76, 175, 80, 0.25)'
              }}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              Yeni İlaç Ekle
            </Button>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              className="mb-4"
              sx={{ borderRadius: '8px' }}
              variant="filled"
            >
              {error}
            </Alert>
          )}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress size={48} color="success" />
            </Box>
          )}
          
          {!loading && filteredMedications.length === 0 ? (
            <Paper 
              elevation={0} 
              className="py-12 px-6 text-center" 
              sx={{ 
                bgcolor: 'background.default', 
                borderRadius: '12px',
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'Arama kriterine uygun ilaç bulunamadı' : 'Henüz kayıtlı ilaç bulunmuyor'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm 
                  ? 'Farklı arama kriterleri deneyebilir veya aramayı temizleyebilirsiniz'
                  : 'Sisteme yeni ilaçlar eklemek için "Yeni İlaç Ekle" butonuna tıklayabilirsiniz'}
              </Typography>
              
              {searchTerm ? (
                <Button 
                  variant="outlined" 
                  color="success" 
                  onClick={() => setSearchTerm('')}
                  sx={{ borderRadius: '8px', px: 3 }}
                >
                  Aramayı Temizle
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<AddIcon />}
                  onClick={() => handleDialogOpen('add')}
                  sx={{ 
                    borderRadius: '8px',
                    px: 3,
                    py: 1.2,
                    boxShadow: '0 4px 10px rgba(76, 175, 80, 0.25)'
                  }}
                >
                  Yeni İlaç Ekle
                </Button>
              )}
            </Paper>
          ) : (
            <Box>
              <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }} elevation={0}>
                <MedicationList 
                  medications={filteredMedications} 
                  onEdit={(medication) => handleDialogOpen('edit', medication)} 
                  onDelete={handleDeleteMedication}
                  loading={loading}
                />
              </Paper>
              
              {totalPages > 1 && (
                <Pagination 
                  page={page}
                  count={totalPages}
                  totalElements={totalElements}
                  rowsPerPage={size}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleSizeChange}
                />
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose} 
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <MedicationForm 
          mode={dialogMode}
          initialData={selectedMedication}
          onSubmit={handleFormSubmit}
          onCancel={handleDialogClose}
          loading={loading}
        />
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedicationPage; 