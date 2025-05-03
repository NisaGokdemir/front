import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
  Chip,
  Avatar,
  useTheme,
  Paper,
  Collapse,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  HealthAndSafety as AllergyIcon,
  Pets as PetIcon,
  LocalHospital as SeverityIcon,
  Bolt as ReactionIcon,
  Note as NoteIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon
} from '@mui/icons-material';

/**
 * Alerji listesi bileşeni
 * 
 * @param {Object} props
 * @param {Array} props.allergies - Alerji listesi
 * @param {Array} props.patients - Hasta listesi (patientId'yi isme dönüştürmek için) - Opsiyonel
 * @param {Function} props.onEdit - Düzenleme butonuna tıklandığında çağrılacak fonksiyon
 * @param {Function} props.onDelete - Silme butonuna tıklandığında çağrılacak fonksiyon
 * @param {boolean} props.loading - Yükleniyor durumu
 */
const AllergyList = ({ allergies, patients = [], onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, allergy: null });
  const [expandedRow, setExpandedRow] = useState(null);

  /**
   * Silme onay dialogunu açar
   * 
   * @param {Object} allergy - Silinecek alerji
   */
  const handleOpenDeleteDialog = (allergy) => {
    setDeleteDialog({ open: true, allergy });
  };

  /**
   * Silme onay dialogunu kapatır
   */
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, allergy: null });
  };

  /**
   * Silme işlemini onaylar ve çağıran bileşene bildirir
   */
  const confirmDelete = () => {
    if (deleteDialog.allergy) {
      onDelete(deleteDialog.allergy.id);
      handleCloseDeleteDialog();
    }
  };

  /**
   * Satır detaylarını açar/kapatır
   * 
   * @param {number} id - Alerji ID'si
   */
  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  /**
   * Hasta adını ID'ye göre bulan yardımcı fonksiyon
   * Hasta listesi verilmezse ID gösterir
   * 
   * @param {number} patientId - Hasta ID'si
   * @returns {string} - Hasta adı veya ID
   */
  const getPatientName = (patientId) => {
    if (!patients || !patients.length) return `Hasta ${patientId}`;
    
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return `Hasta ${patientId}`;
    
    return patient.name;
  };
  
  /**
   * Hasta bilgilerini ID'ye göre bulan yardımcı fonksiyon
   * Hasta listesi verilmezse sadece ID bilgisi döner
   * 
   * @param {number} patientId - Hasta ID'si
   * @returns {Object} - Hasta adı ve türü içeren nesne
   */
  const getPatientInfo = (patientId) => {
    if (!patients || !patients.length) return { name: `Hasta ${patientId}`, species: '' };
    
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return { name: `Hasta ${patientId}`, species: '' };
    
    return { 
      name: patient.name,
      species: patient.species || ''
    };
  };

  /**
   * Şiddet seviyesinden renk oluşturma
   * 
   * @param {string} severity - Şiddet seviyesi
   * @returns {string} - Renk değeri
   */
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'MILD':
        return theme.palette.success.light;
      case 'MODERATE':
        return theme.palette.warning.light;
      case 'SEVERE':
        return theme.palette.error.light;
      default:
        return theme.palette.info.light;
    }
  };

  /**
   * Şiddet seviyesi etiketini oluşturma
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

  /**
   * Reaksiyon tipi etiketini oluşturma
   * 
   * @param {string} reactionType - Reaksiyon tipi
   * @returns {string} - Türkçe etiket
   */
  const getReactionTypeLabel = (reactionType) => {
    switch(reactionType) {
      case 'SKIN':
        return 'Deri (Kaşıntı, Kızarıklık)';
      case 'RESPIRATORY':
        return 'Solunum (Öksürük, Nefes Darlığı)';
      case 'DIGESTIVE':
        return 'Sindirim (Kusma, İshal)';
      case 'ANAPHYLAXIS':
        return 'Anafilaksi';
      case 'OTHER':
        return 'Diğer';
      default:
        return reactionType || 'Belirtilmemiş';
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderBottom: '2px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
          }}>
            <TableRow>
              <TableCell sx={{ width: '40px' }} />
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Alerji Adı</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Hasta ID</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Şiddet</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Reaksiyon Tipi</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allergies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Kayıtlı alerji bulunamadı.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              allergies.map((allergy) => {
                const patientInfo = getPatientInfo(allergy.patientId);
                
                return (
                  <>
                    <TableRow 
                      key={allergy.id} 
                      hover
                      sx={{
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.05)' 
                            : 'rgba(0,0,0,0.02)'
                        }
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpand(allergy.id)}
                          aria-label="detayları göster/gizle"
                        >
                          {expandedRow === allergy.id ? (
                            <ArrowUpIcon fontSize="small" />
                          ) : (
                            <ArrowDownIcon fontSize="small" />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getSeverityColor(allergy.severity),
                              color: '#fff',
                              width: 40, 
                              height: 40 
                            }}
                          >
                            <AllergyIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {allergy.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {allergy.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PetIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {patientInfo.name}
                            {patientInfo.species && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                {patientInfo.species}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getSeverityLabel(allergy.severity)}
                          size="small"
                          sx={{ 
                            bgcolor: getSeverityColor(allergy.severity),
                            color: '#fff',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {allergy.reactionType ? (
                          <Typography variant="body2">
                            {getReactionTypeLabel(allergy.reactionType)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Belirtilmemiş
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Düzenle">
                          <IconButton 
                            onClick={() => onEdit(allergy)} 
                            disabled={loading}
                            color="primary"
                            size="small"
                            sx={{ 
                              mr: 1,
                              backgroundColor: 'rgba(63, 81, 181, 0.08)',
                              '&:hover': {
                                backgroundColor: 'rgba(63, 81, 181, 0.15)',
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            onClick={() => handleOpenDeleteDialog(allergy)} 
                            disabled={loading}
                            color="error"
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(244, 67, 54, 0.08)',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.15)',
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    
                    {/* Detay Satırı */}
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 0 }}>
                        <Collapse in={expandedRow === allergy.id} timeout="auto" unmountOnExit>
                          <Box sx={{ px: 2, py: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                            <Grid container spacing={2}>
                              {allergy.description && (
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" gutterBottom component="div" color="primary">
                                    Açıklama:
                                  </Typography>
                                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                                    <Typography variant="body2">{allergy.description}</Typography>
                                  </Paper>
                                </Grid>
                              )}
                              
                              {allergy.notes && (
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" gutterBottom component="div" color="primary" 
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <NoteIcon fontSize="small" /> Ek Notlar:
                                  </Typography>
                                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                                    <Typography variant="body2">{allergy.notes}</Typography>
                                  </Paper>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Silme Onay Dialog'u */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.error.light,
          color: theme.palette.error.contrastText,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <WarningIcon />
          Alerjiyi Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: deleteDialog.allergy ? getSeverityColor(deleteDialog.allergy.severity) : theme.palette.error.light,
                color: '#fff',
                width: 50, 
                height: 50
              }}
            >
              <AllergyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{deleteDialog.allergy?.name}</Typography>
              {deleteDialog.allergy?.patientId && (
                <Typography variant="body2" color="text.secondary">
                  Hasta: {getPatientName(deleteDialog.allergy.patientId)}
                </Typography>
              )}
            </Box>
          </Box>
          <DialogContentText>
            <strong>{deleteDialog.allergy?.name}</strong> alerjisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            İptal
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(244, 67, 54, 0.25)'
            }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllergyList; 