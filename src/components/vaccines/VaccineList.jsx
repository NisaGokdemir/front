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
  Vaccines as VaccineIcon,
  Pets as PetsIcon,
  Factory as ManufacturerIcon,
  Schedule as ScheduleIcon,
  Science as DosageIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon
} from '@mui/icons-material';

/**
 * Aşı listesi bileşeni
 * 
 * @param {Object} props
 * @param {Array} props.vaccines - Aşı listesi
 * @param {Function} props.onEdit - Düzenleme butonuna tıklandığında çağrılacak fonksiyon
 * @param {Function} props.onDelete - Silme butonuna tıklandığında çağrılacak fonksiyon
 * @param {boolean} props.loading - Yükleniyor durumu
 */
const VaccineList = ({ vaccines, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vaccine: null });
  const [expandedRow, setExpandedRow] = useState(null);

  /**
   * Silme onay dialogunu açar
   * 
   * @param {Object} vaccine - Silinecek aşı
   */
  const handleOpenDeleteDialog = (vaccine) => {
    setDeleteDialog({ open: true, vaccine });
  };

  /**
   * Silme onay dialogunu kapatır
   */
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, vaccine: null });
  };

  /**
   * Silme işlemini onaylar ve çağıran bileşene bildirir
   */
  const confirmDelete = () => {
    if (deleteDialog.vaccine) {
      onDelete(deleteDialog.vaccine.id);
      handleCloseDeleteDialog();
    }
  };

  /**
   * Satır detaylarını açar/kapatır
   * 
   * @param {number} id - Aşı ID'si
   */
  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  /**
   * Aşı adından avatar için renk oluşturma
   * 
   * @param {string} name - Aşı adı
   * @returns {string} - Renk değeri
   */
  const getVaccineColorFromName = (name) => {
    const charCode = name.charCodeAt(0);
    const colors = [
      theme.palette.primary.light,
      theme.palette.secondary.light,
      theme.palette.success.light,
      theme.palette.info.light,
      theme.palette.warning.light,
      theme.palette.error.light,
      theme.palette.primary.main,
      theme.palette.secondary.main
    ];
    
    return colors[charCode % colors.length];
  };

  /**
   * Hedef türleri render eder
   * 
   * @param {string} targetSpecies - Virgülle ayrılmış hedef türler
   * @returns {JSX.Element} - Chip listesi
   */
  const renderTargetSpecies = (targetSpecies) => {
    const species = targetSpecies ? targetSpecies.split(',') : [];
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {species.map((type, index) => (
          <Chip
            key={index}
            label={type.trim()}
            size="small"
            variant="outlined"
            color="primary"
            icon={<PetsIcon fontSize="small" />}
            sx={{ borderRadius: '12px' }}
          />
        ))}
      </Box>
    );
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
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Aşı Adı</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Üretici Firma</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Hedef Türler</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaccines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Kayıtlı aşı bulunamadı.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              vaccines.map((vaccine) => (
                <>
                  <TableRow 
                    key={vaccine.id} 
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
                        onClick={() => toggleRowExpand(vaccine.id)}
                        aria-label="detayları göster/gizle"
                      >
                        {expandedRow === vaccine.id ? (
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
                            bgcolor: getVaccineColorFromName(vaccine.name),
                            color: '#fff',
                            width: 40, 
                            height: 40 
                          }}
                        >
                          <VaccineIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {vaccine.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {vaccine.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ManufacturerIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {vaccine.manufacturer}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {renderTargetSpecies(vaccine.targetSpecies)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Düzenle">
                        <IconButton 
                          onClick={() => onEdit(vaccine)} 
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
                          onClick={() => handleOpenDeleteDialog(vaccine)} 
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
                    <TableCell colSpan={5} sx={{ py: 0 }}>
                      <Collapse in={expandedRow === vaccine.id} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 2, py: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                          <Grid container spacing={2}>
                            {vaccine.description && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom component="div" color="primary">
                                  Açıklama:
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                                  <Typography variant="body2">{vaccine.description}</Typography>
                                </Paper>
                              </Grid>
                            )}
                            
                            <Grid item xs={12} md={6}>
                              {vaccine.schedule && (
                                <Box mb={2}>
                                  <Typography variant="subtitle2" gutterBottom component="div" color="primary" 
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ScheduleIcon fontSize="small" /> Uygulama Takvimi:
                                  </Typography>
                                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                                    <Typography variant="body2">{vaccine.schedule}</Typography>
                                  </Paper>
                                </Box>
                              )}
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              {vaccine.dosage && (
                                <Box>
                                  <Typography variant="subtitle2" gutterBottom component="div" color="primary"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DosageIcon fontSize="small" /> Doz Bilgisi:
                                  </Typography>
                                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                                    <Typography variant="body2">{vaccine.dosage}</Typography>
                                  </Paper>
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))
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
          Aşıyı Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: deleteDialog.vaccine ? getVaccineColorFromName(deleteDialog.vaccine.name) : theme.palette.error.light,
                color: '#fff',
                width: 50, 
                height: 50
              }}
            >
              <VaccineIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{deleteDialog.vaccine?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {deleteDialog.vaccine?.manufacturer}
              </Typography>
            </Box>
          </Box>
          <DialogContentText>
            <strong>{deleteDialog.vaccine?.name}</strong> aşısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

export default VaccineList; 