import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Spin, Space, Typography } from 'antd';
import { BankOutlined, BuildOutlined, HomeOutlined, AreaChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

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
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!statistics) {
    return <div>暂无数据</div>;
  }

  return (
    <Space direction="vertical" size="large">
      {/* 头部标题 */}
      <Card>
        <Title level={2}>📊 数据分析中心</Title>
        <Text type="secondary">全方位资产数据统计与可视化分析</Text>
      </Card>

      {/* 主要统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="资产总数"
              value={statistics.totalAssets}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="建筑总数"
              value={statistics.totalBuildings}
              prefix={<BuildOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="楼层总数"
              value={statistics.totalFloors}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="房间总数"
              value={statistics.totalRooms}
              prefix={<AreaChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 面积和分布统计 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="📏 面积统计">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="总建筑面积"
                  value={statistics.totalArea}
                  suffix="m²"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="可用面积"
                  value={Math.round(statistics.totalArea * 0.85)}
                  suffix="m²"
                />
              </Col>
            </Row>
            <div>
              <Text type="secondary">空间利用率</Text>
              <Progress
                percent={statistics.occupancyRate}
                status="active"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="🏢 资产类型分布">
            <Space direction="vertical" size="small">
              {statistics.assetTypeData.map(item => (
                <div key={item.type}>
                  <Text>{item.type}: </Text>
                  <Text strong>{item.value}%</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="🚪 房间类型分布">
            <Space direction="vertical" size="small">
              {statistics.roomTypeData.map(item => (
                <div key={item.type}>
                  <Text>{item.type}: </Text>
                  <Text strong>{item.value} 间</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📈 快速统计">
            <Space direction="vertical" size="middle">
              <div>
                <Text type="secondary">总资产数</Text>
                <br />
                <Text strong>{statistics.totalAssets}</Text>
              </div>
              <div>
                <Text type="secondary">总建筑数</Text>
                <br />
                <Text strong>{statistics.totalBuildings}</Text>
              </div>
              <div>
                <Text type="secondary">使用率</Text>
                <br />
                <Text strong>{statistics.occupancyRate}%</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 资产状态统计表 */}
      <Card title="📋 资产状态详情">
        <Table
          dataSource={statistics.assetStatusData}
          columns={[
            {
              title: '资产类型',
              dataIndex: 'type',
              key: 'type',
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
            },
            {
              title: '数量',
              dataIndex: 'count',
              key: 'count',
            },
            {
              title: '占比',
              key: 'percentage',
              render: (_, record) => {
                const total = statistics.assetStatusData
                  .filter(item => item.type === record.type)
                  .reduce((sum, item) => sum + item.count, 0);
                const percentage = ((record.count / total) * 100).toFixed(1);
                return `${percentage}%`;
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
        />
      </Card>
    </Space>
  );
};

export default Statistics;