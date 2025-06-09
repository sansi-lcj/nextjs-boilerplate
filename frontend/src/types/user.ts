// 用户相关类型定义

export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'banned';
  organizationId?: number;
  organization?: Organization;
  roles: Role[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
}

export interface Organization {
  id: number;
  name: string;
  code: string;
  parentId?: number;
  parent?: Organization;
  children?: Organization[];
  level: number;
  sort: number;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
  module: string;
  action: string;
  resource?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: number;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  parentId?: number;
  parent?: Menu;
  children?: Menu[];
  level: number;
  sort: number;
  type: 'menu' | 'button';
  permission?: string;
  status: 'active' | 'inactive';
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// 请求类型
export interface LoginRequest {
  username: string;
  password: string;
  captcha?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  permissions: string[];
  menus: Menu[];
  expiresIn: number;
}

export interface CreateUserRequest {
  username: string;
  name: string;
  email?: string;
  phone?: string;
  password: string;
  organizationId?: number;
  roleIds: number[];
  status?: 'active' | 'inactive';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  organizationId?: number;
  roleIds?: number[];
  status?: 'active' | 'inactive';
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateRoleRequest {
  name: string;
  code: string;
  description?: string;
  permissionIds: number[];
  status?: 'active' | 'inactive';
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissionIds?: number[];
  status?: 'active' | 'inactive';
}

export interface CreateOrganizationRequest {
  name: string;
  code: string;
  parentId?: number;
  description?: string;
  sort?: number;
  status?: 'active' | 'inactive';
}

export interface UpdateOrganizationRequest {
  name?: string;
  code?: string;
  parentId?: number;
  description?: string;
  sort?: number;
  status?: 'active' | 'inactive';
}

// 查询参数类型
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'banned';
  organizationId?: number;
  roleId?: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface RoleQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  status?: 'active' | 'inactive';
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface OrganizationQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  parentId?: number;
  status?: 'active' | 'inactive';
  level?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PermissionQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  module?: string;
  action?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 统计数据类型
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  bannedUsers: number;
  onlineUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  loginSuccessRate: number;
  averageSessionDuration: number;
}

export interface LoginLog {
  id: number;
  userId: number;
  user?: User;
  ip: string;
  userAgent: string;
  location?: string;
  status: 'success' | 'failed';
  failReason?: string;
  loginAt: string;
}

export interface OperationLog {
  id: number;
  userId: number;
  user?: User;
  module: string;
  action: string;
  description: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  requestParams?: Record<string, any>;
  responseData?: Record<string, any>;
  duration: number;
  status: 'success' | 'failed';
  errorMessage?: string;
  createdAt: string;
}

// 表单数据类型
export interface UserFormData extends Omit<CreateUserRequest, 'roleIds'> {
  roleIds: number[];
  confirmPassword?: string;
}

export interface RoleFormData extends CreateRoleRequest {
  permissionIds: number[];
}

export interface OrganizationFormData extends CreateOrganizationRequest {
  children?: OrganizationFormData[];
}

// 认证状态类型
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  permissions: string[];
  menus: Menu[];
  loading: boolean;
  error: string | null;
  expiresAt: number | null;
}