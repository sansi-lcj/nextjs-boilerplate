/**
 * 资产相关类型定义 - 与后端模型严格对应
 * 基于 backend/internal/model/asset.go
 */

import { AuditModel, BaseQuery, Coordinates } from './index';
import { Organization } from './user';

// 字符串数组类型 - 对应后端 StringArray
export type StringArray = string[];

// 资产模型 - 对应后端 Asset
export interface Asset extends AuditModel {
  asset_code: string;
  asset_name: string;
  street_id: number;
  address?: string;
  longitude?: number;
  latitude?: number;
  land_nature?: string;
  total_area?: number;
  rentable_area?: number;
  asset_tags?: StringArray;
  description?: string;
  status: 'normal' | 'disabled';
  street?: Organization;
  buildings?: Building[];
}

// 楼宇模型 - 对应后端 Building
export interface Building extends AuditModel {
  building_code: string;
  building_name: string;
  asset_id: number;
  building_type?: string;
  total_floors?: number;
  underground_floors?: number;
  total_area?: number;
  rentable_area?: number;
  construction_year?: string;
  elevator_count?: number;
  parking_spaces?: number;
  green_rate?: number;
  property_company?: string;
  property_phone?: string;
  features?: StringArray;
  description?: string;
  status: 'normal' | 'disabled';
  asset?: Asset;
  floors?: Floor[];
}

// 楼层模型 - 对应后端 Floor
export interface Floor extends AuditModel {
  building_id: number;
  floor_number: number;
  floor_name?: string;
  floor_area?: number;
  rentable_area?: number;
  rented_area?: number;
  avg_rent_price?: number;
  occupancy_rate?: number;
  description?: string;
  status: 'normal' | 'disabled';
  building?: Building;
  rooms?: Room[];
}

// 房间模型 - 对应后端 Room
export interface Room extends AuditModel {
  floor_id: number;
  room_number?: string;
  room_type?: 'office' | 'meeting' | 'other';
  room_area?: number;
  rent_price?: number;
  decoration?: 'blank' | 'simple' | 'luxury';
  orientation?: 'east' | 'south' | 'west' | 'north';
  has_window?: boolean;
  has_ac?: boolean;
  description?: string;
  status: 'available' | 'rented' | 'maintenance';
  floor?: Floor;
}

// 街道模型 - 对应后端 Street
export interface Street {
  id: number;
  name: string;
  code?: string;
}

// ===== API 请求响应类型 =====

// 资产查询参数
export interface AssetQuery extends BaseQuery {
  asset_code?: string;
  asset_name?: string;
  street_id?: number;
  address?: string;
  land_nature?: string;
  status?: 'normal' | 'disabled';
  longitude?: number;
  latitude?: number;
  total_area_min?: number;
  total_area_max?: number;
  rentable_area_min?: number;
  rentable_area_max?: number;
  asset_tags?: string[];
}

// 创建资产请求
export interface CreateAssetRequest {
  asset_code: string;
  asset_name: string;
  street_id: number;
  address?: string;
  longitude?: number;
  latitude?: number;
  land_nature?: string;
  total_area?: number;
  rentable_area?: number;
  asset_tags?: StringArray;
  description?: string;
  status?: 'normal' | 'disabled';
}

// 更新资产请求
export interface UpdateAssetRequest {
  asset_name?: string;
  street_id?: number;
  address?: string;
  longitude?: number;
  latitude?: number;
  land_nature?: string;
  total_area?: number;
  rentable_area?: number;
  asset_tags?: StringArray;
  description?: string;
  status?: 'normal' | 'disabled';
}

// 楼宇查询参数
export interface BuildingQuery extends BaseQuery {
  building_code?: string;
  building_name?: string;
  asset_id?: number;
  building_type?: string;
  status?: 'normal' | 'disabled';
  total_floors_min?: number;
  total_floors_max?: number;
  total_area_min?: number;
  total_area_max?: number;
  rentable_area_min?: number;
  rentable_area_max?: number;
  construction_year?: string;
  elevator_count_min?: number;
  elevator_count_max?: number;
  parking_spaces_min?: number;
  parking_spaces_max?: number;
  green_rate_min?: number;
  green_rate_max?: number;
  property_company?: string;
  features?: string[];
}

// 创建楼宇请求
export interface CreateBuildingRequest {
  building_code: string;
  building_name: string;
  asset_id: number;
  building_type?: string;
  total_floors?: number;
  underground_floors?: number;
  total_area?: number;
  rentable_area?: number;
  construction_year?: string;
  elevator_count?: number;
  parking_spaces?: number;
  green_rate?: number;
  property_company?: string;
  property_phone?: string;
  features?: StringArray;
  description?: string;
  status?: 'normal' | 'disabled';
}

// 更新楼宇请求
export interface UpdateBuildingRequest {
  building_name?: string;
  asset_id?: number;
  building_type?: string;
  total_floors?: number;
  underground_floors?: number;
  total_area?: number;
  rentable_area?: number;
  construction_year?: string;
  elevator_count?: number;
  parking_spaces?: number;
  green_rate?: number;
  property_company?: string;
  property_phone?: string;
  features?: StringArray;
  description?: string;
  status?: 'normal' | 'disabled';
}

// 楼层查询参数
export interface FloorQuery extends BaseQuery {
  building_id?: number;
  floor_number?: number;
  floor_name?: string;
  status?: 'normal' | 'disabled';
  floor_area_min?: number;
  floor_area_max?: number;
  rentable_area_min?: number;
  rentable_area_max?: number;
  rented_area_min?: number;
  rented_area_max?: number;
  avg_rent_price_min?: number;
  avg_rent_price_max?: number;
  occupancy_rate_min?: number;
  occupancy_rate_max?: number;
}

// 创建楼层请求
export interface CreateFloorRequest {
  building_id: number;
  floor_number: number;
  floor_name?: string;
  floor_area?: number;
  rentable_area?: number;
  rented_area?: number;
  avg_rent_price?: number;
  occupancy_rate?: number;
  description?: string;
  status?: 'normal' | 'disabled';
}

// 更新楼层请求
export interface UpdateFloorRequest {
  building_id?: number;
  floor_number?: number;
  floor_name?: string;
  floor_area?: number;
  rentable_area?: number;
  rented_area?: number;
  avg_rent_price?: number;
  occupancy_rate?: number;
  description?: string;
  status?: 'normal' | 'disabled';
}

// 房间查询参数
export interface RoomQuery extends BaseQuery {
  floor_id?: number;
  room_number?: string;
  room_type?: 'office' | 'meeting' | 'other';
  status?: 'available' | 'rented' | 'maintenance';
  room_area_min?: number;
  room_area_max?: number;
  rent_price_min?: number;
  rent_price_max?: number;
  decoration?: 'blank' | 'simple' | 'luxury';
  orientation?: 'east' | 'south' | 'west' | 'north';
  has_window?: boolean;
  has_ac?: boolean;
}

// 创建房间请求
export interface CreateRoomRequest {
  floor_id: number;
  room_number?: string;
  room_type?: 'office' | 'meeting' | 'other';
  room_area?: number;
  rent_price?: number;
  decoration?: 'blank' | 'simple' | 'luxury';
  orientation?: 'east' | 'south' | 'west' | 'north';
  has_window?: boolean;
  has_ac?: boolean;
  description?: string;
  status?: 'available' | 'rented' | 'maintenance';
}

// 更新房间请求
export interface UpdateRoomRequest {
  floor_id?: number;
  room_number?: string;
  room_type?: 'office' | 'meeting' | 'other';
  room_area?: number;
  rent_price?: number;
  decoration?: 'blank' | 'simple' | 'luxury';
  orientation?: 'east' | 'south' | 'west' | 'north';
  has_window?: boolean;
  has_ac?: boolean;
  description?: string;
  status?: 'available' | 'rented' | 'maintenance';
}

// ===== 选项和枚举类型 =====

// 土地性质选项
export const LAND_NATURE_OPTIONS = [
  { label: '国有出让', value: 'state_granted' },
  { label: '国有划拨', value: 'state_allocated' },
  { label: '集体所有', value: 'collective' },
  { label: '其他', value: 'other' },
] as const;

// 楼宇类型选项
export const BUILDING_TYPE_OPTIONS = [
  { label: '办公楼', value: 'office' },
  { label: '商业综合体', value: 'commercial' },
  { label: '工业厂房', value: 'industrial' },
  { label: '住宅', value: 'residential' },
  { label: '其他', value: 'other' },
] as const;

// 房间类型选项
export const ROOM_TYPE_OPTIONS = [
  { label: '办公室', value: 'office' },
  { label: '会议室', value: 'meeting' },
  { label: '其他', value: 'other' },
] as const;

// 装修情况选项
export const DECORATION_OPTIONS = [
  { label: '毛坯', value: 'blank' },
  { label: '简装', value: 'simple' },
  { label: '精装', value: 'luxury' },
] as const;

// 朝向选项
export const ORIENTATION_OPTIONS = [
  { label: '东', value: 'east' },
  { label: '南', value: 'south' },
  { label: '西', value: 'west' },
  { label: '北', value: 'north' },
] as const;

// 状态选项
export const ASSET_STATUS_OPTIONS = [
  { label: '正常', value: 'normal' },
  { label: '禁用', value: 'disabled' },
] as const;

export const ROOM_STATUS_OPTIONS = [
  { label: '可租', value: 'available' },
  { label: '已租', value: 'rented' },
  { label: '维护中', value: 'maintenance' },
] as const;

// ===== 统计和分析类型 =====

// 资产统计数据
export interface AssetStatistics {
  total_assets: number;
  total_buildings: number;
  total_floors: number;
  total_rooms: number;
  total_area: number;
  total_rentable_area: number;
  total_rented_area: number;
  overall_occupancy_rate: number;
  available_rooms: number;
  rented_rooms: number;
  maintenance_rooms: number;
}

// 资产分布统计
export interface AssetDistribution {
  street_id: number;
  street_name: string;
  asset_count: number;
  building_count: number;
  total_area: number;
  rentable_area: number;
  occupancy_rate: number;
}

// 租金统计
export interface RentStatistics {
  avg_rent_price: number;
  min_rent_price: number;
  max_rent_price: number;
  total_rent_income: number;
  occupied_area: number;
  available_area: number;
}

// 楼层统计
export interface FloorStatistics {
  building_id: number;
  building_name: string;
  total_floors: number;
  total_area: number;
  rentable_area: number;
  rented_area: number;
  occupancy_rate: number;
  avg_rent_price: number;
}

// ===== 地图相关类型 =====

// 地图点位数据
export interface MapPoint extends Coordinates {
  id: number;
  type: 'asset' | 'building';
  name: string;
  address?: string;
  status: string;
  properties?: Record<string, any>;
}

// 地图资产点位
export interface AssetMapPoint extends MapPoint {
  type: 'asset';
  asset_code: string;
  asset_name: string;
  street_name?: string;
  total_area?: number;
  building_count?: number;
}

// 地图楼宇点位
export interface BuildingMapPoint extends MapPoint {
  type: 'building';
  building_code: string;
  building_name: string;
  asset_name?: string;
  total_floors?: number;
  total_area?: number;
}

// 地图查询参数
export interface MapQuery {
  bounds?: {
    northeast: Coordinates;
    southwest: Coordinates;
  };
  zoom?: number;
  center?: Coordinates;
  type?: 'asset' | 'building' | 'all';
  status?: string[];
  street_ids?: number[];
}

// ===== 导入导出类型 =====

// 资产导入数据
export interface AssetImportData {
  asset_code: string;
  asset_name: string;
  street_name: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  land_nature?: string;
  total_area?: number;
  rentable_area?: number;
  asset_tags?: string;
  description?: string;
  status?: string;
}

// 楼宇导入数据
export interface BuildingImportData {
  building_code: string;
  building_name: string;
  asset_code: string;
  building_type?: string;
  total_floors?: number;
  underground_floors?: number;
  total_area?: number;
  rentable_area?: number;
  construction_year?: string;
  elevator_count?: number;
  parking_spaces?: number;
  green_rate?: number;
  property_company?: string;
  property_phone?: string;
  features?: string;
  description?: string;
  status?: string;
}

// 导入结果
export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}

// ===== 表单和UI相关类型 =====

// 资产表单数据
export interface AssetFormData extends Omit<CreateAssetRequest, 'asset_tags'> {
  asset_tags?: string;
}

// 楼宇表单数据
export interface BuildingFormData extends Omit<CreateBuildingRequest, 'features'> {
  features?: string;
}

// 资产树节点
export interface AssetTreeNode {
  key: string;
  title: string;
  value?: any;
  type: 'asset' | 'building' | 'floor' | 'room';
  children?: AssetTreeNode[];
  disabled?: boolean;
  icon?: string;
  extra?: Record<string, any>;
}

// 资产级联选择器选项
export interface AssetCascaderOption {
  label: string;
  value: number;
  children?: AssetCascaderOption[];
  disabled?: boolean;
  type: 'asset' | 'building' | 'floor';
}