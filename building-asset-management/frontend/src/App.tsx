import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import PrivateRoute from './components/common/PrivateRoute';
import 'antd/dist/reset.css';
import './App.css';

// 懒加载页面组件
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AssetList = React.lazy(() => import('./pages/asset/AssetList'));
const BuildingList = React.lazy(() => import('./pages/asset/BuildingList'));

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
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
              <Route
                path="dashboard"
                element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <Dashboard />
                  </React.Suspense>
                }
              />
              <Route path="asset">
                <Route
                  path="list"
                  element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <AssetList />
                    </React.Suspense>
                  }
                />
                <Route
                  path="building"
                  element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <BuildingList />
                    </React.Suspense>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
