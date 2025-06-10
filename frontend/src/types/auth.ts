import { Status } from './common';

// 用户信息
export interface User {
  id: number;
  username: string;
  realName: string;
  phone?: string;
  email?: string;
  orgId?: number;
  orgName?: string;
  roles: Role[];
  permissions: string[];
  status: Status;
  lastLoginTime?: string;
  lastLoginIP?: string;
  createdAt: string;
  updatedAt: string;
}

// 角色信息
export interface Role {
  id: number;
  code: string;
  name: string;
  description?: string;
  permissions: Permission[];
  userCount?: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// 权限信息
export interface Permission {
  id: number;
  code: string;
  name: string;
  description?: string;
  module: string;
  action: string;
  resource?: string;
  type: 'menu' | 'button' | 'api';
  sort: number;
  status: Status;
  parentId?: number;
  children?: Permission[];
}

// 组织机构
export interface Organization {
  id: number;
  parentId?: number;
  orgCode: string;
  orgName: string;
  orgType: string;
  contactPerson?: string;
  contactPhone?: string;
  address?: string;
  sortOrder: number;
  status: Status;
  children?: Organization[];
  createdAt: string;
  updatedAt: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
  captcha?: string;
  rememberMe?: boolean;
}

// 登录响应
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

// 刷新Token请求
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 修改密码请求
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 重置密码请求
export interface ResetPasswordRequest {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}

// 用户创建/更新请求
export interface UserFormData {
  username: string;
  realName: string;
  phone?: string;
  email?: string;
  password?: string;
  orgId?: number;
  roleIds: number[];
  status: Status;
}

// 角色创建/更新请求
export interface RoleFormData {
  code: string;
  name: string;
  description?: string;
  permissionIds: number[];
  status: Status;
}

// 权限树节点
export interface PermissionTreeNode {
  key: string;
  title: string;
  children?: PermissionTreeNode[];
  isLeaf?: boolean;
  disabled?: boolean;
}

// 登录日志
export interface LoginLog {
  id: number;
  userId: number;
  username: string;
  loginTime: string;
  loginIP: string;
  loginLocation?: string;
  browser?: string;
  os?: string;
  loginStatus: 'success' | 'failed';
  message?: string;
}

// 操作日志
export interface OperationLog {
  id: number;
  userId: number;
  username: string;
  module: string;
  action: string;
  resource?: string;
  description: string;
  method: string;
  url: string;
  params?: string;
  result: 'success' | 'failed';
  errorMessage?: string;
  ip: string;
  userAgent?: string;
  operationTime: string;
}

// 认证状态
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
} 