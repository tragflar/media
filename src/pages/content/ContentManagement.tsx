import React, { useState } from 'react';
import { Card, Row, Col, Button, Statistic, List, Avatar, Tag, Space, Input, Select } from 'antd';
import {
  BulbOutlined,
  BookOutlined,
  PictureOutlined,
  EditOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  HeartOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 内容模块统计数据
  const contentStats = [
    {
      title: '线索总数',
      value: 1245,
      icon: <BulbOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: '选题进行中',
      value: 89,
      icon: <BookOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: '媒资素材',
      value: 3456,
      icon: <PictureOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1'
    },
    {
      title: '稿件库',
      value: 567,
      icon: <EditOutlined style={{ color: '#fa8c16' }} />,
      color: '#fa8c16'
    }
  ];

  // 内容模块功能入口
  const contentModules = [
    {
      key: 'clues',
      title: '线索库',
      description: '新闻线索收集与管理，支持多渠道线索录入和跟进',
      icon: <BulbOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      path: '/content/clues',
      stats: '1245条线索',
      status: 'active'
    },
    {
      key: 'topics',
      title: '选题库',
      description: '选题策划与协同编辑，支持多人协作完善选题',
      icon: <BookOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      path: '/content/topics',
      stats: '89个选题',
      status: 'active'
    },
    {
      key: 'media',
      title: '媒资库',
      description: '多媒体素材管理，支持图片、视频、音频上传和检索',
      icon: <PictureOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      path: '/content/media',
      stats: '3456个素材',
      status: 'active'
    },
    {
      key: 'articles',
      title: '稿件库',
      description: '文字稿件创作与管理，支持富文本编辑和版本控制',
      icon: <EditOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      path: '/content/articles',
      stats: '567篇稿件',
      status: 'active'
    },
    {
      key: 'tv-scripts',
      title: '电视文稿库',
      description: '电视节目文稿管理，支持串联单和节目脚本编辑',
      icon: <VideoCameraOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />,
      path: '/content/tv-scripts',
      stats: '123个文稿',
      status: 'active'
    },
    {
      key: 'short-videos',
      title: '短视频发布',
      description: '短视频内容发布流程，支持多平台分发和数据统计',
      icon: <PlayCircleOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />,
      path: '/content/short-videos',
      stats: '234个视频',
      status: 'active'
    },
    {
      key: 'live',
      title: '视频直播',
      description: '直播活动管理，支持直播策划、监控和回放管理',
      icon: <VideoCameraOutlined style={{ fontSize: '32px', color: '#f5222d' }} />,
      path: '/content/live',
      stats: '12场直播',
      status: 'active'
    },
    {
      key: 'activities',
      title: '活动管理',
      description: '各类活动策划执行，支持活动方案制定和效果评估',
      icon: <CalendarOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
      path: '/content/activities',
      stats: '45个活动',
      status: 'active'
    },
    {
      key: 'interactive',
      title: '互动功能',
      description: '投票、抽奖、答题等互动形式，提升用户参与度',
      icon: <HeartOutlined style={{ fontSize: '32px', color: '#ff7875' }} />,
      path: '/content/interactive',
      stats: '78个互动',
      status: 'active'
    }
  ];

  // 最近内容动态
  const recentContent = [
    {
      id: '1',
      title: '市政府召开新闻发布会',
      type: '稿件',
      author: '张记者',
      status: '已发布',
      time: '2小时前',
      category: 'news'
    },
    {
      id: '2',
      title: '春节文化活动报道',
      type: '选题',
      author: '李编辑',
      status: '进行中',
      time: '4小时前',
      category: 'topic'
    },
    {
      id: '3',
      title: '城市夜景航拍素材',
      type: '媒资',
      author: '王摄像',
      status: '已入库',
      time: '6小时前',
      category: 'media'
    },
    {
      id: '4',
      title: '新春特别节目',
      type: '直播',
      author: '赵导演',
      status: '预告中',
      time: '8小时前',
      category: 'live'
    }
  ];

  const getStatusTag = (status: string) => {
    const statusMap = {
      '已发布': { color: 'green', text: '已发布' },
      '进行中': { color: 'blue', text: '进行中' },
      '已入库': { color: 'purple', text: '已入库' },
      '预告中': { color: 'orange', text: '预告中' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      'news': <EditOutlined style={{ color: '#1890ff' }} />,
      'topic': <BookOutlined style={{ color: '#52c41a' }} />,
      'media': <PictureOutlined style={{ color: '#722ed1' }} />,
      'live': <VideoCameraOutlined style={{ color: '#f5222d' }} />
    };
    return iconMap[category as keyof typeof iconMap] || <EditOutlined />;
  };

  return (
    <div style={{ background: 'transparent' }}>
      {/* 页面标题和操作区 */}
      <Card 
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>
              内容版块管理
            </h2>
            <p style={{ margin: 0, color: '#8c8c8c' }}>
              统一管理新闻内容生产、活动运营等各类内容资源
            </p>
          </Col>
          <Col>
            <Space>
              <Search
                placeholder="搜索内容..."
                style={{ width: 200 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: 120 }}
              >
                <Option value="all">全部类型</Option>
                <Option value="news">新闻稿件</Option>
                <Option value="topic">选题策划</Option>
                <Option value="media">媒资素材</Option>
                <Option value="live">直播活动</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 内容统计数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        {contentStats.map((stat, index) => (
          <Col xs={12} sm={6} key={`content-stat-${index}`}>
            <Card 
              style={{
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                border: '1px solid #f0f0f0'
              }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 内容模块功能区 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title="功能模块"
            extra={
              <Button type="primary" icon={<PlusOutlined />}>
                新建内容
              </Button>
            }
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0'
            }}
          >
            <Row gutter={[16, 16]}>
              {contentModules.map((module) => (
                <Col xs={24} sm={12} lg={8} key={module.key}>
                  <Card
                    hoverable
                    size="small"
                    style={{ cursor: 'pointer', height: '140px' }}
                    onClick={() => navigate(module.path)}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '12px' }}>
                        {module.icon}
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                        {module.title}
                      </h4>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        color: '#8c8c8c', 
                        fontSize: '12px',
                        height: '36px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {module.description}
                      </p>
                      <Tag color="blue">{module.stats}</Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 最近内容动态 */}
        <Col xs={24} lg={8}>
          <Card 
            title="最近动态"
            extra={
              <Button type="link" icon={<EyeOutlined />} size="small">
                查看全部
              </Button>
            }
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0',
              height: '500px'
            }}
            styles={{ body: { height: 'calc(100% - 57px)', overflow: 'auto' } }}
          >
            <List
              dataSource={recentContent}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={getCategoryIcon(item.category)}
                        style={{ backgroundColor: '#f0f2f5' }}
                      />
                    }
                    title={
                      <div style={{ fontSize: '14px' }}>
                        <span style={{ fontWeight: 'bold' }}>{item.title}</span>
                        <Tag style={{ marginLeft: '8px' }}>{item.type}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '4px' }}>
                          <span style={{ color: '#8c8c8c', fontSize: '12px' }}>作者：{item.author}</span>
                          {getStatusTag(item.status)}
                        </div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                          {item.time}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContentManagement;