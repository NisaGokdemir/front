import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  PetsOutlined as PetsIcon,
  People as PeopleIcon,
  Bloodtype as BloodTypeIcon,
  Category as CategoryIcon,
  Vaccines as VaccineIcon,
  LocalHospital as MedicationIcon,
  LocalShipping as ShippingIcon,
  Warning as AllergyIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Receipt as ReceiptIcon,
  Medication as MedicineIcon,
  Animation as SpeciesIcon,
  AccountTree as FamilyIcon,
  Pets as BreedIcon
} from '@mui/icons-material';

const navItems = [
  { 
    title: 'Hasta Sahibi', 
    icon: <PeopleIcon />, 
    path: '/owners', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_RECEPTIONIST'] 
  },
  { 
    title: 'Kan Grubu', 
    icon: <BloodTypeIcon />, 
    path: '/blood-types', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Tür', 
    icon: <SpeciesIcon color="info" />, 
    path: '/species', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Familya', 
    icon: <FamilyIcon color="warning" />, 
    path: '/families', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Irk', 
    icon: <BreedIcon color="success" />, 
    path: '/breeds', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Hasta', 
    icon: <PetsIcon />, 
    path: '/patients', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_RECEPTIONIST'] 
  },
  { 
    title: 'Aşı', 
    icon: <VaccineIcon />, 
    path: '/vaccines', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Alerji', 
    icon: <AllergyIcon />, 
    path: '/allergies', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'İlaç', 
    icon: <MedicationIcon />, 
    path: '/medications', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Teslimat', 
    icon: <ShippingIcon />, 
    path: '/medication-batch', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Reçete', 
    icon: <ReceiptIcon />, 
    path: '/prescriptions', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
  { 
    title: 'Reçete Öğeleri', 
    icon: <MedicineIcon />, 
    path: '/prescription-items', 
    roles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN'] 
  },
];

const drawerWidth = 240;

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-end' : 'center',
            px: [1],
          }}
        >
          {open ? (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
                Vet Klinik
              </Typography>
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
        
        {user && (
          <Box sx={{ p: open ? 2 : 1, display: 'flex', flexDirection: open ? 'row' : 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: open ? 0 : 1 }}>
              {user.username && user.username[0].toUpperCase()}
            </Avatar>
            {open && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1">{user.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.roles && user.roles.map(role => role.replace('ROLE_', '')).join(', ')}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        <Divider />
        
        <List>
          {user && user.roles && navItems
            .filter(item => item.roles.some(role => user.roles.includes(role)))
            .map((item) => {
              if (item.path === '/species') {
                return (
                  <React.Fragment key={`category-${item.path}`}>
                    {open && (
                      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="bold">
                          Hayvan Kategorileri
                        </Typography>
                      </Box>
                    )}
                    <ListItem disablePadding>
                      <Tooltip title={open ? '' : item.title} placement="right">
                        <ListItemButton
                          selected={location.pathname === item.path}
                          onClick={() => navigate(item.path)}
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            borderLeft: location.pathname === item.path ? '4px solid' : '4px solid transparent',
                            borderColor: location.pathname === item.path 
                              ? (item.path === '/species' ? 'info.main' 
                                : item.path === '/families' ? 'warning.main' 
                                : item.path === '/breeds' ? 'success.main' 
                                : 'primary.main') 
                              : 'transparent',
                            bgcolor: location.pathname === item.path 
                              ? (item.path === '/species' ? 'rgba(3, 169, 244, 0.08)' 
                                : item.path === '/families' ? 'rgba(255, 152, 0, 0.08)' 
                                : item.path === '/breeds' ? 'rgba(76, 175, 80, 0.08)' 
                                : 'rgba(63, 81, 181, 0.08)') 
                              : 'transparent',
                            '&:hover': {
                              bgcolor: item.path === '/species' ? 'rgba(3, 169, 244, 0.04)' 
                                : item.path === '/families' ? 'rgba(255, 152, 0, 0.04)' 
                                : item.path === '/breeds' ? 'rgba(76, 175, 80, 0.04)' 
                                : 'rgba(63, 81, 181, 0.04)',
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  </React.Fragment>
                );
              }
              
              if (item.path === '/patients') {
                return (
                  <React.Fragment key={`medical-${item.path}`}>
                    {open && (
                      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="bold">
                          Hasta Yönetimi
                        </Typography>
                      </Box>
                    )}
                    <ListItem disablePadding>
                      <Tooltip title={open ? '' : item.title} placement="right">
                        <ListItemButton
                          selected={location.pathname === item.path}
                          onClick={() => navigate(item.path)}
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            borderLeft: location.pathname === item.path ? '4px solid' : '4px solid transparent',
                            borderColor: location.pathname === item.path 
                              ? (item.path === '/species' ? 'info.main' 
                                : item.path === '/families' ? 'warning.main' 
                                : item.path === '/breeds' ? 'success.main' 
                                : 'primary.main') 
                              : 'transparent',
                            bgcolor: location.pathname === item.path 
                              ? (item.path === '/species' ? 'rgba(3, 169, 244, 0.08)' 
                                : item.path === '/families' ? 'rgba(255, 152, 0, 0.08)' 
                                : item.path === '/breeds' ? 'rgba(76, 175, 80, 0.08)' 
                                : 'rgba(63, 81, 181, 0.08)') 
                              : 'transparent',
                            '&:hover': {
                              bgcolor: item.path === '/species' ? 'rgba(3, 169, 244, 0.04)' 
                                : item.path === '/families' ? 'rgba(255, 152, 0, 0.04)' 
                                : item.path === '/breeds' ? 'rgba(76, 175, 80, 0.04)' 
                                : 'rgba(63, 81, 181, 0.04)',
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  </React.Fragment>
                );
              }
              
              return (
                <ListItem key={item.path} disablePadding>
                  <Tooltip title={open ? '' : item.title} placement="right">
                    <ListItemButton
                      selected={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        borderLeft: location.pathname === item.path ? '4px solid' : '4px solid transparent',
                        borderColor: location.pathname === item.path 
                          ? (item.path === '/species' ? 'info.main' 
                            : item.path === '/families' ? 'warning.main' 
                            : item.path === '/breeds' ? 'success.main' 
                            : 'primary.main') 
                          : 'transparent',
                        bgcolor: location.pathname === item.path 
                          ? (item.path === '/species' ? 'rgba(3, 169, 244, 0.08)' 
                            : item.path === '/families' ? 'rgba(255, 152, 0, 0.08)' 
                            : item.path === '/breeds' ? 'rgba(76, 175, 80, 0.08)' 
                            : 'rgba(63, 81, 181, 0.08)') 
                          : 'transparent',
                        '&:hover': {
                          bgcolor: item.path === '/species' ? 'rgba(3, 169, 244, 0.04)' 
                            : item.path === '/families' ? 'rgba(255, 152, 0, 0.04)' 
                            : item.path === '/breeds' ? 'rgba(76, 175, 80, 0.04)' 
                            : 'rgba(63, 81, 181, 0.04)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
        </List>
        
        <Divider />
        
        <List>
          <ListItem disablePadding>
            <Tooltip title={open ? '' : 'Çıkış Yap'} placement="right">
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Çıkış Yap" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${open ? drawerWidth : 64}px)` }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar; 