import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Input, Select, message, Modal, Form, InputNumber, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Room, RoomQueryParams, Floor, Building } from '../../types/asset';
import { roomService, floorService, buildingService } from '../../services/asset';

const { Search } = Input;
const { Option } = Select;

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

  // 获取房间列表
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await roomService.getRooms({
        page,
        pageSize: pageSize,
        ...searchParams,
      });
      
      const apiData = response.data;
      // 后端返回的是直接的数组，不是分页格式
      if (Array.isArray(apiData)) {
        setRooms(apiData);
        setTotal(apiData.length);
      } else {
        // 如果是分页格式
        setRooms(apiData.items || []);
        setTotal(apiData.total || 0);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      message.error('获取房间列表失败');
      // 设置模拟数据以便开发调试
      setRooms([
        {
          id: 1,
          roomCode: 'R001',
          roomName: '会议室A',
          roomNumber: '101',
          floorId: 1,
          floor: { floorName: 'F1 大堂层' } as Floor,
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
          floor: { floorName: 'F10 办公层' } as Floor,
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
      ]);
      setTotal(2);
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
  const handleSearch = (value: string) => {
    setSearchParams({ ...searchParams, roomName: value });
    setPage(1);
  };

  // 处理筛选
  const handleFilterChange = (key: string, value: any) => {
    setSearchParams({ ...searchParams, [key]: value });
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
      occupancyStatus: room.occupancyStatus,
      rent: room.rent,
      rentUnit: room.rentUnit,
      description: room.description,
    });
    setModalVisible(true);
  };

  // 打开创建弹窗
  const handleCreate = () => {
    setEditingRoom(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns: ColumnsType<Room> = [
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 100,
    },
    {
      title: '房间名称',
      dataIndex: 'roomName',
      key: 'roomName',
      width: 150,
    },
    {
      title: '所属楼层',
      dataIndex: ['floor', 'floorName'],
      key: 'floorName',
      width: 150,
      render: (_, record) => record.floor?.floorName || '-',
    },
    {
      title: '房间类型',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          'office': { text: '办公室', color: 'blue' },
          'meeting': { text: '会议室', color: 'green' },
          'storage': { text: '储藏室', color: 'orange' },
          'restroom': { text: '洗手间', color: 'cyan' },
          'elevator': { text: '电梯', color: 'purple' },
          'stair': { text: '楼梯', color: 'default' },
          'corridor': { text: '走廊', color: 'default' },
          'utility': { text: '设备间', color: 'red' },
          'retail': { text: '零售', color: 'magenta' },
          'restaurant': { text: '餐厅', color: 'volcano' },
        };
        const typeInfo = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: '面积(m²)',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      render: (area: number) => area?.toLocaleString(),
    },
    {
      title: '容量(人)',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 80,
    },
    {
      title: '租金(元/月)',
      dataIndex: 'rent',
      key: 'rent',
      width: 120,
      render: (rent: number) => rent ? `¥${rent.toLocaleString()}` : '-',
    },
    {
      title: '占用状态',
      dataIndex: 'occupancyStatus',
      key: 'occupancyStatus',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          'vacant': { text: '空置', color: 'default' },
          'occupied': { text: '已占用', color: 'red' },
          'reserved': { text: '已预订', color: 'orange' },
        };
        const statusInfo = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          'available': { text: '可用', color: 'green' },
          'occupied': { text: '占用', color: 'red' },
          'maintenance': { text: '维护中', color: 'orange' },
          'renovation': { text: '装修中', color: 'blue' },
          'reserved': { text: '预订', color: 'purple' },
        };
        const statusInfo = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="room-list">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="搜索房间名称"
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
            />
            <Select
              placeholder="所属楼层"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => handleFilterChange('floorId', value)}
            >
              {floors.map(floor => (
                <Option key={floor.id} value={floor.id}>
                  {floor.floorName}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="房间类型"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('roomType', value)}
            >
              <Option value="office">办公室</Option>
              <Option value="meeting">会议室</Option>
              <Option value="storage">储藏室</Option>
              <Option value="restroom">洗手间</Option>
              <Option value="utility">设备间</Option>
              <Option value="retail">零售</Option>
              <Option value="restaurant">餐厅</Option>
            </Select>
            <Select
              placeholder="占用状态"
              allowClear
              style={{ width: 100 }}
              onChange={(value) => handleFilterChange('occupancyStatus', value)}
            >
              <Option value="vacant">空置</Option>
              <Option value="occupied">已占用</Option>
              <Option value="reserved">已预订</Option>
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 100 }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="available">可用</Option>
              <Option value="occupied">占用</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="renovation">装修中</Option>
              <Option value="reserved">预订</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新增房间
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={rooms}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize || 10);
            },
          }}
        />
      </Card>

      <Modal
        title={editingRoom ? '编辑房间' : '新增房间'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={700}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'available',
            occupancyStatus: 'vacant',
            roomType: 'office',
            rentUnit: 'monthly',
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="所属楼层"
              name="floorId"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请选择所属楼层' }]}
            >
              <Select placeholder="选择楼层">
                {floors.map(floor => (
                  <Option key={floor.id} value={floor.id}>
                    {floor.floorName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="房间号"
              name="roomNumber"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入房间号' }]}
            >
              <Input placeholder="房间号" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="房间名称"
              name="roomName"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入房间名称' }]}
            >
              <Input placeholder="房间名称" />
            </Form.Item>

            <Form.Item
              label="房间编码"
              name="roomCode"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入房间编码' }]}
            >
              <Input placeholder="房间编码" />
            </Form.Item>
          </div>

          <Form.Item
            label="房间类型"
            name="roomType"
            rules={[{ required: true, message: '请选择房间类型' }]}
          >
            <Select placeholder="选择房间类型">
              <Option value="office">办公室</Option>
              <Option value="meeting">会议室</Option>
              <Option value="storage">储藏室</Option>
              <Option value="restroom">洗手间</Option>
              <Option value="elevator">电梯</Option>
              <Option value="stair">楼梯</Option>
              <Option value="corridor">走廊</Option>
              <Option value="utility">设备间</Option>
              <Option value="retail">零售</Option>
              <Option value="restaurant">餐厅</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="面积(m²)"
              name="area"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入面积' }]}
            >
              <InputNumber
                placeholder="面积"
                style={{ width: '100%' }}
                min={0}
                step={0.1}
                precision={1}
              />
            </Form.Item>

            <Form.Item
              label="使用面积(m²)"
              name="usableArea"
              style={{ flex: 1 }}
            >
              <InputNumber
                placeholder="使用面积"
                style={{ width: '100%' }}
                min={0}
                step={0.1}
                precision={1}
              />
            </Form.Item>

            <Form.Item
              label="容量(人)"
              name="capacity"
              style={{ flex: 1 }}
            >
              <InputNumber
                placeholder="容量"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="租金"
              name="rent"
              style={{ flex: 1 }}
            >
                             <InputNumber
                 placeholder="租金"
                 style={{ width: '100%' }}
                 min={0}
                 addonBefore="¥"
               />
            </Form.Item>

            <Form.Item
              label="租金单位"
              name="rentUnit"
              style={{ flex: 1 }}
            >
              <Select placeholder="选择租金单位">
                <Option value="monthly">月租</Option>
                <Option value="daily">日租</Option>
                <Option value="hourly">时租</Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="状态"
              name="status"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="选择状态">
                <Option value="available">可用</Option>
                <Option value="occupied">占用</Option>
                <Option value="maintenance">维护中</Option>
                <Option value="renovation">装修中</Option>
                <Option value="reserved">预订</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="占用状态"
              name="occupancyStatus"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请选择占用状态' }]}
            >
              <Select placeholder="选择占用状态">
                <Option value="vacant">空置</Option>
                <Option value="occupied">已占用</Option>
                <Option value="reserved">已预订</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="房间描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomList; 