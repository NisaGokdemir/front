import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Collapse,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  Divider,
  Grid,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  LocalHospital as ClinicIcon
} from '@mui/icons-material';

/**
 * Klinikler tablosunu gösteren bileşen
 * 
 * @param {Object} props
 * @param {Array} props.clinics - Klinikler listesi
 * @param {Function} props.onEdit - Düzenleme işlevi
 * @param {Function} props.onDelete - Silme işlevi
 * @param {boolean} props.loading - Yükleniyor durumu
 */
const ClinicList = ({ clinics, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  
  // Dialog durumu
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState(null);
  
  // Genişletilen satırlar
  const [expandedRows, setExpandedRows] = useState({});

  /**
   * Silme dialogunu açar
   * 
   * @param {Object} clinic - Silinecek klinik
   */
  const handleDeleteDialogOpen = (clinic) => {
    setClinicToDelete(clinic);
    setDeleteDialogOpen(true);
  };

  /**
   * Silme dialogunu kapatır
   */
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setClinicToDelete(null);
  };

  /**
   * Silme işlemini onaylar
   */
  const handleConfirmDelete = () => {
    if (clinicToDelete) {
      onDelete(clinicToDelete.id);
      handleDeleteDialogClose();
    }
  };

  /**
   * Satır genişletme durumunu değiştirir
   * 
   * @param {number} id - Klinik ID
   */
  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  /**
   * Klinik durumuna göre renk ve etiket döndürür
   * 
   * @param {string} status - Klinik durumu
   * @returns {Object} - Renk ve etiket bilgisi
   */
  const getStatusInfo = (status) => {
    switch (status) {
      case 'ACTIVE':
        return { color: 'success', label: 'Aktif' };
      case 'INACTIVE':
        return { color: 'error', label: 'Pasif' };
      case 'UNDER_MAINTENANCE':
        return { color: 'warning', label: 'Bakımda' };
      default:
        return { color: 'default', label: status || 'Bilinmiyor' };
    }
  };

  /**
   * Klinik adına göre avatar rengi oluşturur
   * 
   * @param {string} name - Klinik adı
   * @returns {string} - Renk kodu
   */
  const generateAvatarColor = (name) => {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', 
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFC107', '#FF9800', '#FF5722'
    ];
    
    if (!name) return colors[0];
    
    // Basit bir hash algoritması
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  /**
   * Klinik adı kısaltması oluşturur
   * 
   * @param {string} name - Klinik adı
   * @returns {string} - Kısaltma (en fazla 2 harf)
   */
  const getInitials = (name) => {
    if (!name) return '?';
    
    const words = name.split(' ');
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
              <TableCell sx={{ width: '5%' }}></TableCell>
              <TableCell sx={{ width: '30%' }}>Klinik Adı</TableCell>
              <TableCell sx={{ width: '20%' }}>Konum</TableCell>
              <TableCell sx={{ width: '15%' }}>İletişim</TableCell>
              <TableCell sx={{ width: '15%' }}>Durum</TableCell>
              <TableCell align="right" sx={{ width: '15%' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clinics && clinics.length > 0 ? (
              clinics.map((clinic) => (
                <>
                  <TableRow 
                    key={clinic.id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleRowExpand(clinic.id)}
                  >
                    <TableCell>
                      <IconButton size="small">
                        {expandedRows[clinic.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: generateAvatarColor(clinic.name),
                            color: '#fff',
                            fontWeight: 'bold',
                            width: 40,
                            height: 40
                          }}
                        >
                          {getInitials(clinic.name)}
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {clinic.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {clinic.city}{clinic.district ? `, ${clinic.district}` : ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                          {clinic.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusInfo(clinic.status).label}
                        color={getStatusInfo(clinic.status).color}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Düzenle">
                        <IconButton 
                          color="primary" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(clinic);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton 
                          color="error" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDialogOpen(clinic);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                  {/* Genişletilmiş Detay Satırı */}
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse in={expandedRows[clinic.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, pb: 2 }}>
                          <Typography variant="h6" gutterBottom component="div" fontWeight={500}>
                            Klinik Detayları
                          </Typography>
                          <Divider sx={{ mb: 2 }} />

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Adres
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {clinic.address || 'Belirtilmemiş'}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Çalışma Saatleri
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <ScheduleIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {clinic.openingTime && clinic.closingTime 
                                    ? `${clinic.openingTime} - ${clinic.closingTime}`
                                    : 'Belirtilmemiş'
                                  }
                                </Typography>
                              </Box>
                            </Grid>

                            {clinic.email && (
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  E-posta
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <EmailIcon fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {clinic.email}
                                  </Typography>
                                </Box>
                              </Grid>
                            )}

                            {clinic.website && (
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Website
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <LanguageIcon fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {clinic.website}
                                  </Typography>
                                </Box>
                              </Grid>
                            )}

                            {clinic.description && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Açıklama
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  {clinic.description}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <ClinicIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      Henüz klinik bulunamadı
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      "Yeni Klinik Ekle" butonunu kullanarak klinik ekleyebilirsiniz
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Silme Onay Dialogu */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.error.main, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <WarningIcon />
          Klinik Silme İşlemi
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3, pb: 1, mt: 1 }}>
          <DialogContentText>
            <Typography variant="body1" fontWeight={500} color="text.primary" gutterBottom>
              Bu kliniği silmek istediğinizden emin misiniz?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {clinicToDelete?.name} kliniği silinecek. Bu işlem geri alınamaz.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleDeleteDialogClose} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            sx={{ 
              borderRadius: '8px',
              px: 3
            }}
          >
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClinicList; 