import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Input, Select, message, Modal, Form, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Asset } from '../../types/asset';
import { assetService } from '../../services/asset';

const { Search } = Input;

const AssetList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    asset_name: '',
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
        page_size: pageSize,
        ...searchParams,
      });
      console.log('API Response:', response);
      console.log('Response structure:', JSON.stringify(response, null, 2));
      console.log('Assets data:', response.data);
      console.log('Assets list:', response.data?.data?.list);
      console.log('Assets list length:', response.data?.data?.list?.length);
      
      // 修复数据访问路径：response.data.data.list
      const apiData = response.data?.data || response.data;
      setAssets(apiData.list || []);
      setTotal(apiData.total || 0);
    } catch (error) {
      console.error('Error fetching assets:', error);
      message.error('获取资产列表失败');
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
    setSearchParams({ ...searchParams, asset_name: value });
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
    form.setFieldsValue(asset);
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
      dataIndex: 'asset_name',
      key: 'asset_name',
    },
    {
      title: '资产编码',
      dataIndex: 'asset_code',
      key: 'asset_code',
    },
    {
      title: '土地性质',
      dataIndex: 'land_nature',
      key: 'land_nature',
    },
    {
      title: '所在地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '总面积(m²)',
      dataIndex: 'total_area',
      key: 'total_area',
    },
    {
      title: '可租面积(m²)',
      dataIndex: 'rentable_area',
      key: 'rentable_area',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          'active': { text: '正常', color: 'green' },
          'inactive': { text: '停用', color: 'red' },
          'maintenance': { text: '维护中', color: 'orange' },
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
            name="asset_name"
            label="资产名称"
            rules={[{ required: true, message: '请输入资产名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="asset_code"
            label="资产编码"
            rules={[{ required: true, message: '请输入资产编码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="street_id"
            label="街道ID"
            rules={[{ required: true, message: '请输入街道ID' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="address"
            label="所在地址"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="land_nature"
            label="土地性质"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="total_area"
            label="总面积(m²)"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="rentable_area"
            label="可租面积(m²)"
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