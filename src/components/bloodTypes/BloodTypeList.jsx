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
  Bloodtype as BloodtypeIcon,
  Pets as PetsIcon
} from '@mui/icons-material';

/**
 * Kan Grubu Liste Bileşeni
 * 
 * Backend veri yapısına uygun olarak kan gruplarını listeler ve
 * düzenleme/silme işlemlerini yönetir.
 */
const BloodTypeList = ({ bloodTypes, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bloodType: null });

  // Silme diyaloğunu açar
  const handleOpenDeleteDialog = (bloodType) => {
    setDeleteDialog({ open: true, bloodType });
  };

  // Silme diyaloğunu kapatır
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, bloodType: null });
  };

  // Silme işlemini onaylar
  const confirmDelete = () => {
    if (deleteDialog.bloodType) {
      onDelete(deleteDialog.bloodType.id);
      handleCloseDeleteDialog();
    }
  };

  // Türlere göre renk atama
  const getSpeciesColor = (id) => {
    const colors = [
      theme.palette.primary.light,
      theme.palette.secondary.light,
      theme.palette.success.light,
      theme.palette.info.light,
      theme.palette.warning.light
    ];
    return colors[id % colors.length];
  };

  // Kan grubu tipine göre renk atama
  const getBloodTypeColor = (type) => {
    const defaultColor = theme.palette.error.main;
    
    const colors = {
      'A': '#f44336', // red
      'B': '#2196f3', // blue
      'AB': '#9c27b0', // purple
      'O': '#4caf50', // green
      'DEA 1.1+': '#f44336', // red
      'DEA 1.1-': '#4caf50', // green
    };
    
    return colors[type] || defaultColor;
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
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Kan Grubu</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Tür</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bloodTypes.map((bloodType) => (
              <TableRow 
                key={bloodType.id} 
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
                {/* Kan Grubu */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getBloodTypeColor(bloodType.type),
                        color: '#fff',
                        width: 40, 
                        height: 40 
                      }}
                    >
                      <BloodtypeIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {bloodType.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {bloodType.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                {/* Tür Bilgisi */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getSpeciesColor(bloodType.species.id),
                        color: '#fff',
                        width: 32, 
                        height: 32 
                      }}
                    >
                      <PetsIcon sx={{ fontSize: '18px' }} />
                    </Avatar>
                    <Typography variant="body2">
                      {bloodType.species.name}
                    </Typography>
                  </Box>
                </TableCell>
                
                {/* İşlemler */}
                <TableCell align="right">
                  <Tooltip title="Düzenle">
                    <IconButton 
                      onClick={() => onEdit(bloodType)} 
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
                      onClick={() => handleOpenDeleteDialog(bloodType)} 
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

      {/* Silme Onay Diyaloğu */}
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
          Kan Grubunu Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: deleteDialog.bloodType ? getBloodTypeColor(deleteDialog.bloodType.type) : theme.palette.error.main,
                color: '#fff',
                width: 50, 
                height: 50
              }}
            >
              <BloodtypeIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{deleteDialog.bloodType?.type}</Typography>
              {deleteDialog.bloodType?.species && (
                <Typography variant="body2" color="text.secondary">
                  {deleteDialog.bloodType.species.name}
                </Typography>
              )}
            </Box>
          </Box>
          <DialogContentText>
            <strong>{deleteDialog.bloodType?.type}</strong> kan grubunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve bu kan grubuna sahip hayvanlar etkilenebilir.
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

export default BloodTypeList; 