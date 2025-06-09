import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Spin } from 'antd';
import { BankOutlined, BuildOutlined, HomeOutlined, AreaChartOutlined } from '@ant-design/icons';
import { Pie, Line } from '@ant-design/charts';
import { assetService } from '../services/asset';

interface StatisticsData {
  assets: Array<{
    type: string;
    count: number;
    status: string;
  }>;
  building_count: number;
  floor_count: number;
  room_stats: Array<{
    type: string;
    count: number;
  }>;
  total_area: {
    building_area: number;
    room_area: number;
  };
  occupancy_rate: string;
}

const Statistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await assetService.getAssetStatistics();
      console.log('Statistics API response:', response);
      console.log('Statistics data:', response.data);
      
      // 修复数据访问路径，类似资产列表的修复
      const apiData = response.data?.data || response.data;
      setStatistics(apiData);
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

  // 准备资产类型分布数据
  const assetTypeData = (statistics.assets || []).reduce((acc: any[], item) => {
    const existing = acc.find(a => a.type === item.type);
    if (existing) {
      existing.value += item.count;
    } else {
      acc.push({
        type: item.type,
        value: item.count,
      });
    }
    return acc;
  }, []);

  // 准备房间类型分布数据
  const roomTypeData = (statistics.room_stats || []).map(item => ({
    type: item.type,
    value: item.count,
  }));

  // 饼图配置
  const pieConfig = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
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
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 统计卡片 */}
        <Col span={6}>
          <Card>
            <Statistic
              title="资产总数"
              value={assetTypeData.reduce((sum, item) => sum + item.value, 0)}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="建筑总数"
              value={statistics.building_count}
              prefix={<BuildOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="楼层总数"
              value={statistics.floor_count}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="房间总数"
              value={roomTypeData.reduce((sum, item) => sum + item.value, 0)}
              prefix={<AreaChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 面积统计 */}
        <Col span={12}>
          <Card title="面积统计">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="总建筑面积"
                  value={statistics.total_area.building_area}
                  suffix="m²"
                  precision={2}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="总房间面积"
                  value={statistics.total_area.room_area}
                  suffix="m²"
                  precision={2}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 20 }}>
              <div>空间使用率</div>
              <Progress
                percent={parseFloat(statistics.occupancy_rate)}
                status="active"
                format={(percent) => `${percent}%`}
              />
            </div>
          </Card>
        </Col>

        {/* 资产类型分布 */}
        <Col span={12}>
          <Card title="资产类型分布">
            <Pie {...pieConfig} data={assetTypeData} height={200} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 房间类型分布 */}
        <Col span={12}>
          <Card title="房间类型分布">
            <Pie {...pieConfig} data={roomTypeData} height={200} />
          </Card>
        </Col>

        {/* 月度趋势 */}
        <Col span={12}>
          <Card title="月度新增趋势">
            <Line {...lineConfig} height={200} />
          </Card>
        </Col>
      </Row>

      {/* 资产状态统计表 */}
      <Card title="资产状态统计" style={{ marginTop: 16 }}>
        <Table
          dataSource={statistics.assets}
          columns={[
            {
              title: '资产类型',
              dataIndex: 'type',
              key: 'type',
              render: (type: string) => {
                const typeMap: Record<string, string> = {
                  industrial: '工业园区',
                  commercial: '商业综合体',
                  office: '办公楼',
                  residential: '住宅小区',
                  other: '其他',
                };
                return typeMap[type] || type;
              },
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => {
                const statusMap: Record<string, string> = {
                  active: '正常',
                  inactive: '停用',
                  maintenance: '维护中',
                };
                return statusMap[status] || status;
              },
            },
            {
              title: '数量',
              dataIndex: 'count',
              key: 'count',
            },
          ]}
          pagination={false}
          rowKey={(record) => `${record.type}-${record.status}`}
        />
      </Card>
    </div>
  );
};

export default Statistics;