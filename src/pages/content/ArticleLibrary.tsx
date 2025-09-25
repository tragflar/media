import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, Form, DatePicker, message, Row, Col, Statistic, Progress, Avatar, Tooltip } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditFilled,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ShareAltOutlined,
  CopyOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface ArticleItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: 'news' | 'feature' | 'opinion' | 'interview' | 'report';
  status: 'draft' | 'review' | 'approved' | 'published' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  author: string;
  editor?: string;
  reviewer?: string;
  wordCount: number;
  createTime: string;
  updateTime: string;
  publishTime?: string;
  deadline?: string;
  tags: string[];
  relatedTopics: string[];
  version: number;
  viewCount: number;
  shareCount: number;
  source?: string;
  location?: string;
}

const ArticleLibrary: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<ArticleItem | null>(null);
  const [form] = Form.useForm();

  // 模拟稿件数据
  const articleData: ArticleItem[] = [
    {
      id: '1',
      title: '市政府召开新闻发布会 介绍最新民生政策',
      content: '今日上午，市政府在新闻发布厅召开新闻发布会，市长张某某出席并介绍了最新的民生政策措施。此次政策涉及教育、医疗、住房等多个民生领域，将惠及全市200万市民...',
      summary: '市政府发布最新民生政策，涉及教育、医疗、住房等领域，惠及200万市民。',
      category: 'news',
      status: 'published',
      priority: 'high',
      author: '李记者',
      editor: '张编辑',
      reviewer: '王主编',
      wordCount: 1200,
      createTime: '2024-01-15 09:30:00',
      updateTime: '2024-01-15 14:20:00',
      publishTime: '2024-01-15 16:00:00',
      deadline: '2024-01-15 18:00:00',
      tags: ['政府', '民生', '政策'],
      relatedTopics: ['城市停车难问题深度调查'],
      version: 3,
      viewCount: 1580,
      shareCount: 89,
      source: '新闻发布会',
      location: '市政府新闻发布厅'
    },
    {
      id: '2',
      title: '本地科技企业获国家科技进步奖 创新成果引关注',
      content: '近日，本地知名科技企业"智慧科技有限公司"凭借其在人工智能领域的突破性研究成果，荣获国家科技进步奖二等奖。该企业自主研发的AI算法在图像识别准确率方面达到了国际先进水平...',
      summary: '本地科技企业获国家科技进步奖，AI算法达到国际先进水平。',
      category: 'feature',
      status: 'approved',
      priority: 'high',
      author: '王记者',
      editor: '李编辑',
      reviewer: '赵主编',
      wordCount: 1500,
      createTime: '2024-01-14 16:45:00',
      updateTime: '2024-01-15 10:30:00',
      deadline: '2024-01-16 12:00:00',
      tags: ['科技', '企业', '获奖', 'AI'],
      relatedTopics: ['本地科技企业发展系列报道'],
      version: 2,
      viewCount: 0,
      shareCount: 0
    },
    {
      id: '3',
      title: '学校食堂食品安全调查：监管需要更严格',
      content: '针对近期家长反映的学校食堂食品安全问题，本报记者深入多所学校进行实地调查。调查发现，部分学校在食品采购、储存、加工等环节确实存在管理不规范的情况...',
      summary: '学校食堂食品安全调查报告，发现管理不规范问题，呼吁加强监管。',
      category: 'report',
      status: 'review',
      priority: 'high',
      author: '赵记者',
      editor: '王编辑',
      wordCount: 2200,
      createTime: '2024-01-13 11:20:00',
      updateTime: '2024-01-15 09:15:00',
      deadline: '2024-01-16 18:00:00',
      tags: ['教育', '食品安全', '调查', '监管'],
      relatedTopics: [],
      version: 4,
      viewCount: 0,
      shareCount: 0,
      location: '多所学校'
    },
    {
      id: '4',
      title: '退休教师义务辅导：传递知识的温暖力量',
      content: '在某某社区的活动室里，每天下午都会传来朗朗的读书声。这里是退休教师张老师的"义务辅导班"，已经坚持了三年时间。张老师今年68岁，退休前是市重点中学的语文老师...',
      summary: '退休教师张老师义务辅导社区学生三年，传递知识与温暖。',
      category: 'feature',
      status: 'draft',
      priority: 'medium',
      author: '刘记者',
      wordCount: 800,
      createTime: '2024-01-12 14:15:00',
      updateTime: '2024-01-12 16:30:00',
      deadline: '2024-01-17 12:00:00',
      tags: ['教育', '正能量', '社区', '志愿'],
      relatedTopics: [],
      version: 1,
      viewCount: 0,
      shareCount: 0,
      location: '某某社区'
    },
    {
      id: '5',
      title: '春节文化活动策划方案',
      content: '为丰富市民春节期间的文化生活，展现传统文化魅力，特制定以下春节文化活动策划方案。活动时间为农历正月初一至十五，地点设在市文化广场及各社区文化中心...',
      summary: '春节文化活动策划方案，时间为正月初一至十五，地点覆盖全市。',
      category: 'opinion',
      status: 'rejected',
      priority: 'low',
      author: '陈编辑',
      editor: '李编辑',
      reviewer: '张主编',
      wordCount: 1000,
      createTime: '2024-01-11 08:30:00',
      updateTime: '2024-01-11 17:45:00',
      tags: ['春节', '文化', '活动', '策划'],
      relatedTopics: ['春节特别节目策划'],
      version: 2,
      viewCount: 0,
      shareCount: 0
    }
  ];

  // 获取统计数据
  const getStatistics = () => {
    const total = articleData.length;
    const draft = articleData.filter(item => item.status === 'draft').length;
    const review = articleData.filter(item => item.status === 'review').length;
    const published = articleData.filter(item => item.status === 'published').length;
    const totalWords = articleData.reduce((sum, item) => sum + item.wordCount, 0);
    const totalViews = articleData.reduce((sum, item) => sum + item.viewCount, 0);
    
    return { total, draft, review, published, totalWords, totalViews };
  };

  const statistics = getStatistics();

  // 获取分类标签
  const getCategoryTag = (category: string) => {
    const categoryMap = {
      'news': { color: 'blue', text: '新闻' },
      'feature': { color: 'green', text: '专题' },
      'opinion': { color: 'orange', text: '评论' },
      'interview': { color: 'purple', text: '访谈' },
      'report': { color: 'red', text: '调查' }
    };
    const config = categoryMap[category as keyof typeof categoryMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取优先级标签
  const getPriorityTag = (priority: string) => {
    const priorityMap = {
      'high': { color: 'red', text: '高' },
      'medium': { color: 'orange', text: '中' },
      'low': { color: 'green', text: '低' }
    };
    const config = priorityMap[priority as keyof typeof priorityMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      'draft': { color: 'default', text: '草稿', icon: <EditFilled /> },
      'review': { color: 'processing', text: '审核中', icon: <ClockCircleOutlined /> },
      'approved': { color: 'warning', text: '已批准', icon: <CheckCircleOutlined /> },
      'published': { color: 'success', text: '已发布', icon: <CheckCircleOutlined /> },
      'rejected': { color: 'error', text: '已拒绝', icon: <ExclamationCircleOutlined /> }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 获取字数颜色
  const getWordCountColor = (count: number) => {
    if (count >= 1500) return '#52c41a';
    if (count >= 1000) return '#1890ff';
    if (count >= 500) return '#faad14';
    return '#f5222d';
  };

  // 表格列定义
  const columns: ColumnsType<ArticleItem> = [
    {
      title: '稿件信息',
      key: 'info',
      width: 250,
      render: (_, record: ArticleItem) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
            {record.title}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
            {record.summary}
          </div>
          <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
            作者：{record.author} | 字数：
            <span style={{ color: getWordCountColor(record.wordCount), fontWeight: 'bold' }}>
              {record.wordCount}
            </span>
          </div>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 80,
      render: (category: string) => getCategoryTag(category)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => getPriorityTag(priority)
    },
    {
      title: '责任人',
      key: 'people',
      width: 120,
      render: (_, record: ArticleItem) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
            <Avatar size="small" style={{ marginRight: '4px' }}>
              {record.author.charAt(0)}
            </Avatar>
            <span style={{ fontSize: '12px' }}>{record.author}</span>
          </div>
          {record.editor && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
              <Avatar size="small" style={{ marginRight: '4px', backgroundColor: '#52c41a' }}>
                编
              </Avatar>
              <span style={{ fontSize: '12px' }}>{record.editor}</span>
            </div>
          )}
          {record.reviewer && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar size="small" style={{ marginRight: '4px', backgroundColor: '#722ed1' }}>
                审
              </Avatar>
              <span style={{ fontSize: '12px' }}>{record.reviewer}</span>
            </div>
          )}
        </div>
      )
    },
    {
      title: '时间信息',
      key: 'time',
      width: 120,
      render: (_, record: ArticleItem) => (
        <div style={{ fontSize: '12px' }}>
          <div style={{ marginBottom: '2px' }}>
            <CalendarOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            创建：{record.createTime.split(' ')[0]}
          </div>
          <div style={{ marginBottom: '2px' }}>
            <ClockCircleOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            更新：{record.updateTime.split(' ')[0]}
          </div>
          {record.deadline && (
            <div style={{ 
              color: new Date(record.deadline) < new Date() ? '#f5222d' : '#8c8c8c'
            }}>
              <ExclamationCircleOutlined style={{ marginRight: '4px' }} />
              截止：{record.deadline.split(' ')[0]}
            </div>
          )}
        </div>
      )
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 60,
      render: (version: number) => (
        <div style={{ textAlign: 'center' }}>
          <Tag color="blue">v{version}</Tag>
        </div>
      )
    },
    {
      title: '数据',
      key: 'stats',
      width: 80,
      render: (_, record: ArticleItem) => (
        <div style={{ fontSize: '12px', textAlign: 'center' }}>
          <div>阅读：{record.viewCount}</div>
          <div>分享：{record.shareCount}</div>
        </div>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
      render: (tags: string[], record: ArticleItem) => (
        <div>
          {tags.slice(0, 2).map((tag, index) => (
            <Tag key={`article-${record.id}-tag-${index}`} style={{ marginBottom: '2px' }}>
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
      render: (_, record: ArticleItem) => (
        <Space size="small">
          <Tooltip title="预览">
            <Button 
              type="text" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="分享">
            <Button 
              type="text" 
              size="small" 
              icon={<ShareAltOutlined />}
              onClick={() => handleShare(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              size="small" 
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 过滤数据
  const getFilteredData = () => {
    return articleData.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
      const matchCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  };

  // 处理预览
  const handlePreview = (record: ArticleItem) => {
    setPreviewArticle(record);
    setPreviewVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: ArticleItem) => {
    setEditingArticle(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理复制
  const handleCopy = (record: ArticleItem) => {
    navigator.clipboard.writeText(record.content);
    message.success('稿件内容已复制到剪贴板');
  };

  // 处理分享
  const handleShare = (record: ArticleItem) => {
    Modal.info({
      title: '分享稿件',
      content: (
        <div>
          <p>稿件标题：{record.title}</p>
          <p>作者：{record.author}</p>
          <p>字数：{record.wordCount}</p>
          <p>分享链接：https://example.com/article/{record.id}</p>
        </div>
      )
    });
  };

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇稿件吗？删除后无法恢复。',
      onOk: () => {
        message.success('稿件删除成功');
      }
    });
  };

  // 处理新增
  const handleAdd = () => {
    setEditingArticle(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单数据:', values);
      message.success(editingArticle ? '稿件更新成功' : '稿件创建成功');
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
              title="总稿件数"
              value={statistics.total}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="草稿"
              value={statistics.draft}
              valueStyle={{ color: '#8c8c8c' }}
              prefix={<EditFilled />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="审核中"
              value={statistics.review}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已发布"
              value={statistics.published}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="总字数"
              value={statistics.totalWords}
              prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="总阅读"
              value={statistics.totalViews}
              prefix={<EyeOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card 
        title={
          <Space>
            <FileTextOutlined style={{ color: '#1890ff' }} />
            <span>稿件库管理</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建稿件
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
                placeholder="搜索稿件标题、内容、作者或标签..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col>
              <Space>
                <Select
                  value={filterCategory}
                  onChange={setFilterCategory}
                  style={{ width: 120 }}
                  placeholder="分类筛选"
                >
                  <Option value="all">全部分类</Option>
                  <Option value="news">新闻</Option>
                  <Option value="feature">专题</Option>
                  <Option value="opinion">评论</Option>
                  <Option value="interview">访谈</Option>
                  <Option value="report">调查</Option>
                </Select>
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 120 }}
                  placeholder="状态筛选"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="draft">草稿</Option>
                  <Option value="review">审核中</Option>
                  <Option value="approved">已批准</Option>
                  <Option value="published">已发布</Option>
                  <Option value="rejected">已拒绝</Option>
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
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingArticle ? '编辑稿件' : '新建稿件'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={900}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            category: 'news',
            priority: 'medium',
            status: 'draft'
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="稿件标题"
                rules={[{ required: true, message: '请输入稿件标题' }]}
              >
                <Input placeholder="请输入稿件标题" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="summary"
                label="稿件摘要"
                rules={[{ required: true, message: '请输入稿件摘要' }]}
              >
                <TextArea rows={2} placeholder="请输入稿件摘要" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="content"
                label="稿件内容"
                rules={[{ required: true, message: '请输入稿件内容' }]}
              >
                <TextArea rows={8} placeholder="请输入稿件内容" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="稿件分类"
                rules={[{ required: true, message: '请选择稿件分类' }]}
              >
                <Select>
                  <Option value="news">新闻</Option>
                  <Option value="feature">专题</Option>
                  <Option value="opinion">评论</Option>
                  <Option value="interview">访谈</Option>
                  <Option value="report">调查</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select>
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="draft">草稿</Option>
                  <Option value="review">审核中</Option>
                  <Option value="approved">已批准</Option>
                  <Option value="published">已发布</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="author"
                label="作者"
                rules={[{ required: true, message: '请输入作者' }]}
              >
                <Input placeholder="请输入作者" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="editor"
                label="编辑"
              >
                <Input placeholder="请输入编辑" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="location"
                label="地点"
              >
                <Input placeholder="请输入相关地点" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="tags"
                label="标签"
              >
                <Select
                  mode="tags"
                  placeholder="请输入标签，按回车添加"
                  style={{ width: '100%' }}
                >
                  <Option value="政府">政府</Option>
                  <Option value="民生">民生</Option>
                  <Option value="科技">科技</Option>
                  <Option value="教育">教育</Option>
                  <Option value="环保">环保</Option>
                  <Option value="文化">文化</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 预览弹窗 */}
      <Modal
        title={previewArticle?.title}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="edit" icon={<EditOutlined />} onClick={() => {
            setPreviewVisible(false);
            if (previewArticle) handleEdit(previewArticle);
          }}>
            编辑
          </Button>,
          <Button key="copy" icon={<CopyOutlined />} onClick={() => {
            if (previewArticle) handleCopy(previewArticle);
          }}>
            复制
          </Button>,
          <Button key="share" icon={<ShareAltOutlined />} onClick={() => {
            if (previewArticle) handleShare(previewArticle);
          }}>
            分享
          </Button>
        ]}
        width={800}
      >
        {previewArticle && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Space>
                {getCategoryTag(previewArticle.category)}
                {getStatusTag(previewArticle.status)}
                {getPriorityTag(previewArticle.priority)}
                <Tag>v{previewArticle.version}</Tag>
              </Space>
            </div>
            <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>摘要：</p>
              <p style={{ margin: '8px 0 0 0' }}>{previewArticle.summary}</p>
            </div>
            <div style={{ marginBottom: '16px', lineHeight: '1.8' }}>
              {previewArticle.content}
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>作者：</strong>{previewArticle.author}</p>
                  {previewArticle.editor && <p><strong>编辑：</strong>{previewArticle.editor}</p>}
                  {previewArticle.reviewer && <p><strong>审核：</strong>{previewArticle.reviewer}</p>}
                </Col>
                <Col span={12}>
                  <p><strong>字数：</strong>{previewArticle.wordCount}</p>
                  <p><strong>创建时间：</strong>{previewArticle.createTime}</p>
                  <p><strong>更新时间：</strong>{previewArticle.updateTime}</p>
                  {previewArticle.publishTime && <p><strong>发布时间：</strong>{previewArticle.publishTime}</p>}
                </Col>
              </Row>
              {previewArticle.tags.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <strong>标签：</strong>
                  {previewArticle.tags.map((tag, index) => (
                    <Tag key={`article-modal-tag-${index}`} style={{ marginLeft: '4px' }}>{tag}</Tag>
                  ))}
                </div>
              )}
              {previewArticle.location && (
                <p style={{ marginTop: '8px' }}><strong>地点：</strong>{previewArticle.location}</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ArticleLibrary;