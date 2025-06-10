import { http } from '../utils/request';
import type { User, Role, LoginRequest, LoginResponse, ChangePasswordRequest } from '../types/user';
import type { LoginFormData } from '../types/auth';
import type { ApiResponse } from '../types/index';

// 本地存储键名常量
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// 定义本地接口
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email?: string;
  phone?: string;
}

interface UpdatePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
}

// 扩展LoginResponse来包含refreshToken
interface ExtendedLoginResponse extends LoginResponse {
  refreshToken?: string;
}

/**
 * 认证服务类
 */
export class AuthService {
  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>('/auth/login', data);
    return response;
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    await http.post('/auth/logout');
  }

  /**
   * 刷新Token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await http.post<ApiResponse<LoginResponse>>('/auth/refresh', data);
    return response.data;
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    const response = await http.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  /**
   * 用户注册
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await http.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  }

  /**
   * 修改密码
   */
  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    await http.post('/auth/password/update', data);
  }

  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await http.post('/auth/password/reset', data);
  }

  /**
   * 验证Token有效性
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取用户权限列表
   */
  async getUserPermissions(): Promise<string[]> {
    const response = await http.get<ApiResponse<string[]>>('/auth/permissions');
    return response.data;
  }

  /**
   * 获取用户菜单
   */
  async getUserMenus(): Promise<any[]> {
    const response = await http.get<ApiResponse<any[]>>('/auth/menus');
    return response.data;
  }

  /**
   * 检查用户是否有指定权限
   */
  async hasPermission(permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions();
    return permissions.includes(permission) || permissions.includes('*');
  }

  /**
   * 检查用户是否有指定角色
   */
  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user.roles ? user.roles.some((r: Role) => r.code === role) : false;
  }
}

// 导出服务实例
export const authService = new AuthService();

// 修改密码
export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> => {
  await http.post('/auth/password', data);
};

// 存储认证信息
export const saveAuthInfo = (authData: ExtendedLoginResponse): void => {
  localStorage.setItem(TOKEN_KEY, authData.token);
  if (authData.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
  }
  localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
};

// 清除认证信息
export const clearAuthInfo = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// 获取存储的token
export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 获取存储的refresh token
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// 获取存储的用户信息
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.warn('Failed to parse stored user data:', error);
    return null;
  }
};

// 检查是否已认证
export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user);
};

// 检查token是否过期
export const isTokenExpired = (token?: string): boolean => {
  const tokenToCheck = token || getStoredToken();
  if (!tokenToCheck) return true;

  try {
    const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.warn('Failed to parse token:', error);
    return true;
  }
};

// 获取token过期时间
export const getTokenExpiration = (token?: string): number | null => {
  const tokenToCheck = token || getStoredToken();
  if (!tokenToCheck) return null;

  try {
    const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
    return payload.exp * 1000; // 转换为毫秒
  } catch (error) {
    console.warn('Failed to parse token expiration:', error);
    return null;
  }
};

// 自动刷新token
export const autoRefreshToken = async (): Promise<LoginResponse | null> => {
  const refreshTokenValue = getStoredRefreshToken();
  if (!refreshTokenValue || isTokenExpired(refreshTokenValue)) {
    return null;
  }

  try {
    const response = await authService.refreshToken({
      refreshToken: refreshTokenValue,
    });
    saveAuthInfo(response);
    return response;
  } catch (error) {
    console.warn('Auto refresh token failed:', error);
    clearAuthInfo();
    return null;
  }
};

// 检查是否为管理员
export const isAdmin = (): boolean => {
  const user = getStoredUser();
  return !!(user && user.roles && (
    user.roles.some((r: Role) => r.code === 'admin') || 
    user.roles.some((r: Role) => r.code === 'super_admin')
  ));
};