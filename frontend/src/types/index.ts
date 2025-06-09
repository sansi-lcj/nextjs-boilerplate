// 通用类型定义

// API响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页数据
export interface PageData<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

// 分页参数
export interface PageParams {
  page?: number;
  size?: number;
}

// 通用状态
export type Status = 'normal' | 'disabled' | 'active' | 'inactive';

// 日期范围
export interface DateRange {
  startDate: string;
  endDate: string;
}