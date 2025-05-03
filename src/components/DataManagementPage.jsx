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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const DataManagementPage = ({ 
  title, 
  itemName, 
  fields,
  fetchItems,
  addItem,
  updateItem,
  deleteItem
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Bu fonksiyon gerçek uygulamada useEffect içinde API çağrısı yapacak
  const loadItems = async () => {
    try {
      // const data = await fetchItems();
      // setItems(data);
      
      // Şimdilik simülasyon amaçlı boş liste
      setItems([]);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true);
    } else {
      const emptyItem = {};
      fields.forEach(field => {
        emptyItem[field.name] = '';
      });
      setCurrentItem(emptyItem);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        // await updateItem(currentItem);
        // Simülasyon:
        setItems(prev => prev.map(item => 
          item.id === currentItem.id ? currentItem : item
        ));
      } else {
        // const added = await addItem(currentItem);
        // Simülasyon:
        setItems(prev => [...prev, { ...currentItem, id: Date.now() }]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Kayıt işlemi sırasında hata oluştu:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // await deleteItem(id);
      // Simülasyon:
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu:', error);
    }
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni {itemName} Ekle
        </Button>
      </Box>
      
      <Paper elevation={2} className="p-4">
        {items.length > 0 ? (
          <List>
            {items.map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText 
                    primary={item.name} 
                    secondary={item.description || null}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      color="primary" 
                      onClick={() => handleOpenDialog(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      color="error" 
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body1" className="text-center py-4">
            Henüz kayıtlı {itemName.toLowerCase()} bulunmamaktadır.
          </Typography>
        )}
      </Paper>
      
      {/* Ekleme/Düzenleme İletişim Kutusu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? `${itemName} Düzenle` : `Yeni ${itemName} Ekle`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((field) => (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                fullWidth
                multiline={field.multiline}
                rows={field.multiline ? 3 : 1}
                value={currentItem[field.name] || ''}
                onChange={handleInputChange}
              />
            ))}
          </Box>
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

export default DataManagementPage; 