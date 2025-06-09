import request from '../utils/request';
import { Asset, Building, Floor, Room } from '../types/asset';

// Asset APIs
export const assetService = {
  // 获取资产列表
  getAssets: (params?: {
    page?: number;
    page_size?: number;
    asset_name?: string;
    type?: string;
    status?: string;
  }) => {
    return request.get('/assets', { params });
  },

  // 获取资产详情
  getAsset: (id: number) => {
    return request.get(`/assets/${id}`);
  },

  // 创建资产
  createAsset: (data: Partial<Asset>) => {
    return request.post('/assets', data);
  },

  // 更新资产
  updateAsset: (id: number, data: Partial<Asset>) => {
    return request.put(`/assets/${id}`, data);
  },

  // 删除资产
  deleteAsset: (id: number) => {
    return request.delete(`/assets/${id}`);
  },

  // 获取资产统计数据
  getAssetStatistics: () => {
    return request.get('/statistics/assets');
  },
};

// Building APIs
export const buildingService = {
  // 获取建筑列表
  getBuildings: (params?: {
    page?: number;
    page_size?: number;
    asset_id?: number;
    name?: string;
  }) => {
    return request.get('/buildings', { params });
  },

  // 获取建筑详情
  getBuilding: (id: number) => {
    return request.get(`/buildings/${id}`);
  },

  // 创建建筑
  createBuilding: (data: Partial<Building>) => {
    return request.post('/buildings', data);
  },

  // 更新建筑
  updateBuilding: (id: number, data: Partial<Building>) => {
    return request.put(`/buildings/${id}`, data);
  },

  // 删除建筑
  deleteBuilding: (id: number) => {
    return request.delete(`/buildings/${id}`);
  },
};

// Floor APIs
export const floorService = {
  // 获取楼层列表
  getFloors: (buildingId: number) => {
    return request.get('/floors', { params: { building_id: buildingId } });
  },

  // 创建楼层
  createFloor: (data: Partial<Floor>) => {
    return request.post('/floors', data);
  },

  // 更新楼层
  updateFloor: (id: number, data: Partial<Floor>) => {
    return request.put(`/floors/${id}`, data);
  },

  // 删除楼层
  deleteFloor: (id: number) => {
    return request.delete(`/floors/${id}`);
  },
};

// Room APIs
export const roomService = {
  // 获取房间列表
  getRooms: (floorId: number) => {
    return request.get('/rooms', { params: { floor_id: floorId } });
  },

  // 创建房间
  createRoom: (data: Partial<Room>) => {
    return request.post('/rooms', data);
  },

  // 更新房间
  updateRoom: (id: number, data: Partial<Room>) => {
    return request.put(`/rooms/${id}`, data);
  },

  // 删除房间
  deleteRoom: (id: number) => {
    return request.delete(`/rooms/${id}`);
  },
};