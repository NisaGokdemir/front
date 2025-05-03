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
  Collapse
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Pets as PetsIcon,
  AddCircle as AddCircleIcon,
  MedicalServices as MedicalIcon,
  FormatListBulleted as ListIcon
} from '@mui/icons-material';

const PatientList = ({ patients, onEdit, onDelete, onAddDiagnosis, onViewDiagnoses, loading }) => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, patient: null });

  const handleOpenDeleteDialog = (patient) => {
    setDeleteDialog({ open: true, patient });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, patient: null });
  };

  const confirmDelete = () => {
    if (deleteDialog.patient) {
      onDelete(deleteDialog.patient.id);
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
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Hasta</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Detaylar</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Türü / Irkı</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Sahibi</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2.5 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    Kayıtlı hasta bulunamadı
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow 
                  key={patient.id} 
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
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          width: 40, 
                          height: 40 
                        }}
                      >
                        <PetsIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {patient.name}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={`ID: ${patient.id}`} 
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
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2">
                        Yaş: {patient.age}
                      </Typography>
                      <Typography variant="body2">
                        Ağırlık: {patient.weight} kg
                      </Typography>
                      <Typography variant="body2">
                        Çip No: {patient.chipNumber}
                      </Typography>
                      <Typography variant="body2">
                        Kan Grubu: {patient.bloodType?.type || '-'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Chip 
                        label={patient.species?.name || '-'} 
                        size="small"
                        sx={{ 
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {patient.breed?.name || '-'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {patient.owner?.fullName || '-'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.owner?.phone || '-'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {onViewDiagnoses && (
                      <Tooltip title="Tanıları Görüntüle">
                        <IconButton 
                          onClick={() => onViewDiagnoses(patient)} 
                          disabled={loading}
                          color="info"
                          size="small"
                          sx={{ 
                            mr: 1,
                            backgroundColor: 'rgba(3, 169, 244, 0.08)',
                            '&:hover': {
                              backgroundColor: 'rgba(3, 169, 244, 0.15)',
                            }
                          }}
                        >
                          <ListIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onAddDiagnosis && (
                      <Tooltip title="Tanı Ekle">
                        <IconButton 
                          onClick={() => onAddDiagnosis(patient.id)} 
                          disabled={loading}
                          color="success"
                          size="small"
                          sx={{ 
                            mr: 1,
                            backgroundColor: 'rgba(76, 175, 80, 0.08)',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.15)',
                            }
                          }}
                        >
                          <MedicalIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Düzenle">
                      <IconButton 
                        onClick={() => onEdit(patient)} 
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
                        onClick={() => handleOpenDeleteDialog(patient)} 
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
              ))
            )}
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
          Hastayı Sil
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
              <PetsIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{deleteDialog.patient?.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {deleteDialog.patient?.species?.name} - {deleteDialog.patient?.breed?.name}
              </Typography>
            </Box>
          </Box>
          <DialogContentText>
            Bu hastayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve hastaya ait tüm bilgiler sistemden silinecektir.
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

export default PatientList; 