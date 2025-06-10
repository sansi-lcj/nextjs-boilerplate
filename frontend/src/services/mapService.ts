import { get, post } from '../utils/request';
import type {
  MapPoint,
  MapLayer,
  MapViewport,
  MapRegion,
  HeatmapData,
  ClusterData,
  RouteData,
  SearchResult,
  POIData,
  GeofenceData,
  MapConfig,
  MapStyle,
  Coordinates,
  Bounds
} from '../types/map';
import type { Asset, Building, Floor, Room } from '../types/asset';

/**
 * 地图服务类
 */
export class MapService {
  private tiandituKey: string = process.env.REACT_APP_TIANDITU_KEY || '';

  /**
   * 获取资产地图点位数据
   */
  async getAssetMapPoints(): Promise<MapPoint[]> {
    return get<MapPoint[]>('/map/assets/points');
  }

  /**
   * 获取楼宇地图点位数据
   */
  async getBuildingMapPoints(assetId?: number): Promise<MapPoint[]> {
    const params = assetId ? { assetId } : {};
    return get<MapPoint[]>('/map/buildings/points', params);
  }

  /**
   * 获取房间地图点位数据
   */
  async getRoomMapPoints(buildingId?: number): Promise<MapPoint[]> {
    const params = buildingId ? { buildingId } : {};
    return get<MapPoint[]>('/map/rooms/points', params);
  }

  /**
   * 根据点位ID获取详细信息
   */
  async getPointDetail(pointId: string, type: 'asset' | 'building' | 'floor' | 'room'): Promise<any> {
    return get<any>(`/map/points/${type}/${pointId}`);
  }

  /**
   * 搜索地图上的位置
   */
  async searchLocation(keyword: string): Promise<SearchResult[]> {
    return get<SearchResult[]>('/map/search', { keyword });
  }

  /**
   * 获取地理编码
   */
  async geocode(address: string): Promise<Coordinates> {
    return get<Coordinates>('/map/geocode', { address });
  }

  /**
   * 获取逆地理编码
   */
  async reverseGeocode(coordinates: Coordinates): Promise<string> {
    return get<string>('/map/reverse-geocode', coordinates);
  }

  /**
   * 获取热力图数据
   */
  async getHeatmapData(type: string): Promise<HeatmapData[]> {
    return get<HeatmapData[]>('/map/heatmap', { type });
  }

  /**
   * 获取聚类数据
   */
  async getClusterData(bounds: Bounds, zoom: number): Promise<ClusterData[]> {
    return get<ClusterData[]>('/map/cluster', { bounds, zoom });
  }

  /**
   * 获取路径规划
   */
  async getRoute(start: Coordinates, end: Coordinates, mode?: string): Promise<RouteData> {
    return get<RouteData>('/map/route', { start, end, mode });
  }

  /**
   * 获取兴趣点数据
   */
  async getPOIData(category?: string, bounds?: Bounds): Promise<POIData[]> {
    const params: any = {};
    if (category) params.category = category;
    if (bounds) params.bounds = bounds;
    return get<POIData[]>('/map/poi', params);
  }

  /**
   * 获取地理围栏数据
   */
  async getGeofences(): Promise<GeofenceData[]> {
    return get<GeofenceData[]>('/map/geofences');
  }

  /**
   * 创建地理围栏
   */
  async createGeofence(data: Omit<GeofenceData, 'id'>): Promise<GeofenceData> {
    return post<GeofenceData>('/map/geofences', data);
  }

  /**
   * 更新地理围栏
   */
  async updateGeofence(id: string, data: Partial<GeofenceData>): Promise<GeofenceData> {
    return post<GeofenceData>(`/map/geofences/${id}`, data);
  }

  /**
   * 删除地理围栏
   */
  async deleteGeofence(id: string): Promise<void> {
    return get<void>(`/map/geofences/${id}/delete`);
  }

  /**
   * 获取地图配置
   */
  async getMapConfig(): Promise<MapConfig> {
    return get<MapConfig>('/map/config');
  }

  /**
   * 更新地图配置
   */
  async updateMapConfig(config: Partial<MapConfig>): Promise<MapConfig> {
    return post<MapConfig>('/map/config', config);
  }

  /**
   * 获取地图样式
   */
  async getMapStyles(): Promise<MapStyle[]> {
    return get<MapStyle[]>('/map/styles');
  }

  /**
   * 获取地图图层
   */
  async getMapLayers(): Promise<MapLayer[]> {
    return get<MapLayer[]>('/map/layers');
  }

  /**
   * 切换图层显示状态
   */
  async toggleLayer(layerId: string, visible: boolean): Promise<void> {
    return post<void>(`/map/layers/${layerId}/toggle`, { visible });
  }

  /**
   * 保存用户地图偏好
   */
  async saveMapPreferences(viewport: MapViewport, layers: string[]): Promise<void> {
    return post<void>('/map/preferences', { viewport, layers });
  }

  /**
   * 获取用户地图偏好
   */
  async getMapPreferences(): Promise<{ viewport: MapViewport; layers: string[] }> {
    return get<{ viewport: MapViewport; layers: string[] }>('/map/preferences');
  }

  /**
   * 计算两点间距离
   */
  calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // 地球半径 (公里)
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) * Math.cos(this.toRadians(point2.latitude)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * 角度转弧度
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * 检查点是否在边界内
   */
  isPointInBounds(point: Coordinates, bounds: Bounds): boolean {
    return (
      point.latitude >= bounds.southwest.latitude &&
      point.latitude <= bounds.northeast.latitude &&
      point.longitude >= bounds.southwest.longitude &&
      point.longitude <= bounds.northeast.longitude
    );
  }

  /**
   * 获取边界中心点
   */
  getBoundsCenter(bounds: Bounds): Coordinates {
    return {
      latitude: (bounds.northeast.latitude + bounds.southwest.latitude) / 2,
      longitude: (bounds.northeast.longitude + bounds.southwest.longitude) / 2,
    };
  }

  /**
   * 扩展边界
   */
  expandBounds(bounds: Bounds, factor: number): Bounds {
    const center = this.getBoundsCenter(bounds);
    const latDiff = (bounds.northeast.latitude - bounds.southwest.latitude) * factor / 2;
    const lonDiff = (bounds.northeast.longitude - bounds.southwest.longitude) * factor / 2;

    return {
      northeast: {
        latitude: center.latitude + latDiff,
        longitude: center.longitude + lonDiff,
      },
      southwest: {
        latitude: center.latitude - latDiff,
        longitude: center.longitude - lonDiff,
      },
    };
  }

  /**
   * 格式化坐标显示
   */
  formatCoordinates(coordinates: Coordinates, precision: number = 6): string {
    return `${coordinates.latitude.toFixed(precision)}, ${coordinates.longitude.toFixed(precision)}`;
  }

  /**
   * 验证坐标有效性
   */
  validateCoordinates(coordinates: Coordinates): boolean {
    return (
      coordinates.latitude >= -90 &&
      coordinates.latitude <= 90 &&
      coordinates.longitude >= -180 &&
      coordinates.longitude <= 180
    );
  }

  /**
   * 获取天地图瓦片URL
   */
  getTiandituTileUrl(type: 'vec' | 'img' | 'ter' = 'vec', x: number, y: number, z: number): string {
    const subdomain = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'][Math.floor(Math.random() * 8)];
    return `https://${subdomain}.tianditu.gov.cn/${type}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${type}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=${x}&TILEROW=${y}&TILEMATRIX=${z}&tk=${this.tiandituKey}`;
  }

  /**
   * 获取天地图标注图层URL
   */
  getTiandituLabelUrl(type: 'cva' | 'cia' | 'cta' = 'cva', x: number, y: number, z: number): string {
    const subdomain = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'][Math.floor(Math.random() * 8)];
    return `https://${subdomain}.tianditu.gov.cn/${type}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${type}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=${x}&TILEROW=${y}&TILEMATRIX=${z}&tk=${this.tiandituKey}`;
  }
}

// 导出服务实例
export const mapService = new MapService(); 