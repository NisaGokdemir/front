import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box 
      className="min-h-screen flex flex-col items-center justify-center"
      sx={{ bgcolor: 'background.default' }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Yetkisiz Erişim
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bu sayfaya erişim yetkiniz bulunmamaktadır.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => navigate('/dashboard')}
        className="mt-4"
      >
        Ana Sayfaya Dön
      </Button>
    </Box>
  );
};

export default Unauthorized; 