# 前端开发指南

## 概述

本指南介绍楼宇资产管理平台前端的开发规范、架构设计和最佳实践。前端使用 React 18、TypeScript 和 Ant Design 5 构建，采用现代化的组件化开发模式。

## 技术栈

- **React 18**：用户界面库
- **TypeScript**：类型安全的 JavaScript
- **Ant Design 5**：企业级 UI 组件库
- **Redux Toolkit**：状态管理
- **React Router 6**：路由管理
- **Axios**：HTTP 客户端
- **Ant Design Charts**：数据可视化

## 项目结构

```
frontend/
├── public/                 # 静态资源
│   ├── index.html         # HTML模板
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码
│   ├── components/        # 通用组件
│   │   ├── common/       # 基础组件
│   │   ├── business/     # 业务组件
│   │   └── layout/       # 布局组件
│   ├── pages/            # 页面组件
│   │   ├── asset/        # 资产管理
│   │   ├── auth/         # 认证相关
│   │   ├── map/          # 地图展示
│   │   ├── statistics/   # 数据统计
│   │   └── system/       # 系统管理
│   ├── services/         # API服务
│   ├── store/            # Redux状态
│   │   ├── slices/       # 状态切片
│   │   └── index.ts      # Store配置
│   ├── hooks/            # 自定义Hooks
│   ├── utils/            # 工具函数
│   ├── types/            # TypeScript类型
│   ├── styles/           # 全局样式
│   ├── App.tsx           # 根组件
│   └── index.tsx         # 入口文件
├── .env                  # 环境变量
├── tsconfig.json         # TypeScript配置
├── package.json          # 项目配置
└── README.md            # 项目说明
```

## 开发规范

### 1. 命名规范

**文件命名**
- 组件文件：使用 PascalCase，如 `AssetList.tsx`
- 工具文件：使用 camelCase，如 `dateUtils.ts`
- 样式文件：使用 camelCase，如 `assetList.module.css`

**组件命名**
```typescript
// ✅ 好的命名
export const AssetManagementPage: React.FC = () => { }

// ❌ 避免的命名
export const asset_management_page = () => { }
```

**变量命名**
```typescript
// 常量：使用 UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8080/api/v1';

// 变量和函数：使用 camelCase
const assetList = [];
const fetchAssetData = async () => { };

// 类型和接口：使用 PascalCase
interface AssetInfo {
  id: number;
  assetName: string;
}
```

### 2. 组件开发

**函数组件模板**
```typescript
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAssets } from '@/store/slices/assetSlice';
import type { Asset } from '@/types/asset';

interface AssetListProps {
  buildingId?: number;
  onSelect?: (asset: Asset) => void;
}

export const AssetList: React.FC<AssetListProps> = ({ 
  buildingId, 
  onSelect 
}) => {
  const dispatch = useAppDispatch();
  const { assets, loading } = useAppSelector(state => state.asset);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    dispatch(fetchAssets({ buildingId }));
  }, [dispatch, buildingId]);

  const columns: ColumnsType<Asset> = [
    {
      title: '资产编号',
      dataIndex: 'assetCode',
      key: 'assetCode',
      width: 120,
    },
    {
      title: '资产名称',
      dataIndex: 'assetName',
      key: 'assetName',
      ellipsis: true,
    },
    {
      title: '资产类型',
      dataIndex: 'assetType',
      key: 'assetType',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '在用' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
  ];

  const handleRowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  return (
    <Card title="资产列表" loading={loading}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={assets}
        rowSelection={handleRowSelection}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />
    </Card>
  );
};
```

### 3. 状态管理

**Redux Slice 示例**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { assetService } from '@/services/asset';
import type { Asset, AssetListParams } from '@/types/asset';

interface AssetState {
  assets: Asset[];
  currentAsset: Asset | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

const initialState: AssetState = {
  assets: [],
  currentAsset: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 20,
    total: 0,
  },
};

// 异步操作
export const fetchAssets = createAsyncThunk(
  'asset/fetchAssets',
  async (params: AssetListParams) => {
    const response = await assetService.getList(params);
    return response.data;
  }
);

export const createAsset = createAsyncThunk(
  'asset/createAsset',
  async (data: Partial<Asset>) => {
    const response = await assetService.create(data);
    return response.data;
  }
);

// Slice
const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setCurrentAsset: (state, action: PayloadAction<Asset | null>) => {
      state.currentAsset = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取资产列表
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取资产列表失败';
      })
      // 创建资产
      .addCase(createAsset.fulfilled, (state, action) => {
        state.assets.unshift(action.payload);
        message.success('创建成功');
      });
  },
});

export const { setCurrentAsset, clearError } = assetSlice.actions;
export default assetSlice.reducer;
```

### 4. API 服务

**服务层封装**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { code, message: msg, data } = response.data;
    
    if (code === 20000) {
      return data;
    }
    
    message.error(msg || '请求失败');
    return Promise.reject(new Error(msg));
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录');
          store.dispatch(logout());
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误，请稍后重试');
          break;
        default:
          message.error(data.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

// 通用请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config);
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config);
  },
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config);
  },
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config);
  },
};

// 资产服务
export const assetService = {
  // 获取资产列表
  getList(params: AssetListParams) {
    return http.get<PageResult<Asset>>('/assets', { params });
  },
  
  // 获取资产详情
  getById(id: number) {
    return http.get<Asset>(`/assets/${id}`);
  },
  
  // 创建资产
  create(data: Partial<Asset>) {
    return http.post<Asset>('/assets', data);
  },
  
  // 更新资产
  update(id: number, data: Partial<Asset>) {
    return http.put<Asset>(`/assets/${id}`, data);
  },
  
  // 删除资产
  delete(id: number) {
    return http.delete(`/assets/${id}`);
  },
  
  // 批量导入
  batchImport(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post('/assets/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

### 5. 路由配置

**路由结构**
```typescript
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthGuard } from '@/components/common/AuthGuard';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/auth/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const AssetList = lazy(() => import('@/pages/asset/AssetList'));
const AssetDetail = lazy(() => import('@/pages/asset/AssetDetail'));
const MapView = lazy(() => import('@/pages/map/MapView'));
const Statistics = lazy(() => import('@/pages/statistics/Statistics'));
const UserManagement = lazy(() => import('@/pages/system/UserManagement'));
const RoleManagement = lazy(() => import('@/pages/system/RoleManagement'));

// 加载组件
const LazyLoad: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <Spin size="large" />
    </div>
  }>
    {children}
  </Suspense>
);

// 路由配置
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 登录页面 */}
      <Route path="/login" element={
        <LazyLoad>
          <Login />
        </LazyLoad>
      } />
      
      {/* 需要认证的页面 */}
      <Route element={<AuthGuard />}>
        <Route element={<MainLayout />}>
          {/* 首页 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <LazyLoad>
              <Dashboard />
            </LazyLoad>
          } />
          
          {/* 资产管理 */}
          <Route path="/assets">
            <Route index element={
              <LazyLoad>
                <AssetList />
              </LazyLoad>
            } />
            <Route path=":id" element={
              <LazyLoad>
                <AssetDetail />
              </LazyLoad>
            } />
          </Route>
          
          {/* 地图展示 */}
          <Route path="/map" element={
            <LazyLoad>
              <MapView />
            </LazyLoad>
          } />
          
          {/* 数据统计 */}
          <Route path="/statistics" element={
            <LazyLoad>
              <Statistics />
            </LazyLoad>
          } />
          
          {/* 系统管理 */}
          <Route path="/system">
            <Route path="users" element={
              <LazyLoad>
                <UserManagement />
              </LazyLoad>
            } />
            <Route path="roles" element={
              <LazyLoad>
                <RoleManagement />
              </LazyLoad>
            } />
          </Route>
        </Route>
      </Route>
      
      {/* 404页面 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
```

### 6. 自定义 Hooks

**useRequest Hook**
```typescript
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';

interface UseRequestOptions<T> {
  manual?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useRequest<T = any, P extends any[] = any[]>(
  service: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
) {
  const { manual = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  
  const run = useCallback(async (...args: P) => {
    setLoading(true);
    setError(undefined);
    
    try {
      const result = await service(...args);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      message.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service, onSuccess, onError]);
  
  useEffect(() => {
    if (!manual) {
      run(...([] as any));
    }
  }, []);
  
  return {
    data,
    loading,
    error,
    run,
  };
}
```

**useDebounce Hook**
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

### 7. 表单处理

**表单组件示例**
```typescript
import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button } from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import type { Asset } from '@/types/asset';

interface AssetFormProps {
  initialValues?: Partial<Asset>;
  onSubmit: (values: Partial<Asset>) => Promise<void>;
}

export const AssetForm: React.FC<AssetFormProps> = ({ 
  initialValues, 
  onSubmit 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  
  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      // 转换日期格式
      const formattedValues = {
        ...values,
        purchaseDate: values.purchaseDate?.format('YYYY-MM-DD'),
      };
      await onSubmit(formattedValues);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        purchaseDate: initialValues?.purchaseDate 
          ? dayjs(initialValues.purchaseDate) 
          : undefined,
      }}
      onFinish={handleFinish}
    >
      <Form.Item
        label="资产编号"
        name="assetCode"
        rules={[
          { required: true, message: '请输入资产编号' },
          { max: 50, message: '资产编号最多50个字符' },
        ]}
      >
        <Input placeholder="请输入资产编号" />
      </Form.Item>
      
      <Form.Item
        label="资产名称"
        name="assetName"
        rules={[
          { required: true, message: '请输入资产名称' },
          { max: 100, message: '资产名称最多100个字符' },
        ]}
      >
        <Input placeholder="请输入资产名称" />
      </Form.Item>
      
      <Form.Item
        label="资产类型"
        name="assetType"
        rules={[{ required: true, message: '请选择资产类型' }]}
      >
        <Select placeholder="请选择资产类型">
          <Select.Option value="IT设备">IT设备</Select.Option>
          <Select.Option value="办公家具">办公家具</Select.Option>
          <Select.Option value="车辆">车辆</Select.Option>
          <Select.Option value="其他">其他</Select.Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        label="购置日期"
        name="purchaseDate"
        rules={[{ required: true, message: '请选择购置日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item
        label="资产价值"
        name="assetValue"
        rules={[
          { required: true, message: '请输入资产价值' },
          { type: 'number', min: 0, message: '资产价值不能为负数' },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          precision={2}
          formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\¥\s?|(,*)/g, '')}
        />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};
```

### 8. 地图集成

**天地图组件**
```typescript
import React, { useEffect, useRef } from 'react';
import { message } from 'antd';

declare global {
  interface Window {
    T: any;
  }
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    position: [number, number];
    title: string;
    info?: any;
  }>;
  onMarkerClick?: (marker: any) => void;
}

export const TianDiTuMap: React.FC<MapProps> = ({
  center = [116.404, 39.915],
  zoom = 12,
  markers = [],
  onMarkerClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  useEffect(() => {
    // 加载天地图脚本
    const script = document.createElement('script');
    script.src = `http://api.tianditu.gov.cn/api?v=4.0&tk=${process.env.REACT_APP_TIANDITU_KEY}`;
    script.onload = initMap;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  const initMap = () => {
    if (!mapContainer.current || !window.T) return;
    
    // 创建地图实例
    const map = new window.T.Map(mapContainer.current);
    map.centerAndZoom(new window.T.LngLat(center[0], center[1]), zoom);
    
    // 添加控件
    map.addControl(new window.T.Control.Zoom());
    map.addControl(new window.T.Control.Scale());
    
    mapInstance.current = map;
    
    // 添加标记
    updateMarkers();
  };
  
  const updateMarkers = () => {
    if (!mapInstance.current) return;
    
    // 清除旧标记
    markersRef.current.forEach(marker => {
      mapInstance.current.removeOverLay(marker);
    });
    markersRef.current = [];
    
    // 添加新标记
    markers.forEach(markerData => {
      const marker = new window.T.Marker(
        new window.T.LngLat(markerData.position[0], markerData.position[1])
      );
      
      // 创建信息窗口
      const infoWindow = new window.T.InfoWindow({
        content: `
          <div>
            <h4>${markerData.title}</h4>
            <p>经度：${markerData.position[0]}</p>
            <p>纬度：${markerData.position[1]}</p>
          </div>
        `,
      });
      
      // 点击事件
      marker.addEventListener('click', () => {
        mapInstance.current.openInfoWindow(infoWindow, marker.getLngLat());
        onMarkerClick?.(markerData);
      });
      
      mapInstance.current.addOverLay(marker);
      markersRef.current.push(marker);
    });
  };
  
  useEffect(() => {
    updateMarkers();
  }, [markers]);
  
  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '100%', minHeight: 500 }}
    />
  );
};
```

### 9. 性能优化

**组件优化**
```typescript
import React, { memo, useMemo, useCallback } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// 使用 memo 避免不必要的重渲染
export const AssetTable = memo<AssetTableProps>(({ 
  data, 
  loading, 
  onEdit, 
  onDelete 
}) => {
  // 使用 useMemo 缓存计算结果
  const columns: ColumnsType<Asset> = useMemo(() => [
    {
      title: '资产编号',
      dataIndex: 'assetCode',
      key: 'assetCode',
    },
    {
      title: '资产名称',
      dataIndex: 'assetName',
      key: 'assetName',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], []);
  
  // 使用 useCallback 缓存函数
  const handleEdit = useCallback((record: Asset) => {
    onEdit?.(record);
  }, [onEdit]);
  
  const handleDelete = useCallback((record: Asset) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除资产"${record.assetName}"吗？`,
      onOk: () => onDelete?.(record.id),
    });
  }, [onDelete]);
  
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
    />
  );
});

// 代码分割
const HeavyComponent = React.lazy(() => 
  import(/* webpackChunkName: "heavy-component" */ './HeavyComponent')
);

// 虚拟列表
import { List } from 'react-virtualized';

const VirtualList: React.FC<{ items: any[] }> = ({ items }) => {
  const rowRenderer = ({ index, key, style }: any) => (
    <div key={key} style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <List
      width={300}
      height={600}
      rowCount={items.length}
      rowHeight={50}
      rowRenderer={rowRenderer}
    />
  );
};
```

### 10. 测试

**组件测试**
```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/store';
import { AssetList } from '@/pages/asset/AssetList';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
);

describe('AssetList', () => {
  it('should render asset list', async () => {
    render(<AssetList />, { wrapper });
    
    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText('资产列表')).toBeInTheDocument();
    });
    
    // 检查表格是否渲染
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
  
  it('should open create modal when click create button', async () => {
    const user = userEvent.setup();
    render(<AssetList />, { wrapper });
    
    // 点击新建按钮
    const createButton = screen.getByText('新建资产');
    await user.click(createButton);
    
    // 检查弹窗是否打开
    await waitFor(() => {
      expect(screen.getByText('新建资产')).toBeInTheDocument();
    });
  });
  
  it('should filter assets by search', async () => {
    const user = userEvent.setup();
    render(<AssetList />, { wrapper });
    
    // 输入搜索关键词
    const searchInput = screen.getByPlaceholderText('搜索资产');
    await user.type(searchInput, '笔记本');
    
    // 等待搜索结果
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });
  });
});
```

## 部署优化

### 1. 构建优化

```json
// package.json
{
  "scripts": {
    "build": "craco build",
    "analyze": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

```javascript
// craco.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new BundleAnalyzerPlugin({
          analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
        }),
      ],
    },
    configure: (webpackConfig) => {
      // 代码分割
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          antd: {
            name: 'antd',
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            priority: 10,
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
          },
        },
      };
      
      return webpackConfig;
    },
  },
};
```

### 2. 环境配置

```bash
# .env.development
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_TIANDITU_KEY=your-dev-key

# .env.production
REACT_APP_API_BASE_URL=https://api.example.com/api/v1
REACT_APP_TIANDITU_KEY=your-prod-key
```

## 常见问题

### 1. Ant Design 样式覆盖

```css
/* 使用 :global 覆盖全局样式 */
:global(.ant-btn-primary) {
  background-color: #1890ff;
  border-color: #1890ff;
}

/* 使用 CSS Module */
.customButton {
  :global(.ant-btn) {
    height: 40px;
  }
}
```

### 2. TypeScript 类型问题

```typescript
// 扩展 Window 对象
declare global {
  interface Window {
    __APP_CONFIG__: {
      apiUrl: string;
    };
  }
}

// 模块声明
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

### 3. 路由权限控制

```typescript
const PrivateRoute: React.FC<{ 
  permission?: string;
  children: React.ReactNode;
}> = ({ permission, children }) => {
  const { user } = useAppSelector(state => state.auth);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (permission && !hasPermission(user.permissions, permission)) {
    return <Result
      status="403"
      title="403"
      subTitle="抱歉，您无权访问此页面。"
      extra={<Button type="primary" onClick={() => navigate('/')}>返回首页</Button>}
    />;
  }
  
  return <>{children}</>;
};
```

## 下一步

- 阅读[后端开发指南](./backend.md)了解前后端协作
- 查看[API文档](../../api/reference.md)了解接口详情
- 学习[部署指南](../deployment/docker.md)了解如何部署前端应用