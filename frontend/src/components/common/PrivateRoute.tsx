/**
 * 私有路由组件
 * 用于保护需要认证的路由
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  mode?: 'all' | 'any';
  redirect?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  permissions = [],
  roles = [],
  mode = 'any',
  redirect = '/login'
}) => {
  const location = useLocation();
  
  // 简化版本：暂时直接返回children
  // 实际项目中需要检查认证状态和权限
  const isAuthenticated = true; // TODO: 从认证状态获取
  const hasPermission = true; // TODO: 权限检查逻辑
  
  if (!isAuthenticated) {
    // 保存当前路径，登录后跳转回来
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }
  
  if (permissions.length > 0 || roles.length > 0) {
    if (!hasPermission) {
      return <Navigate to="/403" replace />;
    }
  }
  
  return <>{children}</>;
};

export default PrivateRoute;