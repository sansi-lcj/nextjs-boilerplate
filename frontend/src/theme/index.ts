import { ThemeConfig } from 'antd';

// Ant Design 5.0 设计规范配置
const borderRadius = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
};

// 亮色主题配置
export const lightTheme: ThemeConfig = {
  token: {
    // 主色系
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    // 四级圆角 - Ant Design 5 规范
    borderRadius: borderRadius.md,
    borderRadiusXS: borderRadius.xs,
    borderRadiusSM: borderRadius.sm,
    borderRadiusLG: borderRadius.lg,

    // 阴影系统 - 两级阴影
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

    // 背景色
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',

    // 文字色
    colorText: '#000000d9',
    colorTextSecondary: '#00000073',
    colorTextTertiary: '#00000040',

    // 边框色
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',

    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: 14,
    lineHeight: 1.5714285714285714,

    // 间距
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,

    // 控件高度
    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,

    // 动画配置
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  },
  components: {
    Layout: {
      colorBgHeader: '#ffffff',
      colorBgBody: '#f5f5f5',
      colorBgTrigger: '#ffffff',
    },
    Menu: {
      itemHoverBg: '#f5f5f5',
      itemSelectedBg: '#e6f4ff',
      itemActiveBg: '#bae0ff',
    },
    Card: {
      paddingLG: 24,
    },
    Button: {
      paddingInline: 15,
      fontWeight: 500,
    },
    Input: {
      paddingBlock: 4,
      paddingInline: 11,
    },
    Table: {
      headerBg: '#fafafa',
      borderColor: '#f0f0f0',
      rowHoverBg: '#fafafa',
    },
    Modal: {
      paddingLG: 24,
    },
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    },
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
    },
    Form: {
      labelFontSize: 14,
      labelColor: '#000000d9',
      labelRequiredMarkColor: '#ff4d4f',
    },
    Notification: {
      zIndexPopup: 1050,
    },
    Message: {
      zIndexPopup: 1010,
    },
  },
};

// 深色主题配置
export const darkTheme: ThemeConfig = {
  token: {
    // 主色系 - 深色模式调亮
    colorPrimary: '#4096ff',
    colorSuccess: '#73d13d',
    colorWarning: '#ffc53d',
    colorError: '#ff7875',
    colorInfo: '#40a9ff',

    // 四级圆角
    borderRadius: borderRadius.md,
    borderRadiusXS: borderRadius.xs,
    borderRadiusSM: borderRadius.sm,
    borderRadiusLG: borderRadius.lg,

    // 阴影系统 - 深色模式增强
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.16), 0 1px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.09)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 9px 28px 8px rgba(0, 0, 0, 0.20)',

    // 背景色 - 深色模式
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
    colorBgLayout: '#000000',

    // 文字色 - 深色模式
    colorText: '#ffffffd9',
    colorTextSecondary: '#ffffff73',
    colorTextTertiary: '#ffffff40',

    // 边框色 - 深色模式
    colorBorder: '#424242',
    colorBorderSecondary: '#303030',

    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: 14,
    lineHeight: 1.5714285714285714,

    // 间距
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,

    // 控件高度
    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,

    // 动画配置
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  },
  components: {
    Layout: {
      colorBgHeader: '#1f1f1f',
      colorBgBody: '#000000',
      colorBgTrigger: '#1f1f1f',
    },
    Menu: {
      itemBg: '#1a1a1a',
      itemHoverBg: '#ffffff0f',
      itemSelectedBg: '#177ddc1a',
      itemActiveBg: '#177ddc33',
      darkItemBg: '#1a1a1a',
      darkItemColor: '#ffffffd9',
      darkItemHoverBg: '#ffffff0f',
      darkItemSelectedBg: '#177ddc1a',
      darkItemHoverColor: '#4096ff',
      darkItemSelectedColor: '#4096ff',
    },
    Card: {
      colorBgContainer: '#1f1f1f',
      colorTextHeading: '#ffffffd9',
      colorText: '#ffffff73',
      paddingLG: 24,
    },
    Button: {
      colorText: '#ffffffd9',
      colorBgContainer: '#1f1f1f',
      colorBorder: '#424242',
      paddingInline: 15,
      fontWeight: 500,
    },
    Input: {
      colorText: '#ffffffd9',
      colorBgContainer: '#1f1f1f',
      colorBorder: '#424242',
      colorTextPlaceholder: '#ffffff40',
      paddingBlock: 4,
      paddingInline: 11,
    },
    Select: {
      colorText: '#ffffffd9',
      colorBgContainer: '#1f1f1f',
      colorBgElevated: '#262626',
      colorBorder: '#424242',
      colorTextPlaceholder: '#ffffff40',
    },
    Table: {
      colorBgContainer: '#1f1f1f',
      headerBg: '#262626',
      borderColor: '#303030',
      rowHoverBg: '#262626',
      colorText: '#ffffffd9',
      colorTextHeading: '#ffffffd9',
    },
    Modal: {
      colorBgElevated: '#1f1f1f',
      colorText: '#ffffffd9',
      colorTextHeading: '#ffffffd9',
      paddingLG: 24,
    },
    Tooltip: {
      colorBgSpotlight: '#262626',
      colorTextLightSolid: '#ffffffd9',
    },
    Popover: {
      colorBgElevated: '#262626',
      colorText: '#ffffffd9',
      colorBorder: '#424242',
    },
    Dropdown: {
      colorBgElevated: '#262626',
      colorText: '#ffffffd9',
      colorBorder: '#424242',
    },
    Form: {
      colorText: '#ffffffd9',
      labelColor: '#ffffffd9',
      colorTextDescription: '#ffffff73',
      colorError: '#ff7875',
      labelFontSize: 14,
      labelRequiredMarkColor: '#ff7875',
    },
    Statistic: {
      colorText: '#ffffffd9',
      colorTextDescription: '#ffffff73',
      titleFontSize: 14,
      contentFontSize: 24,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    },
    Typography: {
      colorText: '#ffffffd9',
      colorTextSecondary: '#ffffff73',
      colorTextDisabled: '#ffffff40',
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
    },
    Badge: {
      colorBgContainer: '#1f1f1f',
      colorText: '#ffffffd9',
    },
    Tag: {
      colorText: '#ffffffd9',
      colorBgContainer: '#1f1f1f',
      colorBorder: '#424242',
    },
    Alert: {
      colorText: '#ffffffd9',
      colorBgContainer: '#1f1f1f',
      colorBorder: '#424242',
    },
    Notification: {
      colorBgElevated: '#262626',
      colorText: '#ffffffd9',
      colorTextHeading: '#ffffffd9',
      zIndexPopup: 1050,
    },
    Message: {
      colorBgElevated: '#262626',
      colorText: '#ffffffd9',
      zIndexPopup: 1010,
    },
  },
};

// 主题类型
export type ThemeMode = 'light' | 'dark' | 'auto';

// 主题切换 Hook
export interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

// 获取系统主题偏好
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// 主题工具函数
export const getThemeConfig = (mode: ThemeMode): ThemeConfig => {
  if (mode === 'auto') {
    return getSystemTheme() === 'dark' ? darkTheme : lightTheme;
  }
  return mode === 'dark' ? darkTheme : lightTheme;
};

export const getIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'auto') {
    return getSystemTheme() === 'dark';
  }
  return mode === 'dark';
}; 