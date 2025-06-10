import { get, post } from '../utils/request';
import type {
  AssetStatistics,
  BuildingStatistics,
  FloorStatistics,
  RoomStatistics,
  ValueStatistics,
  UsageStatistics,
  TimeSeriesData,
  ComparisonData,
  TrendData,
  GeographicData,
  RealTimeData,
  ReportConfig,
  ReportData,
  ExportConfig,
  StatisticsQuery,
  ChartData,
  MetricData,
  DashboardData,
  StatisticsSummary
} from '../types/statistics';
import type { PaginationResponse } from '../types/common';

/**
 * 资产统计服务
 */
export class AssetStatisticsService {
  /**
   * 获取资产总览统计
   */
  async getAssetOverview(): Promise<AssetStatistics> {
    return get<AssetStatistics>('/statistics/assets/overview');
  }

  /**
   * 获取资产分类统计
   */
  async getAssetByCategory(): Promise<ChartData[]> {
    return get<ChartData[]>('/statistics/assets/category');
  }

  /**
   * 获取资产状态统计
   */
  async getAssetByStatus(): Promise<ChartData[]> {
    return get<ChartData[]>('/statistics/assets/status');
  }

  /**
   * 获取资产价值统计
   */
  async getAssetValue(): Promise<ValueStatistics> {
    return get<ValueStatistics>('/statistics/assets/value');
  }

  /**
   * 获取资产趋势数据
   */
  async getAssetTrend(timeRange: string): Promise<TrendData[]> {
    return get<TrendData[]>('/statistics/assets/trend', { timeRange });
  }

  /**
   * 获取资产地理分布
   */
  async getAssetGeographic(): Promise<GeographicData[]> {
    return get<GeographicData[]>('/statistics/assets/geographic');
  }

  /**
   * 获取资产对比数据
   */
  async getAssetComparison(type: string): Promise<ComparisonData[]> {
    return get<ComparisonData[]>('/statistics/assets/comparison', { type });
  }
}

/**
 * 楼宇统计服务
 */
export class BuildingStatisticsService {
  /**
   * 获取楼宇总览统计
   */
  async getBuildingOverview(): Promise<BuildingStatistics> {
    return get<BuildingStatistics>('/statistics/buildings/overview');
  }

  /**
   * 获取楼宇使用率统计
   */
  async getBuildingUsage(): Promise<UsageStatistics[]> {
    return get<UsageStatistics[]>('/statistics/buildings/usage');
  }

  /**
   * 获取楼宇面积分布
   */
  async getBuildingArea(): Promise<ChartData[]> {
    return get<ChartData[]>('/statistics/buildings/area');
  }

  /**
   * 获取楼宇类型分布
   */
  async getBuildingType(): Promise<ChartData[]> {
    return get<ChartData[]>('/statistics/buildings/type');
  }

  /**
   * 获取楼宇效率指标
   */
  async getBuildingEfficiency(): Promise<MetricData[]> {
    return get<MetricData[]>('/statistics/buildings/efficiency');
  }
}

/**
 * 楼层统计服务
 */
export class FloorStatisticsService {
  /**
   * 获取楼层总览统计
   */
  async getFloorOverview(): Promise<FloorStatistics> {
    return get<FloorStatistics>('/statistics/floors/overview');
  }

  /**
   * 获取楼层利用率
   */
  async getFloorUtilization(): Promise<ChartData[]> {
    return get<ChartData[]>('/statistics/floors/utilization');
  }

  /**
   * 获取楼层功能分布
   */
  async getFloorFunction(): Promise<ChartData[]> {
    return get<ChartData[]>('/statistics/floors/function');
  }

  /**
   * 获取楼层密度分析
   */
  async getFloorDensity(): Promise<MetricData[]> {
    return get<MetricData[]>('/statistics/floors/density');
  }
}

/**
 * 房间统计服务
 */
export class RoomStatisticsService {
  /**
   * 获取房间总览统计
   */
  async getRoomOverview(): Promise<RoomStatistics> {
    return get<RoomStatistics>('/statistics/rooms/overview');
  }

  /**
   * 获取房间类型分布
   */
  async getRoomType(): Promise<ChartData[]> {
    return get<ChartData[]>('/statistics/rooms/type');
  }

  /**
   * 获取房间状态分布
   */
  async getRoomStatus(): Promise<ChartData[]> {
    return get<ChartData[]>('/statistics/rooms/status');
  }

  /**
   * 获取房间使用率
   */
  async getRoomUsage(): Promise<UsageStatistics[]> {
    return get<UsageStatistics[]>('/statistics/rooms/usage');
  }

  /**
   * 获取房间容量分析
   */
  async getRoomCapacity(): Promise<MetricData[]> {
    return get<MetricData[]>('/statistics/rooms/capacity');
  }
}

/**
 * 实时统计服务
 */
export class RealTimeStatisticsService {
  /**
   * 获取实时数据
   */
  async getRealTimeData(): Promise<RealTimeData> {
    return get<RealTimeData>('/statistics/realtime');
  }

  /**
   * 获取实时指标
   */
  async getRealTimeMetrics(): Promise<MetricData[]> {
    return get<MetricData[]>('/statistics/realtime/metrics');
  }

  /**
   * 获取实时告警
   */
  async getRealTimeAlerts(): Promise<any[]> {
    return get<any[]>('/statistics/realtime/alerts');
  }

  /**
   * 获取系统健康状态
   */
  async getSystemHealth(): Promise<any> {
    return get<any>('/statistics/realtime/health');
  }
}

/**
 * 报表服务
 */
export class ReportService {
  /**
   * 获取报表配置
   */
  async getReportConfigs(): Promise<ReportConfig[]> {
    return get<ReportConfig[]>('/statistics/reports/configs');
  }

  /**
   * 生成报表
   */
  async generateReport(config: ReportConfig): Promise<ReportData> {
    return post<ReportData>('/statistics/reports/generate', config);
  }

  /**
   * 获取报表数据
   */
  async getReportData(reportId: string): Promise<ReportData> {
    return get<ReportData>(`/statistics/reports/${reportId}`);
  }

  /**
   * 导出报表
   */
  async exportReport(reportId: string, config: ExportConfig): Promise<Blob> {
    const response = await fetch(`/api/v1/statistics/reports/${reportId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(config),
    });
    return response.blob();
  }

  /**
   * 删除报表
   */
  async deleteReport(reportId: string): Promise<void> {
    return get<void>(`/statistics/reports/${reportId}/delete`);
  }

  /**
   * 获取报表历史
   */
  async getReportHistory(reportId: string): Promise<any[]> {
    return get<any[]>(`/statistics/reports/${reportId}/history`);
  }
}

/**
 * 仪表板服务
 */
export class DashboardService {
  /**
   * 获取仪表板数据
   */
  async getDashboardData(): Promise<DashboardData> {
    return get<DashboardData>('/statistics/dashboard');
  }

  /**
   * 获取统计摘要
   */
  async getStatisticsSummary(): Promise<StatisticsSummary> {
    return get<StatisticsSummary>('/statistics/summary');
  }

  /**
   * 获取关键指标
   */
  async getKeyMetrics(): Promise<MetricData[]> {
    return get<MetricData[]>('/statistics/metrics/key');
  }

  /**
   * 获取时间序列数据
   */
  async getTimeSeriesData(query: StatisticsQuery): Promise<TimeSeriesData[]> {
    return get<TimeSeriesData[]>('/statistics/timeseries', query);
  }

  /**
   * 获取排行榜数据
   */
  async getRankingData(type: string, limit?: number): Promise<any[]> {
    return get<any[]>('/statistics/ranking', { type, limit });
  }

  /**
   * 获取预测数据
   */
  async getForecastData(metric: string, period: number): Promise<TrendData[]> {
    return get<TrendData[]>('/statistics/forecast', { metric, period });
  }

  /**
   * 获取异常检测结果
   */
  async getAnomalyDetection(): Promise<any[]> {
    return get<any[]>('/statistics/anomaly');
  }
}

/**
 * 自定义统计服务
 */
export class CustomStatisticsService {
  /**
   * 创建自定义查询
   */
  async createCustomQuery(query: StatisticsQuery): Promise<any> {
    return post<any>('/statistics/custom/query', query);
  }

  /**
   * 执行自定义查询
   */
  async executeCustomQuery(queryId: string): Promise<any> {
    return get<any>(`/statistics/custom/query/${queryId}/execute`);
  }

  /**
   * 保存自定义图表
   */
  async saveCustomChart(chartConfig: any): Promise<any> {
    return post<any>('/statistics/custom/chart', chartConfig);
  }

  /**
   * 获取自定义图表
   */
  async getCustomCharts(): Promise<any[]> {
    return get<any[]>('/statistics/custom/charts');
  }

  /**
   * 删除自定义图表
   */
  async deleteCustomChart(chartId: string): Promise<void> {
    return get<void>(`/statistics/custom/chart/${chartId}/delete`);
  }
}

// 导出服务实例
export const assetStatisticsService = new AssetStatisticsService();
export const buildingStatisticsService = new BuildingStatisticsService();
export const floorStatisticsService = new FloorStatisticsService();
export const roomStatisticsService = new RoomStatisticsService();
export const realTimeStatisticsService = new RealTimeStatisticsService();
export const reportService = new ReportService();
export const dashboardService = new DashboardService();
export const customStatisticsService = new CustomStatisticsService(); 