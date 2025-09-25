import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, Form, DatePicker, message, Row, Col, Statistic, Progress, Avatar } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TopicItem {
  id: string;
  title: string;
  description: string;
  category: 'news' | 'feature' | 'series' | 'special';
  priority: 'high' | 'medium' | 'low';
  status: 'planning' | 'approved' | 'production' | 'completed' | 'cancelled';
  creator: string;
  assignee: string[];
  startDate: string;
  deadline: string;
  progress: number;
  tags: string[];
  budget?: number;
  expectedOutput: string;
  relatedClues: string[];
}

const TopicLibrary: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [form] = Form.useForm();

  // 模拟选题数据
  const topicData: TopicItem[] = [
    {
      id: '1',
      title: '城市停车难问题深度调查',
      description: '针对市民反映的停车难问题，进行深度调查报道，分析原因并提出解决方案。',
      category: 'feature',
      priority: 'high',
      status: 'production',
      creator: '李编辑',
      assignee: ['李记者', '王记者'],
      startDate: '2024-01-15',
      deadline: '2024-01-25',
      progress: 65,
      tags: ['民生', '交通', '调查'],
      budget: 5000,
      expectedOutput: '深度报道文章 + 视频专题',
      relatedClues: ['市民反映某小区停车难问题']
    },
    {
      id: '2',
      title: '本地科技企业发展系列报道',
      description: '聚焦本地科技企业发展现状，展现科技创新成果和企业家精神。',
      category: 'series',
      priority: 'medium',
      status: 'approved',
      creator: '张编辑',
      assignee: ['王记者', '赵记者', '刘记者'],
      startDate: '2024-01-20',
      deadline: '2024-02-20',
      progress: 20,
      tags: ['科技', '企业', '系列报道'],
      budget: 15000,
      expectedOutput: '系列报道 5-8 篇 + 视频访谈',
      relatedClues: ['本地企业获得国家科技奖项']
    },
    {
      id: '3',
      title: '春节特别节目策划',
      description: '2024年春节特别节目，包含文艺演出、民俗展示、市民祝福等内容。',
      category: 'special',
      priority: 'high',
      status: 'planning',
      creator: '陈制片',
      assignee: ['李导演', '王编导', '张主持'],
      startDate: '2024-01-25',
      deadline: '2024-02-10',
      progress: 10,
      tags: ['春节', '特别节目', '文艺'],
      budget: 50000,
      expectedOutput: '2小时特别节目',
      relatedClues: []
    },
    {
      id: '4',
      title: '教育改革政策解读',
      description: '深度解读最新教育改革政策，采访教育专家和一线教师。',
      category: 'news',
      priority: 'medium',
      status: 'completed',
      creator: '孙编辑',
      assignee: ['赵记者'],
      startDate: '2024-01-05',
      deadline: '2024-01-15',
      progress: 100,
      tags: ['教育', '政策', '解读'],
      budget: 3000,
      expectedOutput: '新闻报道 + 专家访谈',
      relatedClues: []
    },
    {
      id: '5',
      title: '环保志愿者风采展示',
      description: '展示本地环保志愿者的风采和环保成果，传播环保理念。',
      category: 'feature',
      priority: 'low',
      status: 'cancelled',
      creator: '周编辑',
      assignee: ['刘记者'],
      startDate: '2024-01-10',
      deadline: '2024-01-20',
      progress: 30,
      tags: ['环保', '志愿者', '公益'],
      budget: 2000,
      expectedOutput: '专题报道',
      relatedClues: ['环保志愿者清理河道垃圾']
    }
  ];

  // 获取统计数据
  const getStatistics = () => {
    const total = topicData.length;
    const planning = topicData.filter(item => item.status === 'planning').length;
    const production = topicData.filter(item => item.status === 'production').length;
    const completed = topicData.filter(item => item.status === 'completed').length;
    const highPriority = topicData.filter(item => item.priority === 'high').length;
    const avgProgress = Math.round(topicData.reduce((sum, item) => sum + item.progress, 0) / total);
    
    return { total, planning, production, completed, highPriority, avgProgress };
  };

  const statistics = getStatistics();

  // 获取分类标签
  const getCategoryTag = (category: string) => {
    const categoryMap = {
      'news': { color: 'blue', text: '新闻' },
      'feature': { color: 'green', text: '专题' },
      'series': { color: 'orange', text: '系列' },
      'special': { color: 'purple', text: '特别节目' }
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
      'planning': { color: 'default', text: '策划中' },
      'approved': { color: 'processing', text: '已批准' },
      'production': { color: 'warning', text: '制作中' },
      'completed': { color: 'success', text: '已完成' },
      'cancelled': { color: 'error', text: '已取消' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取进度颜色
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#52c41a';
    if (progress >= 50) return '#faad14';
    if (progress >= 20) return '#1890ff';
    return '#f5222d';
  };

  // 表格列定义
  const columns: ColumnsType<TopicItem> = [
    {
      title: '选题标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text: string, record: TopicItem) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            创建人：{record.creator}
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
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => getPriorityTag(priority)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 120,
      render: (assignee: string[], record: TopicItem) => (
        <div>
          {assignee.slice(0, 2).map((person, index) => (
            <div key={`topic-${record.id}-participant-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
              <Avatar size="small" style={{ marginRight: '4px' }}>
                {person.charAt(0)}
              </Avatar>
              <span style={{ fontSize: '12px' }}>{person}</span>
            </div>
          ))}
          {assignee.length > 2 && (
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>+{assignee.length - 2}人</div>
          )}
        </div>
      )
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 100,
      render: (progress: number) => (
        <div>
          <Progress 
            percent={progress} 
            size="small" 
            strokeColor={getProgressColor(progress)}
            showInfo={false}
          />
          <div style={{ fontSize: '12px', textAlign: 'center', marginTop: '2px' }}>
            {progress}%
          </div>
        </div>
      )
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 100,
      render: (deadline: string, record: TopicItem) => {
        const isOverdue = new Date(deadline) < new Date() && record.status !== 'completed';
        return (
          <div style={{ 
            fontSize: '12px',
            color: isOverdue ? '#f5222d' : '#8c8c8c'
          }}>
            <CalendarOutlined style={{ marginRight: '4px' }} />
            {deadline}
            {isOverdue && <div style={{ color: '#f5222d' }}>已逾期</div>}
          </div>
        );
      }
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 80,
      render: (budget: number) => (
        <div style={{ fontSize: '12px' }}>
          ¥{budget?.toLocaleString() || '未设定'}
        </div>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
      render: (tags: string[], record: TopicItem) => (
        <div>
          {tags.slice(0, 2).map((tag, index) => (
            <Tag key={`topic-${record.id}-tag-${index}`} style={{ marginBottom: '2px' }}>
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
      width: 120,
      fixed: 'right',
      render: (_, record: TopicItem) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
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
    return topicData.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
      const matchCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  };

  // 处理查看
  const handleView = (record: TopicItem) => {
    Modal.info({
      title: record.title,
      width: 700,
      content: (
        <div>
          <p><strong>描述：</strong>{record.description}</p>
          <p><strong>分类：</strong>{getCategoryTag(record.category)}</p>
          <p><strong>优先级：</strong>{getPriorityTag(record.priority)}</p>
          <p><strong>状态：</strong>{getStatusTag(record.status)}</p>
          <p><strong>创建人：</strong>{record.creator}</p>
          <p><strong>负责人：</strong>{record.assignee.join('、')}</p>
          <p><strong>开始时间：</strong>{record.startDate}</p>
          <p><strong>截止时间：</strong>{record.deadline}</p>
          <p><strong>进度：</strong>
            <Progress 
              percent={record.progress} 
              strokeColor={getProgressColor(record.progress)}
              style={{ marginLeft: '8px', width: '200px' }}
            />
          </p>
          <p><strong>预算：</strong>¥{record.budget?.toLocaleString() || '未设定'}</p>
          <p><strong>预期产出：</strong>{record.expectedOutput}</p>
          <p><strong>相关线索：</strong>{record.relatedClues.length > 0 ? record.relatedClues.join('、') : '无'}</p>
          <p><strong>标签：</strong>
            {record.tags.map((tag, index) => (
              <Tag key={`topic-modal-tag-${index}`} style={{ marginLeft: '4px' }}>{tag}</Tag>
            ))}
          </p>
        </div>
      )
    });
  };

  // 处理编辑
  const handleEdit = (record: TopicItem) => {
    setEditingTopic(record);
    form.setFieldsValue({
      ...record,
      startDate: undefined, // DatePicker需要moment对象，这里简化处理
      deadline: undefined
    });
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个选题吗？删除后无法恢复。',
      onOk: () => {
        message.success('选题删除成功');
      }
    });
  };

  // 处理新增
  const handleAdd = () => {
    setEditingTopic(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单数据:', values);
      message.success(editingTopic ? '选题更新成功' : '选题添加成功');
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
              title="总选题数"
              value={statistics.total}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="策划中"
              value={statistics.planning}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="制作中"
              value={statistics.production}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已完成"
              value={statistics.completed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="高优先级"
              value={statistics.highPriority}
              valueStyle={{ color: '#f5222d' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均进度"
              value={statistics.avgProgress}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card 
        title={
          <Space>
            <BookOutlined style={{ color: '#1890ff' }} />
            <span>选题库管理</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增选题
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
                placeholder="搜索选题标题、描述或标签..."
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
                  <Option value="series">系列</Option>
                  <Option value="special">特别节目</Option>
                </Select>
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 120 }}
                  placeholder="状态筛选"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="planning">策划中</Option>
                  <Option value="approved">已批准</Option>
                  <Option value="production">制作中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingTopic ? '编辑选题' : '新增选题'}
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
            status: 'planning',
            progress: 0
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="选题标题"
                rules={[{ required: true, message: '请输入选题标题' }]}
              >
                <Input placeholder="请输入选题标题" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="选题描述"
                rules={[{ required: true, message: '请输入选题描述' }]}
              >
                <Input.TextArea rows={4} placeholder="请详细描述选题内容和目标" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="选题分类"
                rules={[{ required: true, message: '请选择选题分类' }]}
              >
                <Select>
                  <Option value="news">新闻</Option>
                  <Option value="feature">专题</Option>
                  <Option value="series">系列</Option>
                  <Option value="special">特别节目</Option>
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
                  <Option value="planning">策划中</Option>
                  <Option value="approved">已批准</Option>
                  <Option value="production">制作中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="负责人"
                rules={[{ required: true, message: '请选择负责人' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择负责人"
                >
                  <Option value="李记者">李记者</Option>
                  <Option value="王记者">王记者</Option>
                  <Option value="赵记者">赵记者</Option>
                  <Option value="刘记者">刘记者</Option>
                  <Option value="李导演">李导演</Option>
                  <Option value="王编导">王编导</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="预算（元）"
              >
                <Input type="number" placeholder="请输入预算金额" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="expectedOutput"
                label="预期产出"
                rules={[{ required: true, message: '请输入预期产出' }]}
              >
                <Input placeholder="如：深度报道文章 + 视频专题" />
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
                  <Option value="民生">民生</Option>
                  <Option value="科技">科技</Option>
                  <Option value="教育">教育</Option>
                  <Option value="环保">环保</Option>
                  <Option value="文艺">文艺</Option>
                  <Option value="调查">调查</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicLibrary;