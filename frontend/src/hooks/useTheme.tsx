import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeMode, ThemeContextType, getThemeConfig, getIsDark, getSystemTheme } from '../theme';

// 主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 本地存储键名
const THEME_STORAGE_KEY = 'building-asset-theme';

// 获取初始主题
const getInitialTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      return saved as ThemeMode;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return 'auto';
};

interface ThemeProviderProps {
  children: ReactNode;
}

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [isDark, setIsDark] = useState(() => getIsDark(getInitialTheme()));

  // 设置主题
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setIsDark(getIsDark(newTheme));
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
    setTheme(newTheme);
  };

  // 监听系统主题变化（当theme为auto时）
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        setIsDark(getSystemTheme() === 'dark');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // 更新body的数据属性，用于CSS-in-JS样式
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-dark', isDark.toString());
    
    // 更新meta主题色
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1f1f1f' : '#ffffff');
    }
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 主题Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 获取当前主题配置的Hook
export const useThemeConfig = () => {
  const { theme } = useTheme();
  return getThemeConfig(theme);
};

// 获取是否为深色模式的Hook
export const useIsDark = () => {
  const { isDark } = useTheme();
  return isDark;
}; 