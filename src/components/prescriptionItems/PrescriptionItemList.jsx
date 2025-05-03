import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

const PrescriptionItemList = ({ prescriptionItems, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPrescriptionItem, setSelectedPrescriptionItem] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOpen = (prescriptionItem) => {
    setSelectedPrescriptionItem(prescriptionItem);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedPrescriptionItem(null);
  };

  const handleDeleteOpen = (prescriptionItem) => {
    setSelectedPrescriptionItem(prescriptionItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPrescriptionItem(null);
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedPrescriptionItem.id);
    setDeleteDialogOpen(false);
    setSelectedPrescriptionItem(null);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - prescriptionItems.length) : 0;

  if (prescriptionItems.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">Henüz reçete öğesi bulunmamaktadır</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table aria-label="reçete öğeleri listesi">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hasta</TableCell>
              <TableCell>İlaç</TableCell>
              <TableCell>Günlük Doz</TableCell>
              <TableCell>Süre (Gün)</TableCell>
              <TableCell>Miktar</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? prescriptionItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : prescriptionItems
            ).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {item.prescription?.diagnosis?.patient?.name || 'Bilinmiyor'}
                </TableCell>
                <TableCell>
                  {item.medication?.name || 'Bilinmiyor'}
                </TableCell>
                <TableCell>
                  {item.dailyDose}
                </TableCell>
                <TableCell>
                  {item.durationDays}
                </TableCell>
                <TableCell>
                  {item.totalAmount}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Detayları Görüntüle">
                    <IconButton
                      color="info"
                      onClick={() => handleViewOpen(item)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Düzenle">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(item)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteOpen(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'Tümü', value: -1 }]}
        component="div"
        count={prescriptionItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Sayfa başına satır:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / ${count !== -1 ? count : `${to} üzerinden`}`
        }
      />

      {/* Detay Görüntüleme Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewClose} maxWidth="md">
        <DialogTitle>Reçete Öğesi Detayları</DialogTitle>
        <DialogContent>
          {selectedPrescriptionItem && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                ID: {selectedPrescriptionItem.id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Hasta: {selectedPrescriptionItem.prescription?.diagnosis?.patient?.name || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Sahibi: {selectedPrescriptionItem.prescription?.diagnosis?.patient?.owner?.fullName || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Reçete Notları: {selectedPrescriptionItem.prescription?.notes || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                İlaç: {selectedPrescriptionItem.medication?.name || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Birim: {selectedPrescriptionItem.medication?.unit || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Günlük Doz: {selectedPrescriptionItem.dailyDose}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tedavi Süresi: {selectedPrescriptionItem.durationDays} gün
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Toplam Miktar: {selectedPrescriptionItem.totalAmount}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tanı: {selectedPrescriptionItem.prescription?.diagnosis?.diagnosis || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tedavi Planı: {selectedPrescriptionItem.prescription?.diagnosis?.treatmentPlan || 'Bilinmiyor'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Silme Onay Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Reçete Öğesini Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu reçete öğesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

PrescriptionItemList.propTypes = {
  prescriptionItems: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PrescriptionItemList; 