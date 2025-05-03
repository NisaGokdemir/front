import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  useTheme,
  Divider,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Dialog
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  EditOutlined as EditIcon,
  Pets as PetsIcon,
  Scale as ScaleIcon,
  Numbers as NumbersIcon,
  Bloodtype as BloodTypeIcon,
  Cake as CakeIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useEffect as useEffectHook } from 'react';
import ownerService from '../../services/ownerService';
import speciesService from '../../services/speciesService';
import breedService from '../../services/breedService';
import bloodTypeService from '../../services/bloodTypeService';

const PatientForm = ({ mode, patient, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    chipNumber: '',
    bloodTypeId: '',
    ownerId: '',
    speciesId: '',
    breedId: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [owners, setOwners] = useState([]);
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [filteredBloodTypes, setFilteredBloodTypes] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Hasta sahibi ekleme için state'ler
  const [openOwnerDialog, setOpenOwnerDialog] = useState(false);
  const [ownerFormData, setOwnerFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [ownerFormErrors, setOwnerFormErrors] = useState({});
  const [ownerLoading, setOwnerLoading] = useState(false);

  // Form verilerini yükle
  useEffect(() => {
    if (mode === 'edit' && patient) {
      setFormData({
        name: patient.name || '',
        age: patient.age || '',
        weight: patient.weight || '',
        chipNumber: patient.chipNumber || '',
        bloodTypeId: patient.bloodType?.id || '',
        ownerId: patient.owner?.id || '',
        speciesId: patient.species?.id || '',
        breedId: patient.breed?.id || ''
      });
    }
  }, [mode, patient]);

  // Referans verilerini yükle
  useEffect(() => {
    const fetchReferenceData = async () => {
      setDataLoading(true);
      try {
        const [ownersRes, speciesRes, breedsRes, bloodTypesRes] = await Promise.all([
          ownerService.getOwners(0, 100),
          speciesService.getSpecies(0, 100),
          breedService.getBreeds(0, 100),
          bloodTypeService.getBloodTypes(0, 100)
        ]);
        
        setOwners(ownersRes.content || []);
        setSpecies(speciesRes.content || []);
        setBreeds(breedsRes.content || []);
        setBloodTypes(bloodTypesRes.content || []);
      } catch (error) {
        console.error('Referans verileri yüklenirken hata oluştu:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchReferenceData();
  }, []);

  // Seçilen türe göre ırkları filtrele
  useEffect(() => {
    if (formData.speciesId) {
      const filtered = breeds.filter(breed => breed.species?.id === parseInt(formData.speciesId));
      setFilteredBreeds(filtered);
      
      // Tür değiştiğinde seçili ırkı sıfırla
      if (mode !== 'edit' || (mode === 'edit' && patient?.species?.id !== parseInt(formData.speciesId))) {
        setFormData(prev => ({ ...prev, breedId: '' }));
      }
      
      // Kan gruplarını filtrele
      const filteredBT = bloodTypes.filter(bt => bt.species?.id === parseInt(formData.speciesId));
      setFilteredBloodTypes(filteredBT);
      
      // Tür değiştiğinde seçili kan grubunu sıfırla
      if (mode !== 'edit' || (mode === 'edit' && patient?.species?.id !== parseInt(formData.speciesId))) {
        setFormData(prev => ({ ...prev, bloodTypeId: '' }));
      }
    } else {
      setFilteredBreeds([]);
      setFilteredBloodTypes([]);
    }
  }, [formData.speciesId, breeds, bloodTypes, mode, patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Anlık doğrulama
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          setFormErrors(prev => ({ ...prev, name: 'Hasta adı boş olamaz' }));
        } else {
          setFormErrors(prev => ({ ...prev, name: null }));
        }
        break;
      case 'age':
        if (value === '') {
          setFormErrors(prev => ({ ...prev, age: 'Yaş boş olamaz' }));
        } else if (isNaN(value) || parseInt(value) < 0) {
          setFormErrors(prev => ({ ...prev, age: 'Geçerli bir yaş girin' }));
        } else {
          setFormErrors(prev => ({ ...prev, age: null }));
        }
        break;
      case 'weight':
        if (value === '') {
          setFormErrors(prev => ({ ...prev, weight: 'Ağırlık boş olamaz' }));
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          setFormErrors(prev => ({ ...prev, weight: 'Geçerli bir ağırlık girin' }));
        } else {
          setFormErrors(prev => ({ ...prev, weight: null }));
        }
        break;
      case 'chipNumber':
        if (!value.trim()) {
          setFormErrors(prev => ({ ...prev, chipNumber: 'Çip numarası boş olamaz' }));
        } else {
          setFormErrors(prev => ({ ...prev, chipNumber: null }));
        }
        break;
      case 'ownerId':
        if (!value) {
          setFormErrors(prev => ({ ...prev, ownerId: 'Hasta sahibi seçilmelidir' }));
        } else {
          setFormErrors(prev => ({ ...prev, ownerId: null }));
        }
        break;
      case 'speciesId':
        if (!value) {
          setFormErrors(prev => ({ ...prev, speciesId: 'Tür seçilmelidir' }));
        } else {
          setFormErrors(prev => ({ ...prev, speciesId: null }));
        }
        break;
      case 'breedId':
        if (!value) {
          setFormErrors(prev => ({ ...prev, breedId: 'Irk seçilmelidir' }));
        } else {
          setFormErrors(prev => ({ ...prev, breedId: null }));
        }
        break;
      case 'bloodTypeId':
        if (!value) {
          setFormErrors(prev => ({ ...prev, bloodTypeId: 'Kan grubu seçilmelidir' }));
        } else {
          setFormErrors(prev => ({ ...prev, bloodTypeId: null }));
        }
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
    });

    return !Object.keys(formErrors).some(key => formErrors[key]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submittingData = {
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        bloodTypeId: parseInt(formData.bloodTypeId),
        ownerId: parseInt(formData.ownerId),
        speciesId: parseInt(formData.speciesId),
        breedId: parseInt(formData.breedId)
      };
      
      onSubmit(submittingData);
    }
  };

  // Hasta sahibi ekleme için fonksiyonlar
  const handleOpenOwnerDialog = () => {
    setOpenOwnerDialog(true);
  };

  const handleCloseOwnerDialog = () => {
    setOpenOwnerDialog(false);
    setOwnerFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: ''
    });
    setOwnerFormErrors({});
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Anlık doğrulama
    if (name === 'firstName' && !value.trim()) {
      setOwnerFormErrors(prev => ({ ...prev, firstName: 'Ad boş olamaz' }));
    } else if (name === 'lastName' && !value.trim()) {
      setOwnerFormErrors(prev => ({ ...prev, lastName: 'Soyad boş olamaz' }));
    } else if (name === 'phone' && !value.trim()) {
      setOwnerFormErrors(prev => ({ ...prev, phone: 'Telefon numarası boş olamaz' }));
    } else if (name === 'phone' && !/^(05)([0-9]{9})$/.test(value)) {
      setOwnerFormErrors(prev => ({ ...prev, phone: 'Geçerli bir Türkiye telefon numarası girin (05xxxxxxxxx)' }));
    } else if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      setOwnerFormErrors(prev => ({ ...prev, email: 'Geçerli bir e-posta adresi girin' }));
    } else {
      setOwnerFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateOwnerForm = () => {
    const errors = {};
    let isValid = true;

    if (!ownerFormData.firstName.trim()) {
      errors.firstName = 'Ad boş olamaz';
      isValid = false;
    }

    if (!ownerFormData.lastName.trim()) {
      errors.lastName = 'Soyad boş olamaz';
      isValid = false;
    }

    if (!ownerFormData.phone.trim()) {
      errors.phone = 'Telefon numarası boş olamaz';
      isValid = false;
    } else if (!/^(05)([0-9]{9})$/.test(ownerFormData.phone)) {
      errors.phone = 'Geçerli bir Türkiye telefon numarası girin (05xxxxxxxxx)';
      isValid = false;
    }

    if (ownerFormData.email && !/\S+@\S+\.\S+/.test(ownerFormData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
      isValid = false;
    }

    setOwnerFormErrors(errors);
    return isValid;
  };

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOwnerForm()) {
      return;
    }
    
    // Form verilerini göster, sorunları tespit etmek için
    console.log('Gönderilen hasta sahibi verisi:', ownerFormData);
    
    // Soyad alanında boşluk karakterleri varsa temizleyelim
    const processedData = {
      ...ownerFormData,
      lastName: ownerFormData.lastName.trim()
    };
    
    setOwnerLoading(true);
    try {
      const newOwner = await ownerService.createOwner(processedData);
      console.log('Backend yanıtı:', newOwner);
      
      // Yeni hasta sahibini listeye ekle ve seç
      setOwners(prev => [...prev, newOwner]);
      setFormData(prev => ({
        ...prev,
        ownerId: newOwner.id.toString()
      }));
      
      handleCloseOwnerDialog();
      
      // Hata varsa temizle
      setFormErrors(prev => ({ ...prev, ownerId: null }));
      
    } catch (error) {
      console.error('Hasta sahibi eklenirken hata oluştu:', error);
      // Hata mesajını kontrol edelim ve özelleştirelim
      let errorMessage = error.message || 'Hasta sahibi eklenirken bir hata oluştu';
      
      // Eğer hata "soyad boş olamaz" ile ilgiliyse, daha belirgin hata mesajı gösterelim
      if (errorMessage.includes('Soyad boş olamaz') || errorMessage.toLowerCase().includes('lastname')) {
        errorMessage = 'Soyad alanı boş olamaz. Lütfen geçerli bir soyad girin.';
        setOwnerFormErrors(prev => ({ ...prev, lastName: 'Soyad boş olamaz' }));
      }
      
      setOwnerFormErrors(prev => ({ 
        ...prev, 
        submit: errorMessage
      }));
    } finally {
      setOwnerLoading(false);
    }
  };

  return (
    <>
      <DialogTitle sx={{ 
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 0
      }}>
        {mode === 'add' ? <AddIcon /> : <EditIcon />}
        {mode === 'add' ? 'Yeni Hasta Ekle' : 'Hastayı Düzenle'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                name="name"
                label="Hasta Adı"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading || dataLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PetsIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="chipNumber"
                label="Çip Numarası"
                fullWidth
                required
                value={formData.chipNumber}
                onChange={handleChange}
                error={!!formErrors.chipNumber}
                helperText={formErrors.chipNumber}
                disabled={loading || dataLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="age"
                label="Yaş"
                type="number"
                fullWidth
                required
                value={formData.age}
                onChange={handleChange}
                error={!!formErrors.age}
                helperText={formErrors.age}
                disabled={loading || dataLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="weight"
                label="Ağırlık (kg)"
                type="number"
                fullWidth
                required
                value={formData.weight}
                onChange={handleChange}
                error={!!formErrors.weight}
                helperText={formErrors.weight}
                disabled={loading || dataLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScaleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                <FormControl 
                  fullWidth 
                  error={!!formErrors.ownerId}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
                  <InputLabel id="owner-label">Hasta Sahibi *</InputLabel>
                  <Select
                    labelId="owner-label"
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleChange}
                    label="Hasta Sahibi *"
                    required
                    disabled={loading || dataLoading}
                  >
                    <MenuItem value="" disabled>Hasta sahibi seçin</MenuItem>
                    {owners.map(owner => (
                      <MenuItem key={owner.id} value={owner.id.toString()}>
                        {owner.fullName} - {owner.phone}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.ownerId && <FormHelperText>{formErrors.ownerId}</FormHelperText>}
                </FormControl>
                
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOpenOwnerDialog}
                  disabled={loading || dataLoading}
                  startIcon={<PersonAddIcon />}
                  sx={{ 
                    minWidth: '120px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Yeni Ekle
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!formErrors.speciesId}
                disabled={loading || dataLoading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="species-label">Tür</InputLabel>
                <Select
                  labelId="species-label"
                  name="speciesId"
                  value={formData.speciesId}
                  onChange={handleChange}
                  label="Tür"
                >
                  {species.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.speciesId && <FormHelperText>{formErrors.speciesId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!formErrors.breedId}
                disabled={loading || dataLoading || !formData.speciesId}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="breed-label">Irk</InputLabel>
                <Select
                  labelId="breed-label"
                  name="breedId"
                  value={formData.breedId}
                  onChange={handleChange}
                  label="Irk"
                >
                  {filteredBreeds.map((breed) => (
                    <MenuItem key={breed.id} value={breed.id}>
                      {breed.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.breedId && <FormHelperText>{formErrors.breedId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!formErrors.bloodTypeId}
                disabled={loading || dataLoading || !formData.speciesId}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <InputLabel id="bloodType-label">Kan Grubu</InputLabel>
                <Select
                  labelId="bloodType-label"
                  name="bloodTypeId"
                  value={formData.bloodTypeId}
                  onChange={handleChange}
                  label="Kan Grubu"
                  startAdornment={
                    <InputAdornment position="start">
                      <BloodTypeIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {filteredBloodTypes.map((bt) => (
                    <MenuItem key={bt.id} value={bt.id}>
                      {bt.type}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.bloodTypeId && <FormHelperText>{formErrors.bloodTypeId}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
          
          {(loading || dataLoading) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          
          {Object.keys(formErrors).some(key => formErrors[key]) && (
            <Box mt={2}>
              <Alert 
                severity="error"
                variant="filled"
                sx={{ borderRadius: '8px' }}
              >
                Lütfen form hatalarını düzeltin
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={onCancel} 
            disabled={loading || dataLoading}
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || dataLoading || Object.keys(formErrors).some(key => formErrors[key])}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ 
              borderRadius: '8px',
              px: 3,
              boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
            }}
          >
            {loading ? 'Kaydediliyor...' : mode === 'add' ? 'Ekle' : 'Güncelle'}
          </Button>
        </DialogActions>
      </form>
      
      {/* Yeni Hasta Sahibi Ekleme Dialog'u */}
      <Dialog 
        open={openOwnerDialog} 
        onClose={handleCloseOwnerDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PersonAddIcon />
          Yeni Hasta Sahibi Ekle
        </DialogTitle>
        
        <form onSubmit={handleOwnerSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  name="firstName"
                  label="Ad"
                  fullWidth
                  required
                  value={ownerFormData.firstName}
                  onChange={handleOwnerChange}
                  error={!!ownerFormErrors.firstName}
                  helperText={ownerFormErrors.firstName}
                  disabled={ownerLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Soyad"
                  fullWidth
                  required
                  value={ownerFormData.lastName}
                  onChange={handleOwnerChange}
                  error={!!ownerFormErrors.lastName}
                  helperText={ownerFormErrors.lastName}
                  disabled={ownerLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="phone"
                  label="Telefon"
                  fullWidth
                  required
                  placeholder="05xxxxxxxxx"
                  value={ownerFormData.phone}
                  onChange={handleOwnerChange}
                  error={!!ownerFormErrors.phone}
                  helperText={ownerFormErrors.phone}
                  disabled={ownerLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="E-posta"
                  type="email"
                  fullWidth
                  value={ownerFormData.email}
                  onChange={handleOwnerChange}
                  error={!!ownerFormErrors.email}
                  helperText={ownerFormErrors.email}
                  disabled={ownerLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Adres"
                  fullWidth
                  multiline
                  rows={2}
                  value={ownerFormData.address}
                  onChange={handleOwnerChange}
                  disabled={ownerLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
            </Grid>
            
            {ownerFormErrors.submit && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {ownerFormErrors.submit}
              </Alert>
            )}
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleCloseOwnerDialog} 
              disabled={ownerLoading}
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={ownerLoading || Object.values(ownerFormErrors).some(error => error)}
              startIcon={ownerLoading ? <CircularProgress size={20} /> : null}
              sx={{ 
                borderRadius: '8px',
                px: 3,
                boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)'
              }}
            >
              {ownerLoading ? 'Kaydediliyor...' : 'Ekle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PatientForm; 