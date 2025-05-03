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
  LocalHospital as ClinicIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationCity as CityIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { clinicService } from '../services/apiService';
import ClinicList from '../components/clinics/ClinicList';
import ClinicForm from '../components/clinics/ClinicForm';
import Pagination from '../components/common/Pagination';

/**
 * Klinik (Clinic) yönetim sayfası
 * Klinikleri listeleme, arama, filtreleme, ekleme, düzenleme ve silme işlemlerini sağlar
 */
const ClinicPage = () => {
  const theme = useTheme();
  
  // Veri durum state'leri
  const [clinics, setClinics] = useState([]);
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
  const [selectedClinic, setSelectedClinic] = useState(null);
  
  // Arama ve filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [cityFilter, setCityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [cities, setCities] = useState([]);
  
  // Sıralama state'leri
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  /**
   * Klinikleri getirme fonksiyonu
   */
  const fetchClinics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // API'den verileri getir
      const result = await clinicService.getAll(page, size);
      
      // Sayfalama yanıtı mı dizi mi kontrol et
      if (result.content) {
        // Sayfalama yanıtı
        setClinics(result.content);
        setTotalElements(result.totalElements);
        setTotalPages(result.totalPages);
      } else if (Array.isArray(result)) {
        // Dizi yanıtı
        setClinics(result);
        setTotalElements(result.length);
        setTotalPages(Math.ceil(result.length / size));
      }
      
      // Eşsiz şehirleri çıkar
      const uniqueCities = [...new Set(
        (result.content || result)
          .map(clinic => clinic.city)
          .filter(city => city) // undefined/null değerleri filtrele
      )];
      setCities(uniqueCities);
      
    } catch (err) {
      console.error('Klinikler getirilemedi:', err);
      setError('Klinikler yüklenirken bir hata oluştu.');
      
      // Yine de filtreleme ve sayfalama için geçici veri yapısını kur
      setClinics([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  // Sayfa yüklendiğinde klinikleri getir
  useEffect(() => {
    fetchClinics();
  }, [fetchClinics]);

  // Filtreleme işlemi
  useEffect(() => {
    setLoading(true);
    
    let result = [...clinics];
    
    // Arama filtresi uygula
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(clinic => 
        clinic.name.toLowerCase().includes(lowerSearchTerm) ||
        (clinic.description && clinic.description.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Şehir filtresi uygula
    if (cityFilter) {
      result = result.filter(clinic => 
        clinic.city === cityFilter
      );
    }
    
    // Durum filtresi uygula
    if (statusFilter) {
      result = result.filter(clinic => 
        clinic.status === statusFilter
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
    
    setFilteredClinics(result);
    
    // Sayfa sınırlarını kontrol et
    if (result.length > 0 && page > Math.ceil(result.length / size) - 1) {
      setPage(0);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 300);
    
  }, [clinics, searchTerm, cityFilter, statusFilter, sortField, sortDirection, page, size]);

  /**
   * Sayfalama işlemleri
   */
  const getPaginatedData = useCallback(() => {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    return filteredClinics.slice(startIndex, endIndex);
  }, [filteredClinics, page, size]);

  /**
   * Dialog'u açar (ekleme veya düzenleme modu)
   * 
   * @param {string} mode - Dialog modu ('add' veya 'edit')
   * @param {Object} clinic - Düzenlenecek klinik (edit modunda)
   */
  const handleDialogOpen = (mode, clinic = null) => {
    setDialogMode(mode);
    setSelectedClinic(clinic);
    setOpenDialog(true);
  };

  /**
   * Dialog'u kapatır
   */
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedClinic(null);
  };

  /**
   * Arama teriminin değişimini yönetir
   * 
   * @param {string} value - Arama terimi
   */
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(0); // İlk sayfaya dön
  };

  /**
   * Şehir filtresini değiştirir
   * 
   * @param {string|null} city - Şehir adı veya null
   */
  const handleCityFilter = (city) => {
    setCityFilter(cityFilter === city ? null : city);
    setPage(0); // İlk sayfaya dön
  };

  /**
   * Durum filtresini değiştirir
   * 
   * @param {string|null} status - Durum adı veya null
   */
  const handleStatusFilter = (status) => {
    setStatusFilter(statusFilter === status ? null : status);
    setPage(0); // İlk sayfaya dön
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
   * Sayfalama değişimini yönetir
   * 
   * @param {number} newPage - Yeni sayfa indeksi
   */
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  /**
   * Sayfa boyutu değişimini yönetir
   * 
   * @param {number} newSize - Yeni sayfa boyutu
   */
  const handlePageSizeChange = (newSize) => {
    setSize(newSize);
    setPage(0); // İlk sayfaya dön
  };

  /**
   * Form gönderimini yönetir (ekleme veya düzenleme)
   * 
   * @param {Object} clinicData - Form verileri
   */
  const handleFormSubmit = async (clinicData) => {
    setLoading(true);
    
    try {
      // Ekleme veya güncelleme işlemi
      if (dialogMode === 'add') {
        // Yeni klinik ekle
        await clinicService.create(clinicData);
        
        // Bildirim göster
        setNotification({
          open: true,
          message: 'Klinik başarıyla eklendi',
          severity: 'success'
        });
      } else {
        // Mevcut kliniği güncelle
        await clinicService.update(selectedClinic.id, clinicData);
        
        // Bildirim göster
        setNotification({
          open: true,
          message: 'Klinik başarıyla güncellendi',
          severity: 'success'
        });
      }
      
      // Dialog'u kapat
      handleDialogClose();
      
      // Klinikleri yeniden getir
      fetchClinics();
    } catch (err) {
      console.error('Klinik işlemi sırasında hata:', err);
      
      // Hata bildirimi göster
      setNotification({
        open: true,
        message: 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Klinik silme işlemini yönetir
   * 
   * @param {number} id - Silinecek klinik ID'si
   */
  const handleDeleteClinic = async (id) => {
    setLoading(true);
    
    try {
      // Kliniği sil
      await clinicService.delete(id);
      
      // Bildirim göster
      setNotification({
        open: true,
        message: 'Klinik başarıyla silindi',
        severity: 'success'
      });
      
      // Klinikleri yeniden getir
      fetchClinics();
    } catch (err) {
      console.error('Klinik silme sırasında hata:', err);
      
      // Hata bildirimi göster
      setNotification({
        open: true,
        message: 'Silme işlemi sırasında bir hata oluştu',
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
   * Şehir filtre çiplerini oluşturur
   * 
   * @returns {JSX.Element} - Şehir filtreleme çipleri
   */
  const renderCityChips = () => (
    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
        <FilterIcon fontSize="small" sx={{ mr: 0.5 }} /> Şehir:
      </Typography>
      
      {cities.map((city) => (
        <Chip
          key={city}
          label={city}
          size="small"
          icon={<CityIcon style={{ fontSize: 16 }} />}
          onClick={() => handleCityFilter(city)}
          color={cityFilter === city ? 'primary' : 'default'}
          variant={cityFilter === city ? 'filled' : 'outlined'}
          sx={{ 
            borderRadius: '16px',
            '& .MuiChip-label': { px: 1 },
            fontWeight: cityFilter === city ? 500 : 400
          }}
        />
      ))}
    </Box>
  );

  /**
   * Durum filtre çiplerini oluşturur
   * 
   * @returns {JSX.Element} - Durum filtreleme çipleri
   */
  const renderStatusChips = () => {
    const statuses = [
      { value: 'ACTIVE', label: 'Aktif', color: 'success' },
      { value: 'INACTIVE', label: 'Pasif', color: 'error' },
      { value: 'UNDER_MAINTENANCE', label: 'Bakımda', color: 'warning' }
    ];
    
    return (
      <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon fontSize="small" sx={{ mr: 0.5 }} /> Durum:
        </Typography>
        
        {statuses.map((status) => (
          <Chip
            key={status.value}
            label={status.label}
            size="small"
            icon={<BusinessIcon style={{ fontSize: 16 }} />}
            onClick={() => handleStatusFilter(status.value)}
            color={statusFilter === status.value ? status.color : 'default'}
            variant={statusFilter === status.value ? 'filled' : 'outlined'}
            sx={{ 
              borderRadius: '16px',
              '& .MuiChip-label': { px: 1 },
              fontWeight: statusFilter === status.value ? 500 : 400
            }}
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
            background: 'linear-gradient(90deg, #3f51b5 0%, #5d6cc6 100%)',
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
            <ClinicIcon fontSize="large" sx={{ color: 'white' }} />
          </Box>
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: 'white' }}>
              Klinik Yönetimi
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Sistem içindeki klinik kayıtlarını yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 4, px: 4 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Klinik adı veya açıklamada ara..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
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
                 sortField === 'city' ? 'Şehre Göre' : 'Duruma Göre'}
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
                  boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
                }}
              >
                Yeni Klinik Ekle
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
                <MenuItem onClick={() => handleSortBy('city')}>
                  <ListItemIcon>
                    {sortField === 'city' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText>Şehre Göre</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortBy('status')}>
                  <ListItemIcon>
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText>Duruma Göre</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
          
          {/* Filtre Çipleri */}
          {cities.length > 0 && renderCityChips()}
          {renderStatusChips()}
          
          {/* Hata Mesajı */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mt: 2, mb: 2, borderRadius: '8px' }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          
          {/* Klinik Listesi */}
          <Paper 
            elevation={0} 
            sx={{ 
              position: 'relative',
              borderRadius: '12px', 
              overflow: 'hidden',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              mt: 2
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
            
            <ClinicList 
              clinics={getPaginatedData()} 
              onEdit={(clinic) => handleDialogOpen('edit', clinic)}
              onDelete={handleDeleteClinic}
              loading={loading}
            />
          </Paper>
          
          {/* Sayfalama */}
          <Pagination 
            page={page}
            totalPages={Math.max(1, Math.ceil(filteredClinics.length / size))}
            totalElements={filteredClinics.length}
            onPageChange={handlePageChange}
            pageSize={size}
            onPageSizeChange={handlePageSizeChange}
          />
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
        <ClinicForm
          mode={dialogMode}
          initialData={selectedClinic}
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

export default ClinicPage; 