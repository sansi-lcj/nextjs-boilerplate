// @ts-nocheck
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { User, LoginRequest, LoginResponse } from '../../types/user';
import * as authService from '../../services/auth';
import { MessageUtils } from '../../utils/message';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokenAsync: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    user: authService.getStoredUser(),
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: authService.isAuthenticated(),
    loading: false,
    error: null,

    login: async (credentials: LoginRequest) => {
      try {
        set({ loading: true, error: null });
        const response = await authService.login(credentials);
        authService.saveAuthInfo(response);
        
        set({
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken || null,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        
        MessageUtils.success('登录成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '登录失败';
        set({
          loading: false,
          error: errorMessage,
          isAuthenticated: false,
        });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    logout: async () => {
      try {
        set({ loading: true });
        await authService.logout();
        authService.clearAuthInfo();
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
        
        MessageUtils.success('退出成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '退出失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    refreshTokenAsync: async () => {
      try {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await authService.refreshToken(refreshToken);
        authService.saveAuthInfo(response);
        
        set({
          token: response.token,
          refreshToken: response.refreshToken || null,
          error: null,
        });
      } catch (error: any) {
        // Token 刷新失败，清除认证信息
        authService.clearAuthInfo();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: 'Token已过期，请重新登录',
        });
        throw error;
      }
    },

    getCurrentUser: async () => {
      try {
        set({ loading: true, error: null });
        const user = await authService.getCurrentUser();
        
        set({
          user: user,
          loading: false,
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取用户信息失败';
        set({
          loading: false,
          error: errorMessage,
        });
      }
    },

    setUser: (user: User | null) => {
      set({ user });
    },

    clearAuth: () => {
      authService.clearAuthInfo();
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    },

    clearError: () => {
      set({ error: null });
    },

    setLoading: (loading: boolean) => {
      set({ loading });
    },
  }))
);

// 自动监听认证状态变化
useAuthStore.subscribe(
  (state: AuthState) => state.isAuthenticated,
  (isAuthenticated: boolean) => {
    if (!isAuthenticated) {
      // 清理其他相关状态
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
);

export default useAuthStore;