import React, { useEffect, useState } from 'react';
import {
  Card,
  Tree,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Table,
  Tag,
  Popconfirm,
  TreeSelect,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  BankOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { systemService, Organization } from '../../services/system';

interface OrganizationNode extends Organization {
  key: string;
  title: string;
  children?: OrganizationNode[];
}

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [treeData, setTreeData] = useState<OrganizationNode[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [form] = Form.useForm();

  // 组织类型选项
  const orgTypeOptions = [
    { label: '集团公司', value: 'group' },
    { label: '分公司', value: 'branch' },
    { label: '部门', value: 'department' },
    { label: '小组', value: 'team' },
  ];

  // 状态选项
  const statusOptions = [
    { label: '正常', value: 'active' },
    { label: '禁用', value: 'inactive' },
  ];

  // 将平铺的组织数据转换为树形结构
  const convertToTreeData = (organizations: Organization[]): OrganizationNode[] => {
    const map = new Map<number, OrganizationNode>();
    const roots: OrganizationNode[] = [];

    // 首先创建所有节点
    organizations.forEach(org => {
      const node: OrganizationNode = {
        ...org,
        key: org.id.toString(),
        title: org.name,
        children: [],
      };
      map.set(org.id, node);
    });

    // 然后建立父子关系
    organizations.forEach(org => {
      const node = map.get(org.id);
      if (!node) return;

      if (org.parent_id && map.has(org.parent_id)) {
        const parent = map.get(org.parent_id)!;
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // 获取组织列表
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await systemService.getOrganizations();
      console.log('Organizations response:', response);
      
      const apiData = response.data || response;
      const orgList = apiData.list || apiData || [];
      setOrganizations(orgList);
      setTreeData(convertToTreeData(orgList));
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      message.error('加载组织列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // 选择树节点
  const onTreeSelect = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys.length > 0) {
      const orgId = Number(selectedKeys[0]);
      const selected = organizations.find(org => org.id === orgId);
      setSelectedOrg(selected || null);
    } else {
      setSelectedOrg(null);
    }
  };

  // 添加组织
  const handleAdd = (parentId?: number) => {
    setEditingOrg(null);
    form.resetFields();
    if (parentId) {
      form.setFieldsValue({ parent_id: parentId });
    }
    setIsModalOpen(true);
  };

  // 编辑组织
  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    form.setFieldsValue({
      name: org.name,
      code: org.code,
      type: org.type,
      parent_id: org.parent_id,
      status: org.status,
    });
    setIsModalOpen(true);
  };

  // 删除组织
  const handleDelete = async (id: number) => {
    try {
      await systemService.deleteOrganization(id);
      message.success('删除成功');
      fetchOrganizations();
      if (selectedOrg?.id === id) {
        setSelectedOrg(null);
      }
    } catch (error) {
      console.error('Failed to delete organization:', error);
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (editingOrg) {
        await systemService.updateOrganization(editingOrg.id, values);
        message.success('更新成功');
      } else {
        await systemService.createOrganization(values);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchOrganizations();
    } catch (error) {
      console.error('Failed to save organization:', error);
      message.error(editingOrg ? '更新失败' : '创建失败');
    }
  };

  // 获取组织类型图标
  const getOrgTypeIcon = (type: string) => {
    switch (type) {
      case 'group':
        return <BankOutlined style={{ color: '#1890ff' }} />;
      case 'branch':
        return <TeamOutlined style={{ color: '#52c41a' }} />;
      case 'department':
        return <UsergroupAddOutlined style={{ color: '#faad14' }} />;
      case 'team':
        return <TeamOutlined style={{ color: '#722ed1' }} />;
      default:
        return <TeamOutlined />;
    }
  };

  // 获取组织类型名称
  const getOrgTypeName = (type: string) => {
    const option = orgTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  // 自定义树节点标题
  const renderTreeTitle = (nodeData: OrganizationNode) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {getOrgTypeIcon(nodeData.type)}
        <span style={{ marginLeft: '8px' }}>{nodeData.name}</span>
        <Tag style={{ marginLeft: '8px', fontSize: '12px' }}>
          {getOrgTypeName(nodeData.type)}
        </Tag>
      </div>
    </div>
  );

  // 子组织列表表格列配置
  const childrenColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Organization) => (
        <Space>
          {getOrgTypeIcon(record.type)}
          {text}
        </Space>
      ),
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{getOrgTypeName(type)}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Organization) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个组织吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 获取子组织
  const getChildrenOrganizations = (parentId: number) => {
    return organizations.filter(org => org.parent_id === parentId);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        {/* 左侧：组织树 */}
        <Col span={8}>
          <Card 
            title="组织架构"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => handleAdd()}
              >
                新增组织
              </Button>
            }
            bodyStyle={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
          >
            <Tree
              treeData={treeData}
              onSelect={onTreeSelect}
              selectedKeys={selectedOrg ? [selectedOrg.id.toString()] : []}
              titleRender={renderTreeTitle}
              showLine={{ showLeafIcon: false }}
              defaultExpandAll
            />
          </Card>
        </Col>

        {/* 右侧：组织详情 */}
        <Col span={16}>
          {selectedOrg ? (
            <Card 
              title={
                <Space>
                  {getOrgTypeIcon(selectedOrg.type)}
                  {selectedOrg.name}
                </Space>
              }
              extra={
                <Space>
                  <Button 
                    icon={<PlusOutlined />}
                    onClick={() => handleAdd(selectedOrg.id)}
                  >
                    添加子组织
                  </Button>
                  <Button 
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(selectedOrg)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定删除这个组织吗？"
                    onConfirm={() => handleDelete(selectedOrg.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              }
            >
              {/* 组织基本信息 */}
              <div style={{ marginBottom: '24px' }}>
                <h4>基本信息</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <div><strong>组织名称：</strong>{selectedOrg.name}</div>
                  </Col>
                  <Col span={12}>
                    <div><strong>组织编码：</strong>{selectedOrg.code}</div>
                  </Col>
                  <Col span={12} style={{ marginTop: '8px' }}>
                    <div>
                      <strong>组织类型：</strong>
                      <Tag color="blue" style={{ marginLeft: '8px' }}>
                        {getOrgTypeName(selectedOrg.type)}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12} style={{ marginTop: '8px' }}>
                    <div>
                      <strong>状态：</strong>
                      <Tag color={selectedOrg.status === 'active' ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                        {selectedOrg.status === 'active' ? '正常' : '禁用'}
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* 子组织列表 */}
              <div>
                <h4>子组织</h4>
                <Table
                  columns={childrenColumns}
                  dataSource={getChildrenOrganizations(selectedOrg.id)}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  locale={{ emptyText: '暂无子组织' }}
                />
              </div>
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <TeamOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                <div style={{ marginTop: '16px', color: '#999' }}>
                  请选择左侧组织节点查看详情
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingOrg ? '编辑组织' : '新增组织'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="组织名称"
            rules={[{ required: true, message: '请输入组织名称' }]}
          >
            <Input placeholder="请输入组织名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="组织编码"
            rules={[{ required: true, message: '请输入组织编码' }]}
          >
            <Input placeholder="请输入组织编码" />
          </Form.Item>

          <Form.Item
            name="type"
            label="组织类型"
            rules={[{ required: true, message: '请选择组织类型' }]}
          >
            <Select placeholder="请选择组织类型" options={orgTypeOptions} />
          </Form.Item>

          <Form.Item
            name="parent_id"
            label="上级组织"
          >
            <TreeSelect
              placeholder="请选择上级组织（空表示顶级组织）"
              allowClear
              treeData={treeData}
              fieldNames={{ label: 'title', value: 'key' }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue="active"
          >
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingOrg ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationManagement; 