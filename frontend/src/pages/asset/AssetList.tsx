import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Input, 
  Select, 
  message, 
  Modal, 
  Form, 
  InputNumber, 
  Popconfirm, 
  Tag, 
  Tooltip,
  Badge,
  Avatar,
  Statistic,
  Row,
  Col,
  Divider,
  Typography,
  Progress,
  Segmented,
  FloatButton,
  notification,
  Dropdown,
  Spin,
  Empty,
  Result,
  theme
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EnvironmentOutlined,
  HomeOutlined,
  BuildOutlined,
  SearchOutlined,
  EyeOutlined,
  SettingOutlined,
  TrophyOutlined,
  RiseOutlined,
  TeamOutlined,
  DollarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  MoreOutlined,
  FilterOutlined,
  ExportOutlined,
  ReloadOutlined,
  BulbOutlined,
  SyncOutlined,
  StarOutlined,
  HeartOutlined,
  CustomerServiceOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Asset, AssetQueryParams } from '../../types/asset';
import { assetService } from '../../services/asset';
import PageContainer from '../../components/common/PageContainer';
import SearchFilterBar, { FilterField } from '../../components/common/SearchFilterBar';
import './AssetList.less';

const { Title, Text, Paragraph } = Typography;

const AssetList: React.FC = () => {
  const { token } = theme.useToken();
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
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // 统计数据
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    totalArea: 0,
    averageArea: 0,
    occupancyRate: 0,
    totalValue: 0,
    maintenanceCount: 0,
  });

  // 主题颜色配置
  const themeColors = {
    primary: token.colorPrimary,
    primaryBg: token.colorPrimaryBg,
    success: token.colorSuccess,
    warning: token.colorWarning,
    error: token.colorError,
    info: token.colorInfo,
    bgContainer: token.colorBgContainer,
    bgLayout: token.colorBgLayout,
    textPrimary: token.colorText,
    textSecondary: token.colorTextSecondary,
    border: token.colorBorder,
  };

  // 搜索过滤字段配置
  const filterFields: FilterField[] = [
    {
      key: 'assetName',
      label: '资产名称',
      type: 'search',
      placeholder: '搜索资产名称...',
    },
    {
      key: 'assetType',
      label: '资产类型',
      type: 'select',
      options: [
        { label: '🏢 办公楼', value: 'office' },
        { label: '🏬 商业楼', value: 'commercial' },
        { label: '🏠 住宅', value: 'residential' },
        { label: '🏭 工业', value: 'industrial' },
        { label: '🏢 综合楼', value: 'mixed' },
      ],
    },
    {
      key: 'status',
      label: '运营状态',
      type: 'select',
      options: [
        { label: '✅ 正常运营', value: 'normal' },
        { label: '⚠️ 维护中', value: 'maintenance' },
        { label: '❌ 暂停使用', value: 'disabled' },
      ],
    },
  ];

  // 快速操作菜单
  const moreActions = [
    {
      key: 'export',
      label: '导出数据',
      icon: <ExportOutlined />,
      onClick: () => {
        notification.info({
          message: '导出功能',
          description: '数据导出功能正在开发中...',
          placement: 'topRight',
        });
      },
    },
    {
      key: 'import',
      label: '批量导入',
      icon: <BulbOutlined />,
      onClick: () => {
        notification.info({
          message: '导入功能',
          description: '批量导入功能正在开发中...',
          placement: 'topRight',
        });
      },
    },
    {
      key: 'settings',
      label: '表格设置',
      icon: <SettingOutlined />,
      onClick: () => {
        notification.info({
          message: '设置功能',
          description: '表格自定义设置功能正在开发中...',
          placement: 'topRight',
        });
      },
    },
  ];

  // 页面操作配置
  const pageActions = [
    {
      key: 'create',
      title: '新增资产',
      icon: <PlusOutlined />,
      type: 'primary' as const,
      onClick: handleCreate,
    },
  ];

  // 面包屑配置
  const breadcrumb = [
    { title: '资产管理', icon: <EnvironmentOutlined /> },
    { title: '资产列表' },
  ];

  // 获取资产列表
  const fetchAssets = async (showNotification = false) => {
    setLoading(true);
    if (showNotification) setRefreshing(true);
    
    try {
      const response = await assetService.getAssets({
        page,
        pageSize: pageSize,
        ...searchParams,
      });
      console.log('API Response:', response);
      
      const apiData = response.data as any;
      const rawAssets = apiData.list || apiData.items || [];
      
      const transformedAssets = rawAssets.map((item: any) => ({
        id: item.id,
        assetCode: item.asset_code || `AS${String(item.id).padStart(3, '0')}`,
        assetName: item.asset_name || `资产${item.id}`,
        assetType: item.asset_type || 'office',
        totalArea: item.total_area || 0,
        buildArea: item.rentable_area || 0,
        address: item.address || '',
        province: '',
        city: '',
        district: '',
        status: item.status === 'active' ? 'normal' : (item.status || 'normal'),
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      }));
      
      setAssets(transformedAssets);
      setTotal(apiData.total || 0);
      
      // 计算统计数据
      const totalArea = transformedAssets.reduce((sum: number, asset: Asset) => sum + (asset.totalArea || 0), 0);
      const totalValue = transformedAssets.reduce((sum: number, asset: Asset) => sum + (asset.totalArea || 0) * 12000, 0); // 估算价值
      setStatistics({
        totalAssets: transformedAssets.length,
        totalArea,
        averageArea: transformedAssets.length > 0 ? Math.round(totalArea / transformedAssets.length) : 0,
        occupancyRate: 85.5 + Math.random() * 10, // 模拟动态数据
        totalValue,
        maintenanceCount: Math.floor(Math.random() * 5),
      });

      if (showNotification) {
        notification.success({
          message: '数据刷新成功',
          description: `已更新 ${transformedAssets.length} 条资产记录`,
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      message.error('获取资产列表失败');
      
      // 设置模拟数据
      const mockAssets: Asset[] = [
        {
          id: 1,
          assetCode: 'AS001',
          assetName: '创新科技大厦',
          assetType: 'office' as const,
          totalArea: 45000,
          buildArea: 38000,
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          address: '北京市朝阳区建国路88号',
          status: 'normal' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          assetCode: 'AS002',
          assetName: '国际商务中心',
          assetType: 'commercial' as const,
          totalArea: 68000,
          buildArea: 58000,
          province: '上海市',
          city: '上海市',
          district: '浦东新区',
          address: '上海市浦东新区陆家嘴金融街168号',
          status: 'normal' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          assetCode: 'AS003',
          assetName: '智慧产业园区',
          assetType: 'mixed' as const,
          totalArea: 120000,
          buildArea: 95000,
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          address: '深圳市南山区科技园南区',
          status: 'maintenance' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 4,
          assetCode: 'AS004',
          assetName: '滨海新城住宅区',
          assetType: 'residential' as const,
          totalArea: 180000,
          buildArea: 160000,
          province: '天津市',
          city: '天津市',
          district: '滨海新区',
          address: '天津市滨海新区响螺湾商务区',
          status: 'normal' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setAssets(mockAssets);
      setTotal(4);
      
      const totalArea = mockAssets.reduce((sum, asset) => sum + (asset.totalArea || 0), 0);
      const totalValue = totalArea * 12000;
      setStatistics({
        totalAssets: mockAssets.length,
        totalArea,
        averageArea: Math.round(totalArea / mockAssets.length),
        occupancyRate: 91.4 + Math.random() * 5,
        totalValue,
        maintenanceCount: 2,
      });

      if (showNotification) {
        notification.warning({
          message: '使用模拟数据',
          description: '无法连接服务器，已切换到演示模式',
          placement: 'topRight',
        });
      }
    } finally {
      setLoading(false);
      if (showNotification) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchParams]);

  // 处理搜索
  const handleSearch = (values: Record<string, any>) => {
    setSearchParams(values);
    setPage(1);
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({ assetName: '' });
    setPage(1);
  };

  // 处理刷新
  const handleRefresh = () => {
    fetchAssets(true);
  };

  // 处理视图模式切换
  const handleViewModeChange = (mode: 'table' | 'card') => {
    setViewMode(mode);
    notification.info({
      message: '视图切换',
      description: `已切换到${mode === 'table' ? '表格' : '卡片'}视图`,
      placement: 'topRight',
    });
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
  function handleCreate() {
    setEditingAsset(null);
    form.resetFields();
    setModalVisible(true);
  }

  const columns: ColumnsType<Asset> = [
    {
      title: (
        <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
          <BuildOutlined style={{ marginRight: 8 }} />
          资产信息
        </span>
      ),
      key: 'assetInfo',
      width: 320,
      fixed: 'left',
      render: (_, record) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          padding: '8px 0'
        }}>
          <Avatar 
            size={56} 
            icon={<BuildOutlined />}
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.info} 100%)`,
              border: `2px solid ${themeColors.primaryBg}`,
              boxShadow: `0 4px 12px ${themeColors.primary}20`,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 2 }}>
              <Text strong style={{ 
                fontSize: '16px', 
                color: themeColors.textPrimary,
                lineHeight: 1.4
              }}>
                {record.assetName}
              </Text>
            </div>
            <div style={{ marginBottom: 4 }}>
              <Text style={{ 
                fontSize: '12px', 
                fontFamily: 'Monaco, Consolas, monospace',
                color: themeColors.textSecondary,
                background: themeColors.bgLayout,
                padding: '2px 6px',
                borderRadius: 4
              }}>
                {record.assetCode}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EnvironmentOutlined style={{ 
                fontSize: '12px', 
                color: themeColors.warning, 
                marginRight: 4 
              }} />
              <Text 
                style={{ 
                  fontSize: '12px',
                  color: themeColors.textSecondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={record.address}
              >
                {record.address || '暂无地址'}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
          <TrophyOutlined style={{ marginRight: 8 }} />
          资产类型
        </span>
      ),
      dataIndex: 'assetType',
      key: 'assetType',
      width: 140,
      filters: [
        { text: '🏢 办公楼', value: 'office' },
        { text: '🏬 商业楼', value: 'commercial' },
        { text: '🏠 住宅', value: 'residential' },
        { text: '🏭 工业', value: 'industrial' },
        { text: '🏢 综合楼', value: 'mixed' },
      ],
      onFilter: (value, record) => record.assetType === value,
      render: (type: string) => {
        const typeConfig: Record<string, { 
          text: string; 
          color: string; 
          icon: React.ReactNode;
          gradient: string;
          emoji: string;
        }> = {
          'office': { 
            text: '办公楼', 
            color: themeColors.primary, 
            icon: <BuildOutlined />,
            gradient: `linear-gradient(135deg, ${themeColors.primary} 0%, #40a9ff 100%)`,
            emoji: '🏢'
          },
          'commercial': { 
            text: '商业楼', 
            color: themeColors.warning, 
            icon: <HomeOutlined />,
            gradient: `linear-gradient(135deg, ${themeColors.warning} 0%, #ffc53d 100%)`,
            emoji: '🏬'
          },
          'residential': { 
            text: '住宅', 
            color: themeColors.success, 
            icon: <TeamOutlined />,
            gradient: `linear-gradient(135deg, ${themeColors.success} 0%, #73d13d 100%)`,
            emoji: '🏠'
          },
          'industrial': { 
            text: '工业', 
            color: '#722ed1', 
            icon: <SettingOutlined />,
            gradient: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
            emoji: '🏭'
          },
          'mixed': { 
            text: '综合楼', 
            color: themeColors.info, 
            icon: <TrophyOutlined />,
            gradient: `linear-gradient(135deg, ${themeColors.info} 0%, #36cfc9 100%)`,
            emoji: '🌟'
          },
        };
        const config = typeConfig[type] || { 
          text: type, 
          color: '#d9d9d9', 
          icon: <BuildOutlined />,
          gradient: 'linear-gradient(135deg, #d9d9d9 0%, #f0f0f0 100%)',
          emoji: '🏢'
        };
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '18px' }}>{config.emoji}</span>
            <Tag 
              style={{ 
                background: config.gradient,
                border: 'none',
                borderRadius: '12px',
                padding: '4px 12px',
                fontWeight: '600',
                color: 'white',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: `0 2px 8px ${config.color}30`,
                margin: 0
              }}
            >
              {config.icon}
              {config.text}
            </Tag>
          </div>
        );
      },
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
          <FireOutlined style={{ marginRight: 8 }} />
          面积信息
        </span>
      ),
      key: 'areaInfo',
      width: 240,
      render: (_, record) => {
        const utilizationRate = record.totalArea && record.buildArea 
          ? Math.round((record.buildArea / record.totalArea) * 100)
          : 0;
        
        return (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 6
            }}>
              <Text style={{ fontSize: '13px', color: themeColors.textSecondary }}>
                总面积
              </Text>
              <Text strong style={{ 
                fontSize: '15px', 
                color: themeColors.primary,
                fontFamily: 'Roboto, sans-serif'
              }}>
                {record.totalArea ? record.totalArea.toLocaleString() : '-'}
                <span style={{ fontSize: '11px', marginLeft: 2 }}>㎡</span>
              </Text>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 8
            }}>
              <Text style={{ fontSize: '13px', color: themeColors.textSecondary }}>
                建筑面积
              </Text>
              <Text strong style={{ 
                fontSize: '15px', 
                color: themeColors.success,
                fontFamily: 'Roboto, sans-serif'
              }}>
                {record.buildArea ? record.buildArea.toLocaleString() : '-'}
                <span style={{ fontSize: '11px', marginLeft: 2 }}>㎡</span>
              </Text>
            </div>
            
            {record.totalArea && record.buildArea && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 4
                }}>
                  <Text style={{ fontSize: '12px', color: themeColors.textSecondary }}>
                    利用率
                  </Text>
                  <Text style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: utilizationRate > 80 ? themeColors.success : 
                           utilizationRate > 60 ? themeColors.warning : themeColors.error
                  }}>
                    {utilizationRate}%
                  </Text>
                </div>
                <Progress 
                  percent={utilizationRate}
                  size="small"
                  strokeColor={{
                    '0%': utilizationRate > 80 ? themeColors.success : 
                          utilizationRate > 60 ? themeColors.warning : themeColors.error,
                    '100%': utilizationRate > 80 ? '#73d13d' : 
                            utilizationRate > 60 ? '#ffc53d' : '#ff7875'
                  }}
                  trailColor={themeColors.bgLayout}
                  showInfo={false}
                  strokeWidth={6}
                  style={{ marginTop: 2 }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
          <ThunderboltOutlined style={{ marginRight: 8 }} />
          运营状态
        </span>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      filters: [
        { text: '✅ 正常运营', value: 'normal' },
        { text: '⚠️ 维护中', value: 'maintenance' },
        { text: '❌ 暂停使用', value: 'disabled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const statusConfig: Record<string, { 
          text: string; 
          color: string; 
          bgColor: string;
          emoji: string;
          status: 'success' | 'processing' | 'warning' | 'error' | 'default';
        }> = {
          'normal': { 
            text: '正常运营', 
            color: themeColors.success, 
            bgColor: `${themeColors.success}15`,
            emoji: '✅',
            status: 'success' 
          },
          'maintenance': { 
            text: '维护中', 
            color: themeColors.warning, 
            bgColor: `${themeColors.warning}15`,
            emoji: '⚠️',
            status: 'processing' 
          },
          'disabled': { 
            text: '暂停使用', 
            color: themeColors.error, 
            bgColor: `${themeColors.error}15`,
            emoji: '❌',
            status: 'error' 
          },
        };
        const config = statusConfig[status] || { 
          text: status, 
          color: '#d9d9d9', 
          bgColor: '#f5f5f5',
          emoji: '❓',
          status: 'default' as const
        };
        
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: '16px',
            background: config.bgColor,
            border: `1px solid ${config.color}30`,
          }}>
            <span style={{ fontSize: '14px' }}>{config.emoji}</span>
            <Badge 
              status={config.status}
              style={{ marginRight: 4 }}
            />
            <Text style={{ 
              fontWeight: '600', 
              fontSize: '13px',
              color: config.color
            }}>
              {config.text}
            </Text>
          </div>
        );
      },
    },
    {
      title: (
        <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          操作
        </span>
      ),
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => {
        const actionMenuItems = [
          {
            key: 'view',
            label: '查看详情',
            icon: <EyeOutlined />,
            onClick: () => {
              notification.info({
                message: '查看资产详情',
                description: `正在查看 ${record.assetName} 的详细信息...`,
                placement: 'topRight',
              });
            }
          },
          {
            key: 'edit',
            label: '编辑资产',
            icon: <EditOutlined />,
            onClick: () => handleEdit(record)
          },
          {
            key: 'duplicate',
            label: '复制资产',
            icon: <StarOutlined />,
            onClick: () => {
              notification.info({
                message: '复制资产',
                description: `正在复制 ${record.assetName}...`,
                placement: 'topRight',
              });
            }
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            label: '删除资产',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.id)
          },
        ];

        return (
          <Space size="small">
            <Tooltip title="查看详情">
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                style={{
                  borderRadius: '8px',
                  background: `${themeColors.info}10`,
                  color: themeColors.info,
                  border: `1px solid ${themeColors.info}30`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = themeColors.info;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${themeColors.info}10`;
                  e.currentTarget.style.color = themeColors.info;
                }}
                onClick={() => {
                  notification.info({
                    message: '查看资产详情',
                    description: `正在查看 ${record.assetName} 的详细信息...`,
                    placement: 'topRight',
                  });
                }}
              />
            </Tooltip>
            
            <Tooltip title="编辑资产">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                size="small"
                style={{
                  borderRadius: '8px',
                  background: `${themeColors.primary}10`,
                  color: themeColors.primary,
                  border: `1px solid ${themeColors.primary}30`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = themeColors.primary;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${themeColors.primary}10`;
                  e.currentTarget.style.color = themeColors.primary;
                }}
              />
            </Tooltip>

            <Dropdown
              menu={{ 
                items: actionMenuItems.map(item => 
                  item.type === 'divider' ? item : {
                    ...item,
                    onClick: () => {
                      if (item.key === 'delete') {
                        Modal.confirm({
                          title: '确定要删除这个资产吗？',
                          content: `资产名称: ${record.assetName}\n资产编码: ${record.assetCode}\n\n删除后无法恢复，请谨慎操作！`,
                          icon: <DeleteOutlined style={{ color: themeColors.error }} />,
                          okText: '确定删除',
                          cancelText: '取消',
                          okButtonProps: { danger: true },
                          onOk: () => item.onClick?.(),
                        });
                      } else {
                        item.onClick?.();
                      }
                    }
                  }
                )
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Tooltip title="更多操作">
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  size="small"
                  style={{
                    borderRadius: '8px',
                    background: `${themeColors.textSecondary}10`,
                    color: themeColors.textSecondary,
                    border: `1px solid ${themeColors.textSecondary}30`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = themeColors.textSecondary;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${themeColors.textSecondary}10`;
                    e.currentTarget.style.color = themeColors.textSecondary;
                  }}
                />
              </Tooltip>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ 
      padding: '24px',
      background: themeColors.bgLayout,
      minHeight: '100vh'
    }}>
      {/* 页面头部 */}
      <div style={{ 
        background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.info} 100%)`,
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          opacity: 0.6
        }} />
        <div style={{ 
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%'
        }} />
        
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <Title level={2} style={{ 
              color: 'white', 
              margin: 0,
              fontSize: '32px',
              fontWeight: 'bold'
            }}>
              🏢 资产管理中心
            </Title>
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '16px',
              marginTop: '8px',
              display: 'block'
            }}>
              智能管理企业资产信息，实时监控资产状态与运营数据
            </Text>
          </div>
          <Space size="middle">
            <Button 
              size="large"
              icon={<ReloadOutlined spin={refreshing} />}
              onClick={handleRefresh}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
            >
              刷新数据
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<PlusOutlined />} 
              onClick={handleCreate}
              style={{
                background: 'white',
                color: themeColors.primary,
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              新增资产
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            background: `linear-gradient(135deg, ${themeColors.primary} 0%, #40a9ff 100%)`,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '80px', opacity: 0.1 }}>
              🏢
            </div>
            <Statistic
              title={
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', fontWeight: '500' }}>
                  资产总数
                </Text>
              }
              value={statistics.totalAssets}
              suffix="个"
              valueStyle={{ 
                color: 'white', 
                fontSize: '32px', 
                fontWeight: 'bold',
                fontFamily: 'Roboto, sans-serif'
              }}
            />
            <div style={{ 
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <RiseOutlined style={{ color: '#73d13d', fontSize: '14px' }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px' }}>
                +2.5% 较上月
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            background: `linear-gradient(135deg, ${themeColors.success} 0%, #73d13d 100%)`,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '80px', opacity: 0.1 }}>
              📏
            </div>
            <Statistic
              title={
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', fontWeight: '500' }}>
                  总面积
                </Text>
              }
              value={statistics.totalArea}
              suffix="㎡"
              valueStyle={{ 
                color: 'white', 
                fontSize: '32px', 
                fontWeight: 'bold',
                fontFamily: 'Roboto, sans-serif'
              }}
            />
            <div style={{ 
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <RiseOutlined style={{ color: '#ffc53d', fontSize: '14px' }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px' }}>
                +1.2% 较上月
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            background: `linear-gradient(135deg, ${themeColors.warning} 0%, #ffc53d 100%)`,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '80px', opacity: 0.1 }}>
              🏆
            </div>
            <Statistic
              title={
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', fontWeight: '500' }}>
                  平均面积
                </Text>
              }
              value={statistics.averageArea}
              suffix="㎡"
              valueStyle={{ 
                color: 'white', 
                fontSize: '32px', 
                fontWeight: 'bold',
                fontFamily: 'Roboto, sans-serif'
              }}
            />
            <div style={{ 
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <RiseOutlined style={{ color: '#73d13d', fontSize: '14px' }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px' }}>
                +0.8% 较上月
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            background: `linear-gradient(135deg, ${themeColors.info} 0%, #36cfc9 100%)`,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '80px', opacity: 0.1 }}>
              📊
            </div>
            <Statistic
              title={
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', fontWeight: '500' }}>
                  出租率
                </Text>
              }
              value={statistics.occupancyRate}
              precision={1}
              suffix="%"
              valueStyle={{ 
                color: 'white', 
                fontSize: '32px', 
                fontWeight: 'bold',
                fontFamily: 'Roboto, sans-serif'
              }}
            />
            <div style={{ 
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <RiseOutlined style={{ color: '#73d13d', fontSize: '14px' }} />
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px' }}>
                +0.3% 较上月
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 搜索过滤栏 */}
      <Card style={{
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        marginBottom: '24px'
      }}>
        <SearchFilterBar
          fields={filterFields}
          values={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />
      </Card>

      {/* 数据表格 */}
      <Card style={{
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '4px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Title level={4} style={{ 
              margin: 0,
              color: themeColors.textPrimary,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <BuildOutlined style={{ color: themeColors.primary }} />
              资产列表
            </Title>
            <Badge 
              count={total} 
              style={{ 
                backgroundColor: themeColors.primary,
                fontSize: '12px',
                height: '20px',
                minWidth: '20px',
                lineHeight: '20px'
              }} 
            />
          </div>
          
          <Space size="middle">
            <Dropdown
              menu={{ 
                items: moreActions.map(action => ({
                  key: action.key,
                  label: action.label,
                  icon: action.icon,
                  onClick: action.onClick
                }))
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button 
                icon={<MoreOutlined />}
                style={{
                  borderRadius: '8px',
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                更多操作
              </Button>
            </Dropdown>
            
            <Segmented
              options={[
                { label: '表格', value: 'table', icon: <BuildOutlined /> },
                { label: '卡片', value: 'card', icon: <TrophyOutlined /> }
              ]}
              value={viewMode}
              onChange={handleViewModeChange}
              style={{ borderRadius: '8px' }}
            />
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={assets}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          size="large"
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
          }
          style={{
            borderRadius: '12px',
            overflow: 'hidden'
          }}
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
            pageSizeOptions: ['10', '20', '50', '100'],
            style: {
              marginTop: '24px',
              padding: '16px 0',
              borderTop: `1px solid ${themeColors.border}`,
              background: themeColors.bgContainer
            }
          }}
        />
      </Card>

      {/* 创建/编辑弹窗 */}
      <Modal
        title={
          <div style={{ 
            textAlign: 'center', 
            padding: '16px 0',
            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.info} 100%)`,
            margin: '-24px -24px 24px -24px',
            borderRadius: '16px 16px 0 0'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: 8,
              filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.2))'
            }}>
              {editingAsset ? '✏️' : '🏢'}
            </div>
            <Title level={3} style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>
              {editingAsset ? '编辑资产信息' : '新增资产信息'}
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px' }}>
              {editingAsset ? '修改现有资产的详细信息' : '添加新的资产到管理系统'}
            </Text>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
        style={{
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ padding: '0 8px' }}
          size="large"
        >
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                name="assetName"
                label={
                  <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
                    🏢 资产名称
                  </span>
                }
                rules={[{ required: true, message: '请输入资产名称' }]}
              >
                <Input 
                  placeholder="请输入资产名称"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assetCode"
                label={
                  <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
                    🏷️ 资产编码
                  </span>
                }
                rules={[{ required: true, message: '请输入资产编码' }]}
              >
                <Input 
                  placeholder="请输入资产编码"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="assetType"
            label={
              <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
                🎯 资产类型
              </span>
            }
            rules={[{ required: true, message: '请选择资产类型' }]}
          >
            <Select 
              placeholder="请选择资产类型"
              style={{ borderRadius: '8px' }}
            >
              <Select.Option value="office">🏢 办公楼</Select.Option>
              <Select.Option value="commercial">🏬 商业楼</Select.Option>
              <Select.Option value="residential">🏠 住宅</Select.Option>
              <Select.Option value="industrial">🏭 工业</Select.Option>
              <Select.Option value="mixed">🌟 综合楼</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label={
              <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
                📍 详细地址
              </span>
            }
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input 
              placeholder="请输入详细地址"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                name="totalArea"
                label={
                  <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
                    📏 总面积 (㎡)
                  </span>
                }
                rules={[{ required: true, message: '请输入总面积' }]}
              >
                <InputNumber
                  placeholder="请输入总面积"
                  min={0}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="buildArea"
                label={
                  <span style={{ fontWeight: 600, color: themeColors.textPrimary }}>
                    🏗️ 建筑面积 (㎡)
                  </span>
                }
                rules={[{ required: true, message: '请输入建筑面积' }]}
              >
                <InputNumber
                  placeholder="请输入建筑面积"
                  min={0}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ 
            marginBottom: 0, 
            marginTop: 32, 
            textAlign: 'center',
            paddingTop: 24,
            borderTop: `1px solid ${themeColors.border}`
          }}>
            <Space size="large">
              <Button 
                size="large" 
                onClick={() => setModalVisible(false)}
                style={{
                  borderRadius: '10px',
                  padding: '0 32px',
                  height: '44px',
                  fontSize: '16px'
                }}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                size="large" 
                htmlType="submit"
                style={{
                  borderRadius: '10px',
                  padding: '0 32px',
                  height: '44px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.info} 100%)`,
                  border: 'none',
                  boxShadow: `0 4px 16px ${themeColors.primary}40`
                }}
              >
                {editingAsset ? '✅ 更新资产' : '🎉 创建资产'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 浮动操作按钮 */}
      <FloatButton.Group 
        trigger="hover" 
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<CustomerServiceOutlined />}
        tooltip="快速操作"
      >
        <FloatButton 
          icon={<PlusOutlined />} 
          tooltip="新增资产"
          onClick={handleCreate}
        />
        <FloatButton 
          icon={<ReloadOutlined spin={refreshing} />} 
          tooltip="刷新数据"
          onClick={handleRefresh}
        />
        <FloatButton 
          icon={<QuestionCircleOutlined />} 
          tooltip="帮助中心"
          onClick={() => {
            notification.info({
              message: '帮助中心',
              description: '如需帮助，请联系系统管理员或查看用户手册',
              placement: 'topRight',
            });
          }}
        />
      </FloatButton.Group>
    </div>
  );
};

export default AssetList;