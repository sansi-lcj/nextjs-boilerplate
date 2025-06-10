import { Asset, Building, Floor, Room, AssetQueryParams, BuildingQueryParams, FloorQueryParams, RoomQueryParams, AssetFormData, BuildingFormData, FloorFormData, RoomFormData, AssetStatistics, BuildingStatistics, FloorStatistics, RoomStatistics } from '../types/asset';
import { get, post, put, del } from '../utils/request';
import { ApiResponse, PageData } from '../types';

// 资产相关API
export const assetService = {
  // 获取资产列表
  async getAssets(params?: AssetQueryParams): Promise<ApiResponse<PageData<Asset>>> {
    return await get('/assets', params);
  },

  // 获取资产详情
  async getAsset(id: number): Promise<ApiResponse<Asset>> {
    return await get(`/assets/${id}`);
  },

  // 创建资产
  async createAsset(data: AssetFormData): Promise<ApiResponse<Asset>> {
    return await post('/assets', data);
  },

  // 更新资产
  async updateAsset(id: number, data: AssetFormData): Promise<ApiResponse<Asset>> {
    return await put(`/assets/${id}`, data);
  },

  // 删除资产
  async deleteAsset(id: number): Promise<ApiResponse<void>> {
    return await del(`/assets/${id}`);
  },

  // 获取资产统计
  async getAssetStatistics(): Promise<ApiResponse<AssetStatistics>> {
    return await get('/assets/statistics');
  },

  // 上传资产图片
  async uploadAssetImage(id: number, file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return await post(`/assets/${id}/images`, formData);
  },

  // 删除资产图片
  async deleteAssetImage(id: number, imageUrl: string): Promise<ApiResponse<void>> {
    return await del(`/assets/${id}/images`, { imageUrl });
  },
};

// 楼宇相关API
export const buildingService = {
  // 获取楼宇列表
  async getBuildings(params?: BuildingQueryParams): Promise<ApiResponse<PageData<Building>>> {
    return await get('/buildings', params);
  },

  // 获取楼宇详情
  async getBuilding(id: number): Promise<ApiResponse<Building>> {
    return await get(`/buildings/${id}`);
  },

  // 创建楼宇
  async createBuilding(data: BuildingFormData): Promise<ApiResponse<Building>> {
    return await post('/buildings', data);
  },

  // 更新楼宇
  async updateBuilding(id: number, data: BuildingFormData): Promise<ApiResponse<Building>> {
    return await put(`/buildings/${id}`, data);
  },

  // 删除楼宇
  async deleteBuilding(id: number): Promise<ApiResponse<void>> {
    return await del(`/buildings/${id}`);
  },

  // 获取楼宇统计
  async getBuildingStatistics(): Promise<ApiResponse<BuildingStatistics>> {
    return await get('/buildings/statistics');
  },

  // 根据资产ID获取楼宇列表
  async getBuildingsByAsset(assetId: number): Promise<ApiResponse<Building[]>> {
    return await get('/buildings', { assetId });
  },
};

// 楼层相关API
export const floorService = {
  // 获取楼层列表
  async getFloors(params?: FloorQueryParams): Promise<ApiResponse<PageData<Floor>>> {
    return await get('/floors', params);
  },

  // 获取楼层详情
  async getFloor(id: number): Promise<ApiResponse<Floor>> {
    return await get(`/floors/${id}`);
  },

  // 创建楼层
  async createFloor(data: FloorFormData): Promise<ApiResponse<Floor>> {
    return await post('/floors', data);
  },

  // 更新楼层
  async updateFloor(id: number, data: FloorFormData): Promise<ApiResponse<Floor>> {
    return await put(`/floors/${id}`, data);
  },

  // 删除楼层
  async deleteFloor(id: number): Promise<ApiResponse<void>> {
    return await del(`/floors/${id}`);
  },

  // 获取楼层统计
  async getFloorStatistics(): Promise<ApiResponse<FloorStatistics>> {
    return await get('/floors/statistics');
  },

  // 根据楼宇ID获取楼层列表
  async getFloorsByBuilding(buildingId: number): Promise<ApiResponse<Floor[]>> {
    return await get('/floors', { buildingId });
  },

  // 上传楼层平面图
  async uploadFloorPlan(id: number, file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return await post(`/floors/${id}/plan`, formData);
  },
};

// 房间相关API
export const roomService = {
  // 获取房间列表
  async getRooms(params?: RoomQueryParams): Promise<ApiResponse<PageData<Room>>> {
    return await get('/rooms', params);
  },

  // 获取房间详情
  async getRoom(id: number): Promise<ApiResponse<Room>> {
    return await get(`/rooms/${id}`);
  },

  // 创建房间
  async createRoom(data: RoomFormData): Promise<ApiResponse<Room>> {
    return await post('/rooms', data);
  },

  // 更新房间
  async updateRoom(id: number, data: RoomFormData): Promise<ApiResponse<Room>> {
    return await put(`/rooms/${id}`, data);
  },

  // 删除房间
  async deleteRoom(id: number): Promise<ApiResponse<void>> {
    return await del(`/rooms/${id}`);
  },

  // 获取房间统计
  async getRoomStatistics(): Promise<ApiResponse<RoomStatistics>> {
    return await get('/rooms/statistics');
  },

  // 根据楼层ID获取房间列表
  async getRoomsByFloor(floorId: number): Promise<ApiResponse<Room[]>> {
    return await get('/rooms', { floorId });
  },

  // 批量更新房间状态
  async batchUpdateRoomStatus(roomIds: number[], status: string): Promise<ApiResponse<void>> {
    return await put('/rooms/batch-status', { roomIds, status });
  },

  // 房间预约
  async bookRoom(roomId: number, data: {
    startDate: string;
    endDate: string;
    purpose: string;
    contactPerson: string;
    contactPhone: string;
  }): Promise<ApiResponse<void>> {
    return await post(`/rooms/${roomId}/book`, data);
  },

  // 取消房间预约
  async cancelRoomBooking(roomId: number, bookingId: number): Promise<ApiResponse<void>> {
    return await del(`/rooms/${roomId}/book/${bookingId}`);
  },
};

// 地图相关API
export const mapService = {
  // 获取地图点位数据
  async getMapPoints(params?: {
    level?: 'asset' | 'building';
    bounds?: [number, number, number, number]; // [west, south, east, north]
    zoom?: number;
  }): Promise<ApiResponse<any[]>> {
    return await get('/map/points', params);
  },

  // 获取区域统计数据
  async getRegionStatistics(regionCode?: string): Promise<ApiResponse<any>> {
    return await get('/map/regions', { code: regionCode });
  },

  // 地理编码
  async geocode(address: string): Promise<ApiResponse<{
    longitude: number;
    latitude: number;
    formatted_address: string;
  }>> {
    return await get('/map/geocode', { address });
  },

  // 逆地理编码
  async reverseGeocode(longitude: number, latitude: number): Promise<ApiResponse<{
    address: string;
    province: string;
    city: string;
    district: string;
  }>> {
    return await get('/map/reverse-geocode', { longitude, latitude });
  },
};

// 导出服务
export { assetService as default };

// 全局搜索
export const searchService = {
  // 全局搜索
  async globalSearch(query: string, type?: 'asset' | 'building' | 'floor' | 'room'): Promise<ApiResponse<{
    assets: Asset[];
    buildings: Building[];
    floors: Floor[];
    rooms: Room[];
  }>> {
    return await get('/search', { query, type });
  },

  // 搜索建议
  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return await get('/search/suggestions', { query });
  },
};