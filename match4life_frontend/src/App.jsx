import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import RegisterDonor from './pages/auth/RegisterDonor';
import RegisterHospital from './pages/auth/RegisterHospital';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorProfile from './pages/donor/DonorProfile';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import CreateRequest from './pages/hospital/CreateRequest';
import RequestDetails from './pages/hospital/RequestDetails';

// Admin Redirector
const AdminRedirect = () => {
  window.location.href = 'http://127.0.0.1:8000/admin/';
  return <div>Redirecting to Django Admin...</div>;
};

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, userType, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && userType !== allowedRole) return <Navigate to="/" replace />;
  
  return children;
};

// Home Redirector
const Home = () => {
  const { user, userType, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (userType === 'donor') return <Navigate to="/donor/dashboard" replace />;
  if (userType === 'hospital') return <Navigate to="/hospital/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/donor" element={<RegisterDonor />} />
          <Route path="/register/hospital" element={<RegisterHospital />} />
          <Route path="/admin" element={<AdminRedirect />} />
          
          {/* Donor Routes */}
          <Route 
            path="/donor/dashboard" 
            element={
              <ProtectedRoute allowedRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donor/profile" 
            element={
              <ProtectedRoute allowedRole="donor">
                <DonorProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Hospital Routes */}
          <Route 
            path="/hospital/dashboard" 
            element={
              <ProtectedRoute allowedRole="hospital">
                <HospitalDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hospital/requests/create" 
            element={
              <ProtectedRoute allowedRole="hospital">
                <CreateRequest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hospital/requests/:id" 
            element={
              <ProtectedRoute allowedRole="hospital">
                <RequestDetails />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
