import React from 'react';
import { Card, Row, Col, Statistic, Button, List, Avatar, Tag, Space } from 'antd';
import { useAppStore } from '../store';
import { 
  FileTextOutlined,
  CheckSquareOutlined,
  PictureOutlined,
  EyeOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  BookOutlined,
  EditOutlined,
  VideoCameraOutlined,
  BarChartOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  ToolOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { statistics, recentActivities, user } = useAppStore();
  
  // 融媒体工作台快捷操作
  const quickActions = [
    {
      title: '线索库',
      description: '新闻线索收集与管理',
      icon: <BulbOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/content/clues'
    },
    {
      title: '选题库',
      description: '选题策划与协同编辑',
      icon: <BookOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      path: '/content/topics'
    },
    {
      title: '稿件库',
      description: '文字稿件创作与管理',
      icon: <EditOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      path: '/content/articles'
    },
    {
      title: '媒资库',
      description: '多媒体素材管理',
      icon: <PictureOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: '/content/media'
    },
    {
      title: '待审任务',
      description: '内容审核与管理',
      icon: <CheckSquareOutlined style={{ fontSize: '24px', color: '#fa541c' }} />,
      path: '/tasks/pending-review'
    },
    {
      title: '数据看板',
      description: '传播效果数据分析',
      icon: <BarChartOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
      path: '/data/dashboard'
    }
  ];
  

  
  const getActionTypeTag = (type: string) => {
    const typeMap = {
      'create': { color: 'blue', text: '创建' },
      'edit': { color: 'orange', text: '编辑' },
      'review': { color: 'purple', text: '审核' },
      'publish': { color: 'green', text: '发布' },
      'upload': { color: 'cyan', text: '上传' }
    };
    const config = typeMap[type as keyof typeof typeMap] || { color: 'default', text: '其他' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };
  
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };
  
  return (
    <div style={{ background: 'transparent' }}>
      {/* 欢迎信息卡片 */}
      <Card 
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}
      >
        <Row align="middle">
          <Col flex="auto">
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>
              欢迎使用融通工作台！
            </h2>
            <p style={{ margin: 0, color: '#8c8c8c' }}>
              欢迎回来，{user?.name}！今天是 {getCurrentDate()}，融媒体平台运行正常
            </p>
          </Col>
          <Col>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                管
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* 数据统计区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={12} sm={8} lg={4}>
          <Card style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            border: '1px solid #f0f0f0'
          }}>
            <Statistic
               title="今日稿件"
               value={statistics.todayArticles}
               prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
             />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            border: '1px solid #f0f0f0'
          }}>
            <Statistic
               title="待审任务"
               value={statistics.pendingReviews}
               valueStyle={{ color: '#faad14' }}
               prefix={<CheckSquareOutlined />}
             />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            border: '1px solid #f0f0f0'
          }}>
            <Statistic
               title="媒资素材"
               value={statistics.mediaAssets}
               prefix={<PictureOutlined style={{ color: '#52c41a' }} />}
             />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            border: '1px solid #f0f0f0'
          }}>
            <Statistic
               title="总浏览量"
               value={statistics.totalViews}
               prefix={<EyeOutlined style={{ color: '#722ed1' }} />}
             />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            border: '1px solid #f0f0f0'
          }}>
            <Statistic
               title="在线用户"
               value={statistics.onlineUsers}
               prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
             />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            border: '1px solid #f0f0f0'
          }}>
            <Statistic
               title="系统状态"
               value={statistics.systemStatus === 'normal' ? '正常' : '异常'}
               valueStyle={{ color: statistics.systemStatus === 'normal' ? '#52c41a' : '#f5222d' }}
               prefix={<CheckCircleOutlined style={{ color: statistics.systemStatus === 'normal' ? '#52c41a' : '#f5222d' }} />}
             />
          </Card>
        </Col>
      </Row>
      
      {/* 功能区域 */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        {/* 快捷操作 */}
        <Col xs={24} lg={12}>
          <Card 
            title="快捷操作"
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0',
              height: '400px'
            }}
            styles={{ body: { height: 'calc(100% - 57px)' } }}
          >
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col span={12} key={`home-stat-${index}`}>
                  <Card 
                    hoverable
                    size="small"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(action.path)}
                  >
                    <Row align="middle">
                      <Col flex="none" style={{ marginRight: '12px' }}>
                        {action.icon}
                      </Col>
                      <Col flex="auto">
                        <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
                          {action.title}
                        </div>
                        <div style={{ color: '#8c8c8c', fontSize: '11px' }}>
                          {action.description}
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        
        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card 
            title="最近活动"
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0',
              height: '400px'
            }}
            styles={{ body: { height: 'calc(100% - 57px)', overflow: 'auto' } }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {item.user.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <span style={{ fontWeight: 'bold' }}>{item.user}</span>
                        {getActionTypeTag(item.type)}
                        <span style={{ color: '#8c8c8c', fontSize: '12px' }}>{item.time}</span>
                      </Space>
                    }
                    description={item.title}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 系统状态区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card 
            title="平台状态"
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>内容发布率</span>
                <Tag color="green">92%</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>审核通过率</span>
                <Tag color="blue">87%</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>用户活跃度</span>
                <Tag color="orange">78%</Tag>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card 
            title="今日数据"
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>新增稿件</span>
                <Tag color="green">+28</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>发布内容</span>
                <Tag color="blue">156</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>互动数量</span>
                <Tag color="purple">1.2K</Tag>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card 
            title="快速链接"
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="link" 
                icon={<VideoCameraOutlined />} 
                onClick={() => navigate('/content/live')}
                style={{ padding: 0, height: 'auto', textAlign: 'left' }}
              >
                直播管理
              </Button>
              <Button 
                type="link" 
                icon={<CalendarOutlined />} 
                onClick={() => navigate('/content/activities')}
                style={{ padding: 0, height: 'auto', textAlign: 'left' }}
              >
                活动管理
              </Button>
              <Button 
                type="link" 
                icon={<ToolOutlined />} 
                onClick={() => navigate('/tools')}
                style={{ padding: 0, height: 'auto', textAlign: 'left' }}
              >
                媒体工具
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;