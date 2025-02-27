import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TemplatePage from '../pages/TemplatePage';
import CreateTemplatePage from '../pages/CreateTemplatePage';
import EditTemplatePage from '../pages/EditTemplatePage';
import SearchPage from '../pages/SearchPage';
import AdminPage from '../pages/AdminPage';
import NotFoundPage from '../pages/NotFoundPage';

// Components
import PrivateRoute from '../components/auth/PrivateRoute';
import AdminRoute from '../components/auth/AdminRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <HomePage /> : <Navigate to="/login" />
      } />
      <Route path="/login" element={
        !isAuthenticated ? <LoginPage /> : <Navigate to="/" />
      } />
      <Route path="/register" element={
        !isAuthenticated ? <RegisterPage /> : <Navigate to="/" />
      } />
      
      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/templates/create" element={<CreateTemplatePage />} />
        <Route path="/templates/:id" element={<TemplatePage />} />
        <Route path="/templates/:id/edit" element={<EditTemplatePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes; 