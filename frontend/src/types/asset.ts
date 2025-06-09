// 资产相关类型定义

import { Organization } from './user';

// 资产
export interface Asset {
  id: number;
  asset_code: string;
  asset_name: string;
  street_id: number;
  address?: string;
  longitude?: number;
  latitude?: number;
  land_nature?: string;
  total_area?: number;
  rentable_area?: number;
  asset_tags?: string[];
  description?: string;
  status: 'normal' | 'disabled';
  street?: Organization;
  buildings?: Building[];
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

// 楼宇
export interface Building {
  id: number;
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
  features?: string[];
  description?: string;
  status: 'normal' | 'disabled';
  asset?: Asset;
  floors?: Floor[];
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

// 楼层
export interface Floor {
  id: number;
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
  room_count?: number;
  rented_room_count?: number;
}

// 房间
export interface Room {
  id: number;
  floor_id: number;
  room_number: string;
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

// 资产查询参数
export interface AssetQueryParams {
  assetName?: string;
  streetId?: number;
  status?: string;
  assetTags?: string;
  page?: number;
  size?: number;
}

// 楼宇查询参数
export interface BuildingQueryParams {
  assetId?: number;
  buildingName?: string;
  buildingType?: string;
  page?: number;
  size?: number;
}

// 创建资产请求
export interface CreateAssetRequest {
  asset_name: string;
  street_id: number;
  address?: string;
  longitude?: number;
  latitude?: number;
  land_nature?: string;
  total_area?: number;
  rentable_area?: number;
  asset_tags?: string[];
  description?: string;
}

// 更新资产请求
export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {
  status?: 'normal' | 'disabled';
}