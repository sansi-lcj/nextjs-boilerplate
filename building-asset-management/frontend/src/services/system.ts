import request from '../utils/request';
import { User, Role, Organization } from '../types/user';

// User APIs
export const userService = {
  // 获取用户列表
  getUsers: (params?: {
    page?: number;
    page_size?: number;
    username?: string;
    real_name?: string;
    status?: string;
    org_id?: number;
  }) => {
    return request.get('/users', { params });
  },

  // 获取用户详情
  getUser: (id: number) => {
    return request.get(`/users/${id}`);
  },

  // 创建用户
  createUser: (data: Partial<User>) => {
    return request.post('/users', data);
  },

  // 更新用户
  updateUser: (id: number, data: Partial<User>) => {
    return request.put(`/users/${id}`, data);
  },

  // 删除用户
  deleteUser: (id: number) => {
    return request.delete(`/users/${id}`);
  },

  // 重置密码
  resetPassword: (id: number, password: string) => {
    return request.put(`/users/${id}/password`, { password });
  },
};

// Role APIs
export const roleService = {
  // 获取角色列表
  getRoles: (params?: {
    page?: number;
    page_size?: number;
    name?: string;
    code?: string;
  }) => {
    return request.get('/roles', { params });
  },

  // 获取角色详情
  getRole: (id: number) => {
    return request.get(`/roles/${id}`);
  },

  // 创建角色
  createRole: (data: Partial<Role>) => {
    return request.post('/roles', data);
  },

  // 更新角色
  updateRole: (id: number, data: Partial<Role>) => {
    return request.put(`/roles/${id}`, data);
  },

  // 删除角色
  deleteRole: (id: number) => {
    return request.delete(`/roles/${id}`);
  },

  // 更新角色权限
  updateRolePermissions: (id: number, permissionIds: number[]) => {
    return request.put(`/roles/${id}/permissions`, { permission_ids: permissionIds });
  },
};

// Permission APIs
export const permissionService = {
  // 获取权限列表
  getPermissions: () => {
    return request.get('/permissions');
  },

  // 获取权限树
  getPermissionTree: () => {
    return request.get('/permissions/tree');
  },
};

// Menu APIs
export const menuService = {
  // 获取菜单列表
  getMenus: () => {
    return request.get('/menus');
  },

  // 获取菜单树
  getMenuTree: () => {
    return request.get('/menus/tree');
  },

  // 获取用户菜单
  getUserMenus: () => {
    return request.get('/menus/user');
  },
};

// Organization APIs
export const organizationService = {
  // 获取组织列表
  getOrganizations: () => {
    return request.get('/organizations');
  },

  // 获取组织树
  getOrganizationTree: () => {
    return request.get('/organizations/tree');
  },

  // 获取组织详情
  getOrganization: (id: number) => {
    return request.get(`/organizations/${id}`);
  },

  // 创建组织
  createOrganization: (data: Partial<Organization>) => {
    return request.post('/organizations', data);
  },

  // 更新组织
  updateOrganization: (id: number, data: Partial<Organization>) => {
    return request.put(`/organizations/${id}`, data);
  },

  // 删除组织
  deleteOrganization: (id: number) => {
    return request.delete(`/organizations/${id}`);
  },
};

// Log APIs
export const logService = {
  // 获取操作日志
  getOperationLogs: (params?: {
    page?: number;
    page_size?: number;
    username?: string;
    module?: string;
    start_time?: string;
    end_time?: string;
  }) => {
    return request.get('/logs/operations', { params });
  },

  // 获取登录日志
  getLoginLogs: (params?: {
    page?: number;
    page_size?: number;
    username?: string;
    start_time?: string;
    end_time?: string;
  }) => {
    return request.get('/logs/logins', { params });
  },
};