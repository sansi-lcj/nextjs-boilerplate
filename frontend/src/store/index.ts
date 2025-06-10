// @ts-nocheck
// Zustand stores 集中导出和管理

export { default as useAuthStore } from './slices/authSlice';
export { default as useAssetStore } from './slices/assetSlice';

// Store 类型定义
export type { AuthState } from './slices/authSlice';
export type { AssetState } from './slices/assetSlice';

// 创建系统状态管理 store (如果需要的话)
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface SystemState {
  theme: 'light' | 'dark';
  sidebar: {
    collapsed: boolean;
    width: number;
  };
  language: 'zh-CN' | 'en-US';
  setTheme: (theme: 'light' | 'dark') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setLanguage: (language: 'zh-CN' | 'en-US') => void;
}

export const useSystemStore = create<SystemState>()(
  subscribeWithSelector((set) => ({
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    sidebar: {
      collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
      width: parseInt(localStorage.getItem('sidebarWidth') || '256'),
    },
    language: (localStorage.getItem('language') as 'zh-CN' | 'en-US') || 'zh-CN',
    
    setTheme: (theme: 'light' | 'dark') => {
      localStorage.setItem('theme', theme);
      set({ theme });
    },
    
    setSidebarCollapsed: (collapsed: boolean) => {
      localStorage.setItem('sidebarCollapsed', collapsed.toString());
      set((state) => ({
        sidebar: { ...state.sidebar, collapsed }
      }));
    },
    
    setSidebarWidth: (width: number) => {
      localStorage.setItem('sidebarWidth', width.toString());
      set((state) => ({
        sidebar: { ...state.sidebar, width }
      }));
    },
    
    setLanguage: (language: 'zh-CN' | 'en-US') => {
      localStorage.setItem('language', language);
      set({ language });
    },
  }))
);

// 存储重置功能
export const resetAllStores = () => {
  // 导入 stores 并调用 reset 方法
  const { default: useAssetStore } = require('./slices/assetSlice');
  const { default: useAuthStore } = require('./slices/authSlice');
  
  useAssetStore.getState().reset();
  useAuthStore.getState().clearAuth();
};