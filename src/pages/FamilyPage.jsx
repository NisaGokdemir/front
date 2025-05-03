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
  Category as CategoryIcon
} from '@mui/icons-material';
import familyService from '../services/familyService';
import FamilyList from '../components/family/FamilyList';
import FamilyForm from '../components/family/FamilyForm';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

const FamilyPage = () => {
  const theme = useTheme();
  const [families, setFamilies] = useState([]);
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
  const [selectedFamily, setSelectedFamily] = useState(null);
  
  // Arama
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFamilies, setFilteredFamilies] = useState([]);

  // Familyaları API'den yükle
  useEffect(() => {
    fetchFamilies();
  }, [page, size]);
  
  // Arama filtreleme
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFamilies(families);
    } else {
      const filtered = families.filter(family => 
        family.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFamilies(filtered);
    }
  }, [searchTerm, families]);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await familyService.getFamilies(page, size);
      
      setFamilies(response.content || []);
      setFilteredFamilies(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Familyalar yüklenirken hata oluştu:', error);
      setError(error.message || 'Familyalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (mode, family = null) => {
    setDialogMode(mode);
    setSelectedFamily(family);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedFamily(null);
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

  const handleFormSubmit = async (familyData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await familyService.createFamily(familyData);
        setNotification({
          open: true,
          message: 'Familya başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await familyService.updateFamily(selectedFamily.id, familyData);
        setNotification({
          open: true,
          message: 'Familya başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchFamilies();
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

  const handleDeleteFamily = async (id) => {
    try {
      setLoading(true);
      
      await familyService.deleteFamily(id);
      
      setNotification({
        open: true,
        message: 'Familya başarıyla silindi',
        severity: 'success'
      });
      
      fetchFamilies();
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
          className="bg-gradient-to-r from-indigo-600 to-blue-500 py-5 px-6"
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
            <CategoryIcon fontSize="large" sx={{ color: 'white' }} />
          </Box>
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" component="h1" className="font-medium text-white">
              Hayvan Familyaları
            </Typography>
            <Typography variant="subtitle2" className="text-blue-100">
              Sistem içindeki hayvan familyalarını yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 4, px: 4 }}>
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <SearchBar
              placeholder="Familya adı ile ara..."
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
              Yeni Familya Ekle
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
              <CircularProgress size={48} />
            </Box>
          )}
          
          {!loading && filteredFamilies.length === 0 ? (
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
                {searchTerm ? 'Arama kriterine uygun familya bulunamadı' : 'Henüz kayıtlı familya bulunmuyor'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm 
                  ? 'Farklı arama kriterleri deneyebilir veya aramayı temizleyebilirsiniz'
                  : 'Sisteme yeni familyalar eklemek için "Yeni Familya Ekle" butonuna tıklayabilirsiniz'}
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
                  Yeni Familya Ekle
                </Button>
              )}
            </Paper>
          ) : (
            <Box>
              <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }} elevation={0}>
                <FamilyList 
                  families={filteredFamilies} 
                  onEdit={(family) => handleDialogOpen('edit', family)} 
                  onDelete={handleDeleteFamily}
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
        <FamilyForm 
          mode={dialogMode}
          initialData={selectedFamily}
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

export default FamilyPage; 