import React from 'react';
import { usePermission } from '../../hooks/usePermission';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string | string[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // 是否需要所有权限，默认false（任一权限即可）
}

/**
 * 权限守卫组件
 * 根据用户权限决定是否渲染子组件
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  fallback = null,
  requireAll = false,
}) => {
  const { hasPermission, hasAllPermissions } = usePermission();

  // 如果没有权限要求，直接渲染
  if (!permission) {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (typeof permission === 'string') {
    hasAccess = hasPermission(permission);
  } else if (Array.isArray(permission)) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permission);
    } else {
      hasAccess = hasPermission(permission);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard; 