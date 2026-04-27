import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AdminApp } from './modules/admin/AdminApp';
import { CustomerApp } from './modules/customer/CustomerApp';
import { StaffApp } from './modules/staff/StaffApp';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

const MainRouter = () => {
  const { currentUser } = useApp();

  // If not logged in, only allow Landing and Login
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Role-based authenticated routes
  return (
    <Routes>
      <Route path="/" element={
        currentUser.role === 'admin' ? <AdminApp /> :
        currentUser.role === 'customer' ? <CustomerApp /> :
        <StaffApp />
      } />
      <Route path="/login" element={<Navigate to="/" />} />
      {/* Add more routes here as needed */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <MainRouter />
      </Router>
    </AppProvider>
  );
}
