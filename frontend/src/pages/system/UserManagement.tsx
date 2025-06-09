import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  message,
  Tag,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { systemService, User, Role, Organization, CreateUserRequest, UpdateUserRequest } from '../../services/system';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ page: 1, page_size: 10, total: 0 });
  const [form] = Form.useForm();

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '组织',
      dataIndex: 'organization',
      key: 'organization',
      render: (org: any) => org?.name || '-',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: any[]) => (
        <Space>
          {roles?.map((role) => (
            <Tag key={role.id} color="blue">
              {role.name}
            </Tag>
          ))}
        </Space>
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
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个用户吗？"
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await systemService.getUsers({
        page: pagination.page,
        page_size: pagination.page_size,
        keyword: searchText,
      });
      console.log('Users response:', response);
      
      // 正确解析数据结构
      const apiData = response.data || response;
      setUsers(apiData.list || []);
      setPagination(prev => ({
        ...prev,
        total: apiData.total || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

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

  const fetchOrganizations = async () => {
    try {
      const response = await systemService.getOrganizations();
      console.log('Organizations response:', response);
      const apiData = response.data || response;
      setOrganizations(apiData.list || []);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchOrganizations();
  }, [pagination.page, pagination.page_size]);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      name: user.name,
      phone: user.phone,
      email: user.email,
      org_id: user.org_id,
      status: user.status,
      role_ids: user.roles?.map(role => role.id) || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await systemService.deleteUser(id);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        // 更新用户
        const updateData: UpdateUserRequest = {
          name: values.name,
          phone: values.phone,
          email: values.email,
          org_id: values.org_id,
          role_ids: values.role_ids,
          status: values.status,
        };
        await systemService.updateUser(editingUser.id, updateData);
        message.success('更新成功');
      } else {
        // 创建用户
        const createData: CreateUserRequest = {
          username: values.username,
          password: values.password,
          name: values.name,
          phone: values.phone,
          email: values.email,
          org_id: values.org_id,
          role_ids: values.role_ids,
          status: values.status,
        };
        await systemService.createUser(createData);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      message.error(editingUser ? '更新失败' : '创建失败');
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleTableChange = (paginationConfig: any) => {
    setPagination(prev => ({
      ...prev,
      page: paginationConfig.current,
      page_size: paginationConfig.pageSize,
    }));
  };

  return (
    <Card title="用户管理">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索用户名或姓名"
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="org_id"
            label="组织"
            rules={[{ required: true, message: '请选择组织' }]}
          >
            <Select placeholder="选择组织">
              {organizations.map(org => (
                <Select.Option key={org.id} value={org.id}>
                  {org.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="role_ids"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select mode="multiple" placeholder="选择角色">
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManagement; 