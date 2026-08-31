import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DeliveryDashboard from './pages/DeliveryDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ShopDashboard from './pages/ShopDashboard';
import MasterDashboard from './pages/MasterDashboard';
import TailorDashboard from './pages/TailorDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  
  return children;
};

// Global Layout with Topbar
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {user && (
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>LORD'S ERP</h2>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent-color)', fontWeight: 500, padding: '0.25rem 0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)' }}>
              {user.role}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>{user.name}</span>
            <button onClick={logout} style={{ background: 'transparent', color: 'var(--error)', border: '1px solid var(--error)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Logout</button>
          </nav>
        </header>
      )}
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AppLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes by Role */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Super Admin']}><SuperAdminDashboard /></ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute allowedRoles={['Shop', 'Super Admin']}><ShopDashboard /></ProtectedRoute>
            } />
            <Route path="/master" element={
              <ProtectedRoute allowedRoles={['Master', 'Super Admin']}><MasterDashboard /></ProtectedRoute>
            } />
            <Route path="/tailor" element={
              <ProtectedRoute allowedRoles={['Tailor', 'Super Admin']}><TailorDashboard /></ProtectedRoute>
            } />
            <Route path="/delivery" element={
              <ProtectedRoute allowedRoles={['Delivery Boy', 'Super Admin']}><DeliveryDashboard /></ProtectedRoute>
            } />

            {/* Fallbacks */}
            <Route path="/unauthorized" element={<div style={{ padding: '3rem', textAlign: 'center', color: 'var(--error)' }}>Unauthorized Access</div>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </AppLayout>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
