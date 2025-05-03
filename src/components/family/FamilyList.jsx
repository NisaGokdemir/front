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
  TableSortLabel,
  Box,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const FamilyList = ({ families, onEdit, onDelete, loading }) => {
  const theme = useTheme();
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteClick = (family) => {
    setFamilyToDelete(family);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (familyToDelete) {
      onDelete(familyToDelete.id);
      setDeleteConfirmOpen(false);
      setFamilyToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setFamilyToDelete(null);
  };

  // Sıralama fonksiyonu
  const sortedFamilies = families.slice().sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'name') {
      return isAsc
        ? a.name.localeCompare(b.name, 'tr')
        : b.name.localeCompare(a.name, 'tr');
    }
    return 0;
  });

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'background.paper' 
                  : 'grey.50' 
              }}
            >
              <TableCell
                sortDirection={orderBy === 'name' ? order : false}
                sx={{ fontWeight: 'bold' }}
              >
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Familya Adı
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Yükleniyor durumu
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton animation="wave" height={40} /></TableCell>
                  <TableCell align="right"><Skeleton animation="wave" height={40} /></TableCell>
                </TableRow>
              ))
            ) : sortedFamilies.length === 0 ? (
              // Veri yok durumu
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <CategoryIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    <Typography variant="body1" color="text.secondary">
                      Henüz kayıtlı familya bulunmuyor.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              // Veri listesi
              sortedFamilies.map((family) => (
                <TableRow
                  key={family.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'action.hover' },
                    transition: 'background-color 0.3s'
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CategoryIcon color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="body2">{family.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Düzenle">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(family)}
                          sx={{
                            backgroundColor: 'rgba(63, 81, 181, 0.08)',
                            '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.16)' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(family)}
                          sx={{
                            backgroundColor: 'rgba(211, 47, 47, 0.08)',
                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.16)' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Silme Onay Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '12px'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteIcon color="error" />
            <Typography variant="h6">Familya Sil</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" gutterBottom>
              <b>{familyToDelete?.name}</b> adlı familyayı silmek istediğinize emin misiniz?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bu işlem geri alınamaz ve familyaya bağlı türler etkilenebilir.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined" 
            color="primary"
            sx={{ borderRadius: '8px' }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            sx={{ 
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(211, 47, 47, 0.25)'
            }}
          >
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FamilyList; 