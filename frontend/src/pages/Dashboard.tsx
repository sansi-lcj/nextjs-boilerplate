import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography, 
  Space, 
  Badge, 
  Tag,
  Progress,
  Alert
} from 'antd';
import {
  BuildOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  FireOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SecurityScanOutlined,
  ThunderboltOutlined,
  BulbOutlined
} from '@ant-design/icons';

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
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const mockData: DashboardData = {
        overview: {
          totalAssets: 260,
          totalBuildings: 49,
          totalArea: 569570,
          occupancyRate: 89.3,
          maintenanceAlerts: 3,
          securityEvents: 0,
          energyEfficiency: 92.7,
          systemHealth: 93.1,
        },
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
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined />;
      case 'warning': return <WarningOutlined />;
      case 'error': return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getEventType = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';  
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <Space direction="vertical" size="large">
      {/* 欢迎区域 */}
      <Card>
        <Space direction="vertical">
          <Title level={2}>智慧楼宇管控中心</Title>
          <Text type="secondary">🚀 实时监控 · 🧠 智能分析 · ⚡ 高效管理</Text>
          <Badge status="processing" text="系统正常运行" />
        </Space>
      </Card>

      {/* 主要统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="资产总数"
              value={data.overview.totalAssets}
              prefix={<BuildOutlined />}
              loading={loading}
            />
            <Progress percent={85} size="small" showInfo={false} />
            <Text type="secondary">
              <RiseOutlined /> 2.5% 与昨日相比
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="楼宇总数"
              value={data.overview.totalBuildings}
              prefix={<HomeOutlined />}
              loading={loading}
            />
            <Progress percent={92} size="small" showInfo={false} />
            <Text type="secondary">
              <RiseOutlined /> 1.2% 与昨日相比
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总面积"
              value={data.overview.totalArea}
              suffix="m²"
              prefix={<UsergroupAddOutlined />}
              loading={loading}
            />
            <Progress percent={78} size="small" showInfo={false} />
            <Text type="secondary">
              <RiseOutlined /> 0.8% 与昨日相比
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="出租率"
              value={data.overview.occupancyRate}
              suffix="%"
              precision={1}
              prefix={<RiseOutlined />}
              loading={loading}
            />
            <Progress percent={89} size="small" showInfo={false} />
            <Text type="secondary">
              <RiseOutlined /> 0.3% 与昨日相比
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 监控指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="维护预警"
              value={data.overview.maintenanceAlerts}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="安全事件"
              value={data.overview.securityEvents}
              prefix={<SecurityScanOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="能效指数"
              value={data.overview.energyEfficiency}
              suffix="%"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress percent={data.overview.energyEfficiency} size="small" showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="系统健康度"
              value={data.overview.systemHealth}
              suffix="%"
              prefix={<BulbOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
            <Progress percent={data.overview.systemHealth} size="small" showInfo={false} />
          </Card>
        </Col>
      </Row>

      {/* 分析图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <RiseOutlined />
                入住率趋势分析
                <Tag>30天</Tag>
              </Space>
            }
          >
            <div>
              <Text type="secondary">图表组件加载中...</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined />
                资产类型分布
              </Space>
            }
          >
            <div>
              <Text type="secondary">图表组件加载中...</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 下方区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ThunderboltOutlined />
                能耗分析（近7天）
              </Space>
            }
          >
            <Text type="secondary">实时数据</Text>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <EyeOutlined />
                实时事件监控
                <Badge count={5} />
              </Space>
            }
          >
            <Space direction="vertical" size="small">
              {data.recentEvents.map((event) => (
                <Alert
                  key={event.id}
                  message={event.message}
                  description={
                    <Space>
                      <Text type="secondary">{event.time}</Text>
                      <Text type="secondary">📍 {event.location}</Text>
                    </Space>
                  }
                  type={getEventType(event.type)}
                  icon={getEventIcon(event.type)}
                  showIcon
                />
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Dashboard;