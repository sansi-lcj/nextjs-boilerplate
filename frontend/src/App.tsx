import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/asset/AssetList';
import BuildingList from './pages/asset/BuildingList';
import Map from './pages/Map';
import Statistics from './pages/Statistics';
import UserManagement from './pages/system/UserManagement';
import RoleManagement from './pages/system/RoleManagement';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assets" element={<AssetList />} />
          <Route path="buildings" element={<BuildingList />} />
          <Route path="map" element={<Map />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="system/users" element={<UserManagement />} />
          <Route path="system/roles" element={<RoleManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;