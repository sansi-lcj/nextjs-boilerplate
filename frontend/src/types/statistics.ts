// 统计分析相关类型定义

// 统计维度
export type StatisticsDimension = 
  | 'type'        // 按类型统计
  | 'status'      // 按状态统计
  | 'department'  // 按部门统计
  | 'value'       // 按价值统计
  | 'time'        // 按时间统计
  | 'location'    // 按位置统计
  | 'usage';      // 按使用率统计

// 统计指标
export type StatisticsMetric = 
  | 'count'       // 数量
  | 'value'       // 价值
  | 'ratio'       // 比率
  | 'rate'        // 占用率
  | 'area'        // 面积
  | 'avg'         // 平均值
  | 'sum'         // 总和
  | 'growth';     // 增长率

// 时间范围
export type TimeRange = 
  | 'today'       // 今日
  | 'week'        // 本周
  | 'month'       // 本月
  | 'quarter'     // 本季度
  | 'year'        // 本年
  | 'custom';     // 自定义

// 图表类型
export type ChartType = 
  | 'bar'         // 柱状图
  | 'line'        // 折线图
  | 'pie'         // 饼图
  | 'area'        // 面积图
  | 'scatter'     // 散点图
  | 'heatmap'     // 热力图
  | 'gauge'       // 仪表盘
  | 'radar';      // 雷达图

// 统计概览数据
export interface StatisticsOverview {
  totalAssets: number;
  totalValue: number;
  totalBuildings: number;
  totalRooms: number;
  utilizationRate: number;
  availableRooms: number;
  maintenanceAssets: number;
  newAssetsThisMonth: number;
}

// 统计查询参数
export interface StatisticsQueryParams {
  dimension: StatisticsDimension;
  metric?: StatisticsMetric;
  timeRange?: TimeRange;
  startDate?: string;
  endDate?: string;
  groupBy?: string;
  organizationId?: number;
  buildingId?: number;
  assetType?: string;
  status?: string;
  limit?: number;
}

// 统计项目
export interface StatisticsItem {
  key: string;
  label: string;
  value: number;
  percentage?: number;
  count?: number;
  extra?: Record<string, any>;
}

// 统计响应数据
export interface StatisticsResponse {
  dimension: StatisticsDimension;
  metric: StatisticsMetric;
  timeRange?: TimeRange;
  total?: number;
  items: StatisticsItem[];
  summary?: Record<string, any>;
}

// 趋势数据点
export interface TrendDataPoint {
  time: string;
  value: number;
  count?: number;
  category?: string;
}

// 趋势数据
export interface TrendData {
  timeRange: TimeRange;
  metric: StatisticsMetric;
  data: TrendDataPoint[];
  summary: {
    total: number;
    growth: number;
    average: number;
  };
}

// 资产类型分布
export interface AssetTypeDistribution {
  type: string;
  typeName: string;
  count: number;
  value: number;
  percentage: number;
  color?: string;
}

// 资产状态统计
export interface AssetStatusStatistics {
  status: string;
  statusName: string;
  count: number;
  percentage: number;
  color?: string;
}

// 价值区间分布
export interface ValueRangeDistribution {
  range: string;
  rangeLabel: string;
  minValue: number;
  maxValue: number;
  count: number;
  totalValue: number;
  percentage: number;
}

// 部门资产统计
export interface DepartmentAssetStatistics {
  departmentId: number;
  departmentName: string;
  assetCount: number;
  totalValue: number;
  utilizationRate: number;
  topAssetTypes: Array<{
    type: string;
    count: number;
  }>;
}

// 楼宇使用率统计
export interface BuildingUtilizationStatistics {
  buildingId: number;
  buildingName: string;
  totalRooms: number;
  occupiedRooms: number;
  utilizationRate: number;
  totalArea: number;
  usedArea: number;
  areaUtilizationRate: number;
}

// 楼层占用情况
export interface FloorOccupancyStatistics {
  floorId: number;
  floorName: string;
  buildingName: string;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  roomTypes: Array<{
    type: string;
    count: number;
  }>;
}

// 地图热力数据
export interface HeatmapData {
  longitude: number;
  latitude: number;
  value: number;
  count: number;
  label?: string;
  extra?: Record<string, any>;
}

// 地图统计区域
export interface MapStatisticsRegion {
  regionId: string;
  regionName: string;
  regionType: 'district' | 'street' | 'community';
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  statistics: {
    assetCount: number;
    buildingCount: number;
    totalValue: number;
    utilizationRate: number;
  };
  heatmapData: HeatmapData[];
}

// 资产增长趋势
export interface AssetGrowthTrend {
  period: string;
  totalAssets: number;
  newAssets: number;
  retiredAssets: number;
  netGrowth: number;
  growthRate: number;
  cumulativeValue: number;
}

// 维修统计
export interface MaintenanceStatistics {
  totalMaintenanceCount: number;
  totalMaintenanceCost: number;
  avgMaintenanceCost: number;
  maintenanceByType: Array<{
    type: string;
    count: number;
    cost: number;
  }>;
  maintenanceByMonth: Array<{
    month: string;
    count: number;
    cost: number;
  }>;
  topMaintenanceAssets: Array<{
    assetId: number;
    assetName: string;
    maintenanceCount: number;
    totalCost: number;
  }>;
}

// 折旧分析
export interface DepreciationAnalysis {
  totalOriginalValue: number;
  totalCurrentValue: number;
  totalDepreciation: number;
  depreciationRate: number;
  depreciationByType: Array<{
    type: string;
    originalValue: number;
    currentValue: number;
    depreciation: number;
    rate: number;
  }>;
  depreciationTrend: Array<{
    year: string;
    depreciation: number;
    rate: number;
  }>;
}

// 使用率分析
export interface UtilizationAnalysis {
  overallUtilization: number;
  utilizationByBuilding: Array<{
    buildingId: number;
    buildingName: string;
    utilization: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  utilizationByType: Array<{
    type: string;
    utilization: number;
    optimalUtilization: number;
    variance: number;
  }>;
  underutilizedAssets: Array<{
    assetId: number;
    assetName: string;
    utilization: number;
    recommendedAction: string;
  }>;
}

// 成本效益分析
export interface CostBenefitAnalysis {
  totalCost: number;
  totalBenefit: number;
  roi: number;
  paybackPeriod: number;
  costByCategory: Array<{
    category: string;
    cost: number;
    percentage: number;
  }>;
  benefitByCategory: Array<{
    category: string;
    benefit: number;
    percentage: number;
  }>;
  projections: Array<{
    year: string;
    cost: number;
    benefit: number;
    netBenefit: number;
    cumulativeROI: number;
  }>;
}

// 报表配置
export interface ReportConfig {
  id?: number;
  reportName: string;
  reportType: 'overview' | 'trend' | 'comparison' | 'custom';
  chartType: ChartType;
  dimension: StatisticsDimension;
  metric: StatisticsMetric;
  timeRange: TimeRange;
  filters: Record<string, any>;
  layout: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  refreshInterval?: number;
  isPublic: boolean;
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
}

// 仪表盘配置
export interface DashboardConfig {
  id?: number;
  dashboardName: string;
  description?: string;
  layout: 'grid' | 'flex';
  reports: ReportConfig[];
  refreshInterval: number;
  isDefault: boolean;
  isPublic: boolean;
  permissions: string[];
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
}

// 导出报表请求
export interface ExportReportRequest {
  reportType: 'overview' | 'detailed' | 'trend' | 'comparison';
  format: 'excel' | 'pdf' | 'csv';
  timeRange: TimeRange;
  startDate?: string;
  endDate?: string;
  filters?: Record<string, any>;
  includeCharts: boolean;
  fileName?: string;
}

// 导出报表响应
export interface ExportReportResponse {
  taskId: string;
  fileName: string;
  downloadUrl: string;
  expiresAt: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// 实时统计数据
export interface RealTimeStatistics {
  timestamp: string;
  onlineUsers: number;
  activeAssets: number;
  pendingTasks: number;
  systemLoad: number;
  alerts: Array<{
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

// 预警规则
export interface AlertRule {
  id: number;
  ruleName: string;
  ruleType: 'threshold' | 'trend' | 'pattern';
  metric: StatisticsMetric;
  condition: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isEnabled: boolean;
  notification: {
    email: boolean;
    sms: boolean;
    webhook: boolean;
    recipients: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// 预警记录
export interface AlertRecord {
  id: number;
  ruleId: number;
  ruleName: string;
  metric: StatisticsMetric;
  currentValue: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'acknowledged' | 'resolved';
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  acknowledgedBy?: number;
  resolvedBy?: number;
  notes?: string;
}

// 图表配置选项
export interface ChartOptions {
  title?: string;
  subtitle?: string;
  xAxis?: {
    title: string;
    type: 'category' | 'time' | 'value';
    format?: string;
  };
  yAxis?: {
    title: string;
    type: 'value' | 'log';
    min?: number;
    max?: number;
    format?: string;
  };
  legend?: {
    show: boolean;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  tooltip?: {
    show: boolean;
    format?: string;
  };
  colors?: string[];
  theme?: 'light' | 'dark';
}

// 统计查询接口
export interface StatisticsQuery {
  dimension?: StatisticsDimension;
  metric?: StatisticsMetric;
  timeRange?: TimeRange;
  startDate?: string;
  endDate?: string;
  groupBy?: string;
  filters?: Record<string, any>;
  orderBy?: string;
  limit?: number;
}

// 图表数据
export interface ChartData {
  name: string;
  value: number;
  type?: string;
  category?: string;
  color?: string;
  percentage?: number;
  extra?: Record<string, any>;
}

// 指标数据
export interface MetricData {
  id: string;
  name: string;
  value: number;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  target?: number;
  status?: 'good' | 'warning' | 'critical';
  trend?: TrendDataPoint[];
  lastUpdated?: string;
}

// 仪表板数据
export interface DashboardData {
  overview: StatisticsOverview;
  keyMetrics: MetricData[];
  charts: {
    assetDistribution: ChartData[];
    utilizationTrend: TrendData;
    departmentComparison: ComparisonData[];
    recentActivities: RecentActivity[];
  };
  alerts: AlertRecord[];
  lastUpdated: string;
}

// 统计摘要
export interface StatisticsSummary {
  totalAssets: number;
  totalValue: number;
  activeAssets: number;
  maintenanceAssets: number;
  utilizationRate: number;
  growthRate: number;
  topCategories: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  monthlyTrend: TrendData;
  yearOverYearGrowth: number;
}

// 时间序列数据
export interface TimeSeriesData {
  timestamp: string;
  value: number;
  metric: string;
  dimension?: string;
}

// 对比数据
export interface ComparisonData {
  name: string;
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

// 地理数据
export interface GeographicData {
  region: string;
  latitude: number;
  longitude: number;
  value: number;
  count: number;
  density?: number;
}

// 最近活动
export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
  assetId?: number;
  assetName?: string;
}

// 报表数据
export interface ReportData {
  reportId: string;
  reportName: string;
  reportType: string;
  data: any;
  generatedAt: string;
  generatedBy: string;
  parameters?: Record<string, any>;
}

// 导出配置
export interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts?: boolean;
  includeRawData?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

// 资产统计
export interface AssetStatistics extends StatisticsOverview {
  byCategory: ChartData[];
  byStatus: ChartData[];
  byDepartment: ChartData[];
  valueDistribution: ValueRangeDistribution[];
}

// 楼宇统计
export interface BuildingStatistics {
  totalBuildings: number;
  totalFloors: number;
  totalArea: number;
  averageUtilization: number;
  byType: ChartData[];
  byStatus: ChartData[];
}

// 楼层统计
export interface FloorStatistics {
  totalFloors: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  byFunction: ChartData[];
}

// 房间统计
export interface RoomStatistics {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  byType: ChartData[];
  byStatus: ChartData[];
  averageSize: number;
}

// 价值统计
export interface ValueStatistics {
  totalOriginalValue: number;
  totalCurrentValue: number;
  totalDepreciation: number;
  averageValue: number;
  distribution: ValueRangeDistribution[];
  trend: TrendData;
}

// 使用统计
export interface UsageStatistics {
  id: string;
  name: string;
  totalCapacity: number;
  usedCapacity: number;
  utilizationRate: number;
  peakUsage: number;
  averageUsage: number;
  trend: TrendDataPoint[];
}

// 实时数据
export interface RealTimeData {
  timestamp: string;
  metrics: MetricData[];
  alerts: AlertRecord[];
  activities: RecentActivity[];
  systemStatus: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
} 