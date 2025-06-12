import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Input, 
  Select, 
  Modal, 
  Form, 
  InputNumber, 
  Popconfirm, 
  Tag, 
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Floor, FloorQueryParams } from '../../types/asset';
import { floorService } from '../../services/asset';
import BatchActions from '../../components/common/BatchActions';
import { ConfirmUtils, CommonMessages } from '../../utils/message';
import { EnhancedNotifications } from '../../utils/notification';
import './FloorList.less';

const { Search } = Input;
const { Title } = Typography;

const FloorList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [searchParams, setSearchParams] = useState<FloorQueryParams>({});
  const [form] = Form.useForm();
  
  // 批量操作相关状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Floor[]>([]);

  useEffect(() => {
    fetchFloors();
  }, [page, pageSize, searchParams]);

  const fetchFloors = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        ...searchParams,
      };
      const response = await floorService.getFloors(params);
      
      // 使用模拟数据
      if (!(response.data as any)?.data || (response.data as any).data.length === 0) {
        const mockFloors: Floor[] = [
          {
            id: 1,
            floor_name: '一楼',
            building_id: 1,
            building: { id: 1, building_name: '创新大厦' } as any,
            floor_number: 1,
            floor_area: 2500,
            rentable_area: 2000,
            rented_area: 1500,
            avg_rent_price: 120,
            occupancy_rate: 75,
            status: 'normal' as const,
            created_by: 1,
            updated_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            floor_name: '二楼',
            building_id: 1,
            building: { id: 1, building_name: '创新大厦' } as any,
            floor_number: 2,
            floor_area: 2500,
            rentable_area: 2000,
            rented_area: 1000,
            avg_rent_price: 100,
            occupancy_rate: 50,
            status: 'normal' as const,
            created_by: 1,
            updated_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        
        console.log('设置楼层数据:', mockFloors);
        setFloors(mockFloors);
        setTotal(mockFloors.length);
      } else {
        setFloors((response.data as any).data);
        setTotal((response.data as any).total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch floors:', error);
      // 使用增强的错误通知
      EnhancedNotifications.CREATE_ERROR('楼层列表', '数据加载失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 批量操作相关方法
  const handleBatchDelete = async (keys: React.Key[]) => {
    try {
      // 在实际项目中，这里应该调用批量删除 API
      // await floorService.batchDeleteFloors(keys);
      console.log('批量删除楼层:', keys);
      
      // 模拟删除成功
      setTimeout(() => {
        // 使用增强的批量操作成功通知
        EnhancedNotifications.BATCH_DELETE_SUCCESS(keys.length, '楼层');
        
        // 清空选择
        setSelectedRowKeys([]);
        setSelectedRows([]);
        // 重新加载数据
        fetchFloors();
      }, 1000);
    } catch (error) {
      console.error('批量删除失败:', error);
      // 使用增强的批量操作失败通知
      EnhancedNotifications.DELETE_ERROR('楼层', '批量删除失败，请重试');
    }
  };

  // 处理表格选择变化
  const handleSelectionChange = (newSelectedRowKeys: React.Key[], newSelectedRows: Floor[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  // 清空选择
  const handleClearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const columns: ColumnsType<Floor> = [
    {
      title: '楼层编码',
      dataIndex: 'floorCode',
      key: 'floorCode',
      width: 120,
      sorter: true,
    },
    {
      title: '楼层名称',
      dataIndex: 'floorName',
      key: 'floorName',
      width: 150,
      sorter: true,
    },
    {
      title: '所属建筑',
      dataIndex: ['building', 'buildingName'],
      key: 'buildingName',
      width: 200,
      filters: [
        { text: '创新大厦', value: '创新大厦' },
        { text: '科技园区A座', value: '科技园区A座' },
      ],
    },
    {
      title: '楼层编号',
      dataIndex: 'floorNumber',
      key: 'floorNumber',
      width: 100,
      sorter: true,
    },
    {
      title: '楼层高度',
      dataIndex: 'ceilingHeight',
      key: 'ceilingHeight',
      width: 100,
      render: (height: number) => height ? `${height}m` : '-',
      sorter: true,
    },
    {
      title: '总面积',
      dataIndex: 'totalArea',
      key: 'totalArea',
      width: 100,
      render: (area: number) => `${area}m²`,
      sorter: true,
    },
    {
      title: '可用面积',
      dataIndex: 'usableArea',
      key: 'usableArea',
      width: 100,
      render: (area: number) => `${area}m²`,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          normal: { color: 'green', text: '正常' },
          maintenance: { color: 'orange', text: '维护' },
          closed: { color: 'red', text: '关闭' },
        };
        const config = statusMap[status as keyof typeof statusMap] || statusMap.normal;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: '正常', value: 'normal' },
        { text: '维护', value: 'maintenance' },
        { text: '关闭', value: 'closed' },
      ],
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个楼层吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
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

  function handleCreate() {
    setEditingFloor(null);
    form.resetFields();
    setModalVisible(true);
  }

  function handleEdit(floor: Floor) {
    setEditingFloor(floor);
    form.setFieldsValue(floor);
    setModalVisible(true);
  }

  async function handleDelete(id: number) {
    try {
      await floorService.deleteFloor(id);
      // 使用增强的成功通知
      EnhancedNotifications.DELETE_SUCCESS('楼层', {
        title: '删除成功',
        content: '楼层数据已成功删除'
      });
      fetchFloors();
    } catch (error: any) {
      // 使用增强的错误通知
      EnhancedNotifications.DELETE_ERROR('楼层', error.message, {
        title: '删除失败',
        content: '无法删除楼层，请稍后重试'
      });
    }
  }

  async function handleSubmit() {
    try {
      const values = await form.validateFields();
      if (editingFloor) {
        await floorService.updateFloor(editingFloor.id, values);
        // 使用增强的成功通知
        EnhancedNotifications.UPDATE_SUCCESS('楼层', {
          title: '更新成功',
          content: `楼层"${values.floorName}"已成功更新`
        });
      } else {
        await floorService.createFloor(values);
        // 使用增强的成功通知
        EnhancedNotifications.CREATE_SUCCESS('楼层', {
          title: '创建成功',
          content: `楼层"${values.floorName}"已成功创建`
        });
      }
      setModalVisible(false);
      fetchFloors();
    } catch (error: any) {
      // 使用增强的错误通知
      if (editingFloor) {
        EnhancedNotifications.UPDATE_ERROR('楼层', error.message);
      } else {
        EnhancedNotifications.CREATE_ERROR('楼层', error.message);
      }
    }
  }

  function handleSearch(value: string) {
    setSearchParams({ ...searchParams, floorName: value });
    setPage(1);
  }

  function handleTableChange(pagination: any, filters: any, sorter: any) {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    
    // 处理排序
    if (sorter.field && sorter.order) {
      setSearchParams({
        ...searchParams,
        sort: sorter.field,
        order: sorter.order === 'ascend' ? 'asc' : 'desc',
      });
    } else {
      // 如果取消排序，移除排序参数
      const { sort, order, ...rest } = searchParams;
      setSearchParams(rest);
    }
    
    // 处理筛选
    const newFilters: any = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length > 0) {
        newFilters[key] = filters[key];
      }
    });
    
    if (Object.keys(newFilters).length > 0) {
      setSearchParams({
        ...searchParams,
        ...newFilters,
      });
    }
  }

  // 自定义批量操作
  const batchActions = [
    {
      key: 'export',
      label: '导出选中',
      onClick: (keys: React.Key[]) => {
        console.log('导出选中楼层:', keys);
        EnhancedNotifications.BATCH_EXPORT_SUCCESS(keys.length, '楼层');
      },
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }} className="floor-list-container">
      {/* 页面标题 */}
      <Card>
        <Title level={2}>🏢 楼层管理</Title>
      </Card>

      {/* 搜索和操作 */}
      <Card>
        <div className="search-action-container">
          <Search
            placeholder="搜索楼层名称"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Space>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={fetchFloors}
            >
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新增楼层
            </Button>
          </Space>
        </div>

        {/* 批量操作栏 */}
        {selectedRowKeys.length > 0 && (
          <div className="batch-actions-bar">
            <BatchActions
              selectedRowKeys={selectedRowKeys}
              selectedRows={selectedRows}
              actions={batchActions}
              onClearSelection={handleClearSelection}
            />
          </div>
        )}

        <Table
          columns={columns}
          dataSource={floors}
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
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
          size="middle"
          rowSelection={{
            selectedRowKeys,
            onChange: handleSelectionChange,
          }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingFloor ? '编辑楼层' : '新增楼层'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="楼层编码"
            name="floorCode"
            rules={[{ required: true, message: '请输入楼层编码' }]}
          >
            <Input placeholder="请输入楼层编码" />
          </Form.Item>

          <Form.Item
            label="楼层名称"
            name="floorName"
            rules={[{ required: true, message: '请输入楼层名称' }]}
          >
            <Input placeholder="请输入楼层名称" />
          </Form.Item>

          <Form.Item
            label="所属建筑"
            name="buildingId"
            rules={[{ required: true, message: '请选择所属建筑' }]}
          >
            <Select placeholder="请选择所属建筑">
              <Select.Option value={1}>创新大厦</Select.Option>
              <Select.Option value={2}>科技园区A座</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="楼层编号"
            name="floorNumber"
            rules={[{ required: true, message: '请输入楼层编号' }]}
          >
            <InputNumber
              min={-10}
              max={100}
              placeholder="请输入楼层编号"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="楼层类型"
            name="floorType"
            rules={[{ required: true, message: '请选择楼层类型' }]}
          >
            <Select placeholder="请选择楼层类型">
              <Select.Option value="basement">地下层</Select.Option>
              <Select.Option value="ground">地面层</Select.Option>
              <Select.Option value="office">办公层</Select.Option>
              <Select.Option value="commercial">商业层</Select.Option>
              <Select.Option value="parking">停车层</Select.Option>
              <Select.Option value="equipment">设备层</Select.Option>
              <Select.Option value="roof">屋顶层</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="楼层高度(m)"
            name="ceilingHeight"
            rules={[{ required: true, message: '请输入楼层高度' }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              placeholder="请输入楼层高度"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="总面积(m²)"
            name="totalArea"
            rules={[{ required: true, message: '请输入总面积' }]}
          >
            <InputNumber
              min={0}
              placeholder="请输入总面积"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="可用面积(m²)"
            name="usableArea"
            rules={[{ required: true, message: '请输入可用面积' }]}
          >
            <InputNumber
              min={0}
              placeholder="请输入可用面积"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="房间数量"
            name="roomCount"
            rules={[{ required: true, message: '请输入房间数量' }]}
          >
            <InputNumber
              min={0}
              placeholder="请输入房间数量"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value="normal">正常</Select.Option>
              <Select.Option value="maintenance">维护</Select.Option>
              <Select.Option value="closed">关闭</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default FloorList; 