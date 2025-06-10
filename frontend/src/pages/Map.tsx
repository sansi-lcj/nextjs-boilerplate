import React, { useEffect, useRef, useState } from 'react';
import { Select, Spin, message } from 'antd';
import { assetService } from '../services/asset';
import { Asset } from '../types/asset';

const { Option } = Select;

// 声明天地图全局变量
declare global {
  interface Window {
    T: any;
  }
}

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<number | undefined>();
  const markers = useRef<any[]>([]);

  // 加载天地图脚本
  const loadTianDiTuScript = () => {
    return new Promise((resolve, reject) => {
      if (window.T) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://api.tianditu.gov.cn/api?v=4.0&tk=0361d56dfa968d3d585706f672aab830';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load TianDiTu script'));
      document.head.appendChild(script);
    });
  };

  // 初始化地图
  const initMap = async () => {
    try {
      setLoading(true);
      await loadTianDiTuScript();
      
      if (mapRef.current && window.T) {
        // 清除之前的地图实例
        if (mapInstance.current) {
          try {
            mapInstance.current.clearOverLays();
            // 尝试销毁地图实例
            if (typeof mapInstance.current.destroy === 'function') {
              mapInstance.current.destroy();
            }
          } catch (e) {
            console.warn('清理地图实例失败:', e);
          }
          mapInstance.current = null;
        }

        // ⭐ 关键修复：天地图第二次渲染后拖拽失效的解决方案
        // 删除地图dom后，重新渲染 - 这是解决天地图拖拽失效的关键
        const container = mapRef.current;
        const parent = container.parentNode as Element;
        
        if (parent) {
          // 创建新的容器替换旧容器
          const newContainer = document.createElement('div');
          newContainer.style.width = '100%';
          newContainer.style.height = '100%';
          newContainer.style.minHeight = '600px';
          newContainer.style.borderRadius = '0 0 6px 6px';
          
          // 替换旧容器 - 这一步是关键，必须重新创建DOM元素
          parent.replaceChild(newContainer, container);
          mapRef.current = newContainer;
          console.log('地图容器已重新创建，解决拖拽失效问题');
        }

        // 创建地图实例 - 使用新的容器
        const map = new window.T.Map(mapRef.current);
        
        // 设置地图中心点和级别（以北京为例）
        map.centerAndZoom(new window.T.LngLat(116.40387, 39.91489), 12);
        
        // 启用地图交互功能
        try {
          console.log('🗺️ 启用地图交互功能...');
          
          // ⭐ 重要：必须在地图实例创建后立即启用拖拽，避免标记点添加后失效
          map.enableScrollWheelZoom(); // 启用滚轮缩放
          map.enableDoubleClickZoom(); // 启用双击缩放
          map.enableDrag(); // 启用拖拽 - 这是关键
          map.enableInertia(); // 启用惯性拖拽
          map.enableKeyboard(); // 启用键盘操作
          
          console.log('✅ 地图交互功能已全部启用');
          
          // 验证拖拽是否启用
          if (typeof map.isEnableDrag === 'function') {
            console.log('🔍 拖拽状态检查:', map.isEnableDrag() ? '已启用' : '未启用');
          }
        } catch (e) {
          console.error('❌ 启用地图交互功能失败:', e);
        }
        
        // 强制地图重新计算尺寸
        setTimeout(() => {
          try {
            if (map && typeof map.checkResize === 'function') {
              map.checkResize();
            }
          } catch (e) {
            console.warn('地图尺寸调整失败:', e);
          }
        }, 100);
        
        // 添加地图控件
        try {
          const control = new window.T.Control.Zoom();
          if (window.T.ControlPosition && window.T.ControlPosition.TOP_LEFT) {
            control.setPosition(window.T.ControlPosition.TOP_LEFT);
          }
          map.addControl(control);
        } catch (e) {
          console.warn('缩放控件添加失败:', e);
        }

        // 添加比例尺控件
        try {
          const scale = new window.T.Control.Scale();
          if (window.T.ControlPosition && window.T.ControlPosition.BOTTOM_LEFT) {
            scale.setPosition(window.T.ControlPosition.BOTTOM_LEFT);
          }
          map.addControl(scale);
        } catch (e) {
          console.warn('比例尺控件添加失败:', e);
        }

        // 添加地图类型控件
        try {
          const mapType = new window.T.Control.MapType();
          map.addControl(mapType);
        } catch (e) {
          console.warn('地图类型控件添加失败:', e);
        }

        mapInstance.current = map;
        setLoading(false);
        
        // 获取资产数据并添加标记
        await fetchAssets();
      } else {
        throw new Error('地图初始化失败');
      }
    } catch (error) {
      console.error('Failed to initialize map:', error);
      message.error('地图加载失败，请检查网络连接');
      setLoading(false);
    }
  };

  // 获取资产数据
  const fetchAssets = async () => {
    try {
      const response = await assetService.getAssets({ pageSize: 100 });
      let assetList = response.data.items || [];
      
      // 如果没有数据，使用模拟数据
      if (assetList.length === 0) {
        assetList = [
          {
            id: 1,
            assetCode: 'AS001',
            assetName: '创新大厦',
            address: '北京市朝阳区建国路88号',
            assetType: 'office' as const,
            totalArea: 50000,
            buildArea: 45000,
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            status: 'normal' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            assetCode: 'AS002', 
            assetName: '科技园区A座',
            address: '北京市海淀区中关村大街35号',
            assetType: 'industrial' as const,
            totalArea: 80000,
            buildArea: 70000,
            province: '北京市',
            city: '北京市',
            district: '海淀区',
            status: 'normal' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 3,
            assetCode: 'AS003',
            assetName: '商业综合体',
            address: '北京市西城区金融街19号',
            assetType: 'commercial' as const,
            totalArea: 120000,
            buildArea: 100000,
            province: '北京市',
            city: '北京市',
            district: '西城区',
            status: 'maintenance' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      }
      
      setAssets(assetList);
      
      // 添加标记点
      if (assetList.length > 0 && mapInstance.current) {
        addMarkers(assetList);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      message.warning('使用模拟数据展示地图功能');
      
      // 使用模拟数据
      const mockAssets = [
        {
          id: 1,
          assetCode: 'AS001',
          assetName: '创新大厦',
          address: '北京市朝阳区建国路88号',
          assetType: 'office' as const,
          totalArea: 50000,
          buildArea: 45000,
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          status: 'normal' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          assetCode: 'AS002', 
          assetName: '科技园区A座',
          address: '北京市海淀区中关村大街35号',
          assetType: 'industrial' as const,
          totalArea: 80000,
          buildArea: 70000,
          province: '北京市',
          city: '北京市',
          district: '海淀区',
          status: 'normal' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          assetCode: 'AS003',
          assetName: '商业综合体',
          address: '北京市西城区金融街19号',
          assetType: 'commercial' as const,
          totalArea: 120000,
          buildArea: 100000,
          province: '北京市',
          city: '北京市',
          district: '西城区',
          status: 'maintenance' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setAssets(mockAssets);
      if (mapInstance.current) {
        addMarkers(mockAssets);
      }
    }
  };

  // 添加标记点
  const addMarkers = (assetList: Asset[]) => {
    if (!mapInstance.current || !window.T) return;

    // 清除现有标记
    markers.current.forEach(marker => {
      mapInstance.current.removeOverLay(marker);
    });
    markers.current = [];

    // 添加新标记
    assetList.forEach((asset, index) => {
      // 使用分散的位置来模拟不同资产的地理位置
      const baseLocations = [
        { lng: 116.40387, lat: 39.91489 }, // 北京天安门
        { lng: 116.30387, lat: 39.95489 }, // 北京西北
        { lng: 116.50387, lat: 39.87489 }, // 北京东南
        { lng: 116.35387, lat: 39.88489 }, // 北京西南
        { lng: 116.45387, lat: 39.94489 }, // 北京东北
      ];
      
      const baseLocation = baseLocations[index % baseLocations.length];
      const lng = baseLocation.lng + (Math.random() - 0.5) * 0.02;
      const lat = baseLocation.lat + (Math.random() - 0.5) * 0.02;
      
      // 创建自定义图标
      const icon = new window.T.Icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiMwMGQ5ZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjYiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+',
        iconSize: new window.T.Point(32, 32),
        iconAnchor: new window.T.Point(16, 32)
      });
      
      const marker = new window.T.Marker(new window.T.LngLat(lng, lat), { icon });
      
      // 创建信息窗口内容
      const infoContent = `
        <div style="padding: 12px; min-width: 200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h4 style="margin: 0 0 8px 0; color: #1890ff; font-size: 16px; font-weight: 600;">${asset.assetName}</h4>
          <div style="font-size: 14px; color: #666; line-height: 1.6;">
            <p style="margin: 4px 0;"><strong>资产编码：</strong>${asset.assetCode || '未设置'}</p>
            <p style="margin: 4px 0;"><strong>地址：</strong>${asset.address || '未设置'}</p>
            <p style="margin: 4px 0;"><strong>资产类型：</strong>${asset.assetType || '未知'}</p>
            <p style="margin: 4px 0;"><strong>总面积：</strong>${asset.totalArea || 0} m²</p>
            <p style="margin: 4px 0;"><strong>建筑面积：</strong>${asset.buildArea || 0} m²</p>
            <p style="margin: 4px 0;"><strong>状态：</strong><span style="color: ${asset.status === 'normal' ? '#52c41a' : '#faad14'}">${asset.status === 'normal' ? '正常' : '维护中'}</span></p>
          </div>
        </div>
      `;
      
      // 绑定点击事件
      marker.addEventListener('click', () => {
        const infoWindow = new window.T.InfoWindow(infoContent, {
          closeButton: true,
          width: 280,
          height: 200
        });
        marker.openInfoWindow(infoWindow);
      });
      
      // 绑定鼠标悬停事件（天地图不支持动画，改为简单提示）
      marker.addEventListener('mouseover', () => {
        try {
          // 简单的悬停效果 - 可以考虑改变图标样式或显示提示
          console.log(`悬停在资产: ${asset.assetName}`);
        } catch (e) {
          console.warn('悬停事件处理失败:', e);
        }
      });
      
      marker.addEventListener('mouseout', () => {
        try {
          // 悬停结束处理
          console.log(`离开资产: ${asset.assetName}`);
        } catch (e) {
          console.warn('悬停结束处理失败:', e);
        }
      });
      
      mapInstance.current.addOverLay(marker);
      markers.current.push(marker);
    });

    // 自动调整地图视野以包含所有标记
    if (markers.current.length > 0) {
      try {
        // 天地图使用不同的方法来调整视野
        // 获取第一个标记的位置并设置为地图中心
        const firstMarker = markers.current[0];
        if (firstMarker) {
          const lngLat = firstMarker.getLngLat();
          mapInstance.current.centerAndZoom(lngLat, 12);
        }
      } catch (e) {
        console.warn('自动调整地图视野失败:', e);
      }
    }
  };

  // 处理资产选择
  const handleAssetSelect = (assetId: number) => {
    setSelectedAsset(assetId);
    const asset = assets.find(a => a.id === assetId);
    if (asset && mapInstance.current) {
      // 找到对应的标记并定位
      const targetMarker = markers.current.find((_, index) => assets[index]?.id === assetId);
      if (targetMarker) {
        const lngLat = targetMarker.getLngLat();
        mapInstance.current.centerAndZoom(lngLat, 15);
        
        // 打开信息窗口
        setTimeout(() => {
          if (targetMarker && typeof targetMarker.fireEvent === 'function') {
            targetMarker.fireEvent('click');
          }
        }, 500);
      }
    }
  };

  // 处理窗口大小变化
  const handleResize = () => {
    if (mapInstance.current) {
      setTimeout(() => {
        try {
          if (mapInstance.current && typeof mapInstance.current.checkResize === 'function') {
            mapInstance.current.checkResize();
          }
        } catch (e) {
          console.warn('地图尺寸调整失败:', e);
        }
      }, 100);
    }
  };

  useEffect(() => {
    initMap();

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    return () => {
      // 清理地图实例
      if (mapInstance.current) {
        try {
          mapInstance.current.clearOverLays();
          // 尝试销毁地图实例
          if (typeof mapInstance.current.destroy === 'function') {
            mapInstance.current.destroy();
          }
        } catch (e) {
          console.warn('清理地图实例失败:', e);
        }
        mapInstance.current = null;
      }
      
      // 清空标记数组
      markers.current = [];
      
      // 清空地图容器
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
      
      // 移除事件监听
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>
        {`
          .custom-select .ant-select-selector {
            background-color: #ffffff !important;
            border: 1px solid #e1e5e9 !important;
            border-radius: 8px !important;
            color: #262626 !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
          }
          
          .custom-select .ant-select-selector:hover {
            border-color: #4096ff !important;
            box-shadow: 0 2px 6px rgba(64, 150, 255, 0.15) !important;
          }
          
          .custom-select .ant-select-focused .ant-select-selector {
            border-color: #4096ff !important;
            box-shadow: 0 0 0 3px rgba(64, 150, 255, 0.1), 0 2px 8px rgba(64, 150, 255, 0.2) !important;
          }
          
          .custom-select .ant-select-selection-placeholder {
            color: #8c8c8c !important;
            font-size: 14px !important;
          }
          
          .custom-select .ant-select-selection-search-input {
            color: #262626 !important;
            font-size: 14px !important;
          }
          
          .custom-select .ant-select-selection-item {
            color: #262626 !important;
            font-size: 14px !important;
            padding: 2px 8px !important;
            background: transparent !important;
            border: none !important;
            border-radius: 4px !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            font-weight: 500 !important;
          }
          
          .custom-select .ant-select-selection-item .ant-select-selection-item-content {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            padding: 0 !important;
          }
          
          .custom-select .ant-select-clear {
            background: rgba(0, 0, 0, 0.04);
            border-radius: 4px;
          }
          
          .custom-select .ant-select-item-option {
            padding: 0 !important;
            border-radius: 4px !important;
            margin: 2px 4px !important;
          }
          
          .custom-select .ant-select-item-option:hover {
            background-color: #f5f5f5 !important;
          }
          
          .custom-select .ant-select-item-option-selected {
            background-color: #e6f7ff !important;
            border-radius: 4px !important;
          }
          
          .custom-select .ant-select-item-option-active {
            background-color: #f0f0f0 !important;
          }
        `}
      </style>
      <div 
        style={{ 
          height: '100%',
          background: '#fff',
          borderRadius: '6px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
      {/* 标题栏 */}
      <div 
        style={{ 
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)'
          }}>
            🗺️
          </div>
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 600,
              color: '#262626',
              lineHeight: 1.2
            }}>
              资产地图展示
            </div>
            <div style={{
              fontSize: '12px',
              color: '#8c8c8c',
              marginTop: '2px'
            }}>
              {assets.length} 个资产位置
            </div>
          </div>
        </div>
        <div style={{ 
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '2px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <Select
            placeholder="🔍 搜索或选择资产"
            style={{ 
              width: 300,
              borderRadius: '8px'
            }}
            size="large"
            value={selectedAsset}
            onChange={handleAssetSelect}
            showSearch
            allowClear
            suffixIcon={null}
            filterOption={(input, option) =>
              option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
            }
            dropdownStyle={{
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              background: '#ffffff',
              padding: '6px 0',
              border: '1px solid #f0f0f0'
            }}
            className="custom-select"
          >
  {assets.map(asset => (
            <Option 
              key={asset.id} 
              value={asset.id}
              label={`${asset.assetType === 'office' ? '🏢' : 
                         asset.assetType === 'industrial' ? '🏭' : 
                         asset.assetType === 'commercial' ? '🏬' : '🏗️'} ${asset.assetName}`}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}>
                <span style={{ 
                  fontSize: '16px',
                  lineHeight: 1
                }}>
                  {asset.assetType === 'office' ? '🏢' : 
                   asset.assetType === 'industrial' ? '🏭' : 
                   asset.assetType === 'commercial' ? '🏬' : '🏗️'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 500,
                    color: '#262626',
                    lineHeight: 1.4,
                    marginBottom: '2px'
                  }}>
                    {asset.assetName}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999',
                    lineHeight: 1.3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{asset.assetCode}</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '150px'
                    }}>
                      {asset.address}
                    </span>
                  </div>
                </div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: asset.status === 'normal' ? '#52c41a' : '#faad14',
                  flexShrink: 0
                }}>
                </div>
              </div>
            </Option>
          ))}
        </Select>
        </div>
      </div>

      {/* 地图容器 - 完全独立，没有任何事件阻拦 */}
      <div 
        style={{ 
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: '#f5f5f5'
        }}
      >
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '600px',
            borderRadius: '0 0 6px 6px',
            cursor: 'grab'
          }} 
        />
        {loading && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              pointerEvents: 'auto'
            }}
          >
            <Spin size="large" tip="地图加载中..." />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Map;