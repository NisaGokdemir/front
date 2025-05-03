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
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  PeopleAlt as PeopleIcon
} from '@mui/icons-material';
import ownerService from '../services/ownerService';
import OwnerList from '../components/owners/OwnerList';
import OwnerForm from '../components/owners/OwnerForm';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

/**
 * Hasta Sahibi Sayfası
 * 
 * Bu sayfa, hasta sahiplerini listeleme, arama, ekleme, düzenleme ve silme işlemlerini içerir.
 * Backend yapısına uygun olarak çalışır.
 */
const OwnerPage = () => {
  const theme = useTheme();
  const [owners, setOwners] = useState([]);
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
  const [selectedOwner, setSelectedOwner] = useState(null);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOwners, setFilteredOwners] = useState([]);

  // Hasta sahiplerini API'den yükle
  useEffect(() => {
    fetchOwners();
  }, [page, size]);
  
  // Arama filtreleme
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOwners(owners);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = owners.filter(owner => 
        // Ad veya soyadda arama yapma
        owner.firstName?.toLowerCase().includes(lowerSearchTerm) ||
        owner.lastName?.toLowerCase().includes(lowerSearchTerm) ||
        // Tam ad birleştirerek arama
        `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(lowerSearchTerm) ||
        // Telefon, e-posta veya adres araması
        owner.phone?.includes(searchTerm) ||
        (owner.email && owner.email.toLowerCase().includes(lowerSearchTerm)) ||
        (owner.address && owner.address.toLowerCase().includes(lowerSearchTerm))
      );
      setFilteredOwners(filtered);
    }
  }, [searchTerm, owners]);

  // Hasta sahipleri listesini getir
  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ownerService.getOwners(page, size);
      
      setOwners(response.content || []);
      setFilteredOwners(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Hasta sahipleri yüklenirken hata oluştu:', error);
      setError(error.message || 'Hasta sahipleri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Dialog açma işlemi
  const handleDialogOpen = (mode, owner = null) => {
    setDialogMode(mode);
    setSelectedOwner(owner);
    setOpenDialog(true);
  };

  // Dialog kapatma işlemi
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedOwner(null);
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
  const handleFormSubmit = async (ownerData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await ownerService.createOwner(ownerData);
        setNotification({
          open: true,
          message: 'Hasta sahibi başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await ownerService.updateOwner(selectedOwner.id, ownerData);
        setNotification({
          open: true,
          message: 'Hasta sahibi başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchOwners();
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

  // Hasta sahibini silme işlemi
  const handleDeleteOwner = async (id) => {
    try {
      setLoading(true);
      
      await ownerService.deleteOwner(id);
      
      setNotification({
        open: true,
        message: 'Hasta sahibi başarıyla silindi',
        severity: 'success'
      });
      
      fetchOwners();
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
            bgcolor: theme.palette.primary.main,
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon />
            <Typography variant="h6" component="h2" fontWeight="500">
              Hasta Sahipleri
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
            Yeni Hasta Sahibi
          </Button>
        </Box>
        
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <SearchBar 
            onSearch={handleSearch} 
            value={searchTerm}
            placeholder="Ad, telefon, e-posta veya adres ara..." 
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
                onClick={fetchOwners}
                sx={{ mt: 2, borderRadius: '8px' }}
              >
                Tekrar Dene
              </Button>
            </Paper>
          )}

          {!loading && !error && filteredOwners.length === 0 ? (
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
                {searchTerm ? 'Arama kriterine uygun hasta sahibi bulunamadı' : 'Henüz kayıtlı hasta sahibi bulunmuyor'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm 
                  ? 'Farklı arama kriterleri deneyebilir veya aramayı temizleyebilirsiniz'
                  : 'Hasta sahiplerinin bilgilerini yönetmek için "Yeni Hasta Sahibi" butonuna tıklayabilirsiniz'}
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
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleDialogOpen('add')}
                  sx={{ 
                    borderRadius: '8px',
                    px: 3,
                    py: 1.2,
                    boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
                  }}
                >
                  Yeni Hasta Sahibi Ekle
                </Button>
              )}
            </Paper>
          ) : (
            <Box>
              <Paper sx={{ borderRadius: '0', overflow: 'hidden' }} elevation={0}>
                <OwnerList 
                  owners={filteredOwners} 
                  onEdit={(owner) => handleDialogOpen('edit', owner)} 
                  onDelete={handleDeleteOwner}
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <OwnerForm 
          mode={dialogMode}
          initialData={selectedOwner}
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

export default OwnerPage; 