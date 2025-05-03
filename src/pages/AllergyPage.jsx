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
  HealthAndSafety as AllergyIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Pets as PetIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  LocalHospital as SeverityIcon
} from '@mui/icons-material';
// API servisini kaldırıyoruz
// import allergyService from '../services/allergyService';
import AllergyList from '../components/allergies/AllergyList';
import AllergyForm from '../components/allergies/AllergyForm';
import Pagination from '../components/common/Pagination';

/**
 * Alerji (Allergy) yönetim sayfası
 * Alerjileri listeleme, arama, filtreleme, ekleme, düzenleme ve silme işlemlerini sağlar
 * Sadece görsel demo - Backend bağlantısı olmadan
 */
const AllergyPage = () => {
  const theme = useTheme();
  
  // Demo alerji verileri
  const initialAllergies = [
    { id: 1, name: 'Polen Alerjisi', description: 'Mevsimsel alerji, ilkbahar ve yaz aylarında şiddetlenir', patientId: 101, severity: 'MODERATE', reactionType: 'RESPIRATORY', notes: 'İlkbaharda kötüleşir, antihistaminik kullanılabilir' },
    { id: 2, name: 'Fıstık Alerjisi', description: 'Gıda alerjisi, şiddetli reaksiyonlara neden olabilir', patientId: 102, severity: 'SEVERE', reactionType: 'SKIN', notes: 'Anafilaksi riski var, epinefrin otoenjektör taşınmalı' },
    { id: 3, name: 'Penisilin Alerjisi', description: 'İlaç alerjisi, antibiyotik tedavisinde dikkat edilmeli', patientId: 103, severity: 'MODERATE', reactionType: 'SKIN', notes: 'Alternatif antibiyotikler kullanılmalı' },
    { id: 4, name: 'Ev Tozu Akarı Alerjisi', description: 'Solunum yolu alerjisi, evde sürekli maruz kalınabilir', patientId: 101, severity: 'MILD', reactionType: 'RESPIRATORY', notes: 'Düzenli temizlik ve HEPA filtreli elektrikli süpürge önerilir' },
    { id: 5, name: 'Lateks Alerjisi', description: 'Temas alerjisi, bazı tıbbi ürünlerde bulunur', patientId: 104, severity: 'MODERATE', reactionType: 'SKIN', notes: 'Tıbbi müdahalelerde lateks içermeyen ürünler kullanılmalı' },
    { id: 6, name: 'Arı Sokması Alerjisi', description: 'Böcek sokması alerjisi, açık alanlarda dikkatli olunmalı', patientId: 105, severity: 'SEVERE', reactionType: 'ANAPHYLAXIS', notes: 'Acil durum kiti her zaman yanında taşınmalı' },
    { id: 7, name: 'Süt Alerjisi', description: 'Süt ve süt ürünlerine karşı alerji', patientId: 106, severity: 'MODERATE', reactionType: 'DIGESTIVE', notes: 'Diyet planında süt ürünleri eliminasyonu yapılmalı' },
    { id: 8, name: 'Yumurta Alerjisi', description: 'Yumurtaya karşı gıda alerjisi', patientId: 107, severity: 'MILD', reactionType: 'DIGESTIVE', notes: 'Hazır gıdalarda yumurta içeriği kontrol edilmeli' }
  ];

  // Demo hasta verileri
  const demoPatients = [
    { id: 101, name: 'Pamuk', species: 'Kedi' },
    { id: 102, name: 'Karabaş', species: 'Köpek' },
    { id: 103, name: 'Ceviz', species: 'Tavşan' },
    { id: 104, name: 'Tüylü', species: 'Hamster' },
    { id: 105, name: 'Zeytin', species: 'Köpek' },
    { id: 106, name: 'Sarman', species: 'Kedi' },
    { id: 107, name: 'Limon', species: 'Kanarya' }
  ];
  
  // Veri durum state'leri
  const [allergies, setAllergies] = useState(initialAllergies);
  const [patients, setPatients] = useState(demoPatients);
  const [loading, setLoading] = useState(false);
  
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Sayfalama state'leri
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(initialAllergies.length);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialAllergies.length / size));
  
  // Dialog state'leri
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' veya 'edit'
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  
  // Arama ve filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAllergies, setFilteredAllergies] = useState([]);
  const [patientFilter, setPatientFilter] = useState(null);
  const [severityFilter, setSeverityFilter] = useState(null);
  
  // Sıralama state'leri
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Şiddet dereceleri
  const severityOptions = [
    { value: 'MILD', label: 'Hafif' },
    { value: 'MODERATE', label: 'Orta' },
    { value: 'SEVERE', label: 'Şiddetli' }
  ];

  // Sayfalama işlemleri
  const getPaginatedData = useCallback(() => {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    return filteredAllergies.slice(startIndex, endIndex);
  }, [filteredAllergies, page, size]);

  // Filtreleme işlemi
  useEffect(() => {
    setLoading(true);
    
    let result = [...allergies];
    
    // Arama filtresi uygula
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(allergy => 
        allergy.name.toLowerCase().includes(lowerSearchTerm) ||
        (allergy.description && allergy.description.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Hasta filtresi uygula
    if (patientFilter) {
      result = result.filter(allergy => 
        allergy.patientId === patientFilter
      );
    }
    
    // Şiddet derecesi filtresi uygula
    if (severityFilter) {
      result = result.filter(allergy => 
        allergy.severity === severityFilter
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
    
    setFilteredAllergies(result);
    setTotalElements(result.length);
    setTotalPages(Math.ceil(result.length / size));
    
    // Sayfa sınırlarını kontrol et
    if (result.length > 0 && page > Math.ceil(result.length / size) - 1) {
      setPage(0);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 300); // Yükleniyor animasyonunu göstermek için küçük bir gecikme
    
  }, [allergies, searchTerm, patientFilter, severityFilter, sortField, sortDirection, size]);

  /**
   * Dialog'u açar (ekleme veya düzenleme modu)
   * 
   * @param {string} mode - Dialog modu ('add' veya 'edit')
   * @param {Object} allergy - Düzenlenecek alerji (edit modunda)
   */
  const handleDialogOpen = (mode, allergy = null) => {
    setDialogMode(mode);
    setSelectedAllergy(allergy);
    setOpenDialog(true);
  };

  /**
   * Dialog'u kapatır
   */
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAllergy(null);
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
   * Hasta filtresini değiştirir
   * 
   * @param {number|null} patientId - Hasta ID'si veya null
   */
  const handlePatientFilter = (patientId) => {
    setPatientFilter(patientFilter === patientId ? null : patientId);
    setPage(0); // İlk sayfaya dön
  };

  /**
   * Şiddet derecesi filtresini değiştirir
   * 
   * @param {string|null} severity - Şiddet derecesi veya null
   */
  const handleSeverityFilter = (severity) => {
    setSeverityFilter(severityFilter === severity ? null : severity);
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
   * @param {Object} allergyData - Form verileri
   */
  const handleFormSubmit = (allergyData) => {
    setLoading(true);
    
    // Yapay bir yükleme süresi
    setTimeout(() => {
      try {
        // Ekleme veya güncelleme işlemi
        if (dialogMode === 'add') {
          // Yeni ID oluştur
          const newId = Math.max(...allergies.map(a => a.id), 0) + 1;
          const newAllergy = {
            ...allergyData,
            id: newId
          };
          
          // Alerjiyi ekle
          setAllergies(prev => [...prev, newAllergy]);
          
          // Bildirim göster
          setNotification({
            open: true,
            message: 'Alerji başarıyla eklendi',
            severity: 'success'
          });
        } else {
          // Mevcut alerjiyi güncelle
          setAllergies(prev => 
            prev.map(item => item.id === selectedAllergy.id ? { ...item, ...allergyData } : item)
          );
          
          // Bildirim göster
          setNotification({
            open: true,
            message: 'Alerji başarıyla güncellendi',
            severity: 'success'
          });
        }
        
        // Dialog'u kapat
        handleDialogClose();
      } catch (error) {
        // Hata bildirimi göster
        setNotification({
          open: true,
          message: 'İşlem sırasında bir hata oluştu',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }, 800); // Demo için gecikme
  };

  /**
   * Alerji silme işlemini yönetir
   * 
   * @param {number} id - Silinecek alerji ID'si
   */
  const handleDeleteAllergy = (id) => {
    setLoading(true);
    
    // Yapay bir yükleme süresi
    setTimeout(() => {
      try {
        // Alerjiyi sil
        setAllergies(prev => prev.filter(item => item.id !== id));
        
        // Bildirim göster
        setNotification({
          open: true,
          message: 'Alerji başarıyla silindi',
          severity: 'success'
        });
      } catch (error) {
        // Hata bildirimi göster
        setNotification({
          open: true,
          message: 'Silme işlemi sırasında bir hata oluştu',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }, 800); // Demo için gecikme
  };

  /**
   * Bildirim kapatma işlemini yönetir
   */
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  /**
   * Hasta adını ID'ye göre bulan yardımcı fonksiyon
   * 
   * @param {number} patientId - Hasta ID'si
   * @returns {string} - Hasta adı
   */
  const getPatientName = (patientId) => {
    if (!patients || !patients.length) return `Hasta ${patientId}`;
    
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return `Hasta ${patientId}`;
    
    return patient.name;
  };

  /**
   * Şiddet derecesi etiketini oluşturma
   * 
   * @param {string} severity - Şiddet seviyesi
   * @returns {string} - Türkçe etiket
   */
  const getSeverityLabel = (severity) => {
    switch(severity) {
      case 'MILD':
        return 'Hafif';
      case 'MODERATE':
        return 'Orta';
      case 'SEVERE':
        return 'Şiddetli';
      default:
        return severity || 'Belirtilmemiş';
    }
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
            <AllergyIcon fontSize="large" sx={{ color: 'white' }} />
          </Box>
          
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: 'white' }}>
              Alerji Yönetimi
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Sistem içindeki alerji kayıtlarını yönetin
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 4, px: 4 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Alerji adı veya açıklamada ara..."
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
                 sortField === 'severity' ? 'Şiddete Göre' : 'Tarih'}
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
                Yeni Alerji Ekle
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
                <MenuItem onClick={() => handleSortBy('severity')}>
                  <ListItemIcon>
                    {sortField === 'severity' && (
                      sortDirection === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText>Şiddete Göre</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
          
          {/* Alerji Listesi */}
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
            
            <AllergyList 
              allergies={getPaginatedData()} 
              patients={patients}
              onEdit={(allergy) => handleDialogOpen('edit', allergy)}
              onDelete={handleDeleteAllergy}
              loading={loading}
            />
          </Paper>
          
          {/* Sayfalama */}
          <Pagination 
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
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
        <AllergyForm
          mode={dialogMode}
          initialData={selectedAllergy}
          onSubmit={handleFormSubmit}
          onCancel={handleDialogClose}
          loading={loading}
          patients={patients} // Demo hastaları doğrudan gönder
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

export default AllergyPage; 