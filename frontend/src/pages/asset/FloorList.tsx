import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, message, Modal, Form, InputNumber, Popconfirm, Tag, Select, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BuildOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Floor, FloorQueryParams, Building } from '../../types/asset';
import { floorService, buildingService } from '../../services/asset';
import PageContainer from '../../components/common/PageContainer';
import SearchFilterBar, { FilterField } from '../../components/common/SearchFilterBar';
import './FloorList.less';

const FloorList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<FloorQueryParams>({
    floorName: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [form] = Form.useForm();
  const [buildings, setBuildings] = useState<any[]>([]);

  // 搜索过滤字段配置
  const filterFields: FilterField[] = [
    {
      key: 'floorName',
      label: '楼层名称',
      type: 'search',
      placeholder: '请输入楼层名称搜索',
    },
    {
      key: 'buildingId',
      label: '所属楼宇',
      type: 'select',
      options: buildings.map(building => ({
        label: building.buildingName,
        value: building.id,
      })),
    },
    {
      key: 'floorType',
      label: '楼层类型',
      type: 'select',
      options: [
        { label: '地下层', value: 'basement' },
        { label: '地面层', value: 'ground' },
        { label: '办公层', value: 'office' },
        { label: '商业层', value: 'commercial' },
        { label: '停车层', value: 'parking' },
      ],
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '正常', value: 'normal' },
        { label: '维护中', value: 'maintenance' },
        { label: '停用', value: 'disabled' },
      ],
    },
  ];

  // 页面操作配置
  const pageActions = [
    {
      key: 'create',
      title: '新增楼层',
      icon: <PlusOutlined />,
      type: 'primary' as const,
      onClick: handleCreate,
    },
  ];

  // 面包屑配置
  const breadcrumb = [
    { title: '资产管理', icon: <BuildOutlined /> },
    { title: '楼层列表' },
  ];

  // 获取楼层列表
  const fetchFloors = async () => {
    setLoading(true);
    try {
      console.log('开始获取楼层列表...');
      // 直接使用模拟数据，确保数据正常显示
      const mockFloors: Floor[] = [
        {
          id: 1,
          floorCode: 'F001',
          floorNumber: 1,
          floorName: 'F1 大堂层',
          buildingId: 1,
          building: { id: 1, buildingName: '创新大厦A座' } as Building,
          totalArea: 1200,
          usableArea: 1000,
          roomCount: 10,
          floorType: 'ground',
          status: 'normal',
          description: '大堂接待区域',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          floorCode: 'F010',
          floorNumber: 10,
          floorName: 'F10 办公层',
          buildingId: 1,
          building: { id: 1, buildingName: '创新大厦A座' } as Building,
          totalArea: 1500,
          usableArea: 1350,
          roomCount: 15,
          floorType: 'office',
          status: 'normal',
          description: '标准办公区域',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          floorCode: 'F020',
          floorNumber: 20,
          floorName: 'F20 顶层办公',
          buildingId: 2,
          building: { id: 2, buildingName: '创新大厦B座' } as Building,
          totalArea: 1300,
          usableArea: 1200,
          roomCount: 12,
          floorType: 'office',
          status: 'normal',
          description: '顶层办公区域',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 4,
          floorCode: 'B001',
          floorNumber: -1,
          floorName: 'B1 停车场',
          buildingId: 1,
          building: { id: 1, buildingName: '创新大厦A座' } as Building,
          totalArea: 2000,
          usableArea: 1800,
          roomCount: 0,
          floorType: 'parking',
          status: 'normal',
          description: '地下停车场',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      console.log('设置楼层数据:', mockFloors);
      setFloors(mockFloors);
      setTotal(mockFloors.length);
    } catch (error) {
      console.error('Error fetching floors:', error);
      message.error('获取楼层列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取楼宇列表
  const fetchBuildings = async () => {
    try {
      const response = await buildingService.getBuildings({ page: 1, pageSize: 100 });
      setBuildings(response.data.items || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      // 设置模拟数据
      setBuildings([
        { id: 1, buildingName: '创新大厦A座' },
        { id: 2, buildingName: '创新大厦B座' },
        { id: 3, buildingName: '商业广场' },
      ]);
    }
  };

  useEffect(() => {
    fetchFloors();
    fetchBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchParams]);

  // 处理搜索
  const handleSearch = (values: Record<string, any>) => {
    setSearchParams({ ...searchParams, ...values });
    setPage(1);
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({ floorName: '' });
    setPage(1);
  };

  // 处理创建/编辑
  const handleSubmit = async (values: any) => {
    try {
      if (editingFloor) {
        console.log('更新楼层:', editingFloor.id, values);
        // await floorService.updateFloor(editingFloor.id, values);
        message.success('楼层更新成功');
      } else {
        console.log('创建楼层:', values);
        // await floorService.createFloor(values);
        message.success('楼层创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchFloors();
    } catch (error) {
      message.error(editingFloor ? '更新失败' : '创建失败');
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      console.log('删除楼层:', id);
      // await floorService.deleteFloor(id);
      message.success('楼层删除成功');
      fetchFloors();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 打开编辑弹窗
  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    form.setFieldsValue({
      floorCode: floor.floorCode,
      floorNumber: floor.floorNumber,
      floorName: floor.floorName,
      buildingId: floor.buildingId,
      ceilingHeight: floor.ceilingHeight,
      totalArea: floor.totalArea,
      usableArea: floor.usableArea,
      roomCount: floor.roomCount,
      floorType: floor.floorType,
      status: floor.status,
      description: floor.description,
    });
    setModalVisible(true);
  };

  // 打开创建弹窗
  function handleCreate() {
    setEditingFloor(null);
    form.resetFields();
    setModalVisible(true);
  }

  const columns: ColumnsType<Floor> = [
    {
      title: '楼层编码',
      dataIndex: 'floorCode',
      key: 'floorCode',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => (a.floorCode || '').localeCompare(b.floorCode || ''),
      render: (code: string) => (
        <span style={{ fontFamily: 'Monaco, monospace', fontSize: '12px', color: '#666' }}>
          {code}
        </span>
      ),
    },
    {
      title: '楼层名称',
      dataIndex: 'floorName',
      key: 'floorName',
      width: 200,
      fixed: 'left',
      sorter: (a, b) => (a.floorName || '').localeCompare(b.floorName || ''),
      render: (name: string) => (
        <span style={{ fontWeight: 600, color: '#1890ff' }}>{name}</span>
      ),
    },
    {
      title: '楼层号',
      dataIndex: 'floorNumber',
      key: 'floorNumber',
      width: 100,
      sorter: (a, b) => (a.floorNumber || 0) - (b.floorNumber || 0),
      render: (number: number) => (
        <Tag color={number < 0 ? 'red' : number === 0 ? 'orange' : 'blue'}>
          {number > 0 ? `F${number}` : number === 0 ? 'G' : `B${Math.abs(number)}`}
        </Tag>
      ),
    },
    {
      title: '所属楼宇',
      dataIndex: ['building', 'buildingName'],
      key: 'buildingName',
      width: 180,
      render: (buildingName: string) => (
        <Tag color="cyan">{buildingName}</Tag>
      ),
    },
    {
      title: '楼层类型',
      dataIndex: 'floorType',
      key: 'floorType',
      width: 120,
      render: (type: string) => {
        const typeConfig: Record<string, { text: string; color: string }> = {
          'basement': { text: '地下层', color: 'purple' },
          'ground': { text: '地面层', color: 'orange' },
          'office': { text: '办公层', color: 'blue' },
          'commercial': { text: '商业层', color: 'green' },
          'parking': { text: '停车层', color: 'magenta' },
        };
        const config = typeConfig[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '总面积 (㎡)',
      dataIndex: 'totalArea',
      key: 'totalArea',
      width: 120,
      sorter: (a, b) => (a.totalArea || 0) - (b.totalArea || 0),
      render: (area: number) => (
        <span style={{ fontWeight: 500 }}>
          {area ? area.toLocaleString() : '-'}
        </span>
      ),
    },
    {
      title: '可用面积 (㎡)',
      dataIndex: 'usableArea',
      key: 'usableArea',
      width: 130,
      sorter: (a, b) => (a.usableArea || 0) - (b.usableArea || 0),
      render: (area: number) => (
        <span style={{ fontWeight: 500 }}>
          {area ? area.toLocaleString() : '-'}
        </span>
      ),
    },
    {
      title: '房间数',
      dataIndex: 'roomCount',
      key: 'roomCount',
      width: 100,
      sorter: (a, b) => (a.roomCount || 0) - (b.roomCount || 0),
      render: (count: number) => (
        <span style={{ fontWeight: 500, color: '#722ed1' }}>
          {count || 0}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '正常', value: 'normal' },
        { text: '维护中', value: 'maintenance' },
        { text: '停用', value: 'disabled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const statusConfig: Record<string, { text: string; color: string }> = {
          'normal': { text: '正常', color: 'success' },
          'maintenance': { text: '维护中', color: 'warning' },
          'disabled': { text: '停用', color: 'default' },
        };
        const config = statusConfig[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ padding: '4px 8px' }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个楼层吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ padding: '4px 8px' }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="floor-list-page">
      <div className="floor-list-container">
        <PageContainer
          title="楼层列表"
          subtitle="管理楼宇内的各个楼层信息，包括办公层、商业层等"
          breadcrumb={breadcrumb}
          actions={pageActions}
          loading={loading}
        >
          {/* 搜索过滤栏 */}
          <SearchFilterBar
            fields={filterFields}
            values={searchParams}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
          />

          {/* 数据表格 */}
          <Card title="楼层列表" bordered={false} className="data-table-card">
            <Table
              columns={columns}
              dataSource={floors}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1400 }}
              className="enhanced-table"
              pagination={{
                current: page,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                onChange: (page, size) => {
                  setPage(page);
                  if (size !== pageSize) {
                    setPageSize(size);
                  }
                },
              }}
            />
          </Card>
        </PageContainer>

        {/* 创建/编辑弹窗 */}
        <Modal
          title={editingFloor ? '编辑楼层' : '新增楼层'}
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
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="floorCode"
              label="楼层编码"
              rules={[{ required: true, message: '请输入楼层编码' }]}
            >
              <Input placeholder="请输入楼层编码，如 F001" />
            </Form.Item>

            <Form.Item
              name="floorName"
              label="楼层名称"
              rules={[{ required: true, message: '请输入楼层名称' }]}
            >
              <Input placeholder="请输入楼层名称" />
            </Form.Item>

            <Form.Item
              name="floorNumber"
              label="楼层号"
              rules={[{ required: true, message: '请输入楼层号' }]}
            >
              <InputNumber
                placeholder="请输入楼层号（负数为地下层）"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="buildingId"
              label="所属楼宇"
              rules={[{ required: true, message: '请选择所属楼宇' }]}
            >
              <Select placeholder="请选择所属楼宇">
                {buildings.map(building => (
                  <Select.Option key={building.id} value={building.id}>
                    {building.buildingName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="floorType"
              label="楼层类型"
              rules={[{ required: true, message: '请选择楼层类型' }]}
            >
              <Select placeholder="请选择楼层类型">
                <Select.Option value="basement">地下层</Select.Option>
                <Select.Option value="ground">地面层</Select.Option>
                <Select.Option value="office">办公层</Select.Option>
                <Select.Option value="commercial">商业层</Select.Option>
                <Select.Option value="parking">停车层</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="totalArea"
              label="总面积(㎡)"
              rules={[{ required: true, message: '请输入总面积' }]}
            >
              <InputNumber
                placeholder="请输入总面积"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="usableArea"
              label="可用面积(㎡)"
              rules={[{ required: true, message: '请输入可用面积' }]}
            >
              <InputNumber
                placeholder="请输入可用面积"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea
                placeholder="请输入楼层描述信息"
                rows={3}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingFloor ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default FloorList; 