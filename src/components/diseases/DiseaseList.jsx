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
  Coronavirus as DiseaseIcon,
  Pets as PetsIcon,
  Category as CategoryIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon
} from '@mui/icons-material';

/**
 * Hastalık listesi bileşeni
 * 
 * @param {Object} props
 * @param {Array} props.diseases - Hastalık listesi
 * @param {Function} props.onEdit - Düzenleme butonuna tıklandığında çağrılacak fonksiyon
 * @param {Function} props.onDelete - Silme butonuna tıklandığında çağrılacak fonksiyon
 * @param {boolean} props.loading - Yükleniyor durumu
 */
const DiseaseList = ({ diseases, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, disease: null });
  const [expandedRow, setExpandedRow] = useState(null);

  /**
   * Silme onay dialogunu açar
   * 
   * @param {Object} disease - Silinecek hastalık
   */
  const handleOpenDeleteDialog = (disease) => {
    setDeleteDialog({ open: true, disease });
  };

  /**
   * Silme onay dialogunu kapatır
   */
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, disease: null });
  };

  /**
   * Silme işlemini onaylar ve çağıran bileşene bildirir
   */
  const confirmDelete = () => {
    if (deleteDialog.disease) {
      onDelete(deleteDialog.disease.id);
      handleCloseDeleteDialog();
    }
  };

  /**
   * Satır detaylarını açar/kapatır
   * 
   * @param {number} id - Hastalık ID'si
   */
  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  /**
   * Kategoriye göre renk atar
   * 
   * @param {string} category - Hastalık kategorisi
   * @returns {string} - Renk değeri
   */
  const getCategoryColor = (category) => {
    const categoryColors = {
      'Enfeksiyon': theme.palette.error.light,
      'Paraziter': theme.palette.warning.light,
      'Genetik': theme.palette.info.light,
      'Metabolik': theme.palette.success.light,
      'Ortopedik': theme.palette.secondary.light,
      'Kardiyovasküler': theme.palette.error.main,
      'Solunum': theme.palette.info.main,
      'Sindirim': theme.palette.warning.main,
      'Nörolojik': theme.palette.primary.light,
      'Dermatolojik': theme.palette.secondary.main,
      'Göz': theme.palette.info.dark,
      'Diş': theme.palette.warning.dark,
      'Üriner': theme.palette.success.main,
      'Onkoloji': theme.palette.error.dark,
      'Davranışsal': theme.palette.primary.main,
      'Diğer': theme.palette.grey[500]
    };
    
    return categoryColors[category] || theme.palette.grey[500];
  };

  /**
   * Hastalık adından avatar için renk oluşturma
   * 
   * @param {string} name - Hastalık adı
   * @returns {string} - Renk değeri
   */
  const getDiseaseColorFromName = (name) => {
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
   * Hayvan türlerini render eder
   * 
   * @param {string} animalTypes - Virgülle ayrılmış hayvan türleri
   * @returns {JSX.Element} - Chip listesi
   */
  const renderAnimalTypes = (animalTypes) => {
    const types = animalTypes ? animalTypes.split(',') : [];
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {types.map((type, index) => (
          <Chip
            key={index}
            label={type.trim()}
            size="small"
            variant="outlined"
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
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Hastalık Adı</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Kategori</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Hayvan Türleri</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diseases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Kayıtlı hastalık bulunamadı.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              diseases.map((disease) => (
                <>
                  <TableRow 
                    key={disease.id} 
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
                        onClick={() => toggleRowExpand(disease.id)}
                        aria-label="detayları göster/gizle"
                      >
                        {expandedRow === disease.id ? (
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
                            bgcolor: getDiseaseColorFromName(disease.name),
                            color: '#fff',
                            width: 40, 
                            height: 40 
                          }}
                        >
                          <DiseaseIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {disease.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {disease.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={disease.category}
                        size="small"
                        sx={{ 
                          bgcolor: getCategoryColor(disease.category),
                          color: '#fff',
                          fontWeight: 'medium'
                        }}
                        icon={<CategoryIcon style={{ color: '#fff' }} />}
                      />
                    </TableCell>
                    <TableCell>
                      {renderAnimalTypes(disease.animalTypes)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Düzenle">
                        <IconButton 
                          onClick={() => onEdit(disease)} 
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
                          onClick={() => handleOpenDeleteDialog(disease)} 
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
                      <Collapse in={expandedRow === disease.id} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 2, py: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                          <Grid container spacing={2}>
                            {disease.description && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom component="div" color="primary">
                                  Açıklama:
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                                  <Typography variant="body2">{disease.description}</Typography>
                                </Paper>
                              </Grid>
                            )}
                            
                            {disease.symptoms && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom component="div" color="primary">
                                  Semptomlar:
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                                  <Typography variant="body2">{disease.symptoms}</Typography>
                                </Paper>
                              </Grid>
                            )}
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
          Hastalığı Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: deleteDialog.disease ? getDiseaseColorFromName(deleteDialog.disease.name) : theme.palette.error.light,
                color: '#fff',
                width: 50, 
                height: 50
              }}
            >
              <DiseaseIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{deleteDialog.disease?.name}</Typography>
              {deleteDialog.disease?.category && (
                <Chip 
                  label={deleteDialog.disease.category}
                  size="small"
                  sx={{ 
                    bgcolor: getCategoryColor(deleteDialog.disease.category),
                    color: '#fff',
                    fontWeight: 'medium',
                    mt: 0.5
                  }}
                />
              )}
            </Box>
          </Box>
          <DialogContentText>
            <strong>{deleteDialog.disease?.name}</strong> hastalığını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

export default DiseaseList; 