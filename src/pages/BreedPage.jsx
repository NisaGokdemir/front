import { useState, useEffect, useCallback } from 'react';
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
  Category as CategoryIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import breedService from '../services/breedService';
import speciesService from '../services/speciesService';
import BreedList from '../components/breeds/BreedList';
import BreedForm from '../components/breeds/BreedForm';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

/**
 * Irk (Breed) yönetim sayfası
 * Irkları listeleme, arama, filtreleme, ekleme, düzenleme ve silme işlemlerini sağlar
 */
const BreedPage = () => {
  const theme = useTheme();
  
  // Veri durum state'leri
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Sayfalama state'leri
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Dialog state'leri
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' veya 'edit'
  const [selectedBreed, setSelectedBreed] = useState(null);
  
  // Arama ve filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  /**
   * Irkları API'den yükler
   */
  const fetchBreeds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await breedService.getBreeds(page, size);
      
      setBreeds(response.content || []);
      setFilteredBreeds(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Irklar yüklenirken hata oluştu:', error);
      setError(error.message || 'Irklar yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  /**
   * Türleri API'den yükler (filtreleme için)
   */
  const fetchSpecies = useCallback(async () => {
    try {
      const response = await speciesService.getSpecies(0, 100);
      setSpecies(response.content || []);
    } catch (error) {
      console.error('Türler yüklenirken hata oluştu:', error);
    }
  }, []);

  // Sayfa yüklendiğinde ırkları ve türleri yükle
  useEffect(() => {
    fetchBreeds();
    fetchSpecies();
  }, [fetchBreeds, fetchSpecies]);
  
  // Arama ve filtreleme işlemleri
  useEffect(() => {
    if (!breeds.length) return;
    
    let result = [...breeds];
    
    // Arama filtresi uygula
    if (searchTerm.trim()) {
      result = result.filter(breed => 
        breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.species.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Tür filtresi uygula
    if (selectedSpecies) {
      result = result.filter(breed => breed.species.id === selectedSpecies);
    }
    
    setFilteredBreeds(result);
  }, [searchTerm, breeds, selectedSpecies]);

  /**
   * Dialog'u açar (ekleme veya düzenleme modu)
   * 
   * @param {string} mode - Dialog modu ('add' veya 'edit')
   * @param {Object} breed - Düzenlenecek ırk (edit modunda)
   */
  const handleDialogOpen = (mode, breed = null) => {
    setDialogMode(mode);
    setSelectedBreed(breed);
    setOpenDialog(true);
  };

  /**
   * Dialog'u kapatır
   */
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedBreed(null);
  };

  /**
   * Sayfa değişimini yönetir
   * 
   * @param {Object} event - Event nesnesi
   * @param {number} newPage - Yeni sayfa numarası
   */
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Sayfa başına kayıt sayısı değişimini yönetir
   * 
   * @param {Object} event - Event nesnesi
   */
  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Arama teriminin değişimini yönetir
   * 
   * @param {string} value - Arama terimi
   */
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  /**
   * Tür filtresi uygular
   * 
   * @param {number|null} speciesId - Tür ID'si
   */
  const handleSpeciesFilter = (speciesId) => {
    setSelectedSpecies(selectedSpecies === speciesId ? null : speciesId);
  };

  /**
   * Form gönderimini yönetir (ekleme veya düzenleme)
   * 
   * @param {Object} breedData - Form verileri
   */
  const handleFormSubmit = async (breedData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await breedService.createBreed(breedData);
        setNotification({
          open: true,
          message: 'Irk başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await breedService.updateBreed(selectedBreed.id, breedData);
        setNotification({
          open: true,
          message: 'Irk başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchBreeds();
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

  /**
   * Irk silme işlemini yönetir
   * 
   * @param {number} id - Silinecek ırk ID'si
   */
  const handleDeleteBreed = async (id) => {
    try {
      setLoading(true);
      
      await breedService.deleteBreed(id);
      
      setNotification({
        open: true,
        message: 'Irk başarıyla silindi',
        severity: 'success'
      });
      
      fetchBreeds();
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

  /**
   * Bildirim kapatma işlemini yönetir
   */
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  /**
   * Ana kart başlığı altındaki filtre çiplerini oluşturur
   */
  const renderFilterChips = () => {
    return (
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        flexWrap: 'wrap',
        mb: 2,
        pt: 2
      }}>
        <Chip
          icon={<FilterIcon />}
          label="Tüm Türler"
          variant={selectedSpecies === null ? "filled" : "outlined"}
          color="primary"
          onClick={() => handleSpeciesFilter(null)}
          sx={{ borderRadius: '8px' }}
        />
        
        {species.map(species => (
          <Chip
            key={species.id}
            label={species.name}
            variant={selectedSpecies === species.id ? "filled" : "outlined"}
            color="primary"
            onClick={() => handleSpeciesFilter(species.id)}
            sx={{ borderRadius: '8px' }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Card 
        elevation={2} 
        sx={{ 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          mb: 4
        }}
      >
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'linear-gradient(90deg, #6E48AA 0%, #9D50BB 100%)',
            py: 5,
            px: 6
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
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: 'white' }}>
              Hayvan Irkları
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Sistem içindeki hayvan ırklarını yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 4, px: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: 3,
            gap: 2
          }}>
            <SearchBar
              placeholder="Irk veya tür adı ile ara..."
              onSearch={handleSearch}
              fullWidth={false}
              sx={{ minWidth: { sm: '300px' } }}
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
                boxShadow: '0 4px 10px rgba(109, 72, 170, 0.25)'
              }}
            >
              Yeni Irk Ekle
            </Button>
          </Box>
          
          {/* Filtre Chip'leri */}
          {species.length > 0 && renderFilterChips()}
          
          {/* Liste ve Yükleniyor Göstergesi */}
          <Paper 
            elevation={0} 
            sx={{ 
              position: 'relative',
              borderRadius: '12px', 
              overflow: 'hidden',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` 
            }}
          >
            {loading && (
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.7)',
                zIndex: 10
              }}>
                <CircularProgress />
              </Box>
            )}
            
            <BreedList 
              breeds={filteredBreeds} 
              onEdit={(breed) => handleDialogOpen('edit', breed)}
              onDelete={handleDeleteBreed}
              loading={loading}
            />
          </Paper>
          
          {/* Sayfalama */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination 
              page={page}
              count={totalPages}
              rowsPerPage={size}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleSizeChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
              totalCount={totalElements}
            />
          </Box>
        </CardContent>
      </Card>
      
      {/* Form Dialog'u */}
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
        <BreedForm
          mode={dialogMode}
          initialData={selectedBreed}
          onSubmit={handleFormSubmit}
          onCancel={handleDialogClose}
          loading={loading}
        />
      </Dialog>
      
      {/* Bildirimler */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: '8px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* Hata Mesajı */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2, borderRadius: '8px' }}
          variant="filled"
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default BreedPage; 