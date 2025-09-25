import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { UserOutlined, SafetyOutlined, KeyOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const SystemManagement: React.FC = () => {
  const navigate = useNavigate();
  
  const modules = [
    {
      key: 'users',
      title: '用户管理',
      description: '管理系统用户信息，包括用户的增删改查操作',
      icon: <UserOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      path: '/system/users'
    },
    {
      key: 'roles',
      title: '角色管理',
      description: '管理系统角色，配置角色权限和用户关联',
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      path: '/system/roles'
    },
    {
      key: 'permissions',
      title: '权限管理',
      description: '管理系统权限，配置菜单、按钮和API权限',
      icon: <KeyOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
      path: '/system/permissions'
    }
  ];
  
  return (
    <div style={{ background: 'transparent' }}>
      {/* 页面标题卡片 */}
      <Card 
        style={{ 
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <SettingOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>系统管理</h1>
          <p style={{ fontSize: '14px', color: '#8c8c8c', margin: 0 }}>管理系统用户、角色和权限配置</p>
        </div>
      </Card>
      
      {/* 功能模块卡片 */}
      <Row gutter={[16, 16]}>
        {modules.map(module => (
          <Col xs={24} sm={12} lg={8} key={module.key}>
            <Card
              hoverable
              style={{
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                border: '1px solid #f0f0f0',
                height: '200px',
                display: 'flex',
                flexDirection: 'column'
              }}
              styles={{
                body: {
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'center',
                  padding: '24px'
                }
              }}
            >
              <div>
                <div style={{ marginBottom: '16px' }}>
                  {module.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {module.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#8c8c8c', margin: '0 0 16px 0' }}>
                  {module.description}
                </p>
              </div>
              <Button 
                type="primary" 
                onClick={() => navigate(module.path)}
                style={{ width: '100%' }}
              >
                进入管理
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SystemManagement;