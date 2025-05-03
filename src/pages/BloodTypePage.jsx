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
  Paper,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  Bloodtype as BloodtypeIcon
} from '@mui/icons-material';
import bloodTypeService from '../services/bloodTypeService';
import BloodTypeList from '../components/bloodTypes/BloodTypeList';
import BloodTypeForm from '../components/bloodTypes/BloodTypeForm';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

/**
 * Kan Grubu Sayfası
 * 
 * Bu sayfa, kan gruplarını listeleme, arama, ekleme, düzenleme ve silme işlemlerini içerir.
 * Backend yapısına uygun olarak çalışır.
 */
const BloodTypePage = () => {
  const theme = useTheme();
  const [bloodTypes, setBloodTypes] = useState([]);
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
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBloodTypes, setFilteredBloodTypes] = useState([]);

  // Kan gruplarını API'den yükle
  useEffect(() => {
    fetchBloodTypes();
  }, [page, size]);
  
  // Arama filtreleme
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBloodTypes(bloodTypes);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = bloodTypes.filter(bloodType => 
        bloodType.type.toLowerCase().includes(lowerSearchTerm) ||
        (bloodType.species && bloodType.species.name.toLowerCase().includes(lowerSearchTerm))
      );
      setFilteredBloodTypes(filtered);
    }
  }, [searchTerm, bloodTypes]);

  // Kan grubu listesini getir
  const fetchBloodTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bloodTypeService.getBloodTypes(page, size);
      
      setBloodTypes(response.content || []);
      setFilteredBloodTypes(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Kan grupları yüklenirken hata oluştu:', error);
      setError(error.message || 'Kan grupları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Dialog açma işlemi
  const handleDialogOpen = (mode, bloodType = null) => {
    setDialogMode(mode);
    setSelectedBloodType(bloodType);
    setOpenDialog(true);
  };

  // Dialog kapatma işlemi
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedBloodType(null);
  };

  // Sayfa değiştirme
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Sayfa başına kayıt sayısını değiştirme
  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Arama işlemi
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Form gönderme işlemi
  const handleFormSubmit = async (bloodTypeData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await bloodTypeService.createBloodType(bloodTypeData);
        setNotification({
          open: true,
          message: 'Kan grubu başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await bloodTypeService.updateBloodType(selectedBloodType.id, bloodTypeData);
        setNotification({
          open: true,
          message: 'Kan grubu başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchBloodTypes();
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

  // Kan grubunu silme işlemi
  const handleDeleteBloodType = async (id) => {
    try {
      setLoading(true);
      
      await bloodTypeService.deleteBloodType(id);
      
      setNotification({
        open: true,
        message: 'Kan grubu başarıyla silindi',
        severity: 'success'
      });
      
      fetchBloodTypes();
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

  // Bildirim kapatma işlemi
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
          sx={{
            bgcolor: theme.palette.error.main,
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BloodtypeIcon />
            <Typography variant="h6" component="h2" fontWeight="500">
              Kan Grupları
            </Typography>
            <Chip 
              label={totalElements} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 500
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => handleDialogOpen('add')}
            sx={{ 
              borderRadius: '8px',
              px: 2,
              bgcolor: 'rgba(255,255,255,0.2)',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              }
            }}
          >
            Yeni Kan Grubu
          </Button>
        </Box>
        
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <SearchBar 
            onSearch={handleSearch} 
            value={searchTerm}
            placeholder="Kan grubu veya tür ara..." 
            fullWidth
          />
        </Box>
        
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
              <CircularProgress size={50} />
            </Box>
          )}

          {!loading && error && (
            <Paper 
              elevation={0} 
              className="py-10 px-6 text-center" 
              sx={{ 
                bgcolor: 'error.light', 
                color: 'error.main',
                borderRadius: 0 
              }}
            >
              <Typography variant="h6" gutterBottom>
                Hata Oluştu
              </Typography>
              <Typography variant="body1">
                {error}
              </Typography>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={fetchBloodTypes}
                sx={{ mt: 2, borderRadius: '8px' }}
              >
                Tekrar Dene
              </Button>
            </Paper>
          )}

          {!loading && !error && filteredBloodTypes.length === 0 ? (
            <Paper 
              elevation={0} 
              className="py-12 px-6 text-center" 
              sx={{ 
                bgcolor: 'background.default', 
                borderRadius: '12px',
                border: '1px dashed',
                borderColor: 'divider',
                mx: 3,
                my: 3
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'Arama kriterine uygun kan grubu bulunamadı' : 'Henüz kayıtlı kan grubu bulunmuyor'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm 
                  ? 'Farklı arama kriterleri deneyebilir veya aramayı temizleyebilirsiniz'
                  : 'Kan gruplarını yönetmek için "Yeni Kan Grubu" butonuna tıklayabilirsiniz'}
              </Typography>
              
              {searchTerm ? (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => setSearchTerm('')}
                  sx={{ borderRadius: '8px', px: 3 }}
                >
                  Aramayı Temizle
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<AddIcon />}
                  onClick={() => handleDialogOpen('add')}
                  sx={{ 
                    borderRadius: '8px',
                    px: 3,
                    py: 1.2,
                    boxShadow: '0 4px 10px rgba(244, 67, 54, 0.25)'
                  }}
                >
                  Yeni Kan Grubu Ekle
                </Button>
              )}
            </Paper>
          ) : (
            <Box>
              <Paper sx={{ borderRadius: '0', overflow: 'hidden' }} elevation={0}>
                <BloodTypeList 
                  bloodTypes={filteredBloodTypes} 
                  onEdit={(bloodType) => handleDialogOpen('edit', bloodType)} 
                  onDelete={handleDeleteBloodType}
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
        <BloodTypeForm 
          mode={dialogMode}
          initialData={selectedBloodType}
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

export default BloodTypePage; 