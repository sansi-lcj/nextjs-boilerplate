import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Spin } from 'antd';
import { BankOutlined, BuildOutlined, HomeOutlined, AreaChartOutlined } from '@ant-design/icons';
import { Pie, Line } from '@ant-design/charts';
// import { assetService } from '../services/asset';
// import { AssetStatistics } from '../types/asset';
// Icons removed as not used in current implementation

// 临时接口，用于兼容当前页面显示
interface StatisticsDisplayData {
  totalAssets: number;
  totalBuildings: number;
  totalFloors: number;
  totalRooms: number;
  totalArea: number;
  occupancyRate: number;
  assetTypeData: Array<{ type: string; value: number }>;
  roomTypeData: Array<{ type: string; value: number }>;
  assetStatusData: Array<{ type: string; status: string; count: number }>;
}

const Statistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<StatisticsDisplayData | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // 使用模拟数据来展示完整功能
      const mockData: StatisticsDisplayData = {
        totalAssets: 156,
        totalBuildings: 248,
        totalFloors: 1250,
        totalRooms: 3680,
        totalArea: 568920,
        occupancyRate: 87.5,
        assetTypeData: [
          { type: '办公楼', value: 45 },
          { type: '商业楼', value: 30 },
          { type: '住宅楼', value: 15 },
          { type: '工业楼', value: 10 },
        ],
        roomTypeData: [
          { type: '办公室', value: 1250 },
          { type: '会议室', value: 380 },
          { type: '仓储', value: 560 },
          { type: '其他', value: 1490 },
        ],
        assetStatusData: [
          { type: '办公楼', status: '正常', count: 40 },
          { type: '办公楼', status: '维护中', count: 5 },
          { type: '商业楼', status: '正常', count: 25 },
          { type: '商业楼', status: '维护中', count: 5 },
          { type: '住宅楼', status: '正常', count: 12 },
          { type: '住宅楼', status: '停用', count: 3 },
          { type: '工业楼', status: '正常', count: 8 },
          { type: '工业楼', status: '维护中', count: 2 },
        ],
      };
      
      setStatistics(mockData);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!statistics) {
    return <div>暂无数据</div>;
  }

  // 饼图配置 - 优化配置避免错误
  const pieConfig = {
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.4,
    legend: {
      position: 'bottom' as const,
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fill: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    color: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };

  // 模拟月度趋势数据
  const monthlyData = [
    { month: '1月', type: '新增资产', value: 3 },
    { month: '1月', type: '新增建筑', value: 5 },
    { month: '2月', type: '新增资产', value: 4 },
    { month: '2月', type: '新增建筑', value: 6 },
    { month: '3月', type: '新增资产', value: 3.5 },
    { month: '3月', type: '新增建筑', value: 7 },
    { month: '4月', type: '新增资产', value: 5 },
    { month: '4月', type: '新增建筑', value: 8 },
    { month: '5月', type: '新增资产', value: 4.9 },
    { month: '5月', type: '新增建筑', value: 9 },
    { month: '6月', type: '新增资产', value: 6 },
    { month: '6月', type: '新增建筑', value: 10 },
  ];

  const lineConfig = {
    data: monthlyData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    legend: {
      position: 'top' as const,
    },
    smooth: true,
    color: ['#1890ff', '#52c41a'],
    point: {
      size: 4,
      shape: 'circle',
    },
    tooltip: {
      shared: true,
      showCrosshairs: true,
    },
    xAxis: {
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
          },
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
          },
        },
      },
    },
  };

  return (
    <div style={{ padding: '0' }}>
      {/* 自定义样式 */}
      <style>{`
        .tech-decoration {
          background: linear-gradient(135deg, #1e2442 0%, #252b45 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .tech-decoration:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 217, 255, 0.2);
          border-color: rgba(0, 217, 255, 0.3);
        }
        
        .tech-decoration .ant-card-head {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tech-decoration .ant-card-body {
          background: transparent;
        }
        
        .tech-decoration .ant-statistic-title {
          color: #b8c5d1;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .tech-decoration .ant-statistic-content {
          color: #ffffff;
        }
        
        .chart-container {
          margin: 16px 0;
          padding: 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
        }
        
        @media (max-width: 768px) {
          .tech-decoration {
            margin-bottom: 16px;
          }
          
          .chart-container {
            margin: 8px 0;
          }
        }
      `}</style>

      {/* 头部标题 */}
      <div style={{ 
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #1e2442 0%, #252b45 100%)',
        padding: '20px 24px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ 
          color: '#ffffff', 
          margin: 0,
          fontSize: '24px',
          background: 'linear-gradient(135deg, #00d9ff, #0066ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          📊 数据分析中心
        </h2>
        <p style={{ color: '#b8c5d1', margin: '8px 0 0 0', fontSize: '14px' }}>
          全方位资产数据统计与可视化分析
        </p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* 统计卡片 */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="tech-decoration" hoverable>
            <Statistic
              title="资产总数"
              value={statistics.totalAssets}
              prefix={<BankOutlined style={{ color: '#00d9ff' }} />}
              valueStyle={{ 
                background: 'linear-gradient(135deg, #00d9ff, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '28px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="tech-decoration" hoverable>
            <Statistic
              title="建筑总数"
              value={statistics.totalBuildings}
              prefix={<BuildOutlined style={{ color: '#0066ff' }} />}
              valueStyle={{ 
                background: 'linear-gradient(135deg, #0066ff, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '28px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="tech-decoration" hoverable>
            <Statistic
              title="楼层总数"
              value={statistics.totalFloors}
              prefix={<HomeOutlined style={{ color: '#ff6b35' }} />}
              valueStyle={{ 
                background: 'linear-gradient(135deg, #ff6b35, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '28px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="tech-decoration" hoverable>
            <Statistic
              title="房间总数"
              value={statistics.totalRooms}
              prefix={<AreaChartOutlined style={{ color: '#00ff88' }} />}
              valueStyle={{ 
                background: 'linear-gradient(135deg, #00ff88, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '28px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* 面积统计 */}
        <Col xs={24} lg={12}>
          <Card title={
            <span style={{ color: '#ffffff' }}>
              📏 面积统计
            </span>
          } className="tech-decoration">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="总建筑面积"
                  value={statistics.totalArea}
                  suffix="m²"
                  precision={0}
                  valueStyle={{ color: '#00d9ff', fontSize: '20px' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="可用面积"
                  value={statistics.totalArea * 0.85}
                  suffix="m²"
                  precision={0}
                  valueStyle={{ color: '#00ff88', fontSize: '20px' }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 20 }}>
              <div style={{ color: '#b8c5d1', marginBottom: '8px' }}>空间利用率</div>
              <Progress
                percent={statistics.occupancyRate}
                status="active"
                strokeColor={{
                  '0%': '#00d9ff',
                  '100%': '#00ff88',
                }}
                format={(percent) => `${percent}%`}
              />
            </div>
          </Card>
        </Col>

        {/* 资产类型分布 */}
        <Col xs={24} lg={12}>
          <Card title={
            <span style={{ color: '#ffffff' }}>
              🏢 资产类型分布
            </span>
          } className="tech-decoration">
            <div className="chart-container">
              <Pie {...pieConfig} data={statistics.assetTypeData} height={200} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* 房间类型分布 */}
        <Col xs={24} lg={12}>
          <Card title={
            <span style={{ color: '#ffffff' }}>
              🚪 房间类型分布
            </span>
          } className="tech-decoration">
            <div className="chart-container">
              <Pie {...pieConfig} data={statistics.roomTypeData} height={200} />
            </div>
          </Card>
        </Col>

        {/* 月度趋势 */}
        <Col xs={24} lg={12}>
          <Card title={
            <span style={{ color: '#ffffff' }}>
              📈 月度新增趋势
            </span>
          } className="tech-decoration">
            <div className="chart-container">
              <Line {...lineConfig} height={200} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 资产状态统计表 */}
      <Card title={
        <span style={{ color: '#ffffff' }}>
          📋 资产状态详情
        </span>
      } className="tech-decoration">
        <Table
          dataSource={statistics.assetStatusData}
          columns={[
            {
              title: '资产类型',
              dataIndex: 'type',
              key: 'type',
              render: (type: string) => (
                <span style={{ color: '#00d9ff', fontWeight: 500 }}>
                  {type}
                </span>
              ),
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => {
                const statusColors: Record<string, string> = {
                  '正常': '#00ff88',
                  '维护中': '#ffb800',
                  '停用': '#ff4757',
                };
                return (
                  <span style={{ 
                    color: statusColors[status] || '#b8c5d1',
                    fontWeight: 500
                  }}>
                    {status}
                  </span>
                );
              },
            },
            {
              title: '数量',
              dataIndex: 'count',
              key: 'count',
              render: (count: number) => (
                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                  {count}
                </span>
              ),
            },
            {
              title: '占比',
              key: 'percentage',
              render: (_, record) => {
                const total = statistics.assetStatusData
                  .filter(item => item.type === record.type)
                  .reduce((sum, item) => sum + item.count, 0);
                const percentage = ((record.count / total) * 100).toFixed(1);
                return (
                  <span style={{ color: '#b8c5d1' }}>
                    {percentage}%
                  </span>
                );
              },
            },
          ]}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          rowKey={(record) => `${record.type}-${record.status}-${record.count}`}
          size="middle"
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
};

export default Statistics;