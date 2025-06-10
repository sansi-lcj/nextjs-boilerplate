import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BuildOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Building } from '../../types/asset';
import PageContainer from '../../components/common/PageContainer';
import SearchFilterBar, { FilterField } from '../../components/common/SearchFilterBar';
import './BuildingList.less';

const BuildingList: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    building_name: '',
    building_type: '',
    asset_id: '',
  });

  // 搜索过滤字段配置
  const filterFields: FilterField[] = [
    {
      key: 'building_name',
      label: '楼宇名称',
      type: 'search',
      placeholder: '请输入楼宇名称搜索',
    },
    {
      key: 'building_type',
      label: '楼宇类型',
      type: 'select',
      options: [
        { label: '办公楼', value: 'office' },
        { label: '商业楼', value: 'commercial' },
        { label: '住宅楼', value: 'residential' },
        { label: '停车楼', value: 'parking' },
        { label: '辅助楼', value: 'auxiliary' },
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
      title: '新增楼宇',
      icon: <PlusOutlined />,
      type: 'primary' as const,
      onClick: handleAdd,
    },
  ];

  // 面包屑配置
  const breadcrumb = [
    { title: '资产管理', icon: <BuildOutlined /> },
    { title: '楼宇列表' },
  ];

  useEffect(() => {
    loadBuildings();
  }, [searchParams, page, pageSize]);

  const loadBuildings = async () => {
    setLoading(true);
    try {
      // 模拟 API 调用
      const mockBuildings: Building[] = [
        {
          id: 1,
          building_code: 'B001',
          building_name: '创新大厦',
          building_type: 'office',
          asset_id: 1,
          asset: { id: 1, asset_name: '科技园区' } as any,
          total_area: 15000,
          rentable_area: 13000,
          total_floors: 20,
          underground_floors: 2,
          property_company: '物业管理有限公司',
          status: 'normal' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          building_code: 'B002',
          building_name: '科技园A座',
          building_type: 'industrial',
          asset_id: 2,
          asset: { id: 2, asset_name: '商业综合体' } as any,
          total_area: 12000,
          rentable_area: 10000,
          total_floors: 15,
          underground_floors: 1,
          property_company: '园区物业',
          status: 'normal' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          building_code: 'B003',
          building_name: '商业中心1号楼',
          building_type: 'commercial',
          asset_id: 3,
          asset: { id: 3, asset_name: '商业综合体' } as any,
          total_area: 8000,
          rentable_area: 7200,
          total_floors: 8,
          underground_floors: 2,
          property_company: '商业物业管理',
          status: 'normal' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          building_code: 'B004',
          building_name: '办公楼D座',
          building_type: 'office',
          asset_id: 1,
          asset: { id: 1, asset_name: '科技园区' } as any,
          total_area: 18000,
          rentable_area: 16000,
          total_floors: 25,
          underground_floors: 3,
          property_company: '物业管理有限公司',
          status: 'normal' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          building_code: 'B005',
          building_name: '研发中心',
          building_type: 'auxiliary',
          asset_id: 2,
          asset: { id: 2, asset_name: '商业综合体' } as any,
          total_area: 3000,
          rentable_area: 2800,
          total_floors: 3,
          underground_floors: 0,
          property_company: '后勤管理部',
          status: 'normal' as const,
          created_by: 1,
          updated_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // 应用搜索过滤
      let filteredBuildings = mockBuildings;
      if (searchParams.building_name) {
        filteredBuildings = filteredBuildings.filter(building =>
          building.building_name.includes(searchParams.building_name)
        );
      }
      if (searchParams.building_type) {
        filteredBuildings = filteredBuildings.filter(building =>
          building.building_type === searchParams.building_type
        );
      }
      
      setBuildings(filteredBuildings);
      setTotal(filteredBuildings.length);
    } catch (error) {
      console.error('加载楼宇列表失败:', error);
      message.error('加载楼宇列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (values: Record<string, any>) => {
    setSearchParams(prev => ({ ...prev, ...values }));
    setPage(1);
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({
      building_name: '',
      building_type: '',
      asset_id: '',
    });
    setPage(1);
  };

  const handleEdit = (building: Building) => {
    console.log('编辑楼宇:', building);
    message.info(`编辑楼宇: ${building.building_name}`);
    // TODO: 实现编辑功能
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      // TODO: 调用删除 API
      console.log('删除楼宇:', id);
      
      // 从列表中移除
      setBuildings(buildings.filter(building => building.id !== id));
      setTotal(total - 1);
      
      message.success(`已删除楼宇: ${name}`);
    } catch (error) {
      console.error('删除楼宇失败:', error);
      message.error('删除楼宇失败');
    }
  };

  function handleAdd() {
    message.info('新增楼宇功能开发中...');
    // TODO: 实现新增功能
  }

  const columns: ColumnsType<Building> = [
    {
      title: '楼宇编码',
      dataIndex: 'building_code',
      key: 'building_code',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => (a.building_code || '').localeCompare(b.building_code || ''),
      render: (code: string) => (
        <span 
          className="building-code"
          style={{ 
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: '13px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            padding: '4px 8px',
            borderRadius: '6px',
            color: '#667eea',
            fontWeight: 600,
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}
        >
          {code}
        </span>
      ),
    },
    {
      title: '楼宇名称',
      dataIndex: 'building_name',
      key: 'building_name',
      width: 200,
      fixed: 'left',
      sorter: (a, b) => (a.building_name || '').localeCompare(b.building_name || ''),
      render: (name: string) => (
        <span 
          className="building-name"
          style={{ 
            fontWeight: 700, 
            fontSize: '14px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {name}
        </span>
      ),
    },
    {
      title: '所属资产',
      dataIndex: ['asset', 'asset_name'],
      key: 'asset_name',
      width: 180,
      render: (asset_name: string) => (
        <Tag 
          className="tag-enhanced"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            padding: '4px 12px'
          }}
        >
          {asset_name}
        </Tag>
      ),
    },
    {
      title: '楼宇类型',
      dataIndex: 'building_type',
      key: 'building_type',
      width: 120,
      render: (type: string) => {
        const typeConfig: Record<string, { text: string; gradient: string }> = {
          'office': { 
            text: '办公楼', 
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
          },
          'commercial': { 
            text: '商业楼', 
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
          },
          'residential': { 
            text: '住宅楼', 
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
          },
          'parking': { 
            text: '停车楼', 
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
          },
          'auxiliary': { 
            text: '辅助楼', 
            gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' 
          },
        };
        const config = typeConfig[type] || { 
          text: type, 
          gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' 
        };
        return (
          <Tag 
            className="tag-enhanced"
            style={{
              background: config.gradient,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              padding: '4px 12px'
            }}
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '总面积',
      dataIndex: 'total_area',
      key: 'total_area',
      width: 120,
      sorter: (a, b) => (a.total_area || 0) - (b.total_area || 0),
      render: (area: number) => (
        <span 
          style={{ 
            fontWeight: 500,
            color: '#1890ff' 
          }}
        >
          {area ? `${area.toLocaleString()} ㎡` : '-'}
        </span>
      ),
    },
    {
      title: '可租面积',
      dataIndex: 'rentable_area',
      key: 'rentable_area',
      width: 120,
      sorter: (a, b) => (a.rentable_area || 0) - (b.rentable_area || 0),
      render: (area: number) => (
        <span 
          style={{ 
            fontWeight: 500,
            color: '#52c41a' 
          }}
        >
          {area ? `${area.toLocaleString()} ㎡` : '-'}
        </span>
      ),
    },
    {
      title: '楼层数',
      dataIndex: 'total_floors',
      key: 'total_floors',
      width: 100,
      sorter: (a, b) => (a.total_floors || 0) - (b.total_floors || 0),
      render: (floors: number) => (
        <div style={{ textAlign: 'center' }}>
          <span 
            style={{ 
              fontWeight: 700,
              fontSize: '14px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {floors ? `${floors}层` : '-'}
          </span>
        </div>
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
        const statusConfig: Record<string, { text: string; gradient: string }> = {
          'normal': { 
            text: '正常', 
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
          },
          'maintenance': { 
            text: '维护中', 
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
          },
          'disabled': { 
            text: '停用', 
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
          },
        };
        const config = statusConfig[status] || { 
          text: status, 
          gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' 
        };
        return (
          <Tag 
            className="tag-enhanced"
            style={{
              background: config.gradient,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              padding: '4px 12px',
              minWidth: '60px',
              textAlign: 'center'
            }}
          >
            {config.text}
          </Tag>
        );
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
            style={{ 
              padding: '4px 8px',
              color: '#667eea',
              fontWeight: 500,
              borderRadius: '6px'
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个楼宇吗？"
            onConfirm={() => handleDelete(record.id, record.building_name)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ 
                padding: '4px 8px',
                fontWeight: 500,
                borderRadius: '6px'
              }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="building-list-page">
      <div className="building-list-container">
        <PageContainer
          title="楼宇列表"
          subtitle="管理资产下的各类楼宇建筑，包括办公楼、商业楼等"
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
          <Card title="楼宇列表" bordered={false} className="data-table-card">
            <Table
              columns={columns}
              dataSource={buildings}
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
      </div>
    </div>
  );
};

export default BuildingList;