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
  Card,
  CardContent,
  Divider,
  useTheme,
  Paper,
  Grid,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  MedicalServices as MedicalIcon,
  Person as PersonIcon,
  Pets as PetsIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const DiagnosisList = ({ diagnoses, onEdit, onDelete, onCreatePrescription, onViewPrescriptions, prescriptionCounts = {}, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, diagnosis: null });

  const handleOpenDeleteDialog = (diagnosis) => {
    setDeleteDialog({ open: true, diagnosis });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, diagnosis: null });
  };

  const confirmDelete = () => {
    if (deleteDialog.diagnosis) {
      onDelete(deleteDialog.diagnosis.id);
      handleCloseDeleteDialog();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
    } catch (error) {
      return dateString;
    }
  };

  if (diagnoses.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '12px' }}>
        <MedicalIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Kayıtlı tanı bulunamadı
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Yeni tanı eklemek için "Yeni Tanı" butonunu kullanabilirsiniz.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {diagnoses.map((diagnosis) => (
          <Grid item xs={12} key={diagnosis.id}>
            <Card
              sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    mr: 2
                  }}
                >
                  <MedicalIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" component="h3">
                      Tanı #{diagnosis.id}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={diagnosis.patient?.name || ''}
                      icon={<PetsIcon sx={{ fontSize: '0.8rem !important' }} />}
                      sx={{ 
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {diagnosis.createdAt ? formatDate(diagnosis.createdAt) : 'Tarih bilgisi yok'}
                  </Typography>
                </Box>
                
                <Box>
                  <Tooltip title="Düzenle">
                    <IconButton
                      onClick={() => onEdit(diagnosis)}
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
                      onClick={() => handleOpenDeleteDialog(diagnosis)}
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
                </Box>
              </Box>
              
              <Divider />
              
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                      Tanı
                    </Typography>
                    <Typography variant="body1">
                      {diagnosis.diagnosis}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                      Tedavi Planı
                    </Typography>
                    <Typography variant="body1">
                      {diagnosis.treatmentPlan}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ 
                  mt: 3,
                  p: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Veteriner:
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {diagnosis.vet?.username || 'Bilinmiyor'}
                    </Typography>
                  </Box>
                </Box>

                {/* Reçete Butonları */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => onCreatePrescription && onCreatePrescription(diagnosis)}
                    disabled={loading}
                  >
                    Reçete Oluştur
                  </Button>
                  <Badge 
                    badgeContent={prescriptionCounts[diagnosis.id] || 0} 
                    color="primary"
                    sx={{ '& .MuiBadge-badge': { right: 10, top: 10 } }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={() => onViewPrescriptions && onViewPrescriptions(diagnosis)}
                      disabled={loading || !(prescriptionCounts[diagnosis.id] > 0)}
                    >
                      Reçeteleri Görüntüle
                    </Button>
                  </Badge>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
          Tanıyı Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.light,
                color: '#fff',
                width: 50,
                height: 50
              }}
            >
              <MedicalIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Tanı #{deleteDialog.diagnosis?.id}</Typography>
              <Typography variant="body2" color="textSecondary">
                {deleteDialog.diagnosis?.patient?.name} - {deleteDialog.diagnosis?.diagnosis?.substring(0, 30)}...
              </Typography>
            </Box>
          </Box>
          <DialogContentText>
            Bu tanıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tanıya bağlı tüm reçeteler de silinebilir.
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

export default DiagnosisList; 