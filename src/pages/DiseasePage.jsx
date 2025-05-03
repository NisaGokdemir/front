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
  Chip,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Add as AddIcon,
  Coronavirus as DiseaseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Category as CategoryIcon,
  Pets as PetsIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import diseaseService from '../services/diseaseService';
import DiseaseList from '../components/diseases/DiseaseList';
import DiseaseForm from '../components/diseases/DiseaseForm';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';

/**
 * Hastalık (Disease) yönetim sayfası
 * Hastalıkları listeleme, arama, filtreleme, ekleme, düzenleme ve silme işlemlerini sağlar
 */
const DiseasePage = () => {
  const theme = useTheme();
  
  // Veri durum state'leri
  const [diseases, setDiseases] = useState([]);
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
  const [selectedDisease, setSelectedDisease] = useState(null);
  
  // Arama ve filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [animalTypeFilter, setAnimalTypeFilter] = useState(null);
  
  // Sıralama state'leri
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Kategori ve hayvan türü seçenekleri
  const categoryOptions = [
    'Enfeksiyon',
    'Paraziter',
    'Genetik',
    'Metabolik',
    'Ortopedik',
    'Kardiyovasküler',
    'Solunum',
    'Sindirim',
    'Nörolojik',
    'Dermatolojik',
    'Göz',
    'Diş',
    'Üriner',
    'Onkoloji',
    'Davranışsal',
    'Diğer'
  ];

  const animalTypeOptions = [
    'Kedi',
    'Köpek',
    'Kuş',
    'Kemirgen',
    'Tavşan',
    'At',
    'İnek',
    'Koyun',
    'Keçi',
    'Kümes Hayvanları',
    'Balık',
    'Egzotik Hayvanlar',
    'Sürüngenler'
  ];

  /**
   * Hastalıkları API'den yükler
   */
  const fetchDiseases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await diseaseService.getAllDiseases();
      
      // API yanıtı bir array ya da bir Page objesi olabilir
      if (Array.isArray(response)) {
        setDiseases(response);
        setTotalElements(response.length);
        setTotalPages(1);
      } else {
        setDiseases(response.content || []);
        setTotalElements(response.totalElements || response.length || 0);
        setTotalPages(response.totalPages || 1);
      }
      
    } catch (error) {
      console.error('Hastalıklar yüklenirken hata oluştu:', error);
      setError(error.message || 'Hastalıklar yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sayfa yüklendiğinde hastalıkları yükle
  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  // Filtreleme işlemi
  useEffect(() => {
    if (!diseases.length) return;
    
    let result = [...diseases];
    
    // Arama filtresi uygula
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(disease => 
        disease.name.toLowerCase().includes(lowerSearchTerm) ||
        (disease.description && disease.description.toLowerCase().includes(lowerSearchTerm)) ||
        (disease.symptoms && disease.symptoms.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Kategori filtresi uygula
    if (categoryFilter) {
      result = result.filter(disease => disease.category === categoryFilter);
    }
    
    // Hayvan türü filtresi uygula
    if (animalTypeFilter) {
      result = result.filter(disease => 
        disease.animalTypes && disease.animalTypes.toLowerCase().includes(animalTypeFilter.toLowerCase())
      );
    }
    
    // Sıralama uygula
    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    
    setFilteredDiseases(result);
  }, [diseases, searchTerm, categoryFilter, animalTypeFilter, sortField, sortDirection]);

  /**
   * Dialog'u açar (ekleme veya düzenleme modu)
   * 
   * @param {string} mode - Dialog modu ('add' veya 'edit')
   * @param {Object} disease - Düzenlenecek hastalık (edit modunda)
   */
  const handleDialogOpen = (mode, disease = null) => {
    setDialogMode(mode);
    setSelectedDisease(disease);
    setOpenDialog(true);
  };

  /**
   * Dialog'u kapatır
   */
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedDisease(null);
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
   * Kategori filtresini değiştirir
   * 
   * @param {string|null} category - Kategori adı veya null
   */
  const handleCategoryFilter = (category) => {
    setCategoryFilter(categoryFilter === category ? null : category);
  };

  /**
   * Hayvan türü filtresini değiştirir
   * 
   * @param {string|null} animalType - Hayvan türü veya null
   */
  const handleAnimalTypeFilter = (animalType) => {
    setAnimalTypeFilter(animalTypeFilter === animalType ? null : animalType);
  };

  /**
   * Sıralama menüsünü açar
   * 
   * @param {Object} event - Menü açma olayı
   */
  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  /**
   * Sıralama menüsünü kapatır
   */
  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  /**
   * Sıralama alanını değiştirir
   * 
   * @param {string} field - Sıralanacak alan adı
   */
  const handleSortBy = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    handleSortMenuClose();
  };

  /**
   * Form gönderimini yönetir (ekleme veya düzenleme)
   * 
   * @param {Object} diseaseData - Form verileri
   */
  const handleFormSubmit = async (diseaseData) => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        await diseaseService.createDisease(diseaseData);
        setNotification({
          open: true,
          message: 'Hastalık başarıyla eklendi',
          severity: 'success'
        });
      } else {
        await diseaseService.updateDisease(selectedDisease.id, diseaseData);
        setNotification({
          open: true,
          message: 'Hastalık başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      handleDialogClose();
      fetchDiseases(); // Listeyi yenile
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
   * Hastalık silme işlemini yönetir
   * 
   * @param {number} id - Silinecek hastalık ID'si
   */
  const handleDeleteDisease = async (id) => {
    try {
      setLoading(true);
      
      await diseaseService.deleteDisease(id);
      
      setNotification({
        open: true,
        message: 'Hastalık başarıyla silindi',
        severity: 'success'
      });
      
      fetchDiseases(); // Listeyi yenile
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
   * Filtre çiplerini render eder
   */
  const renderFilterChips = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', 
        px: 1.5, 
        py: 0.75, 
        borderRadius: '16px'
      }}>
        <CategoryIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Kategori:
        </Typography>
      </Box>
      
      <Chip
        label="Tümü"
        color="primary"
        variant={!categoryFilter ? 'filled' : 'outlined'}
        onClick={() => handleCategoryFilter(null)}
        sx={{ borderRadius: '16px' }}
      />
      
      {categoryOptions.map(category => (
        <Chip
          key={category}
          label={category}
          color="primary"
          variant={categoryFilter === category ? 'filled' : 'outlined'}
          onClick={() => handleCategoryFilter(category)}
          sx={{ borderRadius: '16px' }}
        />
      ))}
    </Box>
  );

  /**
   * Hayvan türü filtre çiplerini render eder
   */
  const renderAnimalTypeChips = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', 
        px: 1.5, 
        py: 0.75, 
        borderRadius: '16px'
      }}>
        <PetsIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Hayvan Türü:
        </Typography>
      </Box>
      
      <Chip
        label="Tümü"
        color="primary"
        variant={!animalTypeFilter ? 'filled' : 'outlined'}
        onClick={() => handleAnimalTypeFilter(null)}
        sx={{ borderRadius: '16px' }}
      />
      
      {animalTypeOptions.map(type => (
        <Chip
          key={type}
          label={type}
          color="primary"
          variant={animalTypeFilter === type ? 'filled' : 'outlined'}
          onClick={() => handleAnimalTypeFilter(type)}
          sx={{ borderRadius: '16px' }}
        />
      ))}
    </Box>
  );

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
            background: 'linear-gradient(90deg, #d32f2f 0%, #f44336 100%)',
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
            <DiseaseIcon fontSize="large" sx={{ color: 'white' }} />
          </Box>
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: 'white' }}>
              Hastalık Yönetimi
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Sistem içindeki hastalık kayıtlarını yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 4, px: 4 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Hastalık adı, açıklama veya belirtilerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { md: 'flex-end' }, gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSortMenuOpen}
                startIcon={<SortIcon />}
                endIcon={sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                sx={{ 
                  borderRadius: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                {sortField === 'name' ? 'İsme Göre' : 
                 sortField === 'category' ? 'Kategoriye Göre' : 'Tarih'}
              </Button>
              
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
                  boxShadow: '0 4px 10px rgba(211, 47, 47, 0.25)'
                }}
              >
                Yeni Hastalık Ekle
              </Button>
              
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{ '& .MuiPaper-root': { borderRadius: '8px', mt: 0.5 } }}
              >
                <MenuItem onClick={() => handleSortBy('name')}>
                  <ListItemIcon>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText>İsme Göre</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortBy('category')}>
                  <ListItemIcon>
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText>Kategoriye Göre</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
          
          {/* Kategori Filtreleri */}
          {renderFilterChips()}
          
          {/* Hayvan Türü Filtreleri */}
          {renderAnimalTypeChips()}
          
          {/* Hastalık Listesi */}
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
            
            <DiseaseList 
              diseases={filteredDiseases} 
              onEdit={(disease) => handleDialogOpen('edit', disease)}
              onDelete={handleDeleteDisease}
              loading={loading}
            />
          </Paper>
        </CardContent>
      </Card>
      
      {/* Form Dialog'u */}
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
        <DiseaseForm
          mode={dialogMode}
          initialData={selectedDisease}
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
    </Box>
  );
};

export default DiseasePage; 