import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, Form, Upload, message, Row, Col, Statistic, Image, Progress } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  FileOutlined,
  UploadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  FilterOutlined,
  FolderOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

const { Search } = Input;
const { Option } = Select;

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  format: string;
  size: number;
  duration?: number;
  resolution?: string;
  thumbnail: string;
  url: string;
  tags: string[];
  category: string;
  uploader: string;
  uploadTime: string;
  lastUsed?: string;
  usageCount: number;
  description?: string;
  copyright: 'original' | 'authorized' | 'purchased' | 'free';
  status: 'processing' | 'available' | 'archived' | 'deleted';
}

const MediaLibrary: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();

  // 模拟媒资数据
  const mediaData: MediaItem[] = [
    {
      id: '1',
      name: '市政府新闻发布会现场',
      type: 'image',
      format: 'JPG',
      size: 2048576, // 2MB
      resolution: '1920x1080',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=government%20press%20conference%20room%20with%20officials%20and%20journalists&image_size=landscape_4_3',
      url: 'https://example.com/media/gov-press-conference.jpg',
      tags: ['新闻发布会', '政府', '官方'],
      category: '新闻图片',
      uploader: '李记者',
      uploadTime: '2024-01-15 14:30:00',
      lastUsed: '2024-01-15 16:20:00',
      usageCount: 5,
      description: '市政府举行新闻发布会，介绍最新政策措施',
      copyright: 'original',
      status: 'available'
    },
    {
      id: '2',
      name: '科技企业采访视频',
      type: 'video',
      format: 'MP4',
      size: 157286400, // 150MB
      duration: 180, // 3分钟
      resolution: '1920x1080',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20technology%20company%20office%20interview%20setup&image_size=landscape_16_9',
      url: 'https://example.com/media/tech-interview.mp4',
      tags: ['科技', '企业', '采访'],
      category: '采访视频',
      uploader: '王记者',
      uploadTime: '2024-01-14 10:15:00',
      lastUsed: '2024-01-14 18:45:00',
      usageCount: 3,
      description: '对本地知名科技企业CEO的专访',
      copyright: 'original',
      status: 'available'
    },
    {
      id: '3',
      name: '背景音乐-轻快节奏',
      type: 'audio',
      format: 'MP3',
      size: 5242880, // 5MB
      duration: 120, // 2分钟
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=music%20waveform%20visualization%20colorful%20audio%20spectrum&image_size=square',
      url: 'https://example.com/media/background-music.mp3',
      tags: ['背景音乐', '轻快', '节奏'],
      category: '音频素材',
      uploader: '音频编辑',
      uploadTime: '2024-01-13 09:20:00',
      lastUsed: '2024-01-15 11:30:00',
      usageCount: 12,
      description: '适合新闻节目使用的轻快背景音乐',
      copyright: 'purchased',
      status: 'available'
    },
    {
      id: '4',
      name: '活动策划方案文档',
      type: 'document',
      format: 'PDF',
      size: 1048576, // 1MB
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=document%20file%20icon%20with%20text%20and%20charts&image_size=square',
      url: 'https://example.com/media/event-plan.pdf',
      tags: ['活动', '策划', '方案'],
      category: '文档资料',
      uploader: '策划部',
      uploadTime: '2024-01-12 16:45:00',
      lastUsed: '2024-01-13 14:20:00',
      usageCount: 8,
      description: '春节特别活动的详细策划方案',
      copyright: 'original',
      status: 'available'
    },
    {
      id: '5',
      name: '城市夜景航拍',
      type: 'video',
      format: 'MP4',
      size: 524288000, // 500MB
      duration: 300, // 5分钟
      resolution: '4K',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20city%20skyline%20at%20night%20with%20lights%20aerial%20view&image_size=landscape_16_9',
      url: 'https://example.com/media/city-night-aerial.mp4',
      tags: ['航拍', '夜景', '城市'],
      category: '风景视频',
      uploader: '航拍团队',
      uploadTime: '2024-01-11 20:30:00',
      lastUsed: '2024-01-14 09:15:00',
      usageCount: 7,
      description: '城市夜景航拍素材，4K高清',
      copyright: 'original',
      status: 'available'
    },
    {
      id: '6',
      name: '学校食堂现场照片',
      type: 'image',
      format: 'JPG',
      size: 3145728, // 3MB
      resolution: '2048x1536',
      thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=school%20cafeteria%20dining%20hall%20with%20students%20eating&image_size=landscape_4_3',
      url: 'https://example.com/media/school-cafeteria.jpg',
      tags: ['学校', '食堂', '现场'],
      category: '新闻图片',
      uploader: '赵记者',
      uploadTime: '2024-01-10 12:00:00',
      usageCount: 2,
      description: '学校食堂调查时拍摄的现场照片',
      copyright: 'original',
      status: 'archived'
    }
  ];

  // 获取统计数据
  const getStatistics = () => {
    const total = mediaData.length;
    const images = mediaData.filter(item => item.type === 'image').length;
    const videos = mediaData.filter(item => item.type === 'video').length;
    const audios = mediaData.filter(item => item.type === 'audio').length;
    const documents = mediaData.filter(item => item.type === 'document').length;
    const totalSize = mediaData.reduce((sum, item) => sum + item.size, 0);
    
    return { total, images, videos, audios, documents, totalSize };
  };

  const statistics = getStatistics();

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    const iconMap = {
      'image': <PictureOutlined style={{ color: '#52c41a' }} />,
      'video': <VideoCameraOutlined style={{ color: '#1890ff' }} />,
      'audio': <SoundOutlined style={{ color: '#722ed1' }} />,
      'document': <FileOutlined style={{ color: '#fa8c16' }} />
    };
    return iconMap[type as keyof typeof iconMap];
  };

  // 获取版权标签
  const getCopyrightTag = (copyright: string) => {
    const copyrightMap = {
      'original': { color: 'green', text: '原创' },
      'authorized': { color: 'blue', text: '授权' },
      'purchased': { color: 'orange', text: '购买' },
      'free': { color: 'default', text: '免费' }
    };
    const config = copyrightMap[copyright as keyof typeof copyrightMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      'processing': { color: 'processing', text: '处理中' },
      'available': { color: 'success', text: '可用' },
      'archived': { color: 'default', text: '已归档' },
      'deleted': { color: 'error', text: '已删除' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<MediaItem> = [
    {
      title: '预览',
      key: 'thumbnail',
      width: 80,
      render: (_, record: MediaItem) => (
        <div 
          style={{ cursor: 'pointer' }}
          onClick={() => handlePreview(record)}
        >
          {record.type === 'image' || record.type === 'video' ? (
            <Image
              width={60}
              height={40}
              src={record.thumbnail}
              preview={false}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
            />
          ) : (
            <div style={{ 
              width: '60px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#f5f5f5',
              borderRadius: '4px'
            }}>
              {getTypeIcon(record.type)}
            </div>
          )}
        </div>
      )
    },
    {
      title: '文件信息',
      key: 'info',
      width: 200,
      render: (_, record: MediaItem) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {record.name}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.format} • {formatFileSize(record.size)}
            {record.duration && ` • ${formatDuration(record.duration)}`}
            {record.resolution && ` • ${record.resolution}`}
          </div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getTypeIcon(type)}
          <span style={{ marginLeft: '4px', fontSize: '12px' }}>
            {type === 'image' ? '图片' : 
             type === 'video' ? '视频' :
             type === 'audio' ? '音频' : '文档'}
          </span>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      )
    },
    {
      title: '版权',
      dataIndex: 'copyright',
      key: 'copyright',
      width: 80,
      render: (copyright: string) => getCopyrightTag(copyright)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '上传者',
      dataIndex: 'uploader',
      key: 'uploader',
      width: 100,
      render: (uploader: string) => (
        <div style={{ fontSize: '12px' }}>{uploader}</div>
      )
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 120,
      render: (time: string) => (
        <div style={{ fontSize: '12px' }}>
          {time.split(' ')[0]}<br/>
          {time.split(' ')[1]}
        </div>
      )
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 80,
      render: (count: number) => (
        <div style={{ textAlign: 'center', fontSize: '12px' }}>{count}</div>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
      render: (tags: string[], record: MediaItem) => (
        <div>
          {tags.slice(0, 2).map((tag, index) => (
            <Tag key={`media-${record.id}-tag-${index}`} style={{ marginBottom: '2px' }}>
              {tag}
            </Tag>
          ))}
          {tags.length > 2 && (
            <Tag style={{ marginBottom: '2px' }}>+{tags.length - 2}</Tag>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record: MediaItem) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<ShareAltOutlined />}
            onClick={() => handleShare(record)}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      )
    }
  ];

  // 过滤数据
  const getFilteredData = () => {
    return mediaData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())) ||
                         item.category.toLowerCase().includes(searchText.toLowerCase());
      const matchType = filterType === 'all' || item.type === filterType;
      const matchCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchSearch && matchType && matchCategory;
    });
  };

  // 处理预览
  const handlePreview = (record: MediaItem) => {
    setPreviewMedia(record);
    setPreviewVisible(true);
  };

  // 处理下载
  const handleDownload = (record: MediaItem) => {
    message.success(`开始下载 ${record.name}`);
    // 这里可以实现实际的下载逻辑
  };

  // 处理分享
  const handleShare = (record: MediaItem) => {
    Modal.info({
      title: '分享媒资',
      content: (
        <div>
          <p>文件名：{record.name}</p>
          <p>分享链接：{record.url}</p>
          <p>有效期：7天</p>
        </div>
      )
    });
  };

  // 处理编辑
  const handleEdit = (record: MediaItem) => {
    setEditingMedia(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个媒资文件吗？删除后无法恢复。',
      onOk: () => {
        message.success('媒资删除成功');
      }
    });
  };

  // 处理上传
  const handleUpload = () => {
    uploadForm.resetFields();
    setUploadModalVisible(true);
  };

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    beforeUpload: (file) => {
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('文件大小不能超过 100MB!');
      }
      return isLt100M;
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单数据:', values);
      message.success('媒资信息更新成功');
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const filteredData = getFilteredData();

  return (
    <div style={{ background: 'transparent' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总文件数"
              value={statistics.total}
              prefix={<FolderOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="图片"
              value={statistics.images}
              prefix={<PictureOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="视频"
              value={statistics.videos}
              prefix={<VideoCameraOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="音频"
              value={statistics.audios}
              prefix={<SoundOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="文档"
              value={statistics.documents}
              prefix={<FileOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="总大小"
              value={formatFileSize(statistics.totalSize)}
              prefix={<FolderOutlined style={{ color: '#13c2c2' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card 
        title={
          <Space>
            <PictureOutlined style={{ color: '#1890ff' }} />
            <span>媒资库管理</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<UploadOutlined />} onClick={handleUpload}>
            上传文件
          </Button>
        }
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0'
        }}
      >
        {/* 搜索和筛选 */}
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="搜索文件名、标签或分类..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col>
              <Space>
                <Select
                  value={filterType}
                  onChange={setFilterType}
                  style={{ width: 120 }}
                  placeholder="类型筛选"
                >
                  <Option value="all">全部类型</Option>
                  <Option value="image">图片</Option>
                  <Option value="video">视频</Option>
                  <Option value="audio">音频</Option>
                  <Option value="document">文档</Option>
                </Select>
                <Select
                  value={filterCategory}
                  onChange={setFilterCategory}
                  style={{ width: 120 }}
                  placeholder="分类筛选"
                >
                  <Option value="all">全部分类</Option>
                  <Option value="新闻图片">新闻图片</Option>
                  <Option value="采访视频">采访视频</Option>
                  <Option value="音频素材">音频素材</Option>
                  <Option value="文档资料">文档资料</Option>
                  <Option value="风景视频">风景视频</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑媒资信息"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="文件名"
            rules={[{ required: true, message: '请输入文件名' }]}
          >
            <Input placeholder="请输入文件名" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入文件描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select placeholder="请选择分类">
                  <Option value="新闻图片">新闻图片</Option>
                  <Option value="采访视频">采访视频</Option>
                  <Option value="音频素材">音频素材</Option>
                  <Option value="文档资料">文档资料</Option>
                  <Option value="风景视频">风景视频</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="copyright"
                label="版权"
                rules={[{ required: true, message: '请选择版权类型' }]}
              >
                <Select placeholder="请选择版权类型">
                  <Option value="original">原创</Option>
                  <Option value="authorized">授权</Option>
                  <Option value="purchased">购买</Option>
                  <Option value="free">免费</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="请输入标签，按回车添加"
              style={{ width: '100%' }}
            >
              <Option value="新闻">新闻</Option>
              <Option value="采访">采访</Option>
              <Option value="活动">活动</Option>
              <Option value="风景">风景</Option>
              <Option value="人物">人物</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 上传弹窗 */}
      <Modal
        title="上传媒资文件"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={uploadForm}
          layout="vertical"
        >
          <Form.Item
            name="files"
            label="选择文件"
          >
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。支持图片、视频、音频、文档等格式，单个文件不超过100MB。
              </p>
            </Upload.Dragger>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select placeholder="请选择分类">
                  <Option value="新闻图片">新闻图片</Option>
                  <Option value="采访视频">采访视频</Option>
                  <Option value="音频素材">音频素材</Option>
                  <Option value="文档资料">文档资料</Option>
                  <Option value="风景视频">风景视频</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="copyright"
                label="版权"
                rules={[{ required: true, message: '请选择版权类型' }]}
              >
                <Select placeholder="请选择版权类型">
                  <Option value="original">原创</Option>
                  <Option value="authorized">授权</Option>
                  <Option value="purchased">购买</Option>
                  <Option value="free">免费</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="请输入标签，按回车添加"
              style={{ width: '100%' }}
            >
              <Option value="新闻">新闻</Option>
              <Option value="采访">采访</Option>
              <Option value="活动">活动</Option>
              <Option value="风景">风景</Option>
              <Option value="人物">人物</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预览弹窗 */}
      <Modal
        title={previewMedia?.name}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={() => previewMedia && handleDownload(previewMedia)}>
            下载
          </Button>,
          <Button key="share" icon={<ShareAltOutlined />} onClick={() => previewMedia && handleShare(previewMedia)}>
            分享
          </Button>
        ]}
        width={800}
      >
        {previewMedia && (
          <div style={{ textAlign: 'center' }}>
            {previewMedia.type === 'image' && (
              <Image
                src={previewMedia.thumbnail}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            )}
            {previewMedia.type === 'video' && (
              <video
                src={previewMedia.url}
                controls
                style={{ maxWidth: '100%', maxHeight: '400px' }}
                poster={previewMedia.thumbnail}
              />
            )}
            {previewMedia.type === 'audio' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <SoundOutlined style={{ fontSize: '64px', color: '#722ed1' }} />
                </div>
                <audio src={previewMedia.url} controls style={{ width: '100%' }} />
              </div>
            )}
            {previewMedia.type === 'document' && (
              <div>
                <FileOutlined style={{ fontSize: '64px', color: '#fa8c16', marginBottom: '20px' }} />
                <p>文档预览功能开发中...</p>
              </div>
            )}
            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <p><strong>文件信息：</strong></p>
              <p>格式：{previewMedia.format}</p>
              <p>大小：{formatFileSize(previewMedia.size)}</p>
              {previewMedia.duration && <p>时长：{formatDuration(previewMedia.duration)}</p>}
              {previewMedia.resolution && <p>分辨率：{previewMedia.resolution}</p>}
              <p>上传者：{previewMedia.uploader}</p>
              <p>上传时间：{previewMedia.uploadTime}</p>
              <p>使用次数：{previewMedia.usageCount}</p>
              {previewMedia.description && <p>描述：{previewMedia.description}</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MediaLibrary;