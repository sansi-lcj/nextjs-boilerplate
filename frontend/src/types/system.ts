// 系统管理相关类型定义

// 用户相关类型
export interface User {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  orgId: number;
  orgName?: string;
  status: UserStatus;
  roles: Role[];
  lastLoginTime: string;
  lastLoginIp: string;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = 'active' | 'disabled' | 'locked';

export interface UserFormData {
  username: string;
  password?: string;
  realName: string;
  phone: string;
  email: string;
  orgId: number;
  roleIds: number[];
  status?: UserStatus;
}

export interface UserQueryParams extends BaseQueryParams {
  username?: string;
  realName?: string;
  phone?: string;
  email?: string;
  orgId?: number;
  status?: UserStatus;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  userId: number;
  newPassword: string;
}

// 角色相关类型
export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  roleType: string;
  dataScope: DataScope;
  description: string;
  status: Status;
  permissions: Permission[];
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type DataScope = 'all' | 'org' | 'org_and_sub' | 'self';

export interface RoleFormData {
  roleCode: string;
  roleName: string;
  roleType: string;
  dataScope: DataScope;
  description: string;
  permissionIds: number[];
  status?: Status;
}

export interface RoleQueryParams extends BaseQueryParams {
  roleName?: string;
  roleCode?: string;
  status?: Status;
}

// 权限相关类型
export interface Permission {
  id: number;
  parentId: number;
  permissionName: string;
  permissionCode: string;
  permissionType: PermissionType;
  menuPath?: string;
  menuIcon?: string;
  component?: string;
  sortOrder: number;
  visible: boolean;
  status: Status;
  children?: Permission[];
  createdAt: string;
  updatedAt: string;
}

export type PermissionType = 'module' | 'menu' | 'button';

export interface PermissionFormData {
  parentId: number;
  permissionName: string;
  permissionCode: string;
  permissionType: PermissionType;
  menuPath?: string;
  menuIcon?: string;
  component?: string;
  sortOrder: number;
  visible: boolean;
  status?: Status;
}

export interface PermissionTree extends Permission {
  children?: PermissionTree[];
}

// 组织相关类型
export interface Organization {
  id: number;
  parentId: number;
  orgCode: string;
  orgName: string;
  orgType: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  sortOrder: number;
  status: Status;
  children?: Organization[];
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationFormData {
  parentId: number;
  orgCode: string;
  orgName: string;
  orgType: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  sortOrder: number;
  status?: Status;
}

export interface OrganizationTree extends Organization {
  children?: OrganizationTree[];
}

// 菜单相关类型
export interface Menu {
  id: number;
  parentId: number;
  menuName: string;
  menuType: MenuType;
  menuIcon?: string;
  menuPath?: string;
  component?: string;
  permission?: string;
  sortOrder: number;
  visible: boolean;
  status: Status;
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
}

export type MenuType = 'directory' | 'menu' | 'button';

export interface MenuFormData {
  parentId: number;
  menuName: string;
  menuType: MenuType;
  menuIcon?: string;
  menuPath?: string;
  component?: string;
  permission?: string;
  sortOrder: number;
  visible: boolean;
  status?: Status;
}

export interface MenuTree extends Menu {
  children?: MenuTree[];
}

// 日志相关类型
export interface LoginLog {
  id: number;
  userId: number;
  username: string;
  loginTime: string;
  loginIp: string;
  loginLocation: string;
  browser: string;
  os: string;
  loginStatus: LoginStatus;
  message: string;
}

export type LoginStatus = 'success' | 'failed';

export interface LoginLogQueryParams extends BaseQueryParams {
  username?: string;
  loginIp?: string;
  loginStatus?: LoginStatus;
  startTime?: string;
  endTime?: string;
}

export interface OperationLog {
  id: number;
  userId: number;
  username: string;
  operationModule: string;
  operationType: OperationType;
  operationObject: string;
  operationContent: string;
  operationTime: string;
  operationIp: string;
  operationResult: OperationResult;
  errorMessage?: string;
}

export type OperationType = 'create' | 'update' | 'delete' | 'query' | 'import' | 'export';
export type OperationResult = 'success' | 'failed';

export interface OperationLogQueryParams extends BaseQueryParams {
  userId?: number;
  username?: string;
  operationModule?: string;
  operationType?: OperationType;
  operationResult?: OperationResult;
  startTime?: string;
  endTime?: string;
}

// 数据字典相关类型
export interface Dictionary {
  id: number;
  parentId: number;
  dictType: string;
  dictName: string;
  dictCode: string;
  dictValue: string;
  sortOrder: number;
  remark: string;
  status: Status;
  children?: Dictionary[];
  createdAt: string;
  updatedAt: string;
}

export interface DictionaryFormData {
  parentId: number;
  dictType: string;
  dictName: string;
  dictCode: string;
  dictValue: string;
  sortOrder: number;
  remark: string;
  status?: Status;
}

export interface DictionaryQueryParams extends BaseQueryParams {
  dictType?: string;
  dictName?: string;
  status?: Status;
}

// 配置相关类型
export interface SystemConfig {
  id: number;
  configKey: string;
  configValue: string;
  configType: ConfigType;
  configName: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export type ConfigType = 'text' | 'number' | 'boolean' | 'json' | 'file';

export interface SystemConfigFormData {
  configKey: string;
  configValue: string;
  configType: ConfigType;
  configName: string;
  remark: string;
}

// 导入导出相关类型
export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  failures: Array<{
    row: number;
    reason: string;
    data: Record<string, any>;
  }>;
}

export interface ExportRequest {
  format: ExportFormat;
  columns: string[];
  conditions?: Record<string, any>;
}

export type ExportFormat = 'excel' | 'csv' | 'pdf';

// 从 common.ts 导入基础类型
import type { BaseQueryParams, Status } from './common'; 