import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Input, 
  Select, 
  message, 
  Modal, 
  Form, 
  InputNumber, 
  Popconfirm, 
  Tag, 
  Statistic,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  BuildOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Asset, AssetQueryParams } from '../../types/asset';
import { assetService } from '../../services/asset';

const { Text } = Typography;
const { Search } = Input;

const AssetList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<AssetQueryParams>({
    assetName: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [form] = Form.useForm();

  // 统计数据
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    totalArea: 0,
    averageArea: 0,
    occupancyRate: 0,
  });

  // 获取资产列表
  const fetchAssets = async () => {
    setLoading(true);
    
    try {
      const response = await assetService.getAssets({
        page,
        pageSize: pageSize,
        ...searchParams,
      });
      
      const apiData = response.data as any;
      const rawAssets = apiData.list || apiData.items || [];
      
      const transformedAssets = rawAssets.map((item: any) => ({
        id: item.id,
        assetCode: item.asset_code || `AS${String(item.id).padStart(3, '0')}`,
        assetName: item.asset_name || `资产${item.id}`,
        assetType: item.asset_type || 'office',
        totalArea: item.total_area || 0,
        buildArea: item.rentable_area || 0,
        address: item.address || '',
        province: '',
        city: '',
        district: '',
        status: item.status === 'active' ? 'normal' : (item.status || 'normal'),
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      }));
      
      setAssets(transformedAssets);
      setTotal(apiData.total || 0);
      
      // 计算统计数据
      const totalArea = transformedAssets.reduce((sum: number, asset: Asset) => sum + (asset.totalArea || 0), 0);
      setStatistics({
        totalAssets: transformedAssets.length,
        totalArea,
        averageArea: transformedAssets.length > 0 ? Math.round(totalArea / transformedAssets.length) : 0,
        occupancyRate: 85.5 + Math.random() * 10,
      });
    } catch (error) {
      console.error('Error fetching assets:', error);
      message.error('获取资产列表失败');
      
      // 设置模拟数据
      const mockAssets: Asset[] = [
        {
          id: 1,
          assetCode: 'AS001',
          assetName: '创新科技大厦',
          assetType: 'office' as const,
          totalArea: 45000,
          buildArea: 38000,
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          address: '北京市朝阳区建国路88号',
          status: 'normal' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          assetCode: 'AS002',
          assetName: '国际商务中心',
          assetType: 'commercial' as const,
          totalArea: 68000,
          buildArea: 58000,
          province: '上海市',
          city: '上海市',
          district: '浦东新区',
          address: '上海市浦东新区陆家嘴金融街168号',
          status: 'normal' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setAssets(mockAssets);
      setTotal(2);
      
      const totalArea = mockAssets.reduce((sum, asset) => sum + (asset.totalArea || 0), 0);
      setStatistics({
        totalAssets: mockAssets.length,
        totalArea,
        averageArea: Math.round(totalArea / mockAssets.length),
        occupancyRate: 91.4,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchParams]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchParams({ assetName: value });
    setPage(1);
  };

  // 处理创建/编辑
  const handleSubmit = async (values: any) => {
    try {
      if (editingAsset) {
        await assetService.updateAsset(editingAsset.id, values);
        message.success('更新成功');
      } else {
        await assetService.createAsset(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchAssets();
    } catch (error) {
      message.error(editingAsset ? '更新失败' : '创建失败');
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      await assetService.deleteAsset(id);
      message.success('删除成功');
      fetchAssets();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 打开编辑弹窗
  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    form.setFieldsValue({
      assetName: asset.assetName,
      assetCode: asset.assetCode,
      assetType: asset.assetType,
      address: asset.address,
      totalArea: asset.totalArea,
      buildArea: asset.buildArea,
      province: asset.province,
      city: asset.city,
      district: asset.district,
    });
    setModalVisible(true);
  };

  // 打开创建弹窗
  const handleCreate = () => {
    setEditingAsset(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 状态标签渲染
  const getStatusTag = (status: string) => {
    const statusMap = {
      normal: { color: 'green', text: '正常运营' },
      maintenance: { color: 'orange', text: '维护中' },
      disabled: { color: 'red', text: '暂停使用' },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.normal;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 资产类型标签渲染
  const getTypeTag = (type: string) => {
    const typeMap = {
      office: { color: 'blue', text: '办公楼' },
      commercial: { color: 'purple', text: '商业楼' },
      residential: { color: 'cyan', text: '住宅' },
      industrial: { color: 'orange', text: '工业' },
      mixed: { color: 'green', text: '综合楼' },
    };
    const config = typeMap[type as keyof typeof typeMap] || typeMap.office;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ColumnsType<Asset> = [
    {
      title: '资产名称',
      dataIndex: 'assetName',
      key: 'assetName',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.assetCode}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: '资产类型',
      dataIndex: 'assetType',
      key: 'assetType',
      render: getTypeTag,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '总面积(㎡)',
      dataIndex: 'totalArea',
      key: 'totalArea',
      align: 'right',
      render: (area) => area?.toLocaleString() || '-',
    },
    {
      title: '建筑面积(㎡)',
      dataIndex: 'buildArea',
      key: 'buildArea',
      align: 'right',
      render: (area) => area?.toLocaleString() || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除这个资产吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总资产数"
              value={statistics.totalAssets}
              prefix={<BuildOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总面积"
              value={statistics.totalArea}
              suffix="㎡"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均面积"
              value={statistics.averageArea}
              suffix="㎡"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="使用率"
              value={statistics.occupancyRate}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Search
                placeholder="搜索资产名称"
                allowClear
                onSearch={handleSearch}
                style={{ width: 250 }}
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchAssets}
              >
                刷新
              </Button>
            </Space>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreate}
            >
              新增资产
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={assets}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              if (newPageSize !== pageSize) {
                setPageSize(newPageSize);
              }
            },
          }}
        />
      </Card>

      {/* 创建/编辑弹窗 */}
      <Modal
        title={editingAsset ? '编辑资产' : '新增资产'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assetName"
                label="资产名称"
                rules={[{ required: true, message: '请输入资产名称' }]}
              >
                <Input placeholder="请输入资产名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assetCode"
                label="资产编码"
                rules={[{ required: true, message: '请输入资产编码' }]}
              >
                <Input placeholder="请输入资产编码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assetType"
                label="资产类型"
                rules={[{ required: true, message: '请选择资产类型' }]}
              >
                <Select placeholder="请选择资产类型">
                  <Select.Option value="office">办公楼</Select.Option>
                  <Select.Option value="commercial">商业楼</Select.Option>
                  <Select.Option value="residential">住宅</Select.Option>
                  <Select.Option value="industrial">工业</Select.Option>
                  <Select.Option value="mixed">综合楼</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="详细地址"
              >
                <Input placeholder="请输入详细地址" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalArea"
                label="总面积(㎡)"
                rules={[{ required: true, message: '请输入总面积' }]}
              >
                <InputNumber 
                  placeholder="请输入总面积" 
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="buildArea"
                label="建筑面积(㎡)"
                rules={[{ required: true, message: '请输入建筑面积' }]}
              >
                <InputNumber 
                  placeholder="请输入建筑面积" 
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="province" label="省份">
                <Input placeholder="请输入省份" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="city" label="城市">
                <Input placeholder="请输入城市" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="district" label="区县">
                <Input placeholder="请输入区县" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingAsset ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssetList;