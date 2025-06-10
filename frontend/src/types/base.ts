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

// 分页响应
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

// 通用状态枚举
export type Status = 'active' | 'inactive' | 'normal' | 'disabled';

// 操作类型
export type OperationType = 'create' | 'update' | 'delete' | 'view';

// 表格操作接口
export interface TableAction {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'danger';
  icon?: React.ReactNode;
  permission?: string;
}

// 表单字段配置
export interface FormField {
  key: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'number' | 'date' | 'switch';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
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
}

// 文件上传响应
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}