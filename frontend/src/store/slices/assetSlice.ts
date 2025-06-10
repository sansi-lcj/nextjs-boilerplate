// @ts-nocheck
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  Asset, 
  Building, 
  Floor, 
  Room,
  AssetQueryParams, 
  BuildingQueryParams,
  FloorQueryParams,
  RoomQueryParams,
  AssetFormData,
  BuildingFormData,
  FloorFormData,
  RoomFormData
} from '../../types/asset';
import { assetService, buildingService, floorService, roomService } from '../../services/asset';
import { MessageUtils } from '../../utils/message';

export interface AssetState {
  // 数据状态
  assets: Asset[];
  buildings: Building[];
  floors: Floor[];
  rooms: Room[];
  
  // 当前选中的项
  currentAsset: Asset | null;
  currentBuilding: Building | null;
  currentFloor: Floor | null;
  currentRoom: Room | null;
  
  // 总数
  totalAssets: number;
  totalBuildings: number;
  totalFloors: number;
  totalRooms: number;
  
  // 状态
  loading: boolean;
  error: string | null;
  
  // 资产相关方法
  fetchAssets: (params?: AssetQueryParams) => Promise<void>;
  fetchAssetById: (id: number) => Promise<void>;
  createAsset: (data: AssetFormData) => Promise<void>;
  updateAsset: (id: number, data: AssetFormData) => Promise<void>;
  deleteAsset: (id: number) => Promise<void>;
  
  // 楼宇相关方法
  fetchBuildings: (params?: BuildingQueryParams) => Promise<void>;
  fetchBuildingById: (id: number) => Promise<void>;
  createBuilding: (data: BuildingFormData) => Promise<void>;
  updateBuilding: (id: number, data: BuildingFormData) => Promise<void>;
  deleteBuilding: (id: number) => Promise<void>;
  
  // 楼层相关方法
  fetchFloors: (params?: FloorQueryParams) => Promise<void>;
  fetchFloorById: (id: number) => Promise<void>;
  createFloor: (data: FloorFormData) => Promise<void>;
  updateFloor: (id: number, data: FloorFormData) => Promise<void>;
  deleteFloor: (id: number) => Promise<void>;
  
  // 房间相关方法
  fetchRooms: (params?: RoomQueryParams) => Promise<void>;
  fetchRoomById: (id: number) => Promise<void>;
  createRoom: (data: RoomFormData) => Promise<void>;
  updateRoom: (id: number, data: RoomFormData) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;
  
  // 设置方法
  setCurrentAsset: (asset: Asset | null) => void;
  setCurrentBuilding: (building: Building | null) => void;
  setCurrentFloor: (floor: Floor | null) => void;
  setCurrentRoom: (room: Room | null) => void;
  
  // 工具方法
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAssetStore = create<AssetState>()(
  subscribeWithSelector((set, get) => ({
    // 初始状态
    assets: [],
    buildings: [],
    floors: [],
    rooms: [],
    currentAsset: null,
    currentBuilding: null,
    currentFloor: null,
    currentRoom: null,
    totalAssets: 0,
    totalBuildings: 0,
    totalFloors: 0,
    totalRooms: 0,
    loading: false,
    error: null,

    // 资产相关方法
    fetchAssets: async (params?: AssetQueryParams) => {
      try {
        set({ loading: true, error: null });
        const response = await assetService.getAssets(params);
        
        set({
          assets: Array.isArray(response.data) ? response.data : response.data.items || [],
          totalAssets: Array.isArray(response.data) ? response.data.length : response.data.total || 0,
          loading: false,
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取资产列表失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    fetchAssetById: async (id: number) => {
      try {
        set({ loading: true, error: null });
        const response = await assetService.getAsset(id);
        
        set({
          currentAsset: response.data,
          loading: false,
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取资产详情失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    createAsset: async (data: AssetFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await assetService.createAsset(data as any);
        
        set((state) => ({
          assets: [response.data, ...state.assets],
          totalAssets: state.totalAssets + 1,
          loading: false,
        }));
        
        MessageUtils.success('创建资产成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '创建资产失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    updateAsset: async (id: number, data: AssetFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await assetService.updateAsset(id, data as any);
        
        set((state) => ({
          assets: state.assets.map(asset => 
            asset.id === id ? response.data : asset
          ),
          currentAsset: state.currentAsset?.id === id ? response.data : state.currentAsset,
          loading: false,
        }));
        
        MessageUtils.success('更新资产成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '更新资产失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    deleteAsset: async (id: number) => {
      try {
        set({ loading: true, error: null });
        await assetService.deleteAsset(id);
        
        set((state) => ({
          assets: state.assets.filter(asset => asset.id !== id),
          totalAssets: state.totalAssets - 1,
          currentAsset: state.currentAsset?.id === id ? null : state.currentAsset,
          loading: false,
        }));
        
        MessageUtils.success('删除资产成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '删除资产失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    // 楼宇相关方法
    fetchBuildings: async (params?: BuildingQueryParams) => {
      try {
        set({ loading: true, error: null });
        const response = await buildingService.getBuildings(params);
        
        set({
          buildings: Array.isArray(response.data) ? response.data : response.data.items || [],
          totalBuildings: Array.isArray(response.data) ? response.data.length : response.data.total || 0,
          loading: false,
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取楼宇列表失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    fetchBuildingById: async (id: number) => {
      try {
        set({ loading: true, error: null });
        const response = await buildingService.getBuilding(id);
        
        set({
          currentBuilding: response.data,
          loading: false,
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取楼宇详情失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    createBuilding: async (data: BuildingFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await buildingService.createBuilding(data as any);
        
        set((state) => ({
          buildings: [response.data, ...state.buildings],
          totalBuildings: state.totalBuildings + 1,
          loading: false,
        }));
        
        MessageUtils.success('创建楼宇成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '创建楼宇失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    updateBuilding: async (id: number, data: BuildingFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await buildingService.updateBuilding(id, data as any);
        
        set((state) => ({
          buildings: state.buildings.map(building => 
            building.id === id ? response.data : building
          ),
          currentBuilding: state.currentBuilding?.id === id ? response.data : state.currentBuilding,
          loading: false,
        }));
        
        MessageUtils.success('更新楼宇成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '更新楼宇失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    deleteBuilding: async (id: number) => {
      try {
        set({ loading: true, error: null });
        await buildingService.deleteBuilding(id);
        
        set((state) => ({
          buildings: state.buildings.filter(building => building.id !== id),
          totalBuildings: state.totalBuildings - 1,
          currentBuilding: state.currentBuilding?.id === id ? null : state.currentBuilding,
          loading: false,
        }));
        
        MessageUtils.success('删除楼宇成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '删除楼宇失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    // 楼层方法
    fetchFloors: async (params?: FloorQueryParams) => {
      try {
        set({ loading: true, error: null });
        const response = await floorService.getFloors(params);
        
        set({
          floors: Array.isArray(response.data) ? response.data : response.data.items || [],
          totalFloors: Array.isArray(response.data) ? response.data.length : response.data.total || 0,
          loading: false,
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取楼层列表失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    fetchFloorById: async (id: number) => {
      try {
        set({ loading: true, error: null });
        const response = await floorService.getFloor(id);
        set({ currentFloor: response.data, loading: false });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取楼层详情失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    createFloor: async (data: FloorFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await floorService.createFloor(data as any);
        set((state) => ({
          floors: [response.data, ...state.floors],
          totalFloors: state.totalFloors + 1,
          loading: false,
        }));
        MessageUtils.success('创建楼层成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '创建楼层失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    updateFloor: async (id: number, data: FloorFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await floorService.updateFloor(id, data as any);
        set((state) => ({
          floors: state.floors.map(floor => floor.id === id ? response.data : floor),
          currentFloor: state.currentFloor?.id === id ? response.data : state.currentFloor,
          loading: false,
        }));
        MessageUtils.success('更新楼层成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '更新楼层失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    deleteFloor: async (id: number) => {
      try {
        set({ loading: true, error: null });
        await floorService.deleteFloor(id);
        set((state) => ({
          floors: state.floors.filter(floor => floor.id !== id),
          totalFloors: state.totalFloors - 1,
          currentFloor: state.currentFloor?.id === id ? null : state.currentFloor,
          loading: false,
        }));
        MessageUtils.success('删除楼层成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '删除楼层失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    // 房间方法
    fetchRooms: async (params?: RoomQueryParams) => {
      try {
        set({ loading: true, error: null });
        const response = await roomService.getRooms(params);
        set({
          rooms: Array.isArray(response.data) ? response.data : response.data.items || [],
          totalRooms: Array.isArray(response.data) ? response.data.length : response.data.total || 0,
          loading: false,
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取房间列表失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    fetchRoomById: async (id: number) => {
      try {
        set({ loading: true, error: null });
        const response = await roomService.getRoom(id);
        set({ currentRoom: response.data, loading: false });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '获取房间详情失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
      }
    },

    createRoom: async (data: RoomFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await roomService.createRoom(data as any);
        set((state) => ({
          rooms: [response.data, ...state.rooms],
          totalRooms: state.totalRooms + 1,
          loading: false,
        }));
        MessageUtils.success('创建房间成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '创建房间失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    updateRoom: async (id: number, data: RoomFormData) => {
      try {
        set({ loading: true, error: null });
        const response = await roomService.updateRoom(id, data as any);
        set((state) => ({
          rooms: state.rooms.map(room => room.id === id ? response.data : room),
          currentRoom: state.currentRoom?.id === id ? response.data : state.currentRoom,
          loading: false,
        }));
        MessageUtils.success('更新房间成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '更新房间失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    deleteRoom: async (id: number) => {
      try {
        set({ loading: true, error: null });
        await roomService.deleteRoom(id);
        set((state) => ({
          rooms: state.rooms.filter(room => room.id !== id),
          totalRooms: state.totalRooms - 1,
          currentRoom: state.currentRoom?.id === id ? null : state.currentRoom,
          loading: false,
        }));
        MessageUtils.success('删除房间成功');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || '删除房间失败';
        set({ loading: false, error: errorMessage });
        MessageUtils.error(errorMessage);
        throw error;
      }
    },

    // 设置方法
    setCurrentAsset: (asset: Asset | null) => set({ currentAsset: asset }),
    setCurrentBuilding: (building: Building | null) => set({ currentBuilding: building }),
    setCurrentFloor: (floor: Floor | null) => set({ currentFloor: floor }),
    setCurrentRoom: (room: Room | null) => set({ currentRoom: room }),

    // 工具方法
    clearError: () => set({ error: null }),
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({
      assets: [],
      buildings: [],
      floors: [],
      rooms: [],
      currentAsset: null,
      currentBuilding: null,
      currentFloor: null,
      currentRoom: null,
      totalAssets: 0,
      totalBuildings: 0,
      totalFloors: 0,
      totalRooms: 0,
      loading: false,
      error: null,
    }),
  }))
);

export default useAssetStore;