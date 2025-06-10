import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 页面组件
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

// 通用组件
import PrivateRoute from './components/common/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingFallback from './components/common/LoadingFallback';

// 主题和样式
import { useThemeStore } from './store/theme';
import './styles/global.css';
import './styles/cyberpunk.css';

/**
 * 科技感主题配置
 */
const getCyberpunkTheme = (isDark: boolean) => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    // 主色调 - 赛博朋克蓝
    colorPrimary: isDark ? '#00d4ff' : '#1890ff',
    colorPrimaryHover: isDark ? '#33dfff' : '#40a9ff',
    colorPrimaryActive: isDark ? '#00b8e6' : '#096dd9',
    
    // 背景色
    colorBgContainer: isDark ? '#0f1419' : '#ffffff',
    colorBgElevated: isDark ? '#1a1f2e' : '#ffffff',
    colorBgLayout: isDark ? '#0a0e14' : '#f5f5f5',
    colorBgSpotlight: isDark ? '#141b26' : '#fafafa',
    
    // 文字颜色
    colorText: isDark ? '#e6f1ff' : '#000000',
    colorTextSecondary: isDark ? '#8892b0' : '#666666',
    colorTextTertiary: isDark ? '#495670' : '#999999',
    colorTextDisabled: isDark ? '#363c4a' : '#c0c0c0',
    
    // 边框颜色
    colorBorder: isDark ? '#233040' : '#d9d9d9',
    colorBorderSecondary: isDark ? '#1a2332' : '#e8e8e8',
    
    // 成功色 - 赛博朋克绿
    colorSuccess: isDark ? '#00ff88' : '#52c41a',
    colorSuccessHover: isDark ? '#33ffaa' : '#73d13d',
    
    // 警告色 - 赛博朋克橙
    colorWarning: isDark ? '#ff9500' : '#faad14',
    colorWarningHover: isDark ? '#ffaa33' : '#ffc53d',
    
    // 错误色 - 赛博朋克红
    colorError: isDark ? '#ff0055' : '#ff4d4f',
    colorErrorHover: isDark ? '#ff3377' : '#ff7875',
    
    // 信息色
    colorInfo: isDark ? '#00d4ff' : '#1890ff',
    
    // 字体
    fontFamily: "'SF Pro Display', 'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // 阴影
    boxShadow: isDark 
      ? '0 2px 8px rgba(0, 212, 255, 0.15)'
      : '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: isDark 
      ? '0 4px 16px rgba(0, 212, 255, 0.25)'
      : '0 4px 16px rgba(0, 0, 0, 0.25)',
      
    // 动画
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  components: {
    Layout: {
      headerBg: isDark ? '#0a0e14' : '#ffffff',
      siderBg: isDark ? '#0f1419' : '#ffffff',
      bodyBg: isDark ? '#0a0e14' : '#f5f5f5',
      triggerBg: isDark ? '#1a2332' : '#f0f0f0',
    },
    Menu: {
      darkItemBg: isDark ? '#0f1419' : '#ffffff',
      darkItemSelectedBg: isDark ? 'linear-gradient(135deg, #00d4ff20, #ff005520)' : '#e6f7ff',
      darkItemHoverBg: isDark ? '#1a2332' : '#f5f5f5',
      darkSubMenuItemBg: isDark ? '#141b26' : '#fafafa',
    },
    Card: {
      headerBg: isDark ? '#141b26' : '#fafafa',
      boxShadow: isDark 
        ? '0 1px 3px rgba(0, 212, 255, 0.12), 0 1px 2px rgba(0, 212, 255, 0.24)'
        : '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    },
    Table: {
      headerBg: isDark ? '#141b26' : '#fafafa',
      rowHoverBg: isDark ? '#1a2332' : '#f5f5f5',
      borderColor: isDark ? '#233040' : '#e8e8e8',
    },
    Button: {
      primaryShadow: isDark 
        ? '0 2px 4px rgba(0, 212, 255, 0.3)'
        : '0 2px 4px rgba(24, 144, 255, 0.3)',
    },
    Input: {
      activeBorderColor: isDark ? '#00d4ff' : '#1890ff',
      hoverBorderColor: isDark ? '#33dfff' : '#40a9ff',
    },
    Select: {
      optionSelectedBg: isDark ? '#1a2332' : '#e6f7ff',
    },
  },
});

/**
 * 应用内容组件
 */
const AppContent: React.FC = () => {
  const { isDark } = useThemeStore();
  const themeConfig = getCyberpunkTheme(isDark);

  return (
    <ConfigProvider
      theme={themeConfig}
      locale={zhCN}
      componentSize="middle"
    >
      <AntdApp className={`app-container ${isDark ? 'dark-mode' : 'light-mode'}`}>
        <ErrorBoundary>
          <Router>
            <Routes>
              {/* 登录页面 */}
              <Route 
                path="/login" 
                element={
                  <React.Suspense fallback={<LoadingFallback />}>
                    <Login />
                  </React.Suspense>
                } 
              />
              
              {/* 主应用路由 */}
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                {/* 重定向到仪表板 */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                
                {/* 仪表板 */}
                <Route 
                  path="dashboard" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <Dashboard />
                    </React.Suspense>
                  } 
                />
                
                {/* 资产管理 */}
                <Route 
                  path="assets" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <AssetList />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="buildings" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <BuildingList />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="floors" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <FloorList />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="rooms" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <RoomList />
                    </React.Suspense>
                  } 
                />
                
                {/* 地图展示 */}
                <Route 
                  path="map" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <Map />
                    </React.Suspense>
                  } 
                />
                
                {/* 数据统计 */}
                <Route 
                  path="statistics" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <Statistics />
                    </React.Suspense>
                  } 
                />
                
                {/* 系统管理 */}
                <Route 
                  path="system/users" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <UserManagement />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="system/roles" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <RoleManagement />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="system/permissions" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <PermissionManagement />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="system/organizations" 
                  element={
                    <React.Suspense fallback={<LoadingFallback />}>
                      <OrganizationManagement />
                    </React.Suspense>
                  } 
                />
                
                {/* 404 页面 */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Router>
        </ErrorBoundary>
      </AntdApp>
    </ConfigProvider>
  );
};

/**
 * 根应用组件
 */
const App: React.FC = () => {
  return <AppContent />;
};

export default App;