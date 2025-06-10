// 地图相关类型定义

// 地理坐标
export interface Coordinates {
  longitude: number;
  latitude: number;
}

// 地理边界
export interface Bounds {
  northeast: Coordinates;
  southwest: Coordinates;
}

// 地图视窗
export interface MapViewport {
  center: Coordinates;
  zoom: number;
  bounds?: Bounds;
  pitch?: number;
  bearing?: number;
}

// 地图点位
export interface MapPoint {
  id: string | number;
  coordinates: Coordinates;
  type: MapPointType;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  size?: MapPointSize;
  data?: Record<string, any>;
  clusterable?: boolean;
}

// 地图点位类型
export type MapPointType = 
  | 'asset'      // 资产点位
  | 'building'   // 楼宇点位
  | 'room'       // 房间点位
  | 'landmark'   // 地标点位
  | 'poi'        // 兴趣点
  | 'custom';    // 自定义点位

// 地图点位大小
export type MapPointSize = 'small' | 'medium' | 'large';

// 地图标记
export interface MapMarker extends MapPoint {
  visible: boolean;
  interactive: boolean;
  popup?: MapPopupContent;
  tooltip?: string;
  zIndex?: number;
}

// 地图弹窗内容
export interface MapPopupContent {
  title: string;
  content: string | React.ReactNode;
  width?: number;
  height?: number;
  showCloseButton?: boolean;
  offset?: [number, number];
}

// 地图图层
export interface MapLayer {
  id: string;
  name: string;
  type: MapLayerType;
  visible: boolean;
  opacity: number;
  minZoom?: number;
  maxZoom?: number;
  source?: string;
  style?: Record<string, any>;
  interactive?: boolean;
  data?: any;
}

// 地图图层类型
export type MapLayerType = 
  | 'base'       // 底图图层
  | 'satellite'  // 卫星图层
  | 'terrain'    // 地形图层
  | 'traffic'    // 交通图层
  | 'marker'     // 标记图层
  | 'heatmap'    // 热力图层
  | 'cluster'    // 聚合图层
  | 'polygon'    // 多边形图层
  | 'line'       // 线图层
  | 'custom';    // 自定义图层

// 地图控件
export interface MapControl {
  type: MapControlType;
  position: MapControlPosition;
  visible: boolean;
  options?: Record<string, any>;
}

// 地图控件类型
export type MapControlType = 
  | 'zoom'         // 缩放控件
  | 'navigation'   // 导航控件
  | 'scale'        // 比例尺
  | 'fullscreen'   // 全屏控件
  | 'compass'      // 指南针
  | 'location'     // 定位控件
  | 'layers'       // 图层控件
  | 'search'       // 搜索控件
  | 'draw'         // 绘制控件
  | 'measure'      // 测量控件
  | 'custom';      // 自定义控件

// 地图控件位置
export type MapControlPosition = 
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'
  | 'left-center'
  | 'right-center';

// 地图配置
export interface MapConfig {
  apiKey: string;
  style: MapStyle;
  viewport: MapViewport;
  controls: MapControl[];
  layers: MapLayer[];
  maxZoom: number;
  minZoom: number;
  doubleClickZoom: boolean;
  scrollWheelZoom: boolean;
  dragPan: boolean;
  dragRotate: boolean;
  touchZoomRotate: boolean;
  keyboard: boolean;
  locale: string;
}

// 地图样式
export type MapStyle = 
  | 'normal'     // 标准地图
  | 'satellite'  // 卫星地图
  | 'terrain'    // 地形地图
  | 'dark'       // 深色地图
  | 'light'      // 浅色地图
  | 'custom';    // 自定义样式

// 地图事件
export interface MapEvent {
  type: MapEventType;
  coordinates?: Coordinates;
  point?: MapPoint;
  layer?: MapLayer;
  feature?: any;
  originalEvent?: Event;
  target?: any;
}

// 地图事件类型
export type MapEventType = 
  | 'click'         // 点击事件
  | 'dblclick'      // 双击事件
  | 'contextmenu'   // 右键菜单
  | 'mousemove'     // 鼠标移动
  | 'mouseenter'    // 鼠标进入
  | 'mouseleave'    // 鼠标离开
  | 'zoom'          // 缩放事件
  | 'move'          // 移动事件
  | 'moveend'       // 移动结束
  | 'load'          // 加载完成
  | 'error'         // 错误事件
  | 'resize'        // 窗口大小变化
  | 'data'          // 数据变化
  | 'sourcedata'    // 数据源变化
  | 'styledata';    // 样式数据变化

// 地图搜索结果
export interface MapSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  type: string;
  distance?: number;
  relevance?: number;
  bounds?: Bounds;
  properties?: Record<string, any>;
}

// 地图搜索选项
export interface MapSearchOptions {
  query: string;
  types?: string[];
  bounds?: Bounds;
  proximity?: Coordinates;
  limit?: number;
  language?: string;
  fuzzyMatch?: boolean;
}

// 地图路径规划
export interface MapRoute {
  id: string;
  coordinates: Coordinates[];
  distance: number;
  duration: number;
  instructions: RouteInstruction[];
  profile: RouteProfile;
  alternatives?: MapRoute[];
}

// 路径规划配置
export type RouteProfile = 
  | 'driving'    // 驾车
  | 'walking'    // 步行
  | 'cycling'    // 骑行
  | 'transit';   // 公交

// 路径指令
export interface RouteInstruction {
  text: string;
  maneuver: string;
  distance: number;
  duration: number;
  coordinates: Coordinates;
  direction?: number;
  exit?: number;
}

// 地图测量
export interface MapMeasurement {
  id: string;
  type: MeasurementType;
  coordinates: Coordinates[];
  result: {
    distance?: number;
    area?: number;
    perimeter?: number;
  };
  unit: MeasurementUnit;
  label?: string;
}

// 测量类型
export type MeasurementType = 
  | 'distance'   // 距离测量
  | 'area'       // 面积测量
  | 'bearing';   // 方位角测量

// 测量单位
export type MeasurementUnit = 
  | 'meters'     // 米
  | 'kilometers' // 千米
  | 'feet'       // 英尺
  | 'miles'      // 英里
  | 'square_meters'     // 平方米
  | 'square_kilometers' // 平方千米
  | 'hectares'          // 公顷
  | 'acres';            // 英亩

// 地图绘制
export interface MapDrawing {
  id: string;
  type: DrawingType;
  coordinates: Coordinates[];
  style?: DrawingStyle;
  properties?: Record<string, any>;
  editable?: boolean;
  deletable?: boolean;
}

// 绘制类型
export type DrawingType = 
  | 'point'      // 点
  | 'line'       // 线
  | 'polygon'    // 多边形
  | 'rectangle'  // 矩形
  | 'circle'     // 圆形
  | 'text';      // 文本

// 绘制样式
export interface DrawingStyle {
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  dashArray?: number[];
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'bevel' | 'round' | 'miter';
}

// 地图热力图
export interface MapHeatmap {
  id: string;
  name: string;
  data: HeatmapDataPoint[];
  options: HeatmapOptions;
  visible: boolean;
}

// 热力图数据点
export interface HeatmapDataPoint {
  coordinates: Coordinates;
  weight: number;
  radius?: number;
  gradient?: number;
}

// 热力图选项
export interface HeatmapOptions {
  radius: number;
  blur: number;
  maxZoom: number;
  max: number;
  gradient: Record<string, string>;
  minOpacity: number;
}

// 地图聚合
export interface MapCluster {
  id: string;
  coordinates: Coordinates;
  count: number;
  points: MapPoint[];
  radius: number;
  zoom: number;
  bounds: Bounds;
}

// 聚合配置
export interface ClusterOptions {
  radius: number;
  maxZoom: number;
  minPoints: number;
  disableClusteringAtZoom?: number;
  spiderfyOnMaxZoom?: boolean;
  showCoverageOnHover?: boolean;
  zoomToBoundsOnClick?: boolean;
  iconCreateFunction?: (cluster: MapCluster) => any;
}

// 地图过滤器
export interface MapFilter {
  id: string;
  name: string;
  property: string;
  operator: FilterOperator;
  value: any;
  active: boolean;
}

// 过滤器操作符
export type FilterOperator = 
  | 'equals'       // 等于
  | 'not_equals'   // 不等于
  | 'greater_than' // 大于
  | 'less_than'    // 小于
  | 'contains'     // 包含
  | 'starts_with'  // 开始于
  | 'ends_with'    // 结束于
  | 'in'           // 在列表中
  | 'not_in';      // 不在列表中

// 地图主题
export interface MapTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  sizes: {
    small: number;
    medium: number;
    large: number;
  };
}

// 地图状态
export interface MapState {
  viewport: MapViewport;
  style: MapStyle;
  layers: MapLayer[];
  markers: MapMarker[];
  drawings: MapDrawing[];
  measurements: MapMeasurement[];
  heatmaps: MapHeatmap[];
  filters: MapFilter[];
  searchResults: MapSearchResult[];
  selectedPoint?: MapPoint;
  loading: boolean;
  error?: string;
}

// 地图操作
export interface MapActions {
  setViewport: (viewport: Partial<MapViewport>) => void;
  setStyle: (style: MapStyle) => void;
  addMarker: (marker: MapMarker) => void;
  removeMarker: (id: string) => void;
  updateMarker: (id: string, updates: Partial<MapMarker>) => void;
  addLayer: (layer: MapLayer) => void;
  removeLayer: (id: string) => void;
  toggleLayer: (id: string) => void;
  search: (options: MapSearchOptions) => Promise<MapSearchResult[]>;
  route: (start: Coordinates, end: Coordinates, profile?: RouteProfile) => Promise<MapRoute>;
  measure: (type: MeasurementType, coordinates: Coordinates[]) => MapMeasurement;
  draw: (type: DrawingType, coordinates: Coordinates[]) => MapDrawing;
  addFilter: (filter: MapFilter) => void;
  removeFilter: (id: string) => void;
  clearAll: () => void;
}

// 地图上下文
export interface MapContextValue {
  map: any; // 地图实例
  state: MapState;
  actions: MapActions;
  config: MapConfig;
}

// 地图组件属性
export interface MapComponentProps {
  config?: Partial<MapConfig>;
  viewport?: Partial<MapViewport>;
  markers?: MapMarker[];
  layers?: MapLayer[];
  controls?: MapControl[];
  onViewportChange?: (viewport: MapViewport) => void;
  onMarkerClick?: (marker: MapMarker, event: MapEvent) => void;
  onMapClick?: (event: MapEvent) => void;
  onLoad?: (map: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

// 天地图 API 相关类型
export interface TiandituConfig {
  apiKey: string;
  version: string;
  plugins: string[];
}

// 天地图图层
export interface TiandituLayer {
  type: TiandituLayerType;
  visible: boolean;
  opacity: number;
}

// 天地图图层类型
export type TiandituLayerType = 
  | 'vec'     // 矢量底图
  | 'img'     // 影像底图
  | 'ter'     // 地形底图
  | 'cva'     // 矢量注记
  | 'cia'     // 影像注记
  | 'cta'     // 地形注记
  | 'ibo'     // 境界
  | 'eva'     // 矢量英文注记
  | 'eia';    // 影像英文注记

// 地图工具条
export interface MapToolbar {
  visible: boolean;
  position: MapControlPosition;
  tools: MapTool[];
}

// 地图工具
export interface MapTool {
  id: string;
  name: string;
  icon: string;
  action: MapToolAction;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

// 地图工具操作
export type MapToolAction = 
  | 'select'     // 选择工具
  | 'pan'        // 平移工具
  | 'zoom_in'    // 放大工具
  | 'zoom_out'   // 缩小工具
  | 'measure'    // 测量工具
  | 'draw'       // 绘制工具
  | 'search'     // 搜索工具
  | 'layers'     // 图层工具
  | 'fullscreen' // 全屏工具
  | 'reset'      // 重置工具
  | 'export'     // 导出工具
  | 'print';     // 打印工具

// 地图导出选项
export interface MapExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  width?: number;
  height?: number;
  dpi?: number;
  quality?: number;
  includeUI?: boolean;
  title?: string;
  description?: string;
}

// 地图导出结果
export interface MapExportResult {
  url: string;
  filename: string;
  size: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}

// 地图区域
export interface MapRegion {
  id: string;
  name: string;
  type: 'district' | 'street' | 'community' | 'custom';
  level: number;
  bounds: Bounds;
  center: Coordinates;
  zoom?: number;
  properties?: Record<string, any>;
}

// 热力图数据（之前可能没有定义）
export interface HeatmapData {
  coordinates: Coordinates;
  weight: number;
  radius?: number;
}

// 聚类数据
export interface ClusterData {
  id: string;
  coordinates: Coordinates;
  count: number;
  bounds: Bounds;
  points?: MapPoint[];
}

// 路线数据
export interface RouteData {
  id?: string;
  start: Coordinates;
  end: Coordinates;
  waypoints?: Coordinates[];
  distance: number;
  duration: number;
  path: Coordinates[];
  instructions?: string[];
  mode: 'driving' | 'walking' | 'transit';
}

// POI（兴趣点）数据
export interface POIData {
  id: string;
  name: string;
  category: string;
  coordinates: Coordinates;
  address?: string;
  phone?: string;
  rating?: number;
  tags?: string[];
  distance?: number;
}

// 地理围栏数据
export interface GeofenceData {
  id: string;
  name: string;
  type: 'circle' | 'polygon' | 'rectangle';
  center?: Coordinates;
  radius?: number;
  points?: Coordinates[];
  bounds?: Bounds;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
  triggerOn?: 'enter' | 'exit' | 'both';
  notificationEnabled?: boolean;
}

// 导出 SearchResult 别名，兼容旧代码
export type SearchResult = MapSearchResult; 