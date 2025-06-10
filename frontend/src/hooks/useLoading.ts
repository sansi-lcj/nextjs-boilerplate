import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface UseLoadingReturn {
  loading: LoadingState;
  isLoading: (key?: string) => boolean;
  setLoading: (key: string, value: boolean) => void;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  executeWithLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
  isAnyLoading: () => boolean;
}

/**
 * 统一Loading状态管理Hook
 * 支持多个Loading状态的管理，常用于表单提交、数据加载等场景
 */
export const useLoading = (initialState?: LoadingState): UseLoadingReturn => {
  const [loading, setLoadingState] = useState<LoadingState>(initialState || {});

  // 检查特定key是否在loading
  const isLoading = useCallback((key?: string): boolean => {
    if (!key) return Object.values(loading).some(Boolean);
    return loading[key] || false;
  }, [loading]);

  // 设置loading状态
  const setLoading = useCallback((key: string, value: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // 开始loading
  const startLoading = useCallback((key: string) => {
    setLoading(key, true);
  }, [setLoading]);

  // 停止loading
  const stopLoading = useCallback((key: string) => {
    setLoading(key, false);
  }, [setLoading]);

  // 执行异步操作并自动管理loading状态
  const executeWithLoading = useCallback(async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    try {
      startLoading(key);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  // 检查是否有任何loading状态
  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loading).some(Boolean);
  }, [loading]);

  return {
    loading,
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    executeWithLoading,
    isAnyLoading,
  };
};

// 常用的loading键值
export const LoadingKeys = {
  // 通用操作
  SAVE: 'save',
  DELETE: 'delete',
  UPDATE: 'update',
  CREATE: 'create',
  LOAD: 'load',
  SEARCH: 'search',
  REFRESH: 'refresh',
  
  // 表单操作
  FORM_SUBMIT: 'form_submit',
  FORM_VALIDATE: 'form_validate',
  
  // 数据操作
  FETCH_LIST: 'fetch_list',
  FETCH_DETAIL: 'fetch_detail',
  
  // 文件操作
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  
  // 批量操作
  BATCH_DELETE: 'batch_delete',
  BATCH_UPDATE: 'batch_update',
  
  // 导入导出
  IMPORT: 'import',
  EXPORT: 'export',
};

export default useLoading; 