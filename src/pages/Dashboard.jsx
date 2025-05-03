import { Box, Typography, Grid, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Hoş Geldiniz, {user?.username}
      </Typography>
      
      <Grid container spacing={3} className="mt-4">
        <Grid item xs={12} md={6} lg={4}>
          <Paper className="p-4 h-full" elevation={2}>
            <Typography variant="h6" component="h2" gutterBottom>
              Hızlı Erişim
            </Typography>
            <Typography variant="body2">
              Soldaki menüden sisteme ait modüllere erişebilirsiniz.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper className="p-4 h-full" elevation={2}>
            <Typography variant="h6" component="h2" gutterBottom>
              Yetki Seviyeniz
            </Typography>
            <Typography variant="body2">
              {user?.roles?.map(role => role.replace('ROLE_', '')).join(', ')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper className="p-4 h-full" elevation={2}>
            <Typography variant="h6" component="h2" gutterBottom>
              Destek
            </Typography>
            <Typography variant="body2">
              Teknik destek için IT departmanıyla iletişime geçin.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 