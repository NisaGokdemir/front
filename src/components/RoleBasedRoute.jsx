import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, hasRole, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return hasRole(allowedRoles) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleBasedRoute; 