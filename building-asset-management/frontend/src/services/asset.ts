import { get, post, put, del } from '../utils/request';
import { 
  Asset, 
  Building, 
  Floor, 
  Room,
  AssetQueryParams,
  BuildingQueryParams,
  CreateAssetRequest,
  UpdateAssetRequest 
} from '../types/asset';
import { PageData } from '../types';

// 资产管理API
export const assetApi = {
  // 获取资产列表
  async getAssets(params?: AssetQueryParams): Promise<PageData<Asset>> {
    const res = await get<PageData<Asset>>('/assets', params);
    return res.data;
  },

  // 获取资产详情
  async getAssetById(id: number): Promise<Asset> {
    const res = await get<Asset>(`/assets/${id}`);
    return res.data;
  },

  // 创建资产
  async createAsset(data: CreateAssetRequest): Promise<Asset> {
    const res = await post<Asset>('/assets', data);
    return res.data;
  },

  // 更新资产
  async updateAsset(id: number, data: UpdateAssetRequest): Promise<Asset> {
    const res = await put<Asset>(`/assets/${id}`, data);
    return res.data;
  },

  // 删除资产
  async deleteAsset(id: number): Promise<void> {
    await del(`/assets/${id}`);
  },
};

// 楼宇管理API
export const buildingApi = {
  // 获取楼宇列表
  async getBuildings(params?: BuildingQueryParams): Promise<PageData<Building>> {
    const res = await get<PageData<Building>>('/buildings', params);
    return res.data;
  },

  // 获取楼宇详情
  async getBuildingById(id: number): Promise<Building> {
    const res = await get<Building>(`/buildings/${id}`);
    return res.data;
  },

  // 创建楼宇
  async createBuilding(data: Partial<Building>): Promise<Building> {
    const res = await post<Building>('/buildings', data);
    return res.data;
  },

  // 更新楼宇
  async updateBuilding(id: number, data: Partial<Building>): Promise<Building> {
    const res = await put<Building>(`/buildings/${id}`, data);
    return res.data;
  },

  // 删除楼宇
  async deleteBuilding(id: number): Promise<void> {
    await del(`/buildings/${id}`);
  },
};

// 楼层管理API
export const floorApi = {
  // 获取楼层列表
  async getFloors(buildingId: number): Promise<Floor[]> {
    const res = await get<{ items: Floor[] }>('/floors', { buildingId });
    return res.data.items;
  },

  // 获取楼层详情
  async getFloorById(id: number): Promise<Floor> {
    const res = await get<Floor>(`/floors/${id}`);
    return res.data;
  },

  // 创建楼层
  async createFloor(data: Partial<Floor>): Promise<Floor> {
    const res = await post<Floor>('/floors', data);
    return res.data;
  },

  // 更新楼层
  async updateFloor(id: number, data: Partial<Floor>): Promise<Floor> {
    const res = await put<Floor>(`/floors/${id}`, data);
    return res.data;
  },

  // 删除楼层
  async deleteFloor(id: number): Promise<void> {
    await del(`/floors/${id}`);
  },
};

// 房间管理API
export const roomApi = {
  // 获取房间列表
  async getRooms(params?: { floorId?: number; roomNumber?: string; roomType?: string; status?: string; page?: number; size?: number }): Promise<PageData<Room>> {
    const res = await get<PageData<Room>>('/rooms', params);
    return res.data;
  },

  // 获取房间详情
  async getRoomById(id: number): Promise<Room> {
    const res = await get<Room>(`/rooms/${id}`);
    return res.data;
  },

  // 创建房间
  async createRoom(data: Partial<Room>): Promise<Room> {
    const res = await post<Room>('/rooms', data);
    return res.data;
  },

  // 更新房间
  async updateRoom(id: number, data: Partial<Room>): Promise<Room> {
    const res = await put<Room>(`/rooms/${id}`, data);
    return res.data;
  },

  // 删除房间
  async deleteRoom(id: number): Promise<void> {
    await del(`/rooms/${id}`);
  },
};