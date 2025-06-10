import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/auth/Login';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/asset/AssetList';
import BuildingList from './pages/asset/BuildingList';
import FloorList from './pages/asset/FloorList';
import RoomList from './pages/asset/RoomList';
import Map from './pages/Map';
import Statistics from './pages/Statistics';
import UserManagement from './pages/system/UserManagement';
import RoleManagement from './pages/system/RoleManagement';
import OrganizationManagement from './pages/system/OrganizationManagement';
import PermissionManagement from './pages/system/PermissionManagement';
import PrivateRoute from './components/common/PrivateRoute';
import { ThemeProvider, useThemeConfig } from './hooks/useTheme';

// 主应用组件（在主题上下文内部）
const AppContent: React.FC = () => {
  const themeConfig = useThemeConfig();

  return (
    <ConfigProvider
      theme={themeConfig}
      locale={zhCN}
      componentSize="middle"
      // 启用CSS-in-JS
      csp={{ nonce: 'antd-csp-nonce' }}
    >
      <AntdApp>
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
              <Route path="floors" element={<FloorList />} />
              <Route path="rooms" element={<RoomList />} />
              <Route path="map" element={<Map />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="system/users" element={<UserManagement />} />
              <Route path="system/roles" element={<RoleManagement />} />
              <Route path="system/permissions" element={<PermissionManagement />} />
              <Route path="system/organizations" element={<OrganizationManagement />} />
            </Route>
          </Routes>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
};

// 根应用组件
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;