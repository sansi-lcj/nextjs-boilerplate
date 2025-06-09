import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Asset, Building, AssetQueryParams, BuildingQueryParams } from '../../types/asset';
import { PageData } from '../../types';
import { assetApi, buildingApi } from '../../services/asset';

interface AssetState {
  assets: Asset[];
  buildings: Building[];
  currentAsset: Asset | null;
  currentBuilding: Building | null;
  totalAssets: number;
  totalBuildings: number;
  loading: boolean;
  error: string | null;
}

const initialState: AssetState = {
  assets: [],
  buildings: [],
  currentAsset: null,
  currentBuilding: null,
  totalAssets: 0,
  totalBuildings: 0,
  loading: false,
  error: null,
};

// 异步actions
export const fetchAssets = createAsyncThunk(
  'asset/fetchAssets',
  async (params?: AssetQueryParams) => {
    const response = await assetApi.getAssets(params);
    return response;
  }
);

export const fetchAssetById = createAsyncThunk(
  'asset/fetchAssetById',
  async (id: number) => {
    const response = await assetApi.getAssetById(id);
    return response;
  }
);

export const createAsset = createAsyncThunk(
  'asset/createAsset',
  async (data: any) => {
    const response = await assetApi.createAsset(data);
    return response;
  }
);

export const updateAsset = createAsyncThunk(
  'asset/updateAsset',
  async ({ id, data }: { id: number; data: any }) => {
    const response = await assetApi.updateAsset(id, data);
    return response;
  }
);

export const deleteAsset = createAsyncThunk(
  'asset/deleteAsset',
  async (id: number) => {
    await assetApi.deleteAsset(id);
    return id;
  }
);

export const fetchBuildings = createAsyncThunk(
  'asset/fetchBuildings',
  async (params?: BuildingQueryParams) => {
    const response = await buildingApi.getBuildings(params);
    return response;
  }
);

export const fetchBuildingById = createAsyncThunk(
  'asset/fetchBuildingById',
  async (id: number) => {
    const response = await buildingApi.getBuildingById(id);
    return response;
  }
);

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setCurrentAsset: (state, action: PayloadAction<Asset | null>) => {
      state.currentAsset = action.payload;
    },
    setCurrentBuilding: (state, action: PayloadAction<Building | null>) => {
      state.currentBuilding = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取资产列表
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload.items;
        state.totalAssets = action.payload.total;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取资产列表失败';
      });

    // 获取资产详情
    builder
      .addCase(fetchAssetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAsset = action.payload;
      })
      .addCase(fetchAssetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取资产详情失败';
      });

    // 创建资产
    builder
      .addCase(createAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.unshift(action.payload);
        state.totalAssets += 1;
      })
      .addCase(createAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建资产失败';
      });

    // 更新资产
    builder
      .addCase(updateAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assets.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.assets[index] = action.payload;
        }
        if (state.currentAsset?.id === action.payload.id) {
          state.currentAsset = action.payload;
        }
      })
      .addCase(updateAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新资产失败';
      });

    // 删除资产
    builder
      .addCase(deleteAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = state.assets.filter(a => a.id !== action.payload);
        state.totalAssets -= 1;
        if (state.currentAsset?.id === action.payload) {
          state.currentAsset = null;
        }
      })
      .addCase(deleteAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除资产失败';
      });

    // 获取楼宇列表
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;
        state.buildings = action.payload.items;
        state.totalBuildings = action.payload.total;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取楼宇列表失败';
      });

    // 获取楼宇详情
    builder
      .addCase(fetchBuildingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBuilding = action.payload;
      })
      .addCase(fetchBuildingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取楼宇详情失败';
      });
  },
});

export const { setCurrentAsset, setCurrentBuilding, clearError } = assetSlice.actions;
export default assetSlice.reducer;