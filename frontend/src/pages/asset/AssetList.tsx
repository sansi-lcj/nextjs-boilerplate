import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Input, Select, message, Modal, Form, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Asset, AssetQueryParams } from '../../types/asset';
import { assetService } from '../../services/asset';

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

  // 获取资产列表
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await assetService.getAssets({
        page,
        pageSize: pageSize,
        ...searchParams,
      });
      console.log('API Response:', response);
      console.log('Response structure:', JSON.stringify(response, null, 2));
      
      // 使用正确的数据访问路径：response.data.items
      const apiData = response.data;
      setAssets(apiData.items || []);
      setTotal(apiData.total || 0);
    } catch (error) {
      console.error('Error fetching assets:', error);
      message.error('获取资产列表失败');
      // 设置模拟数据以便开发调试
      setAssets([
        {
          id: 1,
          assetCode: 'AS001',
          assetName: '创新大厦',
          assetType: 'office',
          totalArea: 50000,
          buildArea: 48000,
          province: '北京市',
          city: '北京市',
          district: '海淀区',
          address: '中关村科技园区',
          status: 'normal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          assetCode: 'AS002',
          assetName: '商业广场',
          assetType: 'commercial',
          totalArea: 80000,
          buildArea: 75000,
          province: '上海市',
          city: '上海市',
          district: '浦东新区',
          address: '陆家嘴金融区',
          status: 'normal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setTotal(2);
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
    setSearchParams({ ...searchParams, assetName: value });
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

  const columns: ColumnsType<Asset> = [
    {
      title: '资产名称',
      dataIndex: 'assetName',
      key: 'assetName',
    },
    {
      title: '资产编码',
      dataIndex: 'assetCode',
      key: 'assetCode',
    },
    {
      title: '资产类型',
      dataIndex: 'assetType',
      key: 'assetType',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          'office': '办公楼',
          'commercial': '商业楼',
          'residential': '住宅',
          'industrial': '工业',
          'mixed': '综合楼',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '所在地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '总面积(m²)',
      dataIndex: 'totalArea',
      key: 'totalArea',
      render: (area: number) => area?.toLocaleString(),
    },
    {
      title: '建筑面积(m²)',
      dataIndex: 'buildArea',
      key: 'buildArea',
      render: (area: number) => area?.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          'normal': { text: '正常', color: 'green' },
          'maintenance': { text: '维护中', color: 'orange' },
          'renovation': { text: '装修中', color: 'blue' },
          'vacant': { text: '空置', color: 'gray' },
          'disposed': { text: '已处置', color: 'red' },
        };
        const statusInfo = statusMap[status] || { text: status, color: 'default' };
        return <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个资产吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Search
            placeholder="搜索资产名称"
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建资产
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={assets}
        loading={loading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize || 10);
          },
        }}
      />

      <Modal
        title={editingAsset ? '编辑资产' : '新建资产'}
        visible={modalVisible}
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
          <Form.Item
            name="assetName"
            label="资产名称"
            rules={[{ required: true, message: '请输入资产名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="assetCode"
            label="资产编码"
            rules={[{ required: true, message: '请输入资产编码' }]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item
            name="province"
            label="省份"
            rules={[{ required: true, message: '请输入省份' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="城市"
            rules={[{ required: true, message: '请输入城市' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="district"
            label="区县"
            rules={[{ required: true, message: '请输入区县' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="totalArea"
            label="总面积(m²)"
            rules={[{ required: true, message: '请输入总面积' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="buildArea"
            label="建筑面积(m²)"
            rules={[{ required: true, message: '请输入建筑面积' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AssetList;