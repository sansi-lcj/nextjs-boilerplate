/**
 * 认证相关类型定义 - 与后端API严格对应
 * 基于 backend/api/v1/auth.go
 */

import { User, Role, Organization, Menu } from './user';

// ===== JWT 认证相关类型 =====

// JWT Claims - 对应后端 auth.Claims
export interface JWTClaims {
  UserID: number;
  Username: string;
  Name: string;
  Roles: string[];
  exp: number;
  iat: number;
  iss: string;
}

// Token 信息
export interface TokenInfo {
  token: string;
  expires_at: number;
  refresh_token?: string;
  refresh_expires_at?: number;
}

// ===== 认证状态类型 =====

// 认证状态
export interface AuthState {
  // 基础状态
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 用户信息
  user: User | null;
  
  // Token 信息
  token: string | null;
  tokenExpiry: number | null;
  
  // 权限信息
  roles: Role[];
  permissions: string[];
  menus: Menu[];
  
  // 其他状态
  lastLoginTime: string | null;
  rememberMe: boolean;
}

// 认证错误类型
export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ===== 登录相关类型 =====

// 登录表单数据
export interface LoginFormData {
  username: string;
  password: string;
  remember?: boolean;
  captcha?: string;
}

// 登录验证规则
export interface LoginValidationRules {
  username: {
    required: boolean;
    minLength: number;
    maxLength: number;
    pattern?: RegExp;
  };
  password: {
    required: boolean;
    minLength: number;
    maxLength: number;
    pattern?: RegExp;
  };
  captcha?: {
    required: boolean;
    length: number;
  };
}

// 验证码信息
export interface CaptchaInfo {
  key: string;
  image: string;
  expires_at: number;
}

// ===== 权限相关类型 =====

// 权限检查参数
export interface PermissionCheckParams {
  permissions: string[];
  mode?: 'all' | 'any'; // all: 需要所有权限，any: 需要任一权限
}

// 角色检查参数
export interface RoleCheckParams {
  roles: string[];
  mode?: 'all' | 'any';
}

// 权限守卫配置
export interface PermissionGuardConfig {
  permissions?: string[];
  roles?: string[];
  mode?: 'all' | 'any';
  fallback?: () => void;
  onUnauthorized?: (missing: string[]) => void;
}

// ===== 认证动作类型 =====

// 认证动作类型
export type AuthActionType = 
  | 'LOGIN_START'
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'TOKEN_REFRESH_START'
  | 'TOKEN_REFRESH_SUCCESS'
  | 'TOKEN_REFRESH_FAILURE'
  | 'USER_INFO_UPDATE'
  | 'PERMISSIONS_UPDATE'
  | 'CLEAR_ERROR'
  | 'SET_LOADING';

// 认证动作接口
export interface AuthAction {
  type: AuthActionType;
  payload?: any;
}

// ===== 会话相关类型 =====

// 会话信息
export interface SessionInfo {
  id: string;
  user_id: number;
  username: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
}

// 会话统计
export interface SessionStatistics {
  total_sessions: number;
  active_sessions: number;
  expired_sessions: number;
  avg_session_duration: number;
  peak_concurrent_sessions: number;
}

// ===== 安全相关类型 =====

// 密码强度等级
export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very_strong';

// 密码强度检查结果
export interface PasswordStrengthResult {
  score: number;
  strength: PasswordStrength;
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}

// 密码策略配置
export interface PasswordPolicy {
  min_length: number;
  max_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
  forbid_common_passwords: boolean;
  forbid_personal_info: boolean;
  max_age_days?: number;
  history_count?: number;
}

// 账户锁定信息
export interface AccountLockInfo {
  is_locked: boolean;
  locked_at?: string;
  locked_until?: string;
  failed_attempts: number;
  max_attempts: number;
  remaining_attempts: number;
}

// ===== 登录日志类型 =====

// 登录日志
export interface LoginLog {
  id: number;
  user_id: number;
  username: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  status: 'success' | 'failed';
  failure_reason?: string;
  created_at: string;
}

// 登录统计
export interface LoginStatistics {
  total_attempts: number;
  successful_logins: number;
  failed_logins: number;
  success_rate: number;
  unique_users: number;
  peak_login_time: string;
  common_failure_reasons: Record<string, number>;
}

// ===== 认证配置类型 =====

// 认证配置
export interface AuthConfig {
  // JWT 配置
  jwt: {
    secret: string;
    expires_in: number;
    refresh_expires_in: number;
    issuer: string;
  };
  
  // 登录配置
  login: {
    max_attempts: number;
    lockout_duration: number;
    require_captcha_after: number;
    remember_me_duration: number;
  };
  
  // 密码配置
  password: PasswordPolicy;
  
  // 会话配置
  session: {
    timeout: number;
    max_concurrent: number;
    extend_on_activity: boolean;
  };
}

// ===== OAuth 相关类型 =====

// OAuth 提供商
export type OAuthProvider = 'google' | 'github' | 'microsoft' | 'dingtalk' | 'wechat';

// OAuth 配置
export interface OAuthConfig {
  provider: OAuthProvider;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string[];
  enabled: boolean;
}

// OAuth 用户信息
export interface OAuthUserInfo {
  provider: OAuthProvider;
  provider_id: string;
  email?: string;
  name?: string;
  avatar?: string;
  raw_data?: Record<string, any>;
}

// ===== 多因素认证类型 =====

// MFA 方式
export type MFAMethod = 'totp' | 'sms' | 'email' | 'backup_codes';

// MFA 配置
export interface MFAConfig {
  enabled: boolean;
  required: boolean;
  methods: MFAMethod[];
  backup_codes_count: number;
}

// TOTP 配置
export interface TOTPConfig {
  secret: string;
  qr_code: string;
  backup_codes: string[];
  is_verified: boolean;
}

// MFA 验证请求
export interface MFAVerifyRequest {
  method: MFAMethod;
  code: string;
  backup_code?: string;
}

// ===== 类型守卫和工具类型 =====

// 检查是否已认证
export const isAuthenticated = (state: AuthState): boolean => {
  return state.isAuthenticated && 
         state.user !== null && 
         state.token !== null &&
         (state.tokenExpiry === null || state.tokenExpiry > Date.now());
};

// 检查是否有权限
export const hasPermission = (state: AuthState, permission: string): boolean => {
  return state.permissions.includes(permission);
};

// 检查是否有任一权限
export const hasAnyPermission = (state: AuthState, permissions: string[]): boolean => {
  return permissions.some(permission => state.permissions.includes(permission));
};

// 检查是否有所有权限
export const hasAllPermissions = (state: AuthState, permissions: string[]): boolean => {
  return permissions.every(permission => state.permissions.includes(permission));
};

// 检查是否有角色
export const hasRole = (state: AuthState, role: string): boolean => {
  return state.roles.some(r => r.code === role || r.name === role);
};

// 检查是否有任一角色
export const hasAnyRole = (state: AuthState, roles: string[]): boolean => {
  return roles.some(role => hasRole(state, role));
};

// 检查是否有所有角色
export const hasAllRoles = (state: AuthState, roles: string[]): boolean => {
  return roles.every(role => hasRole(state, role));
};

// Token 是否即将过期（15分钟内）
export const isTokenExpiringSoon = (state: AuthState): boolean => {
  if (!state.tokenExpiry) return false;
  const fifteenMinutes = 15 * 60 * 1000;
  return state.tokenExpiry - Date.now() < fifteenMinutes;
};

// 获取剩余过期时间（毫秒）
export const getTokenTimeToExpiry = (state: AuthState): number => {
  if (!state.tokenExpiry) return 0;
  return Math.max(0, state.tokenExpiry - Date.now());
};

// ===== 认证上下文类型 =====

// 认证上下文
export interface AuthContextType {
  // 状态
  state: AuthState;
  
  // 认证操作
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  
  // 用户操作
  updateUserInfo: (userInfo: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  
  // 权限检查
  checkPermission: (permission: string) => boolean;
  checkPermissions: (permissions: string[], mode?: 'all' | 'any') => boolean;
  checkRole: (role: string) => boolean;
  checkRoles: (roles: string[], mode?: 'all' | 'any') => boolean;
  
  // 工具方法
  isAuthenticated: () => boolean;
  isTokenExpiringSoon: () => boolean;
  getTokenTimeToExpiry: () => number;
}

// ===== 认证 Hook 类型 =====

// useAuth Hook 返回类型
export interface UseAuthReturn extends AuthContextType {}

// usePermission Hook 参数类型
export interface UsePermissionParams {
  permissions?: string[];
  roles?: string[];
  mode?: 'all' | 'any';
  redirect?: string;
  fallback?: () => void;
}

// usePermission Hook 返回类型
export interface UsePermissionReturn {
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== 路由守卫类型 =====

// 路由守卫配置
export interface RouteGuardConfig {
  requireAuth?: boolean;
  permissions?: string[];
  roles?: string[];
  mode?: 'all' | 'any';
  redirect?: string;
  fallback?: any;
}

// 私有路由属性
export interface PrivateRouteProps {
  children: any;
  permissions?: string[];
  roles?: string[];
  mode?: 'all' | 'any';
  redirect?: string;
  fallback?: any;
} 