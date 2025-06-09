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
import { systemService } from '../../services/system';

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  status: string;
  permissions: Array<{
    id: number;
    name: string;
    code: string;
  }>;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const columns = [
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: any[]) => (
        <Tag color="blue">{permissions?.length || 0} 个权限</Tag>
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
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个角色吗？"
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

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await systemService.getRoles();
      console.log('Roles response:', response);
      const apiData = response.data || response;
      setRoles(apiData.list || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      message.error('加载角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await systemService.getPermissions();
      console.log('Permissions response:', response);
      const apiData = response.data || response;
      setPermissions(apiData.list || []);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      code: role.code,
      name: role.name,
      description: role.description,
      status: role.status,
      permission_ids: role.permissions?.map(p => p.id) || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await systemService.deleteRole(id);
      message.success('删除成功');
      fetchRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: values.status,
        permission_ids: values.permission_ids,
      };

      if (editingRole) {
        await systemService.updateRole(editingRole.id, data);
        message.success('更新成功');
      } else {
        await systemService.createRole(data);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error('Failed to save role:', error);
      message.error(editingRole ? '更新失败' : '创建失败');
    }
  };

  return (
    <Card title="角色管理">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索角色名称或编码"
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={fetchRoles}
          enterButton={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增角色
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input disabled={!!editingRole} />
          </Form.Item>

          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="permission_ids"
            label="权限配置"
          >
            <Select mode="multiple" placeholder="选择权限">
              {permissions.map(permission => (
                <Select.Option key={permission.id} value={permission.id}>
                  {permission.name} ({permission.code})
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

export default RoleManagement; 