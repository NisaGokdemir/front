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
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Pets as PetsIcon
} from '@mui/icons-material';

const SpeciesList = ({ species, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, species: null });

  const handleOpenDeleteDialog = (species) => {
    setDeleteDialog({ open: true, species });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, species: null });
  };

  const confirmDelete = () => {
    if (deleteDialog.species) {
      onDelete(deleteDialog.species.id);
      handleCloseDeleteDialog();
    }
  };

  // Türlerin renklerini belirlemek için basit bir fonksiyon
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
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Tür Adı</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {species.map((specie) => (
              <TableRow 
                key={specie.id} 
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
                        bgcolor: getSpeciesColor(specie.id),
                        color: '#fff',
                        width: 40, 
                        height: 40 
                      }}
                    >
                      <PetsIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {specie.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {specie.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Düzenle">
                    <IconButton 
                      onClick={() => onEdit(specie)} 
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
                      onClick={() => handleOpenDeleteDialog(specie)} 
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
          Türü Sil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: deleteDialog.species ? getSpeciesColor(deleteDialog.species.id) : theme.palette.primary.light,
                color: '#fff',
                width: 50, 
                height: 50
              }}
            >
              <PetsIcon />
            </Avatar>
            <Typography variant="h6">{deleteDialog.species?.name}</Typography>
          </Box>
          <DialogContentText>
            <strong>{deleteDialog.species?.name}</strong> türünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve bu türe bağlı hayvanlar etkilenebilir.
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

export default SpeciesList; 