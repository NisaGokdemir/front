import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
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
  Visibility as ViewIcon,
  MedicalServices as MedicationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PrescriptionList = ({ prescriptions, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOpen = (prescription) => {
    setSelectedPrescription(prescription);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedPrescription(null);
  };

  const handleDeleteOpen = (prescription) => {
    setSelectedPrescription(prescription);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPrescription(null);
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedPrescription.id);
    setDeleteDialogOpen(false);
    setSelectedPrescription(null);
  };

  const navigateToPrescriptionItems = (prescriptionId) => {
    navigate(`/prescription-items/${prescriptionId}`);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - prescriptions.length) : 0;

  if (prescriptions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">Henüz reçete bulunmamaktadır</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table aria-label="reçete listesi">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hasta</TableCell>
              <TableCell>Tanı</TableCell>
              <TableCell>Notlar</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? prescriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : prescriptions
            ).map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.id}</TableCell>
                <TableCell>
                  {prescription.diagnosis?.patient?.name || 'Bilinmiyor'}
                </TableCell>
                <TableCell>
                  {prescription.diagnosis?.diagnosis || 'Bilinmiyor'}
                </TableCell>
                <TableCell>
                  {prescription.notes}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Reçete Öğelerini Görüntüle">
                    <IconButton
                      color="secondary"
                      onClick={() => navigateToPrescriptionItems(prescription.id)}
                    >
                      <MedicationIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Detayları Görüntüle">
                    <IconButton
                      color="info"
                      onClick={() => handleViewOpen(prescription)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Düzenle">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(prescription)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteOpen(prescription)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'Tümü', value: -1 }]}
        component="div"
        count={prescriptions.length}
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
        <DialogTitle>Reçete Detayları</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Reçete ID: {selectedPrescription.id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Hasta: {selectedPrescription.diagnosis?.patient?.name || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Sahibi: {selectedPrescription.diagnosis?.patient?.owner?.fullName || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tür: {selectedPrescription.diagnosis?.patient?.species?.name || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Irk: {selectedPrescription.diagnosis?.patient?.breed?.name || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tanı: {selectedPrescription.diagnosis?.diagnosis || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tedavi Planı: {selectedPrescription.diagnosis?.treatmentPlan || 'Bilinmiyor'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Reçete Notları: {selectedPrescription.notes}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Veteriner: {selectedPrescription.diagnosis?.vet?.username || 'Bilinmiyor'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  startIcon={<MedicationIcon />}
                  onClick={() => {
                    handleViewClose();
                    navigateToPrescriptionItems(selectedPrescription.id);
                  }}
                >
                  Reçete Öğelerini Görüntüle
                </Button>
              </Box>
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
        <DialogTitle>Reçeteyi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu reçeteyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

PrescriptionList.propTypes = {
  prescriptions: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PrescriptionList; 