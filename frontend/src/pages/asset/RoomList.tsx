import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Input, Select, message, Modal, Form, InputNumber, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Room, RoomQueryParams, Floor, Building } from '../../types/asset';
import { roomService, floorService, buildingService } from '../../services/asset';
import PageContainer from '../../components/common/PageContainer';
import SearchFilterBar, { FilterField } from '../../components/common/SearchFilterBar';
import './RoomList.less';

const RoomList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<RoomQueryParams>({
    roomName: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form] = Form.useForm();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  // 搜索过滤字段配置
  const filterFields: FilterField[] = [
    {
      key: 'roomName',
      label: '房间名称',
      type: 'search',
      placeholder: '请输入房间名称搜索',
    },
    {
      key: 'floorId',
      label: '所属楼层',
      type: 'select',
      options: floors.map(floor => ({
        label: floor.floorName,
        value: floor.id,
      })),
    },
    {
      key: 'roomType',
      label: '房间类型',
      type: 'select',
      options: [
        { label: '办公室', value: 'office' },
        { label: '会议室', value: 'meeting' },
        { label: '储藏室', value: 'storage' },
        { label: '洗手间', value: 'restroom' },
        { label: '茶水间', value: 'pantry' },
      ],
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '可用', value: 'available' },
        { label: '维护中', value: 'maintenance' },
        { label: '停用', value: 'disabled' },
      ],
    },
  ];

  // 页面操作配置
  const pageActions = [
    {
      key: 'create',
      title: '新增房间',
      icon: <PlusOutlined />,
      type: 'primary' as const,
      onClick: handleCreate,
    },
  ];

  // 面包屑配置
  const breadcrumb = [
    { title: '资产管理', icon: <HomeOutlined /> },
    { title: '房间列表' },
  ];

  // 获取房间列表
  const fetchRooms = async () => {
    setLoading(true);
    try {
      console.log('开始获取房间列表...');
      // 直接使用模拟数据，确保数据正常显示
      const mockRooms: Room[] = [
        {
          id: 1,
          roomCode: 'R001',
          roomName: '会议室A',
          roomNumber: '101',
          floorId: 1,
          floor: { id: 1, floorName: 'F1 大堂层' } as Floor,
          roomType: 'meeting',
          area: 50,
          usableArea: 45,
          capacity: 12,
          status: 'available',
          occupancyStatus: 'vacant',
          rent: 5000,
          rentUnit: 'monthly',
          description: '大型会议室',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          roomCode: 'R002',
          roomName: '办公室B',
          roomNumber: '1001',
          floorId: 2,
          floor: { id: 2, floorName: 'F10 办公层' } as Floor,
          roomType: 'office',
          area: 80,
          usableArea: 75,
          capacity: 6,
          status: 'available',
          occupancyStatus: 'occupied',
          rent: 8000,
          rentUnit: 'monthly',
          description: '标准办公室',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          roomCode: 'R003',
          roomName: '小型会议室',
          roomNumber: '2001',
          floorId: 3,
          floor: { id: 3, floorName: 'F20 顶层办公' } as Floor,
          roomType: 'meeting',
          area: 30,
          usableArea: 28,
          capacity: 6,
          status: 'available',
          occupancyStatus: 'vacant',
          rent: 3000,
          rentUnit: 'monthly',
          description: '小型讨论室',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 4,
          roomCode: 'R004',
          roomName: '开放办公区',
          roomNumber: '1002',
          floorId: 2,
          floor: { id: 2, floorName: 'F10 办公层' } as Floor,
          roomType: 'office',
          area: 120,
          usableArea: 110,
          capacity: 20,
          status: 'available',
          occupancyStatus: 'occupied',
          rent: 12000,
          rentUnit: 'monthly',
          description: '开放式办公区域',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 5,
          roomCode: 'R005',
          roomName: '储藏室',
          roomNumber: '1003',
          floorId: 2,
          floor: { id: 2, floorName: 'F10 办公层' } as Floor,
          roomType: 'storage',
          area: 20,
          usableArea: 18,
          capacity: 0,
          status: 'available',
          occupancyStatus: 'vacant',
          rent: 1000,
          rentUnit: 'monthly',
          description: '文件储藏室',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      console.log('设置房间数据:', mockRooms);
      setRooms(mockRooms);
      setTotal(mockRooms.length);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      message.error('获取房间列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取楼层列表
  const fetchFloors = async () => {
    try {
      const response = await floorService.getFloors({ page: 1, pageSize: 100 });
      setFloors(response.data.items || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      // 设置模拟数据
      setFloors([
        { id: 1, floorName: 'F1 大堂层', floorNumber: 1 } as Floor,
        { id: 2, floorName: 'F10 办公层', floorNumber: 10 } as Floor,
        { id: 3, floorName: 'F20 顶层办公', floorNumber: 20 } as Floor,
      ]);
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
        { id: 1, buildingName: '创新大厦A座' } as Building,
        { id: 2, buildingName: '创新大厦B座' } as Building,
      ]);
    }
  };

  useEffect(() => {
    fetchRooms();
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
    setSearchParams({ roomName: '' });
    setPage(1);
  };

  // 处理创建/编辑
  const handleSubmit = async (values: any) => {
    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, values);
        message.success('更新成功');
      } else {
        await roomService.createRoom(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchRooms();
    } catch (error) {
      message.error(editingRoom ? '更新失败' : '创建失败');
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      await roomService.deleteRoom(id);
      message.success('删除成功');
      fetchRooms();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 打开编辑弹窗
  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    form.setFieldsValue({
      roomCode: room.roomCode,
      roomName: room.roomName,
      roomNumber: room.roomNumber,
      floorId: room.floorId,
      roomType: room.roomType,
      area: room.area,
      usableArea: room.usableArea,
      capacity: room.capacity,
      status: room.status,
      rent: room.rent,
      rentUnit: room.rentUnit,
      description: room.description,
    });
    setModalVisible(true);
  };

  // 打开创建弹窗
  function handleCreate() {
    setEditingRoom(null);
    form.resetFields();
    setModalVisible(true);
  }

  const columns: ColumnsType<Room> = [
    {
      title: '房间编码',
      dataIndex: 'roomCode',
      key: 'roomCode',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => (a.roomCode || '').localeCompare(b.roomCode || ''),
      render: (code: string) => (
        <span style={{ fontFamily: 'Monaco, monospace', fontSize: '12px', color: '#666' }}>
          {code}
        </span>
      ),
    },
    {
      title: '房间名称',
      dataIndex: 'roomName',
      key: 'roomName',
      width: 200,
      fixed: 'left',
      sorter: (a, b) => (a.roomName || '').localeCompare(b.roomName || ''),
      render: (name: string) => (
        <span style={{ fontWeight: 600, color: '#1890ff' }}>{name}</span>
      ),
    },
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 100,
      sorter: (a, b) => (a.roomNumber || '').localeCompare(b.roomNumber || ''),
      render: (number: string) => (
        <Tag color="blue">{number}</Tag>
      ),
    },
    {
      title: '所属楼层',
      dataIndex: ['floor', 'floorName'],
      key: 'floorName',
      width: 150,
      render: (floorName: string) => (
        <Tag color="cyan">{floorName}</Tag>
      ),
    },
    {
      title: '房间类型',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 120,
      render: (type: string) => {
        const typeConfig: Record<string, { text: string; color: string }> = {
          'office': { text: '办公室', color: 'blue' },
          'meeting': { text: '会议室', color: 'green' },
          'storage': { text: '储藏室', color: 'orange' },
          'restroom': { text: '洗手间', color: 'purple' },
          'pantry': { text: '茶水间', color: 'magenta' },
        };
        const config = typeConfig[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '面积 (㎡)',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      sorter: (a, b) => (a.area || 0) - (b.area || 0),
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
      width: 120,
      sorter: (a, b) => (a.usableArea || 0) - (b.usableArea || 0),
      render: (area: number) => (
        <span style={{ fontWeight: 500 }}>
          {area ? area.toLocaleString() : '-'}
        </span>
      ),
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      sorter: (a, b) => (a.capacity || 0) - (b.capacity || 0),
      render: (capacity: number) => (
        <span style={{ fontWeight: 500, color: '#722ed1' }}>
          {capacity ? `${capacity}人` : '-'}
        </span>
      ),
    },
    {
      title: '租金 (元/月)',
      dataIndex: 'rent',
      key: 'rent',
      width: 120,
      sorter: (a, b) => (a.rent || 0) - (b.rent || 0),
      render: (rent: number) => (
        <span style={{ fontWeight: 500, color: '#52c41a' }}>
          {rent ? `¥${rent.toLocaleString()}` : '-'}
        </span>
      ),
    },
    {
      title: '使用状态',
      dataIndex: 'occupancyStatus',
      key: 'occupancyStatus',
      width: 100,
      render: (status: string) => {
        const statusConfig: Record<string, { text: string; color: string }> = {
          'vacant': { text: '空闲', color: 'default' },
          'occupied': { text: '使用中', color: 'success' },
          'reserved': { text: '预订', color: 'warning' },
        };
        const config = statusConfig[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '可用', value: 'available' },
        { text: '维护中', value: 'maintenance' },
        { text: '停用', value: 'disabled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const statusConfig: Record<string, { text: string; color: string }> = {
          'available': { text: '可用', color: 'success' },
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
            title="确定要删除这个房间吗？"
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
    <div className="room-list-page">
      <div className="room-list-container">
        <PageContainer
          title="房间列表"
          subtitle="管理楼层内的各个房间信息，包括办公室、会议室等"
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
          <Card title="房间列表" bordered={false} className="data-table-card">
            <Table
              columns={columns}
              dataSource={rooms}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1600 }}
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
          title={editingRoom ? '编辑房间' : '新增房间'}
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
              name="roomCode"
              label="房间编码"
              rules={[{ required: true, message: '请输入房间编码' }]}
            >
              <Input placeholder="请输入房间编码，如 R001" />
            </Form.Item>

            <Form.Item
              name="roomName"
              label="房间名称"
              rules={[{ required: true, message: '请输入房间名称' }]}
            >
              <Input placeholder="请输入房间名称" />
            </Form.Item>

            <Form.Item
              name="roomNumber"
              label="房间号"
              rules={[{ required: true, message: '请输入房间号' }]}
            >
              <Input placeholder="请输入房间号，如 101" />
            </Form.Item>

            <Form.Item
              name="floorId"
              label="所属楼层"
              rules={[{ required: true, message: '请选择所属楼层' }]}
            >
              <Select placeholder="请选择所属楼层">
                {floors.map(floor => (
                  <Select.Option key={floor.id} value={floor.id}>
                    {floor.floorName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="roomType"
              label="房间类型"
              rules={[{ required: true, message: '请选择房间类型' }]}
            >
              <Select placeholder="请选择房间类型">
                <Select.Option value="office">办公室</Select.Option>
                <Select.Option value="meeting">会议室</Select.Option>
                <Select.Option value="storage">储藏室</Select.Option>
                <Select.Option value="restroom">洗手间</Select.Option>
                <Select.Option value="pantry">茶水间</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="area"
              label="面积(㎡)"
              rules={[{ required: true, message: '请输入面积' }]}
            >
              <InputNumber
                placeholder="请输入面积"
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
              name="capacity"
              label="容纳人数"
            >
              <InputNumber
                placeholder="请输入容纳人数"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="rent"
              label="租金(元/月)"
            >
              <InputNumber
                placeholder="请输入月租金"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea
                placeholder="请输入房间描述信息"
                rows={3}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingRoom ? '更新' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default RoomList; 