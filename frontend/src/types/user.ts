/**
 * 用户相关类型定义 - 与后端模型严格对应
 * 基于 backend/internal/model/user.go
 */

import { BaseModel, AuditModel, BaseQuery } from './index';

// 用户模型 - 对应后端 User
export interface User extends BaseModel {
  username: string;
  name: string;
  phone?: string;
  email?: string;
  org_id?: number;
  status: 'active' | 'inactive';
  last_login_time?: string;
  last_login_ip?: string;
  roles?: Role[];
  organization?: Organization;
}

// 组织模型 - 对应后端 Organization
export interface Organization extends BaseModel {
  name: string;
  code?: string;
  type?: 'district' | 'street';
  parent_id?: number;
  sort: number;
  status: 'active' | 'inactive';
  street_id?: number;
  district_id?: number;
  parent?: Organization;
  children?: Organization[];
}

// 角色模型 - 对应后端 Role
export interface Role extends BaseModel {
  code: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  sort: number;
  permissions?: Permission[];
  users?: User[];
}

// 权限模型 - 对应后端 Permission
export interface Permission extends BaseModel {
  code: string;
  name: string;
  module?: string;
  description?: string;
  roles?: Role[];
}

// 菜单模型 - 对应后端 Menu
export interface Menu extends BaseModel {
  name: string;
  code?: string;
  path?: string;
  component?: string;
  icon?: string;
  type?: 'menu' | 'button';
  parent_id?: number;
  sort: number;
  hidden: boolean;
  status: 'active' | 'inactive';
  permissions?: string;
  parent?: Menu;
  children?: Menu[];
}

// 用户角色关联 - 对应后端 UserRole
export interface UserRole {
  user_id: number;
  role_id: number;
  created_at: string;
}

// 角色权限关联 - 对应后端 RolePermission
export interface RolePermission {
  role_id: number;
  permission_id: number;
  created_at: string;
}

// ===== API 请求响应类型 =====

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    email?: string;
    phone?: string;
    org_id?: number;
    organization?: Organization;
    roles: Role[];
  };
}

// 刷新令牌响应
export interface RefreshTokenResponse {
  token: string;
}

// 用户信息响应
export interface UserInfoResponse {
  id: number;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  org_id?: number;
  organization?: Organization;
  roles: Role[];
  status: string;
}

// 创建用户请求
export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  phone?: string;
  email?: string;
  org_id?: number;
  status?: 'active' | 'inactive';
  role_ids?: number[];
}

// 更新用户请求
export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  email?: string;
  org_id?: number;
  status?: 'active' | 'inactive';
  role_ids?: number[];
}

// 修改密码请求
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// 用户查询参数
export interface UserQuery extends BaseQuery {
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
  org_id?: number;
  status?: 'active' | 'inactive';
  role_id?: number;
}

// 创建角色请求
export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  sort?: number;
  permission_ids?: number[];
}

// 更新角色请求
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
  sort?: number;
  permission_ids?: number[];
}

// 角色查询参数
export interface RoleQuery extends BaseQuery {
  code?: string;
  name?: string;
  status?: 'active' | 'inactive';
}

// 创建组织请求
export interface CreateOrganizationRequest {
  name: string;
  code?: string;
  type?: 'district' | 'street';
  parent_id?: number;
  sort?: number;
  status?: 'active' | 'inactive';
  street_id?: number;
  district_id?: number;
}

// 更新组织请求
export interface UpdateOrganizationRequest {
  name?: string;
  code?: string;
  type?: 'district' | 'street';
  parent_id?: number;
  sort?: number;
  status?: 'active' | 'inactive';
  street_id?: number;
  district_id?: number;
}

// 组织查询参数
export interface OrganizationQuery extends BaseQuery {
  name?: string;
  code?: string;
  type?: 'district' | 'street';
  parent_id?: number;
  status?: 'active' | 'inactive';
}

// 权限查询参数
export interface PermissionQuery extends BaseQuery {
  code?: string;
  name?: string;
  module?: string;
}

// 菜单查询参数
export interface MenuQuery extends BaseQuery {
  name?: string;
  code?: string;
  type?: 'menu' | 'button';
  parent_id?: number;
  status?: 'active' | 'inactive';
}

// 创建菜单请求
export interface CreateMenuRequest {
  name: string;
  code?: string;
  path?: string;
  component?: string;
  icon?: string;
  type?: 'menu' | 'button';
  parent_id?: number;
  sort?: number;
  hidden?: boolean;
  status?: 'active' | 'inactive';
  permissions?: string;
}

// 更新菜单请求
export interface UpdateMenuRequest {
  name?: string;
  code?: string;
  path?: string;
  component?: string;
  icon?: string;
  type?: 'menu' | 'button';
  parent_id?: number;
  sort?: number;
  hidden?: boolean;
  status?: 'active' | 'inactive';
  permissions?: string;
}

// 组织树节点
export interface OrganizationTreeNode {
  key: number;
  title: string;
  value: number;
  children?: OrganizationTreeNode[];
  disabled?: boolean;
  type?: 'district' | 'street';
}

// 菜单树节点
export interface MenuTreeNode {
  key: number;
  title: string;
  value: number;
  children?: MenuTreeNode[];
  disabled?: boolean;
  type?: 'menu' | 'button';
}

// 权限树节点
export interface PermissionTreeNode {
  key: number | string;
  title: string;
  value: number;
  children?: PermissionTreeNode[];
  disabled?: boolean;
  module?: string;
}