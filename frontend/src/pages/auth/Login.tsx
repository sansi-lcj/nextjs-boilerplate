import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { login } from '../../store/slices/authSlice';
import { LoginRequest } from '../../types/user';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [particles, setParticles] = useState<number[]>([]);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // 生成粒子效果
  useEffect(() => {
    const particleArray = Array.from({ length: 50 }, (_, i) => i);
    setParticles(particleArray);
  }, []);
  
  const onFinish = async (values: LoginRequest) => {
    try {
      await dispatch(login(values)).unwrap();
      setLoginSuccess(true);
      message.success('登录成功');
      
      // 延迟跳转以显示成功动画
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (error: any) {
      message.error(error.message || '登录失败');
    }
  };

  // 生成随机粒子位置和延迟
  const getParticleStyle = (index: number) => {
    return {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${8 + Math.random() * 4}s`
    };
  };
  
  return (
    <div className="login-container">
      {/* 粒子背景 */}
      <div className="particles">
        {particles.map(index => (
          <div
            key={index}
            className="particle"
            style={getParticleStyle(index)}
          />
        ))}
      </div>

      <Card className="login-card" title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <RocketOutlined style={{ fontSize: '28px', color: '#00d9ff' }} />
          <span>楼宇资产管理系统</span>
        </div>
      }>
        <Form
          name="login"
          className="login-form"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
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
              className={`login-button ${loginSuccess ? 'login-success' : ''}`}
              block
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>

          <div className="forgot-password">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              message.info('请联系系统管理员重置密码');
            }}>
              忘记密码？
            </a>
          </div>
        </Form>
      </Card>

      {/* 版本信息 */}
      <div className="version-info">
        <div>楼宇资产管理平台 v2.0.0</div>
        <div style={{ marginTop: '4px', fontSize: '10px', opacity: 0.7 }}>
          Powered by React + Go + AI Technology
        </div>
      </div>

      {/* 技术指标显示 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(30, 36, 66, 0.8)',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(0, 217, 255, 0.3)',
        color: '#b8c5d1',
        fontSize: '12px',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
        fontFamily: 'monospace'
      }}>
        <div>系统状态: <span style={{ color: '#00ff88' }}>在线</span></div>
        <div>服务器: <span style={{ color: '#00d9ff' }}>正常</span></div>
        <div>延迟: <span style={{ color: '#00d9ff' }}>12ms</span></div>
      </div>

      {/* 装饰性代码流 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(30, 36, 66, 0.8)',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(0, 217, 255, 0.3)',
        color: '#6b7280',
        fontSize: '10px',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
        fontFamily: 'monospace',
        lineHeight: 1.4,
        maxWidth: '200px'
      }}>
        <div style={{ color: '#00d9ff', marginBottom: '4px' }}>// System Initialize</div>
        <div>auth.status = <span style={{ color: '#00ff88' }}>READY</span></div>
        <div>db.connection = <span style={{ color: '#00ff88' }}>ACTIVE</span></div>
        <div>api.server = <span style={{ color: '#00ff88' }}>RUNNING</span></div>
      </div>
    </div>
  );
};

export default Login;