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
  Avatar,
  useTheme,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  MedicalServices as MedicalServicesIcon,
  WarningAmber as WarningAmberIcon,
  Straighten as StraightenIcon
} from '@mui/icons-material';

const MedicationList = ({ medications, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, medication: null });

  const handleOpenDeleteDialog = (medication) => {
    setDeleteDialog({ open: true, medication });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, medication: null });
  };

  const confirmDelete = () => {
    if (deleteDialog.medication) {
      onDelete(deleteDialog.medication.id);
      handleCloseDeleteDialog();
    }
  };

  const getStockStatusColor = (stockWarningLevel) => {
    // Bu örnekte sadece stockWarningLevel'e göre renk belirliyoruz
    // Gerçek bir uygulamada stockLevel < stockWarningLevel kontrolü yapılabilir
    if (stockWarningLevel <= 10) return theme.palette.error.main;
    if (stockWarningLevel <= 30) return theme.palette.warning.main;
    return theme.palette.success.main;
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
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>İlaç Adı</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Birim</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Stok Uyarı Seviyesi</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.map((medication) => (
              <TableRow 
                key={medication.id} 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.success.light,
                        color: '#fff',
                        width: 40, 
                        height: 40 
                      }}
                    >
                      <MedicalServicesIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {medication.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {medication.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StraightenIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {medication.unit}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      icon={<WarningAmberIcon />} 
                      label={`${medication.stockWarningLevel} ${medication.unit}`}
                      size="small"
                      sx={{ 
                        bgcolor: `${getStockStatusColor(medication.stockWarningLevel)}20`,
                        color: getStockStatusColor(medication.stockWarningLevel),
                        borderColor: getStockStatusColor(medication.stockWarningLevel),
                        fontWeight: 500,
                        border: '1px solid'
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Düzenle">
                    <IconButton 
                      onClick={() => onEdit(medication)} 
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
                      onClick={() => handleOpenDeleteDialog(medication)} 
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          İlacı Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.success.light,
                color: '#fff',
                width: 50, 
                height: 50
              }}
            >
              <MedicalServicesIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{deleteDialog.medication?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Birim: {deleteDialog.medication?.unit}
              </Typography>
            </Box>
          </Box>
          <DialogContentText>
            <strong>{deleteDialog.medication?.name}</strong> ilacını silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve bu ilaca bağlı reçeteler etkilenebilir.
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

export default MedicationList; 