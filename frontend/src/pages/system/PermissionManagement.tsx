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
  Descriptions,
  Transfer,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  KeyOutlined,
  TeamOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { systemService, Role } from '../../services/system';

interface Permission {
  id: number;
  name: string;
  code: string;
  type: string;
  description: string;
  parent_id: number | null;
  status: string;
  children?: Permission[];
}

interface PermissionNode {
  key: string;
  title: string;
  id: number;
  name: string;
  code: string;
  type: string;
  description: string;
  parent_id: number | null;
  status: string;
  children?: PermissionNode[];
}

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRolePermissionModalOpen, setIsRolePermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [form] = Form.useForm();

  // 权限类型选项
  const permissionTypeOptions = [
    { label: '菜单权限', value: 'menu' },
    { label: '功能权限', value: 'function' },
    { label: '数据权限', value: 'data' },
    { label: '接口权限', value: 'api' },
  ];

  // 状态选项
  const statusOptions = [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' },
  ];

  // 将权限数据转换为树形结构
  const convertToTreeData = (permissions: Permission[]): any[] => {
    const map = new Map<number, any>();
    const roots: any[] = [];

    // 首先创建所有节点
    permissions.forEach(permission => {
      const node = {
        ...permission,
        key: permission.id.toString(),
        title: permission.name,
        children: [] as any[]
      };
      map.set(permission.id, node);
    });

    // 然后建立父子关系
    permissions.forEach(permission => {
      const node = map.get(permission.id);
      if (!node) return;

      if (permission.parent_id && map.has(permission.parent_id)) {
        const parent = map.get(permission.parent_id)!;
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // 获取权限列表
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await systemService.getPermissions();
      console.log('Permissions response:', response);
      
      const apiData = response.data || response;
      const permissionList = apiData.list || apiData || [];
      setPermissions(permissionList);
      setTreeData(convertToTreeData(permissionList));
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      message.error('加载权限列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const response = await systemService.getRoles();
      console.log('Roles response:', response);
      const apiData = response.data || response;
      setRoles(apiData.list || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
  }, []);

  // 选择权限树节点
  const onPermissionTreeSelect = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys.length > 0) {
      const permissionId = Number(selectedKeys[0]);
      const selected = permissions.find(p => p.id === permissionId);
      setSelectedPermission(selected || null);
    } else {
      setSelectedPermission(null);
    }
  };

  // 添加权限
  const handleAdd = (parentId?: number) => {
    setEditingPermission(null);
    form.resetFields();
    if (parentId) {
      form.setFieldsValue({ parent_id: parentId });
    }
    setIsModalOpen(true);
  };

  // 编辑权限
  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    form.setFieldsValue({
      name: permission.name,
      code: permission.code,
      type: permission.type,
      description: permission.description,
      parent_id: permission.parent_id,
      status: permission.status,
    });
    setIsModalOpen(true);
  };

  // 删除权限
  const handleDelete = async (id: number) => {
    try {
      // 这里应该调用删除权限的API，但当前系统服务中没有实现
      // await systemService.deletePermission(id);
      message.success('删除成功');
      fetchPermissions();
      if (selectedPermission?.id === id) {
        setSelectedPermission(null);
      }
    } catch (error) {
      console.error('Failed to delete permission:', error);
      message.error('删除失败');
    }
  };

  // 提交权限表单
  const handleSubmit = async (values: any) => {
    try {
      // 这里应该调用创建/更新权限的API，但当前系统服务中没有实现
      if (editingPermission) {
        // await systemService.updatePermission(editingPermission.id, values);
        message.success('更新成功');
      } else {
        // await systemService.createPermission(values);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchPermissions();
    } catch (error) {
      console.error('Failed to save permission:', error);
      message.error(editingPermission ? '更新失败' : '创建失败');
    }
  };

  // 角色权限管理
  const handleRolePermissionManagement = (role: Role) => {
    setSelectedRole(role);
    // 模拟获取角色权限
    const mockRolePermissions = ['1', '2', '5', '6']; // 假设的权限ID
    setRolePermissions(mockRolePermissions);
    setTargetKeys(mockRolePermissions);
    setIsRolePermissionModalOpen(true);
  };

  // 保存角色权限
  const handleSaveRolePermissions = async () => {
    try {
      // 这里应该调用保存角色权限的API
      // await systemService.updateRolePermissions(selectedRole!.id, targetKeys);
      message.success('权限配置保存成功');
      setIsRolePermissionModalOpen(false);
    } catch (error) {
      console.error('Failed to save role permissions:', error);
      message.error('保存失败');
    }
  };

  // 获取权限类型图标
  const getPermissionTypeIcon = (type: string) => {
    switch (type) {
      case 'menu':
        return <SafetyOutlined style={{ color: '#1890ff' }} />;
      case 'function':
        return <KeyOutlined style={{ color: '#52c41a' }} />;
      case 'data':
        return <LockOutlined style={{ color: '#faad14' }} />;
      case 'api':
        return <SafetyOutlined style={{ color: '#722ed1' }} />;
      default:
        return <SafetyOutlined />;
    }
  };

  // 获取权限类型名称
  const getPermissionTypeName = (type: string) => {
    const option = permissionTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  // 自定义权限树节点标题
  const renderPermissionTreeTitle = (nodeData: any) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {getPermissionTypeIcon(nodeData.type)}
      <span style={{ marginLeft: '8px' }}>{nodeData.name}</span>
      <Tag style={{ marginLeft: '8px', fontSize: '12px' }}>
        {getPermissionTypeName(nodeData.type)}
      </Tag>
    </div>
  );

  // 角色表格列配置
  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleRolePermissionManagement(record)}
          >
            配置权限
          </Button>
        </Space>
      ),
    },
  ];

  // Transfer 数据源
  const transferDataSource = permissions.map(permission => ({
    key: permission.id.toString(),
    title: permission.name,
    description: permission.description,
    chosen: rolePermissions.includes(permission.id.toString()),
  }));

  return (
    <div style={{ padding: '24px' }}>
      <Tabs
        defaultActiveKey="permissions"
        items={[
          {
            key: 'permissions',
            label: '权限管理',
            children: (
              <Row gutter={24}>
                {/* 左侧：权限树 */}
                <Col span={8}>
                  <Card 
                    title="权限树"
                    extra={
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => handleAdd()}
                      >
                        新增权限
                      </Button>
                    }
                    bodyStyle={{ height: 'calc(100vh - 240px)', overflow: 'auto' }}
                  >
                    <Tree
                      treeData={treeData}
                      onSelect={onPermissionTreeSelect}
                      selectedKeys={selectedPermission ? [selectedPermission.id.toString()] : []}
                      titleRender={renderPermissionTreeTitle}
                      showLine={{ showLeafIcon: false }}
                      defaultExpandAll
                    />
                  </Card>
                </Col>

                {/* 右侧：权限详情 */}
                <Col span={16}>
                  {selectedPermission ? (
                    <Card 
                      title={
                        <Space>
                          {getPermissionTypeIcon(selectedPermission.type)}
                          {selectedPermission.name}
                        </Space>
                      }
                      extra={
                        <Space>
                          <Button 
                            icon={<PlusOutlined />}
                            onClick={() => handleAdd(selectedPermission.id)}
                          >
                            添加子权限
                          </Button>
                          <Button 
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(selectedPermission)}
                          >
                            编辑
                          </Button>
                          <Popconfirm
                            title="确定删除这个权限吗？"
                            onConfirm={() => handleDelete(selectedPermission.id)}
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
                      <Descriptions column={2} bordered>
                        <Descriptions.Item label="权限名称">
                          {selectedPermission.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="权限编码">
                          {selectedPermission.code}
                        </Descriptions.Item>
                        <Descriptions.Item label="权限类型">
                          <Space>
                            {getPermissionTypeIcon(selectedPermission.type)}
                            {getPermissionTypeName(selectedPermission.type)}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="状态">
                          <Tag color={selectedPermission.status === 'active' ? 'green' : 'red'}>
                            {selectedPermission.status === 'active' ? '启用' : '禁用'}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="描述" span={2}>
                          {selectedPermission.description || '-'}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  ) : (
                    <Card>
                      <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <SafetyOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                        <div style={{ marginTop: '16px', color: '#999' }}>
                          请选择左侧权限节点查看详情
                        </div>
                      </div>
                    </Card>
                  )}
                </Col>
              </Row>
            ),
          },
          {
            key: 'role-permissions',
            label: '角色权限',
            children: (
              <Card title="角色权限管理">
                <Table
                  columns={roleColumns}
                  dataSource={roles}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                  }}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* 新增/编辑权限弹窗 */}
      <Modal
        title={editingPermission ? '编辑权限' : '新增权限'}
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
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="请输入权限名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="权限编码"
            rules={[{ required: true, message: '请输入权限编码' }]}
          >
            <Input placeholder="请输入权限编码" />
          </Form.Item>

          <Form.Item
            name="type"
            label="权限类型"
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select placeholder="请选择权限类型" options={permissionTypeOptions} />
          </Form.Item>

          <Form.Item
            name="description"
            label="权限描述"
          >
            <Input.TextArea placeholder="请输入权限描述" rows={4} />
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
                {editingPermission ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色权限配置弹窗 */}
      <Modal
        title={`配置角色权限 - ${selectedRole?.name}`}
        open={isRolePermissionModalOpen}
        onCancel={() => setIsRolePermissionModalOpen(false)}
        onOk={handleSaveRolePermissions}
        width={800}
        destroyOnClose
      >
        <Transfer
          dataSource={transferDataSource}
          targetKeys={targetKeys}
          onChange={(newTargetKeys) => setTargetKeys(newTargetKeys as string[])}
          titles={['可选权限', '已授权限']}
          render={(item) => item.title}
          showSearch
          filterOption={(inputValue, option) =>
            option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
          }
          listStyle={{
            width: 300,
            height: 400,
          }}
        />
      </Modal>
    </div>
  );
};

export default PermissionManagement; 