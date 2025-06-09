import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Spin } from 'antd';
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
      script.src = 'http://api.tianditu.gov.cn/api?v=4.0&tk=您的天地图密钥'; // 需要替换为实际密钥
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load TianDiTu script'));
      document.head.appendChild(script);
    });
  };

  // 初始化地图
  const initMap = async () => {
    try {
      await loadTianDiTuScript();
      
      if (mapRef.current && window.T) {
        // 创建地图实例
        const map = new window.T.Map(mapRef.current);
        // 设置地图中心点和级别（以北京为例）
        map.centerAndZoom(new window.T.LngLat(116.40387, 39.91489), 12);
        
        // 添加缩放控件
        const control = new window.T.Control.Zoom();
        map.addControl(control);

        mapInstance.current = map;
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setLoading(false);
    }
  };

  // 获取资产数据
  const fetchAssets = async () => {
    try {
      const response = await assetService.getAssets({ page_size: 100 });
      setAssets(response.data.list || []);
      
      // 添加标记点
      if (response.data.list && mapInstance.current) {
        addMarkers(response.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
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
    assetList.forEach(asset => {
      // 这里需要资产有经纬度信息，暂时使用随机位置
      const lng = 116.40387 + (Math.random() - 0.5) * 0.1;
      const lat = 39.91489 + (Math.random() - 0.5) * 0.1;
      
      const marker = new window.T.Marker(new window.T.LngLat(lng, lat));
      
      // 创建信息窗口
      const info = `
        <div style="padding: 10px;">
          <h4>${asset.name}</h4>
          <p>类型：${asset.type}</p>
          <p>地址：${asset.address}</p>
          <p>占地面积：${asset.land_area}m²</p>
          <p>建筑面积：${asset.building_area}m²</p>
        </div>
      `;
      
      marker.addEventListener('click', () => {
        const infoWindow = new window.T.InfoWindow(info);
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
      // 定位到选中的资产（需要资产有经纬度信息）
      // 这里暂时使用固定位置
      const lng = 116.40387 + (Math.random() - 0.5) * 0.1;
      const lat = 39.91489 + (Math.random() - 0.5) * 0.1;
      mapInstance.current.centerAndZoom(new window.T.LngLat(lng, lat), 15);
    }
  };

  useEffect(() => {
    initMap();
    fetchAssets();

    return () => {
      // 清理地图实例
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <Card
      title="资产地图展示"
      extra={
        <Select
          placeholder="选择资产"
          style={{ width: 200 }}
          value={selectedAsset}
          onChange={handleAssetSelect}
          showSearch
          filterOption={(input, option) =>
            (option?.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {assets.map(asset => (
            <Option key={asset.id} value={asset.id}>
              {asset.name}
            </Option>
          ))}
        </Select>
      }
    >
      <Spin spinning={loading} tip="地图加载中...">
        <div ref={mapRef} style={{ width: '100%', height: '600px' }} />
      </Spin>
    </Card>
  );
};

export default Map;