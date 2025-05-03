import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MedicationBatchPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [batches, setBatches] = useState([]);
  const [medications, setMedications] = useState([]); // İlaç listesi
  const [currentBatch, setCurrentBatch] = useState({
    medicationId: '',
    batchNumber: '',
    quantity: '',
    expiryDate: '',
    receiveDate: new Date().toISOString().split('T')[0],
    supplier: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenDialog = (batch = null) => {
    if (batch) {
      setCurrentBatch({
        ...batch,
        expiryDate: batch.expiryDate.split('T')[0],
        receiveDate: batch.receiveDate.split('T')[0]
      });
      setIsEditing(true);
    } else {
      setCurrentBatch({
        medicationId: '',
        batchNumber: '',
        quantity: '',
        expiryDate: '',
        receiveDate: new Date().toISOString().split('T')[0],
        supplier: ''
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBatch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Burada API çağrısı yapılacak
    console.log('İlaç partisi ekleniyor/güncelleniyor:', currentBatch);
    // Örnek simülasyon:
    if (isEditing) {
      setBatches(prev => prev.map(batch => 
        batch.id === currentBatch.id ? currentBatch : batch
      ));
    } else {
      setBatches(prev => [...prev, { ...currentBatch, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // Silme işlemi API çağrısı
    console.log('İlaç partisi siliniyor:', id);
    // Simülasyon:
    setBatches(prev => prev.filter(batch => batch.id !== id));
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">
          İlaç Teslimatları
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Teslimat Ekle
        </Button>
      </Box>
      
      <Paper elevation={2} className="p-4">
        {batches.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>İlaç</TableCell>
                  <TableCell>Parti No</TableCell>
                  <TableCell>Miktar</TableCell>
                  <TableCell>Son Kullanma</TableCell>
                  <TableCell>Tedarikçi</TableCell>
                  <TableCell>Teslim Tarihi</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>{medications.find(m => m.id === batch.medicationId)?.name || 'Bilinmeyen İlaç'}</TableCell>
                    <TableCell>{batch.batchNumber}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>{new Date(batch.expiryDate).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>{batch.supplier}</TableCell>
                    <TableCell>{new Date(batch.receiveDate).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleOpenDialog(batch)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(batch.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" className="text-center py-4">
            Henüz kayıtlı ilaç teslimatı bulunmamaktadır.
          </Typography>
        )}
      </Paper>
      
      {/* Ekleme/Düzenleme İletişim Kutusu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'İlaç Teslimatı Düzenle' : 'Yeni İlaç Teslimatı Ekle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mt-1">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="medication-label">İlaç</InputLabel>
                <Select
                  labelId="medication-label"
                  name="medicationId"
                  value={currentBatch.medicationId}
                  onChange={handleInputChange}
                  label="İlaç"
                >
                  {medications.map(medication => (
                    <MenuItem key={medication.id} value={medication.id}>
                      {medication.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="batchNumber"
                label="Parti Numarası"
                fullWidth
                value={currentBatch.batchNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="Miktar"
                type="number"
                fullWidth
                value={currentBatch.quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="supplier"
                label="Tedarikçi"
                fullWidth
                value={currentBatch.supplier}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="receiveDate"
                label="Teslim Tarihi"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentBatch.receiveDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="expiryDate"
                label="Son Kullanma Tarihi"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentBatch.expiryDate}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationBatchPage; 