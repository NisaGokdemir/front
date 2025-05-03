import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBasedRoute from '../components/RoleBasedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Unauthorized from '../pages/Unauthorized';
import PatientPage from '../pages/PatientPage';
import OwnerPage from '../pages/OwnerPage';
import BloodTypePage from '../pages/BloodTypePage';
import SpeciesPage from '../pages/SpeciesPage';
import BreedPage from '../pages/BreedPage';
import FamilyPage from '../pages/FamilyPage';
import VaccinePage from '../pages/VaccinePage';
import AllergyPage from '../pages/AllergyPage';
import MedicationPage from '../pages/MedicationPage';
import MedicationBatchPage from '../pages/MedicationBatchPage';
import PrescriptionPage from '../pages/PrescriptionPage';
import PrescriptionItemPage from '../pages/PrescriptionItemPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        
        {/* Receptionist, Veterinarian, Admin Routes */}
        <Route
          element={
            <RoleBasedRoute 
              allowedRoles={['ROLE_ADMIN', 'ROLE_VETERINARIAN', 'ROLE_RECEPTIONIST']} 
            />
          }
        >
          <Route
            path="/patients"
            element={
              <Layout>
                <PatientPage />
              </Layout>
            }
          />
          <Route
            path="/owners"
            element={
              <Layout>
                <OwnerPage />
              </Layout>
            }
          />
        </Route>
        
        {/* Veterinarian, Admin Routes */}
        <Route
          element={
            <RoleBasedRoute 
              allowedRoles={['ROLE_ADMIN', 'ROLE_VETERINARIAN']} 
            />
          }
        >
          <Route
            path="/blood-types"
            element={
              <Layout>
                <BloodTypePage />
              </Layout>
            }
          />
          <Route
            path="/species"
            element={
              <Layout>
                <SpeciesPage />
              </Layout>
            }
          />
          <Route
            path="/families"
            element={
              <Layout>
                <FamilyPage />
              </Layout>
            }
          />
          <Route
            path="/breeds"
            element={
              <Layout>
                <BreedPage />
              </Layout>
            }
          />
          <Route
            path="/vaccines"
            element={
              <Layout>
                <VaccinePage />
              </Layout>
            }
          />
          <Route
            path="/allergies"
            element={
              <Layout>
                <AllergyPage />
              </Layout>
            }
          />
          <Route
            path="/medications"
            element={
              <Layout>
                <MedicationPage />
              </Layout>
            }
          />
          <Route
            path="/medication-batch"
            element={
              <Layout>
                <MedicationBatchPage />
              </Layout>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <Layout>
                <PrescriptionPage />
              </Layout>
            }
          />
          <Route
            path="/prescription-items"
            element={
              <Layout>
                <PrescriptionItemPage />
              </Layout>
            }
          />
          <Route
            path="/prescription-items/:id"
            element={
              <Layout>
                <PrescriptionItemPage />
              </Layout>
            }
          />
        </Route>
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 