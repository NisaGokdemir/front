import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  PersonOutline as PersonIcon,
  Warning as WarningIcon,
  Notes as NotesIcon,
  MonetizationOn as DebtIcon
} from '@mui/icons-material';

/**
 * Hasta Sahibi Liste Bileşeni
 * 
 * Backend veri yapısına uygun olarak hasta sahiplerini listeler ve
 * düzenleme/silme işlemlerini yönetir.
 */
const OwnerList = ({ owners, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, owner: null });

  // Hasta sahibinin tam adını döndürür
  const getFullName = (owner) => {
    if (!owner) return '';
    return `${owner.firstName || ''} ${owner.lastName || ''}`.trim();
  };

  // Silme diyaloğunu açar
  const handleOpenDeleteDialog = (owner) => {
    setDeleteDialog({ open: true, owner });
  };

  // Silme diyaloğunu kapatır
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, owner: null });
  };

  // Silme işlemini onaylar
  const confirmDelete = () => {
    if (deleteDialog.owner) {
      onDelete(deleteDialog.owner.id);
      handleCloseDeleteDialog();
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
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Hasta Sahibi</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>İletişim Bilgileri</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Adres</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Ek Bilgiler</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {owners.map((owner) => (
              <TableRow 
                key={owner.id} 
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
                {/* Hasta Sahibi Adı */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                        width: 40, 
                        height: 40 
                      }}
                    >
                      {getFullName(owner)?.charAt(0)?.toUpperCase() || <PersonIcon fontSize="small" />}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {getFullName(owner)}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={`ID: ${owner.id}`} 
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          mt: 0.5,
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.12)' 
                            : 'rgba(0,0,0,0.08)',
                          color: 'text.secondary'
                        }} 
                      />
                    </Box>
                  </Box>
                </TableCell>
                
                {/* İletişim Bilgileri */}
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="primary" sx={{ opacity: 0.7 }} />
                      <Typography variant="body2">{owner.phone}</Typography>
                    </Box>
                    {owner.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="primary" sx={{ opacity: 0.7 }} />
                        <Typography variant="body2">{owner.email}</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                
                {/* Adres */}
                <TableCell>
                  {owner.address ? (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <LocationIcon fontSize="small" color="primary" sx={{ mt: 0.3, opacity: 0.7 }} />
                      <Typography variant="body2">{owner.address}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      Adres girilmemiş
                    </Typography>
                  )}
                </TableCell>
                
                {/* Ek Bilgiler (Borç ve Notlar) */}
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {owner.debt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DebtIcon fontSize="small" color="error" sx={{ opacity: 0.7 }} />
                        <Typography variant="body2">{owner.debt}</Typography>
                      </Box>
                    )}
                    {owner.notes && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <NotesIcon fontSize="small" color="info" sx={{ mt: 0.3, opacity: 0.7 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {owner.notes}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                
                {/* İşlemler */}
                <TableCell align="right">
                  <Tooltip title="Düzenle">
                    <IconButton 
                      onClick={() => onEdit(owner)} 
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
                      onClick={() => handleOpenDeleteDialog(owner)} 
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
          Hasta Sahibini Sil
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
              {getFullName(deleteDialog.owner)?.charAt(0)?.toUpperCase() || <PersonIcon fontSize="small" />}
            </Avatar>
            <Typography variant="h6">{getFullName(deleteDialog.owner)}</Typography>
          </Box>
          <DialogContentText>
            Bu hasta sahibini silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve hasta sahibine ait tüm bilgiler sistemden silinecektir.
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

export default OwnerList; 