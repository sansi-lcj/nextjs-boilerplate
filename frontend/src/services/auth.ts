import { LoginRequest, LoginResponse, User } from '../types/user';
import { post, get, put } from '../utils/request';

// 存储键名
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// 登录
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

// 登出
export const logout = async (): Promise<void> => {
  try {
    await post('/auth/logout');
  } catch (error) {
    console.warn('Logout request failed:', error);
  }
};

// 刷新Token
export const refreshToken = async (token: string): Promise<LoginResponse> => {
  const response = await post<LoginResponse>('/auth/refresh', {
    refreshToken: token,
  });
  return response.data;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await get<User>('/auth/me');
  return response.data;
};

// 修改密码
export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> => {
  await put('/auth/password', data);
};

// 存储认证信息
export const saveAuthInfo = (authData: LoginResponse): void => {
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
    const response = await refreshToken(refreshTokenValue);
    saveAuthInfo(response);
    return response;
  } catch (error) {
    console.warn('Auto refresh token failed:', error);
    clearAuthInfo();
    return null;
  }
};

// 权限检查
export const hasPermission = (permission: string): boolean => {
  const user = getStoredUser();
  if (!user || !user.permissions) return false;
  
  return user.permissions.includes(permission);
};

// 角色检查
export const hasRole = (roleCode: string): boolean => {
  const user = getStoredUser();
  if (!user || !user.roles) return false;
  
  return user.roles.some(role => role.code === roleCode);
};

// 检查是否为管理员
export const isAdmin = (): boolean => {
  return hasRole('admin') || hasRole('super_admin');
};