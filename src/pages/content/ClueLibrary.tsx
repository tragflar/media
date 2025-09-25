import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, Form, DatePicker, message, Row, Col, Statistic } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BulbOutlined,
  UserOutlined,
  CalendarOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ClueItem {
  id: string;
  title: string;
  content: string;
  source: string;
  type: 'news' | 'feature' | 'investigation' | 'interview';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  reporter: string;
  submitter: string;
  submitTime: string;
  updateTime: string;
  tags: string[];
  location?: string;
  contact?: string;
}

const ClueLibrary: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClue, setEditingClue] = useState<ClueItem | null>(null);
  const [form] = Form.useForm();

  // 模拟线索数据
  const clueData: ClueItem[] = [
    {
      id: '1',
      title: '市民反映某小区停车难问题',
      content: '市民张先生反映，某小区停车位严重不足，业主停车困难，希望相关部门关注解决。',
      source: '市民热线',
      type: 'news',
      priority: 'medium',
      status: 'processing',
      reporter: '李记者',
      submitter: '热线客服',
      submitTime: '2024-01-15 09:30:00',
      updateTime: '2024-01-15 14:20:00',
      tags: ['民生', '交通', '小区'],
      location: '某某小区',
      contact: '张先生 138****1234'
    },
    {
      id: '2',
      title: '本地企业获得国家科技奖项',
      content: '本地某科技企业在人工智能领域取得重大突破，获得国家科技进步奖。',
      source: '企业投稿',
      type: 'feature',
      priority: 'high',
      status: 'pending',
      reporter: '王记者',
      submitter: '企业宣传部',
      submitTime: '2024-01-14 16:45:00',
      updateTime: '2024-01-14 16:45:00',
      tags: ['科技', '企业', '获奖'],
      location: '科技园区',
      contact: '企业联系人 139****5678'
    },
    {
      id: '3',
      title: '学校食堂食品安全问题调查',
      content: '有家长反映某学校食堂存在食品安全隐患，需要深入调查了解情况。',
      source: '家长举报',
      type: 'investigation',
      priority: 'high',
      status: 'completed',
      reporter: '赵记者',
      submitter: '家长代表',
      submitTime: '2024-01-13 11:20:00',
      updateTime: '2024-01-15 10:30:00',
      tags: ['教育', '食品安全', '调查'],
      location: '某某学校',
      contact: '家长代表 137****9012'
    },
    {
      id: '4',
      title: '退休教师义务辅导学生',
      content: '退休教师张老师义务为社区困难学生辅导功课，传递正能量。',
      source: '社区推荐',
      type: 'feature',
      priority: 'medium',
      status: 'pending',
      reporter: '未分配',
      submitter: '社区工作者',
      submitTime: '2024-01-12 14:15:00',
      updateTime: '2024-01-12 14:15:00',
      tags: ['教育', '正能量', '社区'],
      location: '某某社区',
      contact: '社区主任 136****3456'
    },
    {
      id: '5',
      title: '环保志愿者清理河道垃圾',
      content: '环保志愿者组织清理河道垃圾活动，呼吁市民保护环境。',
      source: '志愿者组织',
      type: 'news',
      priority: 'low',
      status: 'rejected',
      reporter: '未分配',
      submitter: '志愿者',
      submitTime: '2024-01-11 08:30:00',
      updateTime: '2024-01-11 17:45:00',
      tags: ['环保', '志愿者', '公益'],
      location: '某某河道',
      contact: '志愿者负责人 135****7890'
    }
  ];

  // 获取统计数据
  const getStatistics = () => {
    const total = clueData.length;
    const pending = clueData.filter(item => item.status === 'pending').length;
    const processing = clueData.filter(item => item.status === 'processing').length;
    const completed = clueData.filter(item => item.status === 'completed').length;
    const highPriority = clueData.filter(item => item.priority === 'high').length;
    
    return { total, pending, processing, completed, highPriority };
  };

  const statistics = getStatistics();

  // 获取类型标签
  const getTypeTag = (type: string) => {
    const typeMap = {
      'news': { color: 'blue', text: '新闻' },
      'feature': { color: 'green', text: '专题' },
      'investigation': { color: 'orange', text: '调查' },
      'interview': { color: 'purple', text: '访谈' }
    };
    const config = typeMap[type as keyof typeof typeMap];
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
      'pending': { color: 'default', text: '待处理' },
      'processing': { color: 'processing', text: '处理中' },
      'completed': { color: 'success', text: '已完成' },
      'rejected': { color: 'error', text: '已拒绝' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<ClueItem> = [
    {
      title: '线索标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text: string, record: ClueItem) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            来源：{record.source}
          </div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => getTypeTag(type)
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
      title: '负责记者',
      dataIndex: 'reporter',
      key: 'reporter',
      width: 100,
      render: (reporter: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
          {reporter}
        </div>
      )
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 120,
      render: (time: string) => (
        <div style={{ fontSize: '12px' }}>
          {time.split(' ')[0]}<br/>
          {time.split(' ')[1]}
        </div>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
      render: (tags: string[], record: ClueItem) => (
        <div>
          {tags.slice(0, 2).map((tag, index) => (
            <Tag key={`clue-${record.id}-tag-${index}`} style={{ marginBottom: '2px' }}>
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
      render: (_, record: ClueItem) => (
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
    return clueData.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
      const matchType = filterType === 'all' || item.type === filterType;
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  };

  // 处理查看
  const handleView = (record: ClueItem) => {
    Modal.info({
      title: record.title,
      width: 600,
      content: (
        <div>
          <p><strong>内容：</strong>{record.content}</p>
          <p><strong>来源：</strong>{record.source}</p>
          <p><strong>类型：</strong>{getTypeTag(record.type)}</p>
          <p><strong>优先级：</strong>{getPriorityTag(record.priority)}</p>
          <p><strong>状态：</strong>{getStatusTag(record.status)}</p>
          <p><strong>负责记者：</strong>{record.reporter}</p>
          <p><strong>提交人：</strong>{record.submitter}</p>
          <p><strong>提交时间：</strong>{record.submitTime}</p>
          <p><strong>更新时间：</strong>{record.updateTime}</p>
          {record.location && <p><strong>地点：</strong>{record.location}</p>}
          {record.contact && <p><strong>联系方式：</strong>{record.contact}</p>}
          <p><strong>标签：</strong>
            {record.tags.map((tag, index) => (
              <Tag key={`clue-modal-tag-${index}`} style={{ marginLeft: '4px' }}>{tag}</Tag>
            ))}
          </p>
        </div>
      )
    });
  };

  // 处理编辑
  const handleEdit = (record: ClueItem) => {
    setEditingClue(record);
    form.setFieldsValue({
      ...record,
      submitTime: undefined // DatePicker需要moment对象，这里简化处理
    });
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条线索吗？删除后无法恢复。',
      onOk: () => {
        message.success('线索删除成功');
      }
    });
  };

  // 处理新增
  const handleAdd = () => {
    setEditingClue(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单数据:', values);
      message.success(editingClue ? '线索更新成功' : '线索添加成功');
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
        <Col span={6}>
          <Card>
            <Statistic
              title="总线索数"
              value={statistics.total}
              prefix={<BulbOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理"
              value={statistics.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="处理中"
              value={statistics.processing}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="高优先级"
              value={statistics.highPriority}
              valueStyle={{ color: '#f5222d' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card 
        title={
          <Space>
            <BulbOutlined style={{ color: '#1890ff' }} />
            <span>线索库管理</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增线索
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
                placeholder="搜索线索标题、内容或标签..."
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
                  <Option value="news">新闻</Option>
                  <Option value="feature">专题</Option>
                  <Option value="investigation">调查</Option>
                  <Option value="interview">访谈</Option>
                </Select>
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 120 }}
                  placeholder="状态筛选"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="pending">待处理</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="completed">已完成</Option>
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingClue ? '编辑线索' : '新增线索'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'news',
            priority: 'medium',
            status: 'pending'
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="线索标题"
                rules={[{ required: true, message: '请输入线索标题' }]}
              >
                <Input placeholder="请输入线索标题" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="content"
                label="线索内容"
                rules={[{ required: true, message: '请输入线索内容' }]}
              >
                <Input.TextArea rows={4} placeholder="请详细描述线索内容" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="source"
                label="线索来源"
                rules={[{ required: true, message: '请输入线索来源' }]}
              >
                <Input placeholder="如：市民热线、企业投稿等" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="线索类型"
                rules={[{ required: true, message: '请选择线索类型' }]}
              >
                <Select>
                  <Option value="news">新闻</Option>
                  <Option value="feature">专题</Option>
                  <Option value="investigation">调查</Option>
                  <Option value="interview">访谈</Option>
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
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="reporter"
                label="负责记者"
              >
                <Input placeholder="请输入负责记者" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="location"
                label="相关地点"
              >
                <Input placeholder="请输入相关地点" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contact"
                label="联系方式"
              >
                <Input placeholder="请输入联系方式" />
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
                  <Option value="交通">交通</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ClueLibrary;