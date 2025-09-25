import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useAppStore();
  
  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    
    try {
      // 模拟登录请求 (1秒延迟)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 验证测试账号
      if (values.username === 'admin' && values.password === '123456') {
        const userInfo = {
          id: '1',
          name: '管理员',
          role: '系统管理员',
          department: '系统管理部',
          permissions: ['all']
        };
        
        message.success('登录成功！');
        
        // 保存登录状态到localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        
        // 同步更新Zustand store状态
        setUser(userInfo);
        setAuthenticated(true);
        
        // 跳转到首页
        navigate('/');
      } else {
        message.error('用户名或密码错误！');
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        title={
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            管理系统登录
          </div>
        }
      >
        <Form
          name="login"
          initialValues={{ remember: true, username: 'admin', password: '123456' }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>
          
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666'
        }}>
          <div>测试账号信息：</div>
          <div>用户名：admin</div>
          <div>密码：123456</div>
        </div>
      </Card>
    </div>
  );
};

export default Login;