import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Badge, Typography, Space, Tooltip } from 'antd';
import {
  BuildOutlined,
  HomeOutlined,
  TeamOutlined,
  RiseOutlined,
  DashboardOutlined,
  FireOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { Line, Column, Pie, Gauge } from '@ant-design/charts';

const { Title, Text } = Typography;

interface DashboardData {
  overview: {
    totalAssets: number;
    totalBuildings: number;
    totalArea: number;
    occupancyRate: number;
    maintenanceAlerts: number;
    securityEvents: number;
    energyEfficiency: number;
    systemHealth: number;
  };
  trends: Array<{
    date: string;
    occupancy: number;
    energy: number;
    maintenance: number;
  }>;
  assetDistribution: Array<{
    type: string;
    value: number;
    color: string;
  }>;
  recentEvents: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    time: string;
    location: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    overview: {
      totalAssets: 0,
      totalBuildings: 0,
      totalArea: 0,
      occupancyRate: 0,
      maintenanceAlerts: 0,
      securityEvents: 0,
      energyEfficiency: 0,
      systemHealth: 0,
    },
    trends: [],
    assetDistribution: [],
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);

  // 模拟实时数据更新
  useEffect(() => {
    const loadData = () => {
      // 模拟API数据
      const mockData: DashboardData = {
        overview: {
          totalAssets: 256 + Math.floor(Math.random() * 10),
          totalBuildings: 48 + Math.floor(Math.random() * 3),
          totalArea: 568920 + Math.floor(Math.random() * 1000),
          occupancyRate: 87.5 + Math.random() * 5,
          maintenanceAlerts: Math.floor(Math.random() * 12),
          securityEvents: Math.floor(Math.random() * 5),
          energyEfficiency: 85 + Math.random() * 10,
          systemHealth: 92 + Math.random() * 6,
        },
        trends: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          occupancy: 70 + Math.random() * 25,
          energy: 60 + Math.random() * 30,
          maintenance: 5 + Math.random() * 15,
        })),
        assetDistribution: [
          { type: '办公楼', value: 45, color: '#00d9ff' },
          { type: '商业楼', value: 30, color: '#0066ff' },
          { type: '住宅楼', value: 15, color: '#ff6b35' },
          { type: '工业楼', value: 10, color: '#00ff88' },
        ],
        recentEvents: [
          { id: '1', type: 'success', message: '大厦A空调系统维护完成', time: '2分钟前', location: '大厦A-15层' },
          { id: '2', type: 'warning', message: '停车场B区域照明需要检查', time: '15分钟前', location: '停车场B区' },
          { id: '3', type: 'info', message: '新租户入驻办理中', time: '32分钟前', location: '大厦C-8层' },
          { id: '4', type: 'error', message: '电梯系统异常报警', time: '1小时前', location: '大厦B-电梯2' },
          { id: '5', type: 'success', message: '消防系统检测通过', time: '2小时前', location: '全区域' },
        ]
      };
      
      setData(mockData);
      setLoading(false);
    };

    loadData();
    
    // 每30秒更新一次数据
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // 趋势图配置
  const trendConfig = {
    data: data.trends,
    xField: 'date',
    yField: 'occupancy',
    smooth: true,
    color: '#00d9ff',
    lineStyle: {
      lineWidth: 3,
    },
    point: {
      size: 4,
      style: {
        fill: '#00d9ff',
        stroke: '#ffffff',
        lineWidth: 2,
      },
    },
    areaStyle: {
      fill: 'linear-gradient(270deg, #00d9ff 0%, transparent 100%)',
      fillOpacity: 0.3,
    },
    theme: 'dark',
  };

  // 柱状图配置
  const columnConfig = {
    data: data.trends.slice(-7),
    xField: 'date',
    yField: 'energy',
    color: '#0066ff',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    theme: 'dark',
  };

  // 饼图配置
  const pieConfig = {
    data: data.assetDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.5,
    color: data.assetDistribution.map(item => item.color),
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
      style: {
        fill: '#ffffff',
        fontSize: 12,
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        style: {
          fill: '#ffffff',
        },
      },
    },
    theme: 'dark',
  };

  // 仪表盘配置
  const gaugeConfig = {
    percent: data.overview.systemHealth / 100,
    color: ['#ff4757', '#ffb800', '#00ff88'],
    innerRadius: 0.7,
    radius: 0.8,
    statistic: {
      title: {
        style: {
          color: '#ffffff',
          fontSize: '14px',
        },
        content: '系统健康度',
      },
      content: {
        style: {
          color: '#00d9ff',
          fontSize: '24px',
          fontWeight: 'bold',
        },
        content: `${Math.round(data.overview.systemHealth)}%`,
      },
    },
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined style={{ color: '#00ff88' }} />;
      case 'warning': return <AlertOutlined style={{ color: '#ffb800' }} />;
      case 'error': return <CloseCircleOutlined style={{ color: '#ff4757' }} />;
      default: return <ClockCircleOutlined style={{ color: '#00d9ff' }} />;
    }
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: number | string;
    suffix?: string;
    trend?: number;
    color: string;
    loading?: boolean;
  }> = ({ icon, title, value, suffix = '', trend, color, loading = false }) => (
    <Card className="tech-decoration" hoverable>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ 
            fontSize: '14px', 
            color: '#b8c5d1', 
            marginBottom: '8px',
            fontWeight: 500
          }}>
            {title}
          </div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${color}, #ffffff)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '4px'
          }}>
            {loading ? <SyncOutlined spin /> : `${value}${suffix}`}
          </div>
          {trend !== undefined && (
            <div style={{ 
              fontSize: '12px', 
              color: trend > 0 ? '#00ff88' : '#ff4757',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <RiseOutlined style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
              {Math.abs(trend).toFixed(1)}% 与昨日相比
            </div>
          )}
        </div>
        <div style={{ 
          fontSize: '32px', 
          color: color,
          opacity: 0.8,
          animation: 'pulse 2s infinite'
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: '0' }}>
      {/* 头部欢迎区域 */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1e2442 0%, #252b45 100%)' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
              <DashboardOutlined style={{ marginRight: '12px', color: '#00d9ff' }} />
              智慧楼宇管控中心
            </Title>
            <Text style={{ color: '#b8c5d1', fontSize: '16px' }}>
              实时监控 · 智能分析 · 高效管理
            </Text>
          </Col>
          <Col>
            <Space size="large">
              <Badge status="processing" text={<span style={{ color: '#00ff88' }}>系统正常运行</span>} />
              <Text style={{ color: '#b8c5d1' }}>
                最后更新: {new Date().toLocaleTimeString()}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<BuildOutlined />}
            title="资产总数"
            value={data.overview.totalAssets}
            color="#00d9ff"
            trend={2.5}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<HomeOutlined />}
            title="楼宇总数"
            value={data.overview.totalBuildings}
            color="#0066ff"
            trend={1.2}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<TeamOutlined />}
            title="总面积"
            value={data.overview.totalArea.toLocaleString()}
            suffix=" m²"
            color="#ff6b35"
            trend={0.8}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<RiseOutlined />}
            title="出租率"
            value={data.overview.occupancyRate.toFixed(1)}
            suffix="%"
            color="#00ff88"
            trend={-0.3}
            loading={loading}
          />
        </Col>
      </Row>

      {/* 次要指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="维护预警"
              value={data.overview.maintenanceAlerts}
              prefix={<FireOutlined style={{ color: '#ffb800' }} />}
              valueStyle={{ color: '#ffb800' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="安全事件"
              value={data.overview.securityEvents}
              prefix={<SafetyOutlined style={{ color: '#ff4757' }} />}
              valueStyle={{ color: data.overview.securityEvents > 0 ? '#ff4757' : '#00ff88' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="能效指数"
              value={data.overview.energyEfficiency.toFixed(1)}
              suffix="%"
              prefix={<ThunderboltOutlined style={{ color: '#00ff88' }} />}
              valueStyle={{ color: '#00ff88' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="chart-container" style={{ padding: '0', border: 'none', margin: 0 }}>
              <Gauge {...gaugeConfig} height={120} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={
            <span>
              <RiseOutlined style={{ marginRight: '8px', color: '#00d9ff' }} />
              入住率趋势分析
            </span>
          }>
            <div className="chart-container">
              <Line {...trendConfig} height={300} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={
            <span>
              <EnvironmentOutlined style={{ marginRight: '8px', color: '#00d9ff' }} />
              资产类型分布
            </span>
          }>
            <div className="chart-container">
              <Pie {...pieConfig} height={300} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={
            <span>
              <ThunderboltOutlined style={{ marginRight: '8px', color: '#00d9ff' }} />
              能耗分析（近7天）
            </span>
          }>
            <div className="chart-container">
              <Column {...columnConfig} height={250} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card 
            title={
              <span>
                <EyeOutlined style={{ marginRight: '8px', color: '#00d9ff' }} />
                实时事件监控
              </span>
            }
            extra={
              <Badge count={data.recentEvents.length} style={{ backgroundColor: '#00d9ff' }} />
            }
          >
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {data.recentEvents.map(event => (
                <div key={event.id} style={{ 
                  padding: '12px 0', 
                  borderBottom: '1px solid #2d3748',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{ marginTop: '2px' }}>
                    {getEventIcon(event.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#ffffff', marginBottom: '4px', fontSize: '14px' }}>
                      {event.message}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', gap: '12px' }}>
                      <span>{event.time}</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;