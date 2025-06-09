// 资产相关类型定义

import { Organization, User } from './user';

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

// 资产
export interface Asset {
  id: number;
  assetCode: string;
  assetName: string;
  assetType: 'office' | 'commercial' | 'residential' | 'industrial' | 'mixed';
  totalArea: number;
  buildArea: number;
  landArea?: number;
  province: string;
  city: string;
  district: string;
  street?: string;
  address: string;
  longitude?: number;
  latitude?: number;
  buildYear?: number;
  floorCount?: number;
  undergroundFloors?: number;
  parkingSpaces?: number;
  totalValue?: number;
  currentValue?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  status: 'normal' | 'maintenance' | 'renovation' | 'vacant' | 'disposed';
  ownerId?: number;
  owner?: Organization;
  managerId?: number;
  manager?: User;
  description?: string;
  images?: string[];
  documents?: string[];
  facilities?: string[];
  features?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  buildings?: Building[];
  statistics?: {
    buildingCount: number;
    floorCount: number;
    roomCount: number;
    occupancyRate: number;
    monthlyIncome: number;
    annualIncome: number;
  };
}

// 楼宇
export interface Building {
  id: number;
  buildingCode: string;
  buildingName: string;
  buildingType: 'office' | 'commercial' | 'residential' | 'parking' | 'auxiliary';
  assetId: number;
  asset?: Asset;
  totalArea: number;
  buildArea: number;
  floorCount: number;
  undergroundFloors?: number;
  elevatorCount?: number;
  stairCount?: number;
  buildYear?: number;
  structure: 'steel' | 'concrete' | 'mixed' | 'wood' | 'other';
  height?: number;
  ceilingHeight?: number;
  loadCapacity?: number;
  fireRating?: string;
  seismicLevel?: string;
  energyRating?: 'A' | 'B' | 'C' | 'D' | 'E';
  status: 'normal' | 'maintenance' | 'renovation' | 'vacant' | 'demolished';
  longitude?: number;
  latitude?: number;
  managerId?: number;
  manager?: User;
  description?: string;
  images?: string[];
  documents?: string[];
  facilities?: string[];
  features?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  floors?: Floor[];
  statistics?: {
    floorCount: number;
    roomCount: number;
    occupancyRate: number;
    monthlyIncome: number;
  };
}

// 楼层
export interface Floor {
  id: number;
  floorCode: string;
  floorName: string;
  floorNumber: number;
  buildingId: number;
  building?: Building;
  floorType: 'basement' | 'ground' | 'office' | 'commercial' | 'parking' | 'equipment' | 'roof';
  totalArea: number;
  usableArea: number;
  publicArea?: number;
  ceilingHeight?: number;
  loadCapacity?: number;
  roomCount: number;
  status: 'normal' | 'maintenance' | 'renovation' | 'vacant';
  managerId?: number;
  manager?: User;
  description?: string;
  images?: string[];
  floorPlan?: string;
  facilities?: string[];
  features?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  rooms?: Room[];
  statistics?: {
    roomCount: number;
    occupiedRooms: number;
    occupancyRate: number;
    monthlyIncome: number;
  };
}

// 房间
export interface Room {
  id: number;
  roomCode: string;
  roomName: string;
  roomNumber: string;
  floorId: number;
  floor?: Floor;
  roomType: 'office' | 'meeting' | 'storage' | 'restroom' | 'elevator' | 'stair' | 'corridor' | 'utility' | 'retail' | 'restaurant';
  area: number;
  usableArea?: number;
  ceilingHeight?: number;
  windowCount?: number;
  doorCount?: number;
  capacity?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'renovation' | 'reserved';
  occupancyStatus: 'vacant' | 'occupied' | 'reserved';
  tenantId?: number;
  tenant?: Tenant;
  rent?: number;
  rentUnit?: 'monthly' | 'daily' | 'hourly';
  leaseStartDate?: string;
  leaseEndDate?: string;
  managerId?: number;
  manager?: User;
  description?: string;
  images?: string[];
  floorPlan?: string;
  facilities?: string[];
  features?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// 资产查询参数
export interface AssetQueryParams {
  page?: number;
  pageSize?: number;
  assetCode?: string;
  assetName?: string;
  assetType?: string;
  province?: string;
  city?: string;
  district?: string;
  status?: string;
  ownerId?: number;
  managerId?: number;
  minArea?: number;
  maxArea?: number;
  minValue?: number;
  maxValue?: number;
  buildYearStart?: number;
  buildYearEnd?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 楼宇查询参数
export interface BuildingQueryParams {
  page?: number;
  pageSize?: number;
  buildingCode?: string;
  buildingName?: string;
  buildingType?: string;
  assetId?: number;
  status?: string;
  managerId?: number;
  structure?: string;
  energyRating?: string;
  minArea?: number;
  maxArea?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 创建资产请求
export interface CreateAssetRequest {
  assetCode: string;
  assetName: string;
  assetType: string;
  totalArea: number;
  buildArea: number;
  landArea?: number;
  province: string;
  city: string;
  district: string;
  street?: string;
  address: string;
  longitude?: number;
  latitude?: number;
  buildYear?: number;
  floorCount?: number;
  undergroundFloors?: number;
  parkingSpaces?: number;
  totalValue?: number;
  currentValue?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  status?: string;
  ownerId?: number;
  managerId?: number;
  description?: string;
  images?: string[];
  documents?: string[];
  facilities?: string[];
  features?: Record<string, any>;
}

// 更新资产请求
export interface UpdateAssetRequest {
  assetName?: string;
  assetType?: string;
  totalArea?: number;
  buildArea?: number;
  landArea?: number;
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  buildYear?: number;
  floorCount?: number;
  undergroundFloors?: number;
  parkingSpaces?: number;
  totalValue?: number;
  currentValue?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  status?: string;
  ownerId?: number;
  managerId?: number;
  description?: string;
  images?: string[];
  documents?: string[];
  facilities?: string[];
  features?: Record<string, any>;
}

// 创建楼宇请求
export interface CreateBuildingRequest {
  buildingCode: string;
  buildingName: string;
  buildingType: string;
  assetId: number;
  totalArea: number;
  buildArea: number;
  floorCount: number;
  undergroundFloors?: number;
  elevatorCount?: number;
  stairCount?: number;
  buildYear?: number;
  structure: string;
  height?: number;
  ceilingHeight?: number;
  loadCapacity?: number;
  fireRating?: string;
  seismicLevel?: string;
  energyRating?: string;
  status?: string;
  longitude?: number;
  latitude?: number;
  managerId?: number;
  description?: string;
  images?: string[];
  documents?: string[];
  facilities?: string[];
  features?: Record<string, any>;
}

// 更新楼宇请求
export interface UpdateBuildingRequest {
  buildingName?: string;
  buildingType?: string;
  totalArea?: number;
  buildArea?: number;
  floorCount?: number;
  undergroundFloors?: number;
  elevatorCount?: number;
  stairCount?: number;
  buildYear?: number;
  structure?: string;
  height?: number;
  ceilingHeight?: number;
  loadCapacity?: number;
  fireRating?: string;
  seismicLevel?: string;
  energyRating?: string;
  status?: string;
  longitude?: number;
  latitude?: number;
  managerId?: number;
  description?: string;
  images?: string[];
  documents?: string[];
  facilities?: string[];
  features?: Record<string, any>;
}

// 创建楼层请求
export interface CreateFloorRequest {
  floorCode: string;
  floorName: string;
  floorNumber: number;
  buildingId: number;
  floorType: string;
  totalArea: number;
  usableArea: number;
  publicArea?: number;
  ceilingHeight?: number;
  loadCapacity?: number;
  roomCount: number;
  status?: string;
  managerId?: number;
  description?: string;
  images?: string[];
  floorPlan?: string;
  facilities?: string[];
  features?: Record<string, any>;
}

// 更新楼层请求
export interface UpdateFloorRequest {
  floorName?: string;
  floorNumber?: number;
  floorType?: string;
  totalArea?: number;
  usableArea?: number;
  publicArea?: number;
  ceilingHeight?: number;
  loadCapacity?: number;
  roomCount?: number;
  status?: string;
  managerId?: number;
  description?: string;
  images?: string[];
  floorPlan?: string;
  facilities?: string[];
  features?: Record<string, any>;
}

// 创建房间请求
export interface CreateRoomRequest {
  roomCode: string;
  roomName: string;
  roomNumber: string;
  floorId: number;
  roomType: string;
  area: number;
  usableArea?: number;
  ceilingHeight?: number;
  windowCount?: number;
  doorCount?: number;
  capacity?: number;
  status?: string;
  occupancyStatus?: string;
  rent?: number;
  rentUnit?: string;
  managerId?: number;
  description?: string;
  images?: string[];
  floorPlan?: string;
  facilities?: string[];
  features?: Record<string, any>;
}

// 更新房间请求
export interface UpdateRoomRequest {
  roomName?: string;
  roomNumber?: string;
  roomType?: string;
  area?: number;
  usableArea?: number;
  ceilingHeight?: number;
  windowCount?: number;
  doorCount?: number;
  capacity?: number;
  status?: string;
  occupancyStatus?: string;
  rent?: number;
  rentUnit?: string;
  managerId?: number;
  description?: string;
  images?: string[];
  floorPlan?: string;
  facilities?: string[];
  features?: Record<string, any>;
}

// 查询参数类型
export interface FloorQueryParams {
  page?: number;
  pageSize?: number;
  floorCode?: string;
  floorName?: string;
  floorType?: string;
  buildingId?: number;
  status?: string;
  managerId?: number;
  floorNumber?: number;
  minArea?: number;
  maxArea?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface RoomQueryParams {
  page?: number;
  pageSize?: number;
  roomCode?: string;
  roomName?: string;
  roomType?: string;
  floorId?: number;
  buildingId?: number;
  assetId?: number;
  status?: string;
  occupancyStatus?: string;
  tenantId?: number;
  managerId?: number;
  minArea?: number;
  maxArea?: number;
  minRent?: number;
  maxRent?: number;
  sort?: string;
  order?: 'asc' | 'desc';
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

// 表单数据类型
export interface AssetFormData extends Omit<CreateAssetRequest, 'features'> {
  features?: Record<string, any>;
  locationCoords?: [number, number];
}

export interface BuildingFormData extends Omit<CreateBuildingRequest, 'features'> {
  features?: Record<string, any>;
  locationCoords?: [number, number];
}

export interface FloorFormData extends Omit<CreateFloorRequest, 'features'> {
  features?: Record<string, any>;
}

export interface RoomFormData extends Omit<CreateRoomRequest, 'features'> {
  features?: Record<string, any>;
}