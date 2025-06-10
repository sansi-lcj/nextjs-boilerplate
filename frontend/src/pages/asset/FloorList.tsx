import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Input, Select, message, Modal, Form, InputNumber, Popconfirm, Tag, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BuildOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Floor, FloorQueryParams, Building } from '../../types/asset';
import { floorService, buildingService } from '../../services/asset';
import { useLoading, LoadingKeys } from '../../hooks/useLoading';
import { AssetValidationRules, ValidationRules, FormUtils } from '../../utils/validation';
import { usePermission, PermissionCodes } from '../../hooks/usePermission';
import PermissionGuard from '../../components/common/PermissionGuard';
import BatchActions from '../../components/common/BatchActions';
import { CommonMessages, ConfirmUtils } from '../../utils/message';

const { Search } = Input;
const { Option } = Select;

const FloorList: React.FC = () => {
  const { loading, executeWithLoading, isLoading } = useLoading();
  const { canCreate, canUpdate, canDelete } = usePermission();
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

  // 获取楼层列表
  const fetchFloors = async () => {
    await executeWithLoading(LoadingKeys.FETCH_LIST, async () => {
      try {
        const response = await floorService.getFloors({
          page,
          pageSize: pageSize,
          ...searchParams,
        });
        
        const apiData = response.data;
        // 后端返回的是直接的数组，不是分页格式
        if (Array.isArray(apiData)) {
          setFloors(apiData);
          setTotal(apiData.length);
        } else {
          // 如果是分页格式
          setFloors(apiData.items || []);
          setTotal(apiData.total || 0);
        }
      } catch (error) {
        console.error('Error fetching floors:', error);
        CommonMessages.LOAD_ERROR();
        // 设置模拟数据以便开发调试
        setFloors([
          {
            id: 1,
            floorCode: 'F001',
            floorNumber: 1,
            floorName: 'F1 大堂层',
            buildingId: 1,
            building: { buildingName: '创新大厦A座' } as Building,
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
            building: { buildingName: '创新大厦A座' } as Building,
            totalArea: 1500,
            usableArea: 1350,
            roomCount: 15,
            floorType: 'office',
            status: 'normal',
            description: '标准办公区域',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
        setTotal(2);
      }
    });
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
  const handleSearch = (value: string) => {
    setSearchParams({ ...searchParams, floorName: value });
    setPage(1);
  };

  // 处理筛选
  const handleFilterChange = (key: string, value: any) => {
    setSearchParams({ ...searchParams, [key]: value });
    setPage(1);
  };

  // 处理创建/编辑
  const handleSubmit = async (values: any) => {
    await executeWithLoading(LoadingKeys.FORM_SUBMIT, async () => {
      try {
        if (editingFloor) {
          await floorService.updateFloor(editingFloor.id, values);
          CommonMessages.UPDATE_SUCCESS('楼层');
        } else {
          await floorService.createFloor(values);
          CommonMessages.CREATE_SUCCESS('楼层');
        }
        setModalVisible(false);
        form.resetFields();
        fetchFloors();
      } catch (error) {
        if (editingFloor) {
          CommonMessages.UPDATE_ERROR('楼层');
        } else {
          CommonMessages.CREATE_ERROR('楼层');
        }
      }
    });
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    await executeWithLoading(LoadingKeys.DELETE, async () => {
      try {
        await floorService.deleteFloor(id);
        CommonMessages.DELETE_SUCCESS('楼层');
        fetchFloors();
      } catch (error) {
        CommonMessages.DELETE_ERROR('楼层');
      }
    });
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
  const handleCreate = () => {
    setEditingFloor(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns: ColumnsType<Floor> = [
    {
      title: '楼层号',
      dataIndex: 'floorNumber',
      key: 'floorNumber',
      width: 80,
      sorter: (a, b) => a.floorNumber - b.floorNumber,
    },
    {
      title: '楼层名称',
      dataIndex: 'floorName',
      key: 'floorName',
      width: 150,
    },
    {
      title: '所属楼宇',
      dataIndex: ['building', 'buildingName'],
      key: 'buildingName',
      width: 150,
      render: (_, record) => record.building?.buildingName || '-',
    },
    {
      title: '楼层类型',
      dataIndex: 'floorType',
      key: 'floorType',
      width: 100,
      render: (floorType: string) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          basement: { text: '地下室', color: 'orange' },
          lobby: { text: '大堂', color: 'blue' },
          office: { text: '办公', color: 'green' },
          commercial: { text: '商业', color: 'purple' },
          parking: { text: '停车场', color: 'grey' },
          equipment: { text: '设备层', color: 'red' },
          roof: { text: '屋顶', color: 'cyan' },
        };
        const config = typeMap[floorType] || { text: floorType, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '建筑面积(m²)',
      dataIndex: 'totalArea',
      key: 'totalArea',
      width: 120,
      render: (area: number) => area ? area.toLocaleString() : '-',
    },
    {
      title: '使用面积(m²)',
      dataIndex: 'usableArea',
      key: 'usableArea',
      width: 120,
      render: (area: number) => area ? area.toLocaleString() : '-',
    },
    {
      title: '房间数量',
      dataIndex: 'roomCount',
      key: 'roomCount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          normal: { text: '正常', color: 'green' },
          maintenance: { text: '维护中', color: 'orange' },
          renovation: { text: '装修中', color: 'blue' },
          vacant: { text: '空置', color: 'grey' },
          disabled: { text: '停用', color: 'red' },
        };
        const config = statusMap[status] || { text: status, color: 'default' };
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
          <PermissionGuard permission={PermissionCodes.FLOOR_UPDATE}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PermissionCodes.FLOOR_DELETE}>
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={isLoading(LoadingKeys.DELETE)}
              onClick={() => {
                ConfirmUtils.confirmDelete(
                  '确定要删除这个楼层吗？',
                  `楼层"${record.floorName}"删除后无法恢复，请谨慎操作。`,
                  () => handleDelete(record.id)
                );
              }}
            >
              删除
            </Button>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div className="floor-list">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="搜索楼层名称"
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
            />
            <Select
              placeholder="所属楼宇"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => handleFilterChange('buildingId', value)}
            >
              {buildings.map(building => (
                <Option key={building.id} value={building.id}>
                  {building.buildingName}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="楼层类型"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('floorType', value)}
            >
              <Option value="basement">地下室</Option>
              <Option value="lobby">大堂</Option>
              <Option value="office">办公</Option>
              <Option value="commercial">商业</Option>
              <Option value="parking">停车场</Option>
              <Option value="equipment">设备层</Option>
              <Option value="roof">屋顶</Option>
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 100 }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="normal">正常</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="renovation">装修中</Option>
              <Option value="vacant">空置</Option>
              <Option value="disabled">停用</Option>
            </Select>
            <PermissionGuard permission={PermissionCodes.FLOOR_CREATE}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                新增楼层
              </Button>
            </PermissionGuard>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={floors}
          rowKey="id"
          loading={isLoading(LoadingKeys.FETCH_LIST)}
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
        title={editingFloor ? '编辑楼层' : '新增楼层'}
        open={modalVisible}
        onOk={() => form.submit()}
        confirmLoading={isLoading(LoadingKeys.FORM_SUBMIT)}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'normal',
            floorType: 'office',
            roomCount: 0,
          }}
        >
          <Form.Item
            label="所属楼宇"
            name="buildingId"
            rules={[ValidationRules.requiredSelect('所属楼宇')]}
          >
            <Select placeholder="选择楼宇">
              {buildings.map(building => (
                <Option key={building.id} value={building.id}>
                  {building.buildingName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="楼层号"
            name="floorNumber"
            rules={AssetValidationRules.floorNumber}
          >
            <InputNumber
              placeholder="楼层号"
              style={{ width: '100%' }}
              min={-10}
              max={200}
            />
          </Form.Item>

          <Form.Item
            label="楼层名称"
            name="floorName"
            rules={AssetValidationRules.buildingName}
          >
            <Input placeholder="楼层名称" />
          </Form.Item>

          <Form.Item
            label="楼层编码"
            name="floorCode"
            rules={[
              ValidationRules.required('楼层编码'),
              ValidationRules.length(2, 20),
            ]}
          >
            <Input placeholder="楼层编码" />
          </Form.Item>

          <Form.Item
            label="楼层类型"
            name="floorType"
            rules={[ValidationRules.requiredSelect('楼层类型')]}
          >
            <Select placeholder="选择楼层类型">
              <Option value="basement">地下室</Option>
              <Option value="lobby">大堂</Option>
              <Option value="office">办公</Option>
              <Option value="commercial">商业</Option>
              <Option value="parking">停车场</Option>
              <Option value="equipment">设备层</Option>
              <Option value="roof">屋顶</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="楼层高度(m)"
              name="ceilingHeight"
              style={{ flex: 1 }}
            >
              <InputNumber
                placeholder="楼层高度"
                style={{ width: '100%' }}
                min={0}
                step={0.1}
                precision={1}
              />
            </Form.Item>

            <Form.Item
              label="建筑面积(m²)"
              name="totalArea"
              style={{ flex: 1 }}
              rules={AssetValidationRules.area}
            >
              <InputNumber
                placeholder="建筑面积"
                style={{ width: '100%' }}
                min={0}
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
              />
            </Form.Item>

            <Form.Item
              label="房间数量"
              name="roomCount"
              style={{ flex: 1 }}
              rules={[ValidationRules.required('房间数量')]}
            >
              <InputNumber
                placeholder="房间数量"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="状态"
            name="status"
            rules={[ValidationRules.requiredSelect('状态')]}
          >
            <Select placeholder="选择状态">
              <Option value="normal">正常</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="renovation">装修中</Option>
              <Option value="vacant">空置</Option>
              <Option value="disabled">停用</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="楼层描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FloorList; 