import { post } from '../utils/request';
import { LoginRequest, LoginResponse, User } from '../types/user';
import { ApiResponse } from '../types';

// 用户登录
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await post<LoginResponse>('/auth/login', data);
  return res.data;
}

// 用户登出
export async function logout(): Promise<void> {
  await post('/auth/logout');
}

// 刷新Token
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  const res = await post<LoginResponse>('/auth/refresh', { refreshToken });
  return res.data;
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<User> {
  const res = await post<User>('/auth/current');
  return res.data;
}

// 保存认证信息到本地存储
export function saveAuthInfo(authInfo: LoginResponse): void {
  localStorage.setItem('token', authInfo.token);
  localStorage.setItem('refreshToken', authInfo.refreshToken);
  localStorage.setItem('user', JSON.stringify(authInfo.user));
}

// 清除认证信息
export function clearAuthInfo(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

// 获取本地存储的用户信息
export function getStoredUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}