// 资产相关类型定义

import { Organization, User } from './user';
import { Status, BaseQueryParams } from './common';

// 租户
export interface Tenant {
  id: number;
  tenantCode: string;
  tenantName: string;
  tenantType: 'individual' | 'company' | 'government' | 'organization';
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  companyName?: string;
  businessLicense?: string;
  taxNumber?: string;
  address?: string;
  industry?: string;
  businessScope?: string;
  creditRating?: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'C';
  status: 'active' | 'inactive' | 'blacklisted';
  createdAt: string;
  updatedAt: string;
  leases?: Lease[];
}

// 租赁合同
export interface Lease {
  id: number;
  leaseCode: string;
  roomId: number;
  room?: Room;
  tenantId: number;
  tenant?: Tenant;
  leaseType: 'rent' | 'sublease' | 'license';
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  managementFee?: number;
  utilities?: string[];
  paymentCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  paymentMethod: 'cash' | 'transfer' | 'check' | 'online';
  autoRenewal: boolean;
  renewalPeriod?: number;
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'suspended';
  signedDate?: string;
  contractFile?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  payments?: Payment[];
}

// 付款记录
export interface Payment {
  id: number;
  leaseId: number;
  lease?: Lease;
  paymentType: 'rent' | 'deposit' | 'management' | 'utility' | 'penalty' | 'refund';
  amount: number;
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: 'cash' | 'transfer' | 'check' | 'online';
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
  receipt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 资产信息
export interface Asset {
  id: number;
  assetCode: string;
  assetName: string;
  streetId?: number;
  streetName?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  landNature?: string;
  totalArea?: number;
  rentableArea?: number;
  assetTags?: string[];
  assetImages?: string[];
  description?: string;
  useDate?: string;
  status: Status;
  buildings?: Building[];
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

// 楼宇信息
export interface Building {
  id: number;
  assetId: number;
  assetName?: string;
  buildingCode: string;
  buildingName: string;
  buildingShortName?: string;
  buildingType: string;
  investor?: string;
  location?: string;
  totalArea?: number;
  rentableArea?: number;
  buildingHeight?: number;
  floorCount?: number;
  undergroundFloors?: number;
  constructionYear?: string;
  elevatorCount?: number;
  parkingSpaces?: number;
  greenRate?: number;
  propertyCompany?: string;
  propertyPhone?: string;
  buildingTags?: string[];
  buildingImages?: string[];
  features?: string[];
  description?: string;
  buildDate?: string;
  status: Status;
  floors?: Floor[];
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

// 楼层信息
export interface Floor {
  id: number;
  buildingId: number;
  buildingName?: string;
  floorCode: string;
  floorName: string;
  floorNumber: number;
  totalArea?: number;
  rentableArea?: number;
  rentedArea?: number;
  floorType?: string;
  floorPlan?: string;
  roomCount?: number;
  rentedRoomCount?: number;
  avgRentPrice?: number;
  occupancyRate?: number;
  remark?: string;
  status: Status;
  rooms?: Room[];
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

// 房间信息
export interface Room {
  id: number;
  floorId: number;
  floorName?: string;
  roomCode: string;
  roomNumber: string;
  area?: number;
  roomType?: string;
  roomStatus: 'available' | 'occupied' | 'maintenance' | 'reserved';
  position?: string;
  assetOwnership?: string;
  decoration?: string;
  orientation?: string;
  hasWindow?: boolean;
  hasAC?: boolean;
  rentPrice?: number;
  remark?: string;
  assets?: AssetItem[];
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

// 具体资产项目
export interface AssetItem {
  id: number;
  assetCode: string;
  assetName: string;
  assetType: string;
  purchaseDate?: string;
  assetValue?: number;
  depreciationRate?: number;
  status: 'in_use' | 'idle' | 'maintenance' | 'scrapped';
  roomId?: number;
  roomName?: string;
  userId?: number;
  userName?: string;
  department?: string;
  description?: string;
  images?: string[];
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

// 街道信息
export interface Street {
  id: number;
  name: string;
  code: string;
  districtId: number;
  districtName: string;
}

// 查询参数
export interface AssetQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  assetName?: string;
  streetId?: number;
  status?: Status;
  assetTags?: string;
}

export interface BuildingQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  assetId?: number;
  buildingName?: string;
  buildingType?: string;
  status?: Status;
}

export interface FloorQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  buildingId: number;
  floorName?: string;
  status?: Status;
}

export interface RoomQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  floorId?: number;
  roomNumber?: string;
  roomType?: string;
  roomStatus?: string;
}

export interface AssetItemQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  roomId?: number;
  assetName?: string;
  assetType?: string;
  status?: string;
  department?: string;
}

// 表单数据
export interface AssetFormData {
  assetName: string;
  streetId?: number;
  address?: string;
  longitude?: number;
  latitude?: number;
  landNature?: string;
  totalArea?: number;
  rentableArea?: number;
  assetTags?: string[];
  description?: string;
  useDate?: string;
  status: Status;
}

export interface BuildingFormData {
  assetId: number;
  buildingName: string;
  buildingShortName?: string;
  buildingType: string;
  investor?: string;
  location?: string;
  totalArea?: number;
  rentableArea?: number;
  buildingHeight?: number;
  floorCount?: number;
  undergroundFloors?: number;
  constructionYear?: string;
  elevatorCount?: number;
  parkingSpaces?: number;
  greenRate?: number;
  propertyCompany?: string;
  propertyPhone?: string;
  features?: string[];
  description?: string;
  buildDate?: string;
  status: Status;
}

export interface FloorFormData {
  buildingId: number;
  floorName: string;
  floorNumber: number;
  totalArea?: number;
  rentableArea?: number;
  floorType?: string;
  avgRentPrice?: number;
  description?: string;
  status: Status;
}

export interface RoomFormData {
  floorId: number;
  roomNumber: string;
  area?: number;
  roomType?: string;
  roomStatus: 'available' | 'occupied' | 'maintenance' | 'reserved';
  position?: string;
  assetOwnership?: string;
  decoration?: string;
  orientation?: string;
  hasWindow?: boolean;
  hasAC?: boolean;
  rentPrice?: number;
  remark?: string;
}

export interface AssetItemFormData {
  assetName: string;
  assetType: string;
  purchaseDate?: string;
  assetValue?: number;
  depreciationRate?: number;
  status: 'in_use' | 'idle' | 'maintenance' | 'scrapped';
  roomId?: number;
  userId?: number;
  department?: string;
  description?: string;
}

// 资产转移记录
export interface AssetTransferLog {
  id: number;
  assetId: number;
  assetName: string;
  fromRoomId?: number;
  fromRoomName?: string;
  toRoomId?: number;
  toRoomName?: string;
  fromUserId?: number;
  fromUserName?: string;
  toUserId?: number;
  toUserName?: string;
  transferReason: string;
  transferDate: string;
  operatorId: number;
  operatorName: string;
  remark?: string;
  createdAt: string;
}

// 资产盘点记录
export interface AssetInventoryLog {
  id: number;
  inventoryCode: string;
  inventoryName: string;
  inventoryDate: string;
  inventoryType: 'full' | 'partial' | 'spot';
  scopeType: 'all' | 'building' | 'floor' | 'room' | 'department';
  scopeId?: number;
  scopeName?: string;
  totalAssets: number;
  foundAssets: number;
  missingAssets: number;
  excessAssets: number;
  damagedAssets: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  operatorId: number;
  operatorName: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

// 统计数据类型
export interface AssetStatistics {
  totalAssets: number;
  totalArea: number;
  totalValue: number;
  averageArea: number;
  averageValue: number;
  assetsByType: Record<string, number>;
  assetsByStatus: Record<string, number>;
  assetsByProvince: Record<string, number>;
  assetsByCity: Record<string, number>;
  recentAssets: Asset[];
  valueAppreciation: number;
  occupancyRate: number;
  monthlyIncome: number;
  annualIncome: number;
}

export interface BuildingStatistics {
  totalBuildings: number;
  totalArea: number;
  averageArea: number;
  buildingsByType: Record<string, number>;
  buildingsByStatus: Record<string, number>;
  buildingsByStructure: Record<string, number>;
  buildingsByEnergyRating: Record<string, number>;
  averageAge: number;
  occupancyRate: number;
  monthlyIncome: number;
}

export interface FloorStatistics {
  totalFloors: number;
  totalArea: number;
  averageArea: number;
  floorsByType: Record<string, number>;
  floorsByStatus: Record<string, number>;
  averageRoomCount: number;
  occupancyRate: number;
  monthlyIncome: number;
}

export interface RoomStatistics {
  totalRooms: number;
  totalArea: number;
  averageArea: number;
  roomsByType: Record<string, number>;
  roomsByStatus: Record<string, number>;
  roomsByOccupancy: Record<string, number>;
  occupancyRate: number;
  averageRent: number;
  monthlyIncome: number;
  vacancyRate: number;
}

// 地图相关类型
export interface MapPoint {
  id: number;
  name: string;
  type: 'asset' | 'building';
  longitude: number;
  latitude: number;
  address: string;
  status: string;
  area?: number;
  value?: number;
  icon?: string;
  color?: string;
  data?: Asset | Building;
}

export interface MapRegion {
  code: string;
  name: string;
  level: 'province' | 'city' | 'district';
  parent?: string;
  center: [number, number];
  bounds?: [[number, number], [number, number]];
  assetCount: number;
  totalArea: number;
  totalValue: number;
}

// 这些类型已经在前面定义了，移除重复定义