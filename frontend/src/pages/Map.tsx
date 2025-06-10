import React, { useEffect, useRef, useState } from 'react';
import { Select, Spin, message, Card, Space, Typography } from 'antd';
import { assetService } from '../services/asset';
import { Asset } from '../types/asset';

const { Option } = Select;
const { Title } = Typography;

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
            if (typeof mapInstance.current.destroy === 'function') {
              mapInstance.current.destroy();
            }
          } catch (e) {
            console.warn('清理地图实例失败:', e);
          }
          mapInstance.current = null;
        }

        // 创建地图实例
        const map = new window.T.Map(mapRef.current);
        
        // 设置地图中心点和级别（以北京为例）
        map.centerAndZoom(new window.T.LngLat(116.40387, 39.91489), 12);
        
        // 启用地图交互功能
        try {
          map.enableScrollWheelZoom();
          map.enableDoubleClickZoom();
          map.enableDrag();
          map.enableInertia();
          map.enableKeyboard();
        } catch (e) {
          console.error('启用地图交互功能失败:', e);
        }
        
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
      let assetList = (response.data as any)?.data || [];
      
      // 如果没有数据，使用模拟数据
      if (assetList.length === 0) {
        assetList = [
          {
            id: 1,
            asset_code: 'AS001',
            asset_name: '创新大厦',
            address: '北京市朝阳区建国路88号',
            asset_type: 'office' as const,
            total_area: 50000,
            build_area: 45000,
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            street_id: 1,
            status: 'normal' as const,
            created_by: 1,
            updated_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            asset_code: 'AS002', 
            asset_name: '科技园区A座',
            address: '北京市海淀区中关村大街35号',
            asset_type: 'industrial' as const,
            total_area: 80000,
            build_area: 70000,
            province: '北京市',
            city: '北京市',
            district: '海淀区',
            street_id: 2,
            status: 'normal' as const,
            created_by: 1,
            updated_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            asset_code: 'AS003',
            asset_name: '商业综合体',
            address: '北京市西城区金融街19号',
            asset_type: 'commercial' as const,
            total_area: 120000,
            build_area: 100000,
            province: '北京市',
            city: '北京市',
            district: '西城区',
            street_id: 3,
            status: 'maintenance' as const,
            created_by: 1,
            updated_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
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
          asset_code: 'AS001',
          asset_name: '创新大厦',
          address: '北京市朝阳区建国路88号',
          asset_type: 'office' as const,
          total_area: 50000,
          build_area: 45000,
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          street_id: 1,
          status: 'normal' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
        { lng: 116.40387, lat: 39.91489 },
        { lng: 116.30387, lat: 39.95489 },
        { lng: 116.50387, lat: 39.87489 },
        { lng: 116.35387, lat: 39.88489 },
        { lng: 116.45387, lat: 39.94489 },
      ];
      
      const baseLocation = baseLocations[index % baseLocations.length];
      const lng = baseLocation.lng + (Math.random() - 0.5) * 0.02;
      const lat = baseLocation.lat + (Math.random() - 0.5) * 0.02;
      
      const marker = new window.T.Marker(new window.T.LngLat(lng, lat));
      
      // 创建信息窗口内容
      const infoContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h4>${asset.asset_name}</h4>
          <p><strong>资产编码：</strong>${asset.asset_code || '未设置'}</p>
          <p><strong>地址：</strong>${asset.address || '未设置'}</p>
          <p><strong>总面积：</strong>${asset.total_area || 0} m²</p>
          <p><strong>状态：</strong>${asset.status === 'normal' ? '正常' : '维护中'}</p>
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
      
      mapInstance.current.addOverLay(marker);
      markers.current.push(marker);
    });
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

  useEffect(() => {
    initMap();

    return () => {
      // 清理地图实例
      if (mapInstance.current) {
        try {
          mapInstance.current.clearOverLays();
          if (typeof mapInstance.current.destroy === 'function') {
            mapInstance.current.destroy();
          }
        } catch (e) {
          console.warn('清理地图实例失败:', e);
        }
        mapInstance.current = null;
      }
      
      markers.current = [];
      
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <Space direction="vertical" size="large">
      {/* 页面标题 */}
      <Card>
        <Title level={2}>🗺️ 地图展示</Title>
        {assets.length > 0 && (
          <div>
            <span>选择资产定位：</span>
            <Select
              value={selectedAsset}
              placeholder="请选择资产"
              onChange={handleAssetSelect}
              style={{ width: 200, marginLeft: 8 }}
            >
              {assets.map(asset => (
                <Option key={asset.id} value={asset.id}>
                  {asset.asset_name}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </Card>

      {/* 地图容器 */}
      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 100 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>地图加载中...</div>
          </div>
        ) : (
          <div 
            ref={mapRef} 
            style={{ 
              width: '100%', 
              height: 600, 
              borderRadius: 6 
            }}
          />
        )}
      </Card>
    </Space>
  );
};

export default Map;