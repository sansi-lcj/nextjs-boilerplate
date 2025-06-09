import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, Input, Select, message, Modal, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchAssets, deleteAsset } from '../../store/slices/assetSlice';
import { Asset } from '../../types/asset';

const { Search } = Input;
const { Option } = Select;

const AssetList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assets, totalAssets, loading } = useAppSelector((state) => state.asset);
  const [searchParams, setSearchParams] = useState({
    assetName: '',
    status: '',
    page: 1,
    size: 10,
  });

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadAssets = () => {
    dispatch(fetchAssets(searchParams));
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个资产吗？',
      onOk: async () => {
        try {
          await dispatch(deleteAsset(id)).unwrap();
          message.success('删除成功');
          loadAssets();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: ColumnsType<Asset> = [
    {
      title: '资产编码',
      dataIndex: 'asset_code',
      key: 'asset_code',
      width: 120,
    },
    {
      title: '资产名称',
      dataIndex: 'asset_name',
      key: 'asset_name',
      width: 200,
    },
    {
      title: '所属街道',
      dataIndex: ['street', 'name'],
      key: 'street_name',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '总面积(m²)',
      dataIndex: 'total_area',
      key: 'total_area',
      width: 120,
      align: 'right',
    },
    {
      title: '标签',
      dataIndex: 'asset_tags',
      key: 'asset_tags',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'normal' ? 'green' : 'red'}>
          {status === 'normal' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="资产列表">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索资产名称"
          allowClear
          onSearch={(value) => setSearchParams({ ...searchParams, assetName: value, page: 1 })}
          style={{ width: 200 }}
        />
        <Select
          placeholder="选择状态"
          allowClear
          style={{ width: 120 }}
          onChange={(value) => setSearchParams({ ...searchParams, status: value || '', page: 1 })}
        >
          <Option value="normal">正常</Option>
          <Option value="disabled">禁用</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />}>
          新增资产
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={assets}
        rowKey="id"
        loading={loading}
        pagination={{
          current: searchParams.page,
          pageSize: searchParams.size,
          total: totalAssets,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setSearchParams({ ...searchParams, page, size: pageSize || 10 });
          },
        }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default AssetList;