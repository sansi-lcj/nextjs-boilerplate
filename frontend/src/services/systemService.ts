import { http } from '../utils/request';
import type {
  User,
  UserFormData,
  UserQueryParams,
  UserStatus,
  Role,
  RoleFormData,
  RoleQueryParams,
  Permission,
  PermissionFormData,
  PermissionTree,
  Organization,
  OrganizationFormData,
  OrganizationTree,
  Menu,
  MenuFormData,
  MenuTree,
  LoginLog,
  LoginLogQueryParams,
  OperationLog,
  OperationLogQueryParams,
  Dictionary,
  DictionaryFormData,
  DictionaryQueryParams,
  SystemConfig,
  SystemConfigFormData,
  ImportResult,
  ExportRequest,
  UpdatePasswordRequest,
  ResetPasswordRequest
} from '../types/system';
import type { ApiResponse, PaginationResponse } from '../types/common';

/**
 * 用户管理服务
 */
export class UserService {
  /**
   * 获取用户列表
   */
  async getUsers(params?: UserQueryParams): Promise<PaginationResponse<User>> {
    const response = await http.get<ApiResponse<PaginationResponse<User>>>('/system/users', { params });
    return response.data;
  }

  /**
   * 获取用户详情
   */
  async getUserById(id: number): Promise<User> {
    const response = await http.get<ApiResponse<User>>(`/system/users/${id}`);
    return response.data;
  }

  /**
   * 创建用户
   */
  async createUser(data: UserFormData): Promise<User> {
    const response = await http.post<ApiResponse<User>>('/system/users', data);
    return response.data;
  }

  /**
   * 更新用户
   */
  async updateUser(id: number, data: Partial<UserFormData>): Promise<User> {
    const response = await http.put<ApiResponse<User>>(`/system/users/${id}`, data);
    return response.data;
  }

  /**
   * 删除用户
   */
  async deleteUser(id: number): Promise<void> {
    await http.delete(`/system/users/${id}`);
  }

  /**
   * 批量删除用户
   */
  async batchDeleteUsers(ids: number[]): Promise<void> {
    await http.post('/system/users/batch-delete', { ids });
  }

  /**
   * 重置用户密码
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await http.post('/system/users/reset-password', data);
  }

  /**
   * 更新用户状态
   */
  async updateUserStatus(id: number, status: UserStatus): Promise<void> {
    await http.put(`/system/users/${id}/status`, { status });
  }

  /**
   * 分配用户角色
   */
  async assignRoles(userId: number, roleIds: number[]): Promise<void> {
    await http.post(`/system/users/${userId}/roles`, { roleIds });
  }

  /**
   * 导入用户
   */
  async importUsers(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await http.post<ApiResponse<ImportResult>>('/system/users/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * 导出用户
   */
  async exportUsers(request: ExportRequest): Promise<Blob> {
    const response = await http.post('/system/users/export', request, {
      responseType: 'blob',
    });
    return response;
  }
}

/**
 * 角色管理服务
 */
export class RoleService {
  /**
   * 获取角色列表
   */
  async getRoles(params?: RoleQueryParams): Promise<PaginationResponse<Role>> {
    const response = await http.get<ApiResponse<PaginationResponse<Role>>>('/system/roles', { params });
    return response.data;
  }

  /**
   * 获取所有角色（用于下拉选择）
   */
  async getAllRoles(): Promise<Role[]> {
    const response = await http.get<ApiResponse<Role[]>>('/system/roles/all');
    return response.data;
  }

  /**
   * 获取角色详情
   */
  async getRoleById(id: number): Promise<Role> {
    const response = await http.get<ApiResponse<Role>>(`/system/roles/${id}`);
    return response.data;
  }

  /**
   * 创建角色
   */
  async createRole(data: RoleFormData): Promise<Role> {
    const response = await http.post<ApiResponse<Role>>('/system/roles', data);
    return response.data;
  }

  /**
   * 更新角色
   */
  async updateRole(id: number, data: Partial<RoleFormData>): Promise<Role> {
    const response = await http.put<ApiResponse<Role>>(`/system/roles/${id}`, data);
    return response.data;
  }

  /**
   * 删除角色
   */
  async deleteRole(id: number): Promise<void> {
    await http.delete(`/system/roles/${id}`);
  }

  /**
   * 分配权限
   */
  async assignPermissions(roleId: number, permissionIds: number[]): Promise<void> {
    await http.post(`/system/roles/${roleId}/permissions`, { permissionIds });
  }

  /**
   * 获取角色权限
   */
  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const response = await http.get<ApiResponse<Permission[]>>(`/system/roles/${roleId}/permissions`);
    return response.data;
  }
}

/**
 * 权限管理服务
 */
export class PermissionService {
  /**
   * 获取权限列表
   */
  async getPermissions(): Promise<Permission[]> {
    const response = await http.get<ApiResponse<Permission[]>>('/system/permissions');
    return response.data;
  }

  /**
   * 获取权限树
   */
  async getPermissionTree(): Promise<PermissionTree[]> {
    const response = await http.get<ApiResponse<PermissionTree[]>>('/system/permissions/tree');
    return response.data;
  }

  /**
   * 获取权限详情
   */
  async getPermissionById(id: number): Promise<Permission> {
    const response = await http.get<ApiResponse<Permission>>(`/system/permissions/${id}`);
    return response.data;
  }

  /**
   * 创建权限
   */
  async createPermission(data: PermissionFormData): Promise<Permission> {
    const response = await http.post<ApiResponse<Permission>>('/system/permissions', data);
    return response.data;
  }

  /**
   * 更新权限
   */
  async updatePermission(id: number, data: Partial<PermissionFormData>): Promise<Permission> {
    const response = await http.put<ApiResponse<Permission>>(`/system/permissions/${id}`, data);
    return response.data;
  }

  /**
   * 删除权限
   */
  async deletePermission(id: number): Promise<void> {
    await http.delete(`/system/permissions/${id}`);
  }
}

/**
 * 组织管理服务
 */
export class OrganizationService {
  /**
   * 获取组织列表
   */
  async getOrganizations(): Promise<Organization[]> {
    const response = await http.get<ApiResponse<Organization[]>>('/system/organizations');
    return response.data;
  }

  /**
   * 获取组织树
   */
  async getOrganizationTree(): Promise<OrganizationTree[]> {
    const response = await http.get<ApiResponse<OrganizationTree[]>>('/system/organizations/tree');
    return response.data;
  }

  /**
   * 获取组织详情
   */
  async getOrganizationById(id: number): Promise<Organization> {
    const response = await http.get<ApiResponse<Organization>>(`/system/organizations/${id}`);
    return response.data;
  }

  /**
   * 创建组织
   */
  async createOrganization(data: OrganizationFormData): Promise<Organization> {
    const response = await http.post<ApiResponse<Organization>>('/system/organizations', data);
    return response.data;
  }

  /**
   * 更新组织
   */
  async updateOrganization(id: number, data: Partial<OrganizationFormData>): Promise<Organization> {
    const response = await http.put<ApiResponse<Organization>>(`/system/organizations/${id}`, data);
    return response.data;
  }

  /**
   * 删除组织
   */
  async deleteOrganization(id: number): Promise<void> {
    await http.delete(`/system/organizations/${id}`);
  }
}

/**
 * 菜单管理服务
 */
export class MenuService {
  /**
   * 获取菜单列表
   */
  async getMenus(): Promise<Menu[]> {
    const response = await http.get<ApiResponse<Menu[]>>('/system/menus');
    return response.data;
  }

  /**
   * 获取菜单树
   */
  async getMenuTree(): Promise<MenuTree[]> {
    const response = await http.get<ApiResponse<MenuTree[]>>('/system/menus/tree');
    return response.data;
  }

  /**
   * 获取用户菜单
   */
  async getUserMenus(): Promise<MenuTree[]> {
    const response = await http.get<ApiResponse<MenuTree[]>>('/system/menus/user');
    return response.data;
  }

  /**
   * 获取菜单详情
   */
  async getMenuById(id: number): Promise<Menu> {
    const response = await http.get<ApiResponse<Menu>>(`/system/menus/${id}`);
    return response.data;
  }

  /**
   * 创建菜单
   */
  async createMenu(data: MenuFormData): Promise<Menu> {
    const response = await http.post<ApiResponse<Menu>>('/system/menus', data);
    return response.data;
  }

  /**
   * 更新菜单
   */
  async updateMenu(id: number, data: Partial<MenuFormData>): Promise<Menu> {
    const response = await http.put<ApiResponse<Menu>>(`/system/menus/${id}`, data);
    return response.data;
  }

  /**
   * 删除菜单
   */
  async deleteMenu(id: number): Promise<void> {
    await http.delete(`/system/menus/${id}`);
  }
}

/**
 * 日志管理服务
 */
export class LogService {
  /**
   * 获取登录日志
   */
  async getLoginLogs(params?: LoginLogQueryParams): Promise<PaginationResponse<LoginLog>> {
    const response = await http.get<ApiResponse<PaginationResponse<LoginLog>>>('/system/logs/login', { params });
    return response.data;
  }

  /**
   * 获取操作日志
   */
  async getOperationLogs(params?: OperationLogQueryParams): Promise<PaginationResponse<OperationLog>> {
    const response = await http.get<ApiResponse<PaginationResponse<OperationLog>>>('/system/logs/operation', { params });
    return response.data;
  }

  /**
   * 清理日志
   */
  async clearLogs(type: 'login' | 'operation', beforeDate: string): Promise<void> {
    await http.post('/system/logs/clear', { type, beforeDate });
  }

  /**
   * 导出日志
   */
  async exportLogs(type: 'login' | 'operation', request: ExportRequest): Promise<Blob> {
    const response = await http.post(`/system/logs/${type}/export`, request, {
      responseType: 'blob',
    });
    return response;
  }
}

/**
 * 数据字典服务
 */
export class DictionaryService {
  /**
   * 获取字典列表
   */
  async getDictionaries(params?: DictionaryQueryParams): Promise<PaginationResponse<Dictionary>> {
    const response = await http.get<ApiResponse<PaginationResponse<Dictionary>>>('/system/dict', { params });
    return response.data;
  }

  /**
   * 获取字典类型列表
   */
  async getDictTypes(): Promise<string[]> {
    const response = await http.get<ApiResponse<string[]>>('/system/dict/types');
    return response.data;
  }

  /**
   * 根据类型获取字典项
   */
  async getDictItemsByType(type: string): Promise<Dictionary[]> {
    const response = await http.get<ApiResponse<Dictionary[]>>(`/system/dict/type/${type}`);
    return response.data;
  }

  /**
   * 获取字典详情
   */
  async getDictionaryById(id: number): Promise<Dictionary> {
    const response = await http.get<ApiResponse<Dictionary>>(`/system/dict/${id}`);
    return response.data;
  }

  /**
   * 创建字典
   */
  async createDictionary(data: DictionaryFormData): Promise<Dictionary> {
    const response = await http.post<ApiResponse<Dictionary>>('/system/dict', data);
    return response.data;
  }

  /**
   * 更新字典
   */
  async updateDictionary(id: number, data: Partial<DictionaryFormData>): Promise<Dictionary> {
    const response = await http.put<ApiResponse<Dictionary>>(`/system/dict/${id}`, data);
    return response.data;
  }

  /**
   * 删除字典
   */
  async deleteDictionary(id: number): Promise<void> {
    await http.delete(`/system/dict/${id}`);
  }

  /**
   * 刷新字典缓存
   */
  async refreshDictCache(): Promise<void> {
    await http.post('/system/dict/refresh-cache');
  }
}

/**
 * 系统配置服务
 */
export class SystemConfigService {
  /**
   * 获取系统配置
   */
  async getConfigs(): Promise<SystemConfig[]> {
    const response = await http.get<ApiResponse<SystemConfig[]>>('/system/config');
    return response.data;
  }

  /**
   * 获取配置值
   */
  async getConfigByKey(key: string): Promise<string> {
    const response = await http.get<ApiResponse<string>>(`/system/config/${key}`);
    return response.data;
  }

  /**
   * 更新配置
   */
  async updateConfig(data: SystemConfigFormData): Promise<SystemConfig> {
    const response = await http.put<ApiResponse<SystemConfig>>('/system/config', data);
    return response.data;
  }

  /**
   * 批量更新配置
   */
  async batchUpdateConfigs(configs: SystemConfigFormData[]): Promise<void> {
    await http.put('/system/config/batch', { configs });
  }

  /**
   * 重置配置为默认值
   */
  async resetConfig(key: string): Promise<void> {
    await http.post(`/system/config/${key}/reset`);
  }
}

// 导出服务实例
export const userService = new UserService();
export const roleService = new RoleService();
export const permissionService = new PermissionService();
export const organizationService = new OrganizationService();
export const menuService = new MenuService();
export const logService = new LogService();
export const dictionaryService = new DictionaryService();
export const systemConfigService = new SystemConfigService(); 