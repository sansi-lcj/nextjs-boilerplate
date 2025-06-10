import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/slices/authSlice';
import type { Role } from '../types/user';

// 权限代码定义
export const PermissionCodes = {
  // 资产管理权限
  ASSET_VIEW: 'asset:view',
  ASSET_CREATE: 'asset:create',
  ASSET_UPDATE: 'asset:update',
  ASSET_DELETE: 'asset:delete',
  
  // 楼宇管理权限
  BUILDING_VIEW: 'building:view',
  BUILDING_CREATE: 'building:create',
  BUILDING_UPDATE: 'building:update',
  BUILDING_DELETE: 'building:delete',
  
  // 楼层管理权限
  FLOOR_VIEW: 'floor:view',
  FLOOR_CREATE: 'floor:create',
  FLOOR_UPDATE: 'floor:update',
  FLOOR_DELETE: 'floor:delete',
  
  // 房间管理权限
  ROOM_VIEW: 'room:view',
  ROOM_CREATE: 'room:create',
  ROOM_UPDATE: 'room:update',
  ROOM_DELETE: 'room:delete',
  
  // 系统管理权限
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  
  PERMISSION_VIEW: 'permission:view',
  PERMISSION_UPDATE: 'permission:update',
  
  ORG_VIEW: 'org:view',
  ORG_CREATE: 'org:create',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',
  
  // 数据分析权限
  ANALYTICS_VIEW: 'analytics:view',
  
  // 地图展示权限
  MAP_VIEW: 'map:view',
  
  // 系统设置权限
  SYSTEM_CONFIG: 'system:config',
};

// 角色权限映射（模拟数据，实际应从后端获取）
const RolePermissions = {
  admin: Object.values(PermissionCodes), // 管理员拥有所有权限
  manager: [
    // 资产管理
    PermissionCodes.ASSET_VIEW,
    PermissionCodes.ASSET_CREATE,
    PermissionCodes.ASSET_UPDATE,
    PermissionCodes.BUILDING_VIEW,
    PermissionCodes.BUILDING_CREATE,
    PermissionCodes.BUILDING_UPDATE,
    PermissionCodes.FLOOR_VIEW,
    PermissionCodes.FLOOR_CREATE,
    PermissionCodes.FLOOR_UPDATE,
    PermissionCodes.ROOM_VIEW,
    PermissionCodes.ROOM_CREATE,
    PermissionCodes.ROOM_UPDATE,
    // 分析查看
    PermissionCodes.ANALYTICS_VIEW,
    PermissionCodes.MAP_VIEW,
    // 用户查看
    PermissionCodes.USER_VIEW,
    PermissionCodes.ROLE_VIEW,
    PermissionCodes.PERMISSION_VIEW,
    PermissionCodes.ORG_VIEW,
  ],
  operator: [
    // 只能查看和基本操作
    PermissionCodes.ASSET_VIEW,
    PermissionCodes.BUILDING_VIEW,
    PermissionCodes.FLOOR_VIEW,
    PermissionCodes.ROOM_VIEW,
    PermissionCodes.ROOM_UPDATE,
    PermissionCodes.ANALYTICS_VIEW,
    PermissionCodes.MAP_VIEW,
  ],
  viewer: [
    // 只能查看
    PermissionCodes.ASSET_VIEW,
    PermissionCodes.BUILDING_VIEW,
    PermissionCodes.FLOOR_VIEW,
    PermissionCodes.ROOM_VIEW,
    PermissionCodes.ANALYTICS_VIEW,
    PermissionCodes.MAP_VIEW,
  ],
};

interface UsePermissionReturn {
  hasPermission: (permission: string | string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getUserPermissions: () => string[];
  isAdmin: () => boolean;
  canView: (module: string) => boolean;
  canCreate: (module: string) => boolean;
  canUpdate: (module: string) => boolean;
  canDelete: (module: string) => boolean;
}

/**
 * 权限控制Hook
 * 基于用户角色和权限码进行访问控制
 */
export const usePermission = (): UsePermissionReturn => {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  
  // 从 zustand store 获取用户信息
  const user = useAuthStore(state => state.user);
  
  // 获取用户权限列表
  const getUserPermissions = useCallback((): string[] => {
    if (!user) return [];
    
    // 从用户角色获取权限（实际应从后端API获取）
    const roles = user.roles || [];
    const permissions = new Set<string>();
    
    roles.forEach((role: Role) => {
      const roleCode = role.code;
      const rolePerms = RolePermissions[roleCode as keyof typeof RolePermissions] || [];
      rolePerms.forEach(perm => permissions.add(perm));
    });
    
    return Array.from(permissions);
  }, [user]);
  
  // 检查单个或多个权限
  const hasPermission = useCallback((permission: string | string[]): boolean => {
    if (!user) return false;
    
    const permissions = getUserPermissions();
    
    if (typeof permission === 'string') {
      return permissions.includes(permission);
    }
    
    // 如果是数组，检查是否有任一权限
    return permission.some(perm => permissions.includes(perm));
  }, [user, getUserPermissions]);
  
  // 检查是否拥有任一权限
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return hasPermission(permissions);
  }, [hasPermission]);
  
  // 检查是否拥有所有权限
  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!user) return false;
    
    const userPerms = getUserPermissions();
    return permissions.every(perm => userPerms.includes(perm));
  }, [user, getUserPermissions]);
  
  // 检查是否为管理员
  const isAdmin = useCallback((): boolean => {
    if (!user) return false;
    return user.roles?.some((role: Role) => role.code === 'admin') || false;
  }, [user]);
  
  // 检查模块查看权限
  const canView = useCallback((module: string): boolean => {
    return hasPermission(`${module}:view`);
  }, [hasPermission]);
  
  // 检查模块创建权限
  const canCreate = useCallback((module: string): boolean => {
    return hasPermission(`${module}:create`);
  }, [hasPermission]);
  
  // 检查模块更新权限
  const canUpdate = useCallback((module: string): boolean => {
    return hasPermission(`${module}:update`);
  }, [hasPermission]);
  
  // 检查模块删除权限
  const canDelete = useCallback((module: string): boolean => {
    return hasPermission(`${module}:delete`);
  }, [hasPermission]);
  
  // 更新用户权限列表
  useEffect(() => {
    setUserPermissions(getUserPermissions());
  }, [getUserPermissions]);
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
    isAdmin,
    canView,
    canCreate,
    canUpdate,
    canDelete,
  };
};

// 权限检查工具函数
export const PermissionUtils = {
  // 根据权限过滤菜单项
  filterMenusByPermission: (menus: any[], userPermissions: string[]) => {
    return menus.filter(menu => {
      if (!menu.permission) return true; // 没有权限要求的菜单项显示
      
      if (Array.isArray(menu.permission)) {
        return menu.permission.some((perm: string) => userPermissions.includes(perm));
      }
      
      return userPermissions.includes(menu.permission);
    });
  },
  
  // 检查路由权限
  hasRoutePermission: (route: string, userPermissions: string[]): boolean => {
    const routePermissionMap: Record<string, string[]> = {
      '/assets': [PermissionCodes.ASSET_VIEW],
      '/buildings': [PermissionCodes.BUILDING_VIEW],
      '/floors': [PermissionCodes.FLOOR_VIEW],
      '/rooms': [PermissionCodes.ROOM_VIEW],
      '/map': [PermissionCodes.MAP_VIEW],
      '/analytics': [PermissionCodes.ANALYTICS_VIEW],
      '/system/users': [PermissionCodes.USER_VIEW],
      '/system/roles': [PermissionCodes.ROLE_VIEW],
      '/system/permissions': [PermissionCodes.PERMISSION_VIEW],
      '/system/organizations': [PermissionCodes.ORG_VIEW],
    };
    
    const requiredPermissions = routePermissionMap[route];
    if (!requiredPermissions) return true; // 没有权限要求的路由允许访问
    
    return requiredPermissions.some(perm => userPermissions.includes(perm));
  },
};

export default usePermission; 