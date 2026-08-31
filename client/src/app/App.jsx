import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import Login from '../features/auth/Login';
import Layout from '../shared/components/Layout';

// Dashboards
import AdminDashboard from '../features/dashboards/AdminDashboard';
import ShopDashboard from '../features/dashboards/ShopDashboard';
import MasterDashboard from '../features/dashboards/MasterDashboard';
import TailorDashboard from '../features/dashboards/TailorDashboard';
import DeliveryDashboard from '../features/dashboards/DeliveryDashboard';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Role-based Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/shop/*" element={
          <ProtectedRoute allowedRoles={['SHOP', 'SUPER_ADMIN']}><ShopDashboard /></ProtectedRoute>
        } />
        <Route path="/master/*" element={
          <ProtectedRoute allowedRoles={['MASTER', 'SUPER_ADMIN']}><MasterDashboard /></ProtectedRoute>
        } />
        <Route path="/tailor/*" element={
          <ProtectedRoute allowedRoles={['TAILOR', 'SUPER_ADMIN']}><TailorDashboard /></ProtectedRoute>
        } />
        <Route path="/delivery/*" element={
          <ProtectedRoute allowedRoles={['DELIVERY_BOY', 'SUPER_ADMIN']}><DeliveryDashboard /></ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<div className="p-12 text-center text-red-600 font-bold text-2xl">Unauthorized Access</div>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
