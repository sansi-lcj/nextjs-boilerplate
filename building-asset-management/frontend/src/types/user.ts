// 用户相关类型定义

export interface User {
  id: number;
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
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: number;
  name: string;
  code: string;
  type: 'district' | 'street';
  parent_id?: number;
  sort: number;
  status: 'active' | 'inactive';
  street_id?: number;
  district_id?: number;
  parent?: Organization;
  children?: Organization[];
}

export interface Role {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  sort: number;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  code: string;
  name: string;
  module: string;
  description?: string;
}

export interface Menu {
  id: number;
  name: string;
  code: string;
  path?: string;
  component?: string;
  icon?: string;
  type: 'menu' | 'button';
  parent_id?: number;
  sort: number;
  hidden: boolean;
  status: 'active' | 'inactive';
  permissions?: string;
  parent?: Menu;
  children?: Menu[];
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

// 用户查询参数
export interface UserQueryParams {
  username?: string;
  name?: string;
  orgId?: number;
  status?: string;
  page?: number;
  size?: number;
}