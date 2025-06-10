import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography, 
  Space, 
  Badge, 
  Avatar, 
  Divider, 
  Progress, 
  Tag,
  Tooltip,
  Segmented,
  FloatButton,
  notification
} from 'antd';
import {
  BuildOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
  RiseOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  FireOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  SecurityScanOutlined,
  BulbOutlined,
  CustomerServiceOutlined,
  ReloadOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Line, Column, Pie, Gauge, Area } from '@ant-design/charts';

const { Title, Text, Paragraph } = Typography;

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
  const [timeRange, setTimeRange] = useState<string>('30天');
  const [refreshing, setRefreshing] = useState(false);

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
          { type: '办公楼', value: 45, color: '#1677ff' },
          { type: '商业楼', value: 30, color: '#52c41a' },
          { type: '住宅楼', value: 15, color: '#faad14' },
          { type: '工业楼', value: 10, color: '#f5222d' },
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

  // 手动刷新数据
  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟刷新延迟
    setTimeout(() => {
      setRefreshing(false);
      notification.success({
        message: '数据更新成功',
        description: '所有监控数据已同步至最新状态',
        placement: 'topRight',
      });
    }, 1000);
  };

  // 趋势图配置 - Ant Design 5 风格
  const trendConfig = {
    data: data.trends,
    xField: 'date',
    yField: 'occupancy',
    smooth: true,
    color: '#1677ff',
    lineStyle: {
      lineWidth: 3,
    },
    point: {
      size: 5,
      style: {
        fill: '#1677ff',
        stroke: '#ffffff',
        lineWidth: 2,
      },
    },
    areaStyle: {
      fill: 'linear-gradient(270deg, #1677ff 0%, rgba(22, 119, 255, 0.1) 100%)',
      fillOpacity: 0.6,
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 2000,
      },
    },
  };

  // 柱状图配置
  const columnConfig = {
    data: data.trends.slice(-7).map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    })),
    xField: 'date',
    yField: 'energy',
    color: '#52c41a',
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 1500,
      },
    },
  };

  // 饼图配置
  const pieConfig = {
    data: data.assetDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.85,
    innerRadius: 0.6,
    color: data.assetDistribution.map(item => item.color),
    legend: {
      position: 'bottom' as const,
      itemName: {
        style: {
          fill: '#ffffff',
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        fill: '#ffffff',
        fontSize: 14,
        textAlign: 'center',
      },
    },
    statistic: {
      title: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: '#ffffff',
        },
        content: '资产分布',
      },
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: '#1677ff',
        },
        content: '总计',
      },
    },
  };

  const getEventIcon = (type: string) => {
    const iconProps = { style: { fontSize: '16px' } };
    switch (type) {
      case 'success': return <CheckCircleOutlined {...iconProps} style={{ color: '#52c41a' }} />;
      case 'warning': return <WarningOutlined {...iconProps} style={{ color: '#faad14' }} />;
      case 'error': return <CloseCircleOutlined {...iconProps} style={{ color: '#f5222d' }} />;
      default: return <ClockCircleOutlined {...iconProps} style={{ color: '#1677ff' }} />;
    }
  };

  const getEventTagColor = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';  
      case 'error': return 'error';
      default: return 'processing';
    }
  };

  // 高级统计卡片组件
  const AdvancedStatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: number | string;
    suffix?: string;
    trend?: number;
    color: string;
    loading?: boolean;
    description?: string;
    progress?: number;
  }> = ({ icon, title, value, suffix = '', trend, color, loading = false, description, progress }) => (
    <Card 
      hoverable
      style={{
        background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.05) 0%, rgba(22, 119, 255, 0.02) 100%)',
        border: '1px solid rgba(22, 119, 255, 0.1)',
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Avatar 
              size={48} 
              style={{ 
                background: `linear-gradient(135deg, ${color}15, ${color}25)`,
                color: color,
                border: `2px solid ${color}30`
              }}
              icon={icon}
            />
            <div style={{ marginLeft: '12px' }}>
              <Text style={{ 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontWeight: 500,
                display: 'block'
              }}>
                {title}
              </Text>
              {description && (
                <Text style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'block'
                }}>
                  {description}
                </Text>
              )}
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <Statistic
              value={loading ? 0 : value}
              suffix={suffix}
              valueStyle={{
                fontSize: '32px',
                fontWeight: 700,
                background: `linear-gradient(135deg, ${color}, ${color}80)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              loading={loading}
            />
          </div>

          {progress !== undefined && (
            <Progress 
              percent={progress} 
              strokeColor={color}
              trailColor="rgba(255, 255, 255, 0.1)"
              size="small"
              showInfo={false}
              style={{ marginBottom: '8px' }}
            />
          )}

          {trend !== undefined && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Tag 
                color={trend > 0 ? 'success' : 'error'} 
                style={{ margin: 0, border: 'none' }}
              >
                <RiseOutlined style={{ 
                  transform: trend < 0 ? 'rotate(180deg)' : 'none',
                  marginRight: '4px'
                }} />
                {Math.abs(trend).toFixed(1)}%
              </Tag>
              <Text style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                与昨日相比
              </Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  // 迷你趋势图
  const miniTrendData = data.trends.slice(-7).map(item => item.occupancy);
  
  return (
    <div style={{ padding: '0', position: 'relative' }}>
      {/* 浮动按钮 */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton 
          icon={<ReloadOutlined />} 
          tooltip="刷新数据"
          onClick={handleRefresh}
        />
        <FloatButton 
          icon={<QuestionCircleOutlined />} 
          tooltip="帮助文档"
        />
      </FloatButton.Group>

      {/* 头部欢迎区域 - 全新设计 */}
      <Card 
        style={{ 
          marginBottom: '24px', 
          background: 'linear-gradient(135deg, #1e2442 0%, #252b45 100%)',
          border: '1px solid rgba(22, 119, 255, 0.2)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row align="middle" justify="space-between">
          <Col flex="auto">
            <Space direction="vertical" size="small">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Avatar 
                  size={64} 
                  style={{ 
                    background: 'linear-gradient(135deg, #1677ff, #52c41a)',
                    boxShadow: '0 8px 24px rgba(22, 119, 255, 0.3)'
                  }}
                  icon={<DashboardOutlined />}
                />
                <div>
                  <Title level={2} style={{ color: '#ffffff', margin: 0, fontSize: '28px' }}>
                    智慧楼宇管控中心
                  </Title>
                  <Paragraph style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '16px' }}>
                    🚀 实时监控 · 🧠 智能分析 · ⚡ 高效管理
                  </Paragraph>
                </div>
              </div>
            </Space>
          </Col>
          <Col>
            <Space size="large" direction="vertical" align="end">
              <Space size="middle">
                <Badge 
                  status="processing" 
                  text={
                    <span style={{ color: '#52c41a', fontWeight: 500 }}>
                      <HeartOutlined style={{ marginRight: '4px' }} />
                      系统正常运行
                    </span>
                  } 
                />
              </Space>
              <div style={{ textAlign: 'right' }}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                  最后更新: {new Date().toLocaleTimeString()}
                </Text>
                <br />
                <Segmented
                  size="small"
                  value={timeRange}
                  onChange={setTimeRange}
                  options={['7天', '30天', '90天']}
                  style={{ marginTop: '8px' }}
                />
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 主要统计卡片 - 全新设计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <AdvancedStatCard
            icon={<BuildOutlined />}
            title="资产总数"
            value={data.overview.totalAssets}
            color="#1677ff"
            trend={2.5}
            loading={loading}
            description="全平台管理资产"
            progress={85}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdvancedStatCard
            icon={<HomeOutlined />}
            title="楼宇总数"
            value={data.overview.totalBuildings}
            color="#52c41a"
            trend={1.2}
            loading={loading}
            description="智能化楼宇建筑"
            progress={92}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdvancedStatCard
            icon={<UsergroupAddOutlined />}
            title="总面积"
            value={data.overview.totalArea.toLocaleString()}
            suffix=" m²"
            color="#faad14"
            trend={0.8}
            loading={loading}
            description="可租赁建筑面积"
            progress={78}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdvancedStatCard
            icon={<RiseOutlined />}
            title="出租率"
            value={data.overview.occupancyRate.toFixed(1)}
            suffix="%"
            color="#52c41a"
            trend={-0.3}
            loading={loading}
            description="当前空间利用率"
            progress={data.overview.occupancyRate}
          />
        </Col>
      </Row>

      {/* 系统状态监控卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, rgba(245, 34, 45, 0.1) 0%, rgba(245, 34, 45, 0.05) 100%)',
              border: '1px solid rgba(245, 34, 45, 0.2)',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title={
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <FireOutlined style={{ marginRight: '8px', color: '#f5222d' }} />
                  维护预警
                </span>
              }
              value={data.overview.maintenanceAlerts}
              valueStyle={{ color: '#f5222d', fontSize: '28px', fontWeight: 'bold' }}
                              suffix={
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#f5222d',
                    fontFamily: 'monospace'
                  }}>
                    趋势: ↗ ↑ ↘ ↗ ↘ ↗ ↘
                  </div>
                }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, rgba(250, 173, 20, 0.1) 0%, rgba(250, 173, 20, 0.05) 100%)',
              border: '1px solid rgba(250, 173, 20, 0.2)',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title={
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <SecurityScanOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                  安全事件
                </span>
              }
              value={data.overview.securityEvents}
              valueStyle={{ 
                color: data.overview.securityEvents > 0 ? '#faad14' : '#52c41a',
                fontSize: '28px', 
                fontWeight: 'bold' 
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(82, 196, 26, 0.05) 100%)',
              border: '1px solid rgba(82, 196, 26, 0.2)',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title={
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <ThunderboltOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                  能效指数
                </span>
              }
              value={data.overview.energyEfficiency.toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
            />
            <Progress 
              percent={data.overview.energyEfficiency} 
              strokeColor="#52c41a" 
              trailColor="rgba(255, 255, 255, 0.1)"
              size="small"
              style={{ marginTop: '8px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.1) 0%, rgba(22, 119, 255, 0.05) 100%)',
              border: '1px solid rgba(22, 119, 255, 0.2)',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title={
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <BulbOutlined style={{ marginRight: '8px', color: '#1677ff' }} />
                  系统健康度
                </span>
              }
              value={data.overview.systemHealth.toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#1677ff', fontSize: '28px', fontWeight: 'bold' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Gauge 
                {...{
                  percent: data.overview.systemHealth / 100,
                  color: ['#f5222d', '#faad14', '#52c41a'],
                  innerRadius: 0.7,
                  radius: 0.8,
                  height: 40,
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 - 全新布局 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <RiseOutlined style={{ color: '#1677ff' }} />
                <span>入住率趋势分析</span>
                <Tag color="blue">{timeRange}</Tag>
              </Space>
            }
            extra={
              <Tooltip title="数据每小时更新">
                <SyncOutlined style={{ color: '#1677ff' }} />
              </Tooltip>
            }
            style={{ borderRadius: '12px' }}
          >
            <div className="chart-container">
              <Area {...trendConfig} height={300} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined style={{ color: '#52c41a' }} />
                <span>资产类型分布</span>
              </Space>
            }
            style={{ borderRadius: '12px' }}
          >
            <div className="chart-container">
              <Pie {...pieConfig} height={300} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card 
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#faad14' }} />
                <span>能耗分析（近7天）</span>
              </Space>
            }
            extra={
              <Tag color="orange">实时数据</Tag>
            }
            style={{ borderRadius: '12px' }}
          >
            <div className="chart-container">
              <Column {...columnConfig} height={280} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card 
            title={
              <Space>
                <EyeOutlined style={{ color: '#1677ff' }} />
                <span>实时事件监控</span>
              </Space>
            }
            extra={
              <Badge 
                count={data.recentEvents.length} 
                style={{ backgroundColor: '#1677ff' }}
                overflowCount={99}
              />
            }
            style={{ borderRadius: '12px' }}
          >
            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {data.recentEvents.map((event, index) => (
                <div key={event.id}>
                  <div style={{ 
                    padding: '16px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <Avatar 
                      size={32} 
                      icon={getEventIcon(event.type)}
                      style={{ 
                        backgroundColor: 'transparent',
                        border: `2px solid ${
                          event.type === 'success' ? '#52c41a' :
                          event.type === 'warning' ? '#faad14' :
                          event.type === 'error' ? '#f5222d' : '#1677ff'
                        }`,
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        color: '#ffffff', 
                        marginBottom: '8px', 
                        fontSize: '14px',
                        fontWeight: 500
                      }}>
                        {event.message}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                                                 <Tag 
                           color={getEventTagColor(event.type)} 
                           style={{ margin: 0, fontSize: '12px' }}
                         >
                          {event.time}
                        </Tag>
                        <Text style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          📍 {event.location}
                        </Text>
                      </div>
                    </div>
                  </div>
                  {index < data.recentEvents.length - 1 && (
                    <Divider style={{ margin: 0, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  )}
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