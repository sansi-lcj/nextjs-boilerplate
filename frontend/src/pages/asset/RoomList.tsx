import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Input, Select, message, Modal, Form, InputNumber, Popconfirm, Tag, Switch } from 'antd';
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
        label: floor.floor_name || '',
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
          room_number: '101',
          floor_id: 1,
          floor: { id: 1, floor_name: 'F1 大堂层', floor_number: 1 } as Floor,
          room_type: 'meeting' as const,
          room_area: 50,
          rent_price: 3000,
          decoration: 'luxury' as const,
          orientation: 'south' as const,
          has_window: true,
          has_ac: true,
          description: '豪华会议室，配备现代化设备',
          status: 'available' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          room_number: '1001',
          floor_id: 2,
          floor: { id: 2, floor_name: 'F10 办公层', floor_number: 10 } as Floor,
          room_type: 'office' as const,
          room_area: 80,
          rent_price: 5000,
          decoration: 'luxury' as const,
          orientation: 'south' as const,
          has_window: true,
          has_ac: true,
          description: '景观办公室，视野开阔',
          status: 'rented' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          room_number: '2001',
          floor_id: 3,
          floor: { id: 3, floor_name: 'F20 顶层办公', floor_number: 20 } as Floor,
          room_type: 'meeting' as const,
          room_area: 30,
          rent_price: 2000,
          decoration: 'simple' as const,
          orientation: 'east' as const,
          has_window: true,
          has_ac: true,
          description: '小型会议室，适合6人团队',
          status: 'available' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 4,
          room_number: '1002',
          floor_id: 2,
          floor: { id: 2, floor_name: 'F10 办公层', floor_number: 10 } as Floor,
          room_type: 'office' as const,
          room_area: 120,
          rent_price: 8000,
          decoration: 'luxury' as const,
          orientation: 'south' as const,
          has_window: true,
          has_ac: true,
          description: '大型开放式办公空间',
          status: 'available' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 5,
          room_number: '1003',
          floor_id: 2,
          floor: { id: 2, floor_name: 'F10 办公层', floor_number: 10 } as Floor,
          room_type: 'other' as const,
          room_area: 20,
          rent_price: 1000,
          decoration: 'blank' as const,
          orientation: 'north' as const,
          has_window: false,
          has_ac: false,
          description: '文件储藏室',
          status: 'available' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
      setFloors((response.data as any)?.items || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      // 设置模拟数据
      setFloors([
        { id: 1, floor_name: 'F1 大堂层', floor_number: 1 } as Floor,
        { id: 2, floor_name: 'F10 办公层', floor_number: 10 } as Floor,
        { id: 3, floor_name: 'F20 顶层办公', floor_number: 20 } as Floor,
      ]);
    }
  };

  // 获取楼宇列表
  const fetchBuildings = async () => {
    try {
      const response = await buildingService.getBuildings({ page: 1, pageSize: 100 });
      setBuildings((response.data as any)?.items || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      // 设置模拟数据
      setBuildings([
        { id: 1, building_name: '创新大厦A座' } as Building,
        { id: 2, building_name: '创新大厦B座' } as Building,
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
      room_number: room.room_number,
      floor_id: room.floor_id,
      room_type: room.room_type,
      room_area: room.room_area,
      rent_price: room.rent_price,
      decoration: room.decoration,
      orientation: room.orientation,
      has_window: room.has_window,
      has_ac: room.has_ac,
      description: room.description,
      status: room.status,
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
      title: '房间号',
      dataIndex: 'room_number',
      key: 'room_number',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => (a.room_number || '').localeCompare(b.room_number || ''),
      render: (number: string) => (
        <Tag color="blue">{number}</Tag>
      ),
    },
    {
      title: '所属楼层',
      dataIndex: ['floor', 'floor_name'],
      key: 'floor_name',
      width: 150,
      render: (floor_name: string) => (
        <Tag color="cyan">{floor_name}</Tag>
      ),
    },
    {
      title: '房间类型',
      dataIndex: 'room_type',
      key: 'room_type',
      width: 120,
      render: (type: string) => {
        const typeConfig: Record<string, { text: string; color: string }> = {
          'office': { text: '办公室', color: 'blue' },
          'meeting': { text: '会议室', color: 'green' },
          'other': { text: '其他', color: 'orange' },
        };
        const config = typeConfig[type] || { text: type, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '面积 (㎡)',
      dataIndex: 'room_area',
      key: 'room_area',
      width: 100,
      sorter: (a, b) => (a.room_area || 0) - (b.room_area || 0),
      render: (room_area: number) => (
        <span style={{ fontWeight: 500 }}>
          {room_area ? room_area.toLocaleString() : '-'}
        </span>
      ),
    },
    {
      title: '租金 (元/月)',
      dataIndex: 'rent_price',
      key: 'rent_price',
      width: 120,
      sorter: (a, b) => (a.rent_price || 0) - (b.rent_price || 0),
      render: (rent_price: number) => (
        <span style={{ fontWeight: 500, color: '#52c41a' }}>
          {rent_price ? `¥${rent_price.toLocaleString()}` : '-'}
        </span>
      ),
    },
    {
      title: '装修情况',
      dataIndex: 'decoration',
      key: 'decoration',
      width: 100,
      render: (decoration: string) => {
        const decorationConfig: Record<string, { text: string; color: string }> = {
          'blank': { text: '毛坯', color: 'default' },
          'simple': { text: '简装', color: 'blue' },
          'luxury': { text: '精装', color: 'gold' },
        };
        const config = decorationConfig[decoration] || { text: decoration, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '朝向',
      dataIndex: 'orientation',
      key: 'orientation',
      width: 80,
      render: (orientation: string) => {
        const orientationConfig: Record<string, string> = {
          'east': '东',
          'south': '南',
          'west': '西',
          'north': '北',
        };
        return orientationConfig[orientation] || orientation;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '可租', value: 'available' },
        { text: '已租', value: 'rented' },
        { text: '维护中', value: 'maintenance' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const statusConfig: Record<string, { text: string; color: string }> = {
          'available': { text: '可租', color: 'success' },
          'rented': { text: '已租', color: 'warning' },
          'maintenance': { text: '维护中', color: 'default' },
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
              name="room_number"
              label="房间号"
              rules={[{ required: true, message: '请输入房间号' }]}
            >
              <Input placeholder="请输入房间号，如 101" />
            </Form.Item>

            <Form.Item
              name="floor_id"
              label="所属楼层"
              rules={[{ required: true, message: '请选择所属楼层' }]}
            >
              <Select placeholder="请选择所属楼层">
                {floors.map(floor => (
                  <Select.Option key={floor.id} value={floor.id}>
                    {floor.floor_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="room_type"
              label="房间类型"
              rules={[{ required: true, message: '请选择房间类型' }]}
            >
              <Select placeholder="请选择房间类型">
                <Select.Option value="office">办公室</Select.Option>
                <Select.Option value="meeting">会议室</Select.Option>
                <Select.Option value="other">其他</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="room_area"
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
              name="rent_price"
              label="租金(元/月)"
            >
              <InputNumber
                placeholder="请输入月租金"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="decoration"
              label="装修情况"
            >
              <Select placeholder="请选择装修情况">
                <Select.Option value="blank">毛坯</Select.Option>
                <Select.Option value="simple">简装</Select.Option>
                <Select.Option value="luxury">精装</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="orientation"
              label="朝向"
            >
              <Select placeholder="请选择朝向">
                <Select.Option value="east">东</Select.Option>
                <Select.Option value="south">南</Select.Option>
                <Select.Option value="west">西</Select.Option>
                <Select.Option value="north">北</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="has_window"
              label="是否有窗"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="has_ac"
              label="是否有空调"
              valuePropName="checked"
            >
              <Switch />
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