/**
 * 基础类型定义 - 与后端模型严格对应
 * 基于 backend/internal/model/base.go
 */

// 基础模型 - 对应后端 BaseModel
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

// 审计模型 - 对应后端 AuditModel
export interface AuditModel extends BaseModel {
  created_by: number;
  updated_by: number;
}

// API 统一响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页响应 - 与后端响应格式对应
export interface PaginatedResponse<T = any> {
  list: T[];
  page: number;
  page_size: number;
  total: number;
}

// 分页查询参数
export interface PaginationQuery {
  page?: number;
  page_size?: number;
  total?: boolean;
}

// 排序参数
export interface SortQuery {
  sort?: string;
  order?: 'asc' | 'desc';
}

// 基础查询参数
export interface BaseQuery extends PaginationQuery, SortQuery {
  [key: string]: any;
}

// 通用状态枚举 - 与后端状态字段对应
export type Status = 'active' | 'inactive' | 'normal' | 'disabled';

// 操作类型
export type OperationType = 'create' | 'update' | 'delete' | 'view';

// 表格操作配置
export interface TableAction<T = any> {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'danger';
  icon?: string;
  permission?: string;
  onClick?: (record: T) => void;
}

// 表单字段配置
export interface FormField {
  key: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'number' | 'date' | 'switch' | 'upload';
  required?: boolean;
  placeholder?: string;
  options?: Option[];
  rules?: any[];
}

// 树形数据结构
export interface TreeNode {
  key: string | number;
  title: string;
  value?: any;
  children?: TreeNode[];
  disabled?: boolean;
}

// 选项接口
export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
  children?: Option[];
}

// 文件上传响应
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

// 日期范围
export interface DateRange {
  startDate: string;
  endDate: string;
}

// 路由菜单项
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  permission?: string;
}

// 错误信息
export interface ErrorInfo {
  field: string;
  message: string;
}

// 坐标位置
export interface Coordinates {
  longitude: number;
  latitude: number;
}

// 地址信息
export interface AddressInfo {
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  detail?: string;
  full_address?: string;
}

// 统计数据项
export interface StatisticItem {
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

// 图表数据
export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

// 表格列配置
export interface TableColumn {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  fixed?: 'left' | 'right';
  sorter?: boolean;
  filters?: Array<{ text: string; value: any }>;
  render?: (value: any, record: any, index: number) => any;
}

// 搜索表单配置
export interface SearchForm {
  fields: FormField[];
  layout?: 'horizontal' | 'vertical' | 'inline';
  onSearch?: (values: any) => void;
  onReset?: () => void;
}