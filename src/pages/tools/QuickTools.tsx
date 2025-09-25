import React, { useState } from 'react';
import { Card, Row, Col, Button, Space, Input, Tag, Avatar, Tooltip, Modal, message } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  BulbOutlined,
  BookOutlined,
  PictureOutlined,
  EditOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  SoundOutlined,
  ScissorOutlined,
  CloudDownloadOutlined,
  TranslationOutlined,
  DeleteOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  SearchOutlined,

  StarOutlined,
  StarFilled
} from '@ant-design/icons';

const { Search } = Input;

interface SystemTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  category: 'business' | 'media';
  status: 'active' | 'maintenance' | 'offline';
  favorite: boolean;
  lastUsed?: string;
  usage: number;
}

interface MediaTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'ai' | 'edit' | 'convert';
  status: 'active' | 'maintenance' | 'offline';
  favorite: boolean;
  features: string[];
  usage: number;
}

const QuickTools: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [toolModalVisible, setToolModalVisible] = useState(false);
  const [selectedTool, setSelectedTool] = useState<SystemTool | MediaTool | null>(null);

  // 业务系统入口数据
  const businessSystems: SystemTool[] = [
    {
      id: '1',
      name: '线索库系统',
      description: '新闻线索收集与管理平台，支持多渠道线索录入',
      icon: <BulbOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      url: '/content/clues',
      category: 'business',
      status: 'active',
      favorite: true,
      lastUsed: '2小时前',
      usage: 156
    },
    {
      id: '2',
      name: '选题库系统',
      description: '选题策划与协同编辑平台，支持多人协作',
      icon: <BookOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      url: '/content/topics',
      category: 'business',
      status: 'active',
      favorite: false,
      lastUsed: '4小时前',
      usage: 89
    },
    {
      id: '3',
      name: '媒资库系统',
      description: '多媒体素材管理平台，支持智能标签和检索',
      icon: <PictureOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      url: '/content/media',
      category: 'business',
      status: 'active',
      favorite: true,
      lastUsed: '1小时前',
      usage: 234
    },
    {
      id: '4',
      name: '稿件库系统',
      description: '文字稿件创作与管理平台，支持版本控制',
      icon: <EditOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      url: '/content/articles',
      category: 'business',
      status: 'active',
      favorite: false,
      lastUsed: '6小时前',
      usage: 178
    },
    {
      id: '5',
      name: '电视文稿系统',
      description: '电视节目文稿管理，支持串联单编辑',
      icon: <VideoCameraOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />,
      url: '/content/tv-scripts',
      category: 'business',
      status: 'active',
      favorite: false,
      lastUsed: '1天前',
      usage: 67
    },
    {
      id: '6',
      name: '短视频分发',
      description: '短视频内容发布与多平台分发管理',
      icon: <PlayCircleOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />,
      url: '/content/short-videos',
      category: 'business',
      status: 'active',
      favorite: true,
      lastUsed: '3小时前',
      usage: 145
    },
    {
      id: '7',
      name: '设备租赁系统',
      description: '摄影摄像设备租赁管理平台',
      icon: <SettingOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
      url: '/tools/equipment',
      category: 'business',
      status: 'maintenance',
      favorite: false,
      lastUsed: '2天前',
      usage: 34
    },
    {
      id: '8',
      name: '活动管理系统',
      description: '各类活动策划执行管理平台',
      icon: <CalendarOutlined style={{ fontSize: '32px', color: '#f5222d' }} />,
      url: '/content/activities',
      category: 'business',
      status: 'active',
      favorite: false,
      lastUsed: '5小时前',
      usage: 92
    }
  ];

  // 媒体工具数据
  const mediaTools: MediaTool[] = [
    {
      id: '1',
      name: '智能同期声提取',
      description: 'AI自动提取视频中的同期声音频，支持多种格式',
      icon: <SoundOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      category: 'ai',
      status: 'active',
      favorite: true,
      features: ['AI识别', '批量处理', '高质量输出'],
      usage: 89
    },
    {
      id: '2',
      name: '画幅转换工具',
      description: '智能视频画幅转换，支持16:9、4:3、1:1等多种比例',
      icon: <ScissorOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      category: 'convert',
      status: 'active',
      favorite: false,
      features: ['多比例支持', '智能裁剪', '批量转换'],
      usage: 156
    },
    {
      id: '3',
      name: '素材搬运工具',
      description: '跨平台素材迁移工具，支持批量下载和格式转换',
      icon: <CloudDownloadOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      category: 'convert',
      status: 'active',
      favorite: true,
      features: ['跨平台', '批量下载', '格式转换'],
      usage: 234
    },
    {
      id: '4',
      name: '文转语工具',
      description: 'AI文字转语音工具，支持多种音色和语言',
      icon: <TranslationOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      category: 'ai',
      status: 'active',
      favorite: false,
      features: ['多音色', '多语言', '情感表达'],
      usage: 178
    },
    {
      id: '5',
      name: '去水印工具',
      description: 'AI智能去除图片和视频水印，保持画质清晰',
      icon: <DeleteOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />,
      category: 'ai',
      status: 'active',
      favorite: true,
      features: ['AI智能', '保持画质', '批量处理'],
      usage: 267
    },
    {
      id: '6',
      name: '稿件智能创作',
      description: 'AI辅助新闻稿件创作，提供写作建议和优化',
      icon: <RobotOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />,
      category: 'ai',
      status: 'active',
      favorite: true,
      features: ['AI写作', '智能优化', '多风格'],
      usage: 345
    },
    {
      id: '7',
      name: '短视频智能创作',
      description: 'AI自动生成短视频，支持文字转视频和智能剪辑',
      icon: <ThunderboltOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
      category: 'ai',
      status: 'maintenance',
      favorite: false,
      features: ['文字转视频', '智能剪辑', '自动配音'],
      usage: 123
    }
  ];

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      'active': { color: 'green', text: '正常' },
      'maintenance': { color: 'orange', text: '维护中' },
      'offline': { color: 'red', text: '离线' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取分类标签
  const getCategoryTag = (category: string) => {
    const categoryMap = {
      'business': { color: 'blue', text: '业务系统' },
      'ai': { color: 'purple', text: 'AI工具' },
      'edit': { color: 'green', text: '编辑工具' },
      'convert': { color: 'orange', text: '转换工具' }
    };
    const config = categoryMap[category as keyof typeof categoryMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 处理工具点击
  const handleToolClick = (tool: SystemTool | MediaTool) => {
    if (tool.status === 'offline') {
      message.error('该工具暂时不可用');
      return;
    }
    if (tool.status === 'maintenance') {
      message.warning('该工具正在维护中，功能可能受限');
    }
    
    if ('url' in tool) {
      // 业务系统，跳转到对应页面
      window.open(tool.url, '_blank');
    } else {
      // 媒体工具，显示详情弹窗
      setSelectedTool(tool);
      setToolModalVisible(true);
    }
  };

  // 切换收藏状态
  const toggleFavorite = (toolId: string, category: 'business' | 'media') => {
    message.success('收藏状态已更新');
  };

  // 过滤工具
  const getFilteredTools = () => {
    const allTools = [...businessSystems, ...mediaTools];
    return allTools.filter(tool => {
      const matchSearch = tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = activeCategory === 'all' || 
                           (activeCategory === 'business' && 'url' in tool) ||
                           (activeCategory === 'media' && !('url' in tool));
      return matchSearch && matchCategory;
    });
  };

  const filteredTools = getFilteredTools();
  const favoriteTools = filteredTools.filter(tool => tool.favorite);

  return (
    <div style={{ background: 'transparent' }}>
      {/* 页面标题和搜索 */}
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
              快捷入口
            </h2>
            <p style={{ margin: 0, color: '#8c8c8c' }}>
              快速访问业务系统和媒体工具，提升工作效率
            </p>
          </Col>
          <Col>
            <Space>
              <Search
                placeholder="搜索工具..."
                style={{ width: 250 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Space.Compact>
                <Button 
                  type={activeCategory === 'all' ? 'primary' : 'default'}
                  onClick={() => setActiveCategory('all')}
                >
                  全部
                </Button>
                <Button 
                  type={activeCategory === 'business' ? 'primary' : 'default'}
                  onClick={() => setActiveCategory('business')}
                >
                  业务系统
                </Button>
                <Button 
                  type={activeCategory === 'media' ? 'primary' : 'default'}
                  onClick={() => setActiveCategory('media')}
                >
                  媒体工具
                </Button>
              </Space.Compact>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 收藏工具 */}
      {favoriteTools.length > 0 && (
        <Card 
          title={
            <Space>
              <StarFilled style={{ color: '#faad14' }} />
              <span>我的收藏</span>
            </Space>
          }
          style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            border: '1px solid #f0f0f0',
            marginBottom: '16px'
          }}
        >
          <Row gutter={[16, 16]}>
            {favoriteTools.map((tool) => (
              <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
                <Card
                  hoverable
                  size="small"
                  style={{ cursor: 'pointer', height: '120px' }}
                  onClick={() => handleToolClick(tool)}
                  actions={[
                    <Tooltip title="取消收藏" key="unfavorite">
                      <StarFilled 
                        style={{ color: '#faad14' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id, 'url' in tool ? 'business' : 'media');
                        }}
                      />
                    </Tooltip>
                  ]}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '8px' }}>
                      {tool.icon}
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      {tool.name}
                    </h4>
                    <div style={{ marginBottom: '8px' }}>
                      {getCategoryTag('url' in tool ? 'business' : (tool as MediaTool).category)}
                      {getStatusTag(tool.status)}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* 业务系统入口 */}
      <Card 
        title={
          <Space>
            <AppstoreOutlined style={{ color: '#1890ff' }} />
            <span>业务系统入口</span>
          </Space>
        }
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}
      >
        <Row gutter={[16, 16]}>
          {businessSystems
            .filter(system => 
              activeCategory === 'all' || activeCategory === 'business'
            )
            .filter(system => 
              system.name.toLowerCase().includes(searchText.toLowerCase()) ||
              system.description.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((system) => (
            <Col xs={24} sm={12} md={8} lg={6} key={system.id}>
              <Card
                hoverable
                size="small"
                style={{ cursor: 'pointer', height: '160px' }}
                onClick={() => handleToolClick(system)}
                actions={[
                  <Tooltip title={system.favorite ? '取消收藏' : '添加收藏'} key="favorite">
                    {system.favorite ? 
                      <StarFilled style={{ color: '#faad14' }} /> : 
                      <StarOutlined />
                    }
                  </Tooltip>
                ]}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '12px' }}>
                    {system.icon}
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    {system.name}
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
                    {system.description}
                  </p>
                  <div style={{ marginBottom: '8px' }}>
                    {getCategoryTag('business')}
                    {getStatusTag(system.status)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    使用次数: {system.usage} | 最近使用: {system.lastUsed}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 媒体工具入口 */}
      <Card 
        title={
          <Space>
            <SettingOutlined style={{ color: '#52c41a' }} />
            <span>媒体工具入口</span>
          </Space>
        }
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0'
        }}
      >
        <Row gutter={[16, 16]}>
          {mediaTools
            .filter(tool => 
              activeCategory === 'all' || activeCategory === 'media'
            )
            .filter(tool => 
              tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
              tool.description.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((tool) => (
            <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
              <Card
                hoverable
                size="small"
                style={{ cursor: 'pointer', height: '180px' }}
                onClick={() => handleToolClick(tool)}
                actions={[
                  <Tooltip title={tool.favorite ? '取消收藏' : '添加收藏'} key="favorite">
                    {tool.favorite ? 
                      <StarFilled style={{ color: '#faad14' }} /> : 
                      <StarOutlined />
                    }
                  </Tooltip>
                ]}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '12px' }}>
                    {tool.icon}
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    {tool.name}
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
                    {tool.description}
                  </p>
                  <div style={{ marginBottom: '8px' }}>
                    {getCategoryTag(tool.category)}
                    {getStatusTag(tool.status)}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    {tool.features.slice(0, 2).map((feature, index) => (
                      <Tag key={`${tool.id}-feature-${index}`} style={{ fontSize: '10px' }}>
                        {feature}
                      </Tag>
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    使用次数: {tool.usage}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 工具详情弹窗 */}
      <Modal
        title={selectedTool?.name}
        open={toolModalVisible}
        onCancel={() => setToolModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setToolModalVisible(false)}>
            关闭
          </Button>,
          <Button key="use" type="primary">
            使用工具
          </Button>
        ]}
        width={600}
      >
        {selectedTool && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {selectedTool.icon}
            </div>
            <p style={{ marginBottom: '16px' }}>
              {selectedTool.description}
            </p>
            {'features' in selectedTool && (
              <div>
                <h4>功能特性：</h4>
                <div style={{ marginBottom: '16px' }}>
                  {selectedTool.features.map((feature, index) => (
                    <Tag key={`${selectedTool.id}-modal-feature-${index}`} style={{ marginBottom: '8px' }}>
                      {feature}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            <div>
              <Space>
                {getCategoryTag('url' in selectedTool ? 'business' : (selectedTool as MediaTool).category)}
                {getStatusTag(selectedTool.status)}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuickTools;