import { MedicalServices as MedicationIcon } from '@mui/icons-material';

const menuItems = [
  {
    title: 'İlaç Yönetimi',
    icon: <MedicationIcon />,
    path: '/medications',
    allowedRoles: ['ROLE_ADMIN', 'ROLE_VETERINARIAN']
  },
]; 