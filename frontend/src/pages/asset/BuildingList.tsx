import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, Input, Select, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchBuildings } from '../../store/slices/assetSlice';
import { Building } from '../../types/asset';

const { Search } = Input;
const { Option } = Select;

const BuildingList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { buildings, totalBuildings, loading } = useAppSelector((state) => state.asset);
  const [searchParams, setSearchParams] = useState({
    buildingName: '',
    buildingType: '',
    page: 1,
    size: 10,
  });

  useEffect(() => {
    loadBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadBuildings = () => {
    dispatch(fetchBuildings(searchParams));
  };

  const columns: ColumnsType<Building> = [
    {
      title: '楼宇编码',
      dataIndex: 'building_code',
      key: 'building_code',
      width: 120,
    },
    {
      title: '楼宇名称',
      dataIndex: 'building_name',
      key: 'building_name',
      width: 200,
    },
    {
      title: '所属资产',
      dataIndex: ['asset', 'asset_name'],
      key: 'asset_name',
      width: 180,
    },
    {
      title: '楼宇类型',
      dataIndex: 'building_type',
      key: 'building_type',
      width: 120,
    },
    {
      title: '总楼层数',
      dataIndex: 'total_floors',
      key: 'total_floors',
      width: 100,
      align: 'center',
    },
    {
      title: '总面积(m²)',
      dataIndex: 'total_area',
      key: 'total_area',
      width: 120,
      align: 'right',
    },
    {
      title: '可租面积(m²)',
      dataIndex: 'rentable_area',
      key: 'rentable_area',
      width: 120,
      align: 'right',
    },
    {
      title: '建造年份',
      dataIndex: 'construction_year',
      key: 'construction_year',
      width: 100,
    },
    {
      title: '物业公司',
      dataIndex: 'property_company',
      key: 'property_company',
      width: 150,
      ellipsis: true,
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
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="楼宇列表">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索楼宇名称"
          allowClear
          onSearch={(value) => setSearchParams({ ...searchParams, buildingName: value, page: 1 })}
          style={{ width: 200 }}
        />
        <Select
          placeholder="楼宇类型"
          allowClear
          style={{ width: 120 }}
          onChange={(value) => setSearchParams({ ...searchParams, buildingType: value || '', page: 1 })}
        >
          <Option value="office">办公楼</Option>
          <Option value="commercial">商业楼</Option>
          <Option value="residential">住宅楼</Option>
          <Option value="industrial">工业楼</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />}>
          新增楼宇
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={buildings}
        rowKey="id"
        loading={loading}
        pagination={{
          current: searchParams.page,
          pageSize: searchParams.size,
          total: totalBuildings,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setSearchParams({ ...searchParams, page, size: pageSize || 10 });
          },
        }}
        scroll={{ x: 1500 }}
      />
    </Card>
  );
};

export default BuildingList;