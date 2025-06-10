// 通用响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
  traceId?: string;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: boolean;
}

// 分页响应
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 排序参数
export interface SortParams {
  sort?: string;
  order?: 'asc' | 'desc';
}

// 查询参数基类
export interface BaseQueryParams extends PaginationParams, SortParams {
  [key: string]: any;
}

// 表单状态
export interface FormState<T> {
  values: T;
  loading: boolean;
  errors: Record<string, string>;
}

// 列表状态
export interface ListState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

// 操作状态
export interface OperationState {
  loading: boolean;
  error: string | null;
}

// 通用状态枚举
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled',
  DELETED = 'deleted'
}

// 权限操作枚举
export enum Permission {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXPORT = 'export'
}

// 菜单类型
export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  component?: string;
  permission?: string;
  sort: number;
  type: 'menu' | 'button' | 'directory';
  visible: boolean;
  status: Status;
  children?: MenuItem[];
  parentId?: string;
}

// 通用选项类型
export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// 文件上传类型
export interface UploadFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  status: 'uploading' | 'done' | 'error';
} 