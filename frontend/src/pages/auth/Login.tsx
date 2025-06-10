import React from 'react';
import { Form, Input, Button, Card, message, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/slices/authSlice';
import { LoginRequest } from '../../types/user';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loading, login } = useAuthStore();
  
  const onFinish = async (values: LoginRequest) => {
    try {
      await login(values);
      message.success('登录成功');
      navigate('/');
    } catch (error: any) {
      message.error(error.message || '登录失败');
    }
  };
  
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 24
    }}>
      <Card style={{ width: 400, maxWidth: '100%' }}>
        {/* 标题区域 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Space direction="vertical" size="small">
            <RocketOutlined style={{ fontSize: 32 }} />
            <Title level={3}>楼宇资产管理系统</Title>
          </Space>
        </div>

        {/* 登录表单 */}
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
            >
              {loading ? '登录中...' : '登 录'}
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
            <Button 
              type="link" 
              onClick={() => {
                message.info('请联系系统管理员重置密码');
              }}
            >
              忘记密码？
            </Button>
          </Form.Item>
        </Form>

        {/* 版本信息 */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            楼宇资产管理平台 v2.0.0
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 10 }}>
            Powered by Realsee Technology
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;