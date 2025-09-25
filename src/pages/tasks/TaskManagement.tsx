import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Space, Input, Select, Tabs, Badge, Avatar, Progress } from 'antd';
import {
  AuditOutlined,
  ClockCircleOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface PendingReviewTask {
  id: string;
  title: string;
  type: string;
  submitter: string;
  submitTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  description: string;
}

interface PendingTodoTask {
  id: string;
  title: string;
  type: string;
  assignee: string;
  deadline: string;
  progress: number;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'doing' | 'done';
  description: string;
}

const TaskManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('review');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // 待审任务数据
  const pendingReviewTasks: PendingReviewTask[] = [
    {
      id: '1',
      title: '市政府新闻发布会报道稿件',
      type: '稿件审核',
      submitter: '张记者',
      submitTime: '2024-01-20 14:30',
      priority: 'high',
      status: 'pending',
      description: '关于城市发展规划的重要新闻发布会报道'
    },
    {
      id: '2',
      title: '春节文化活动选题方案',
      type: '选题审核',
      submitter: '李编辑',
      submitTime: '2024-01-20 10:15',
      priority: 'medium',
      status: 'reviewing',
      description: '春节期间传统文化活动的系列报道选题'
    },
    {
      id: '3',
      title: '城市夜景航拍素材',
      type: '素材审核',
      submitter: '王摄像',
      submitTime: '2024-01-19 16:45',
      priority: 'low',
      status: 'approved',
      description: '城市夜景的高清航拍视频素材'
    },
    {
      id: '4',
      title: '用户评论内容审核',
      type: '评论审核',
      submitter: '系统自动',
      submitTime: '2024-01-20 09:20',
      priority: 'medium',
      status: 'pending',
      description: '用户在新闻文章下的评论内容需要审核'
    }
  ];

  // 待办任务数据
  const pendingTodoTasks: PendingTodoTask[] = [
    {
      id: '1',
      title: '完成环保主题深度报道',
      type: '写稿任务',
      assignee: '张记者',
      deadline: '2024-01-25',
      progress: 60,
      priority: 'high',
      status: 'doing',
      description: '关于城市环保政策实施效果的深度调研报道'
    },
    {
      id: '2',
      title: '拍摄社区文化活动',
      type: '拍摄任务',
      assignee: '王摄像',
      deadline: '2024-01-22',
      progress: 30,
      priority: 'medium',
      status: 'doing',
      description: '社区举办的传统文化展示活动拍摄'
    },
    {
      id: '3',
      title: '归还摄影设备',
      type: '设备管理',
      assignee: '李摄影',
      deadline: '2024-01-21',
      progress: 0,
      priority: 'low',
      status: 'todo',
      description: '归还借用的专业摄影设备和配件'
    },
    {
      id: '4',
      title: '上传新闻素材',
      type: '素材任务',
      assignee: '赵编辑',
      deadline: '2024-01-23',
      progress: 100,
      priority: 'medium',
      status: 'done',
      description: '将采访获得的图片和视频素材上传到媒资库'
    }
  ];

  // 优先级标签
  const getPriorityTag = (priority: string) => {
    const priorityMap = {
      'high': { color: 'red', text: '高' },
      'medium': { color: 'orange', text: '中' },
      'low': { color: 'green', text: '低' }
    };
    const config = priorityMap[priority as keyof typeof priorityMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 审核状态标签
  const getReviewStatusTag = (status: string) => {
    const statusMap = {
      'pending': { color: 'orange', text: '待审核' },
      'reviewing': { color: 'blue', text: '审核中' },
      'approved': { color: 'green', text: '已通过' },
      'rejected': { color: 'red', text: '已拒绝' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 任务状态标签
  const getTodoStatusTag = (status: string) => {
    const statusMap = {
      'todo': { color: 'default', text: '待开始' },
      'doing': { color: 'blue', text: '进行中' },
      'done': { color: 'green', text: '已完成' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 待审任务表格列配置
  const reviewColumns: ColumnsType<PendingReviewTask> = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
          <Tag>{record.type}</Tag>
        </div>
      )
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 100,
      align: 'center',
      render: (text) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 140,
      align: 'center'
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      align: 'center',
      render: getPriorityTag
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: getReviewStatusTag
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size={8}>
          <Button type="link" icon={<EyeOutlined />} size="small">
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" icon={<CheckOutlined />} size="small" style={{ color: '#52c41a' }}>
                通过
              </Button>
              <Button type="link" icon={<CloseOutlined />} size="small" danger>
                拒绝
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  // 待办任务表格列配置
  const todoColumns: ColumnsType<PendingTodoTask> = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
          <Tag>{record.type}</Tag>
        </div>
      )
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 100,
      align: 'center',
      render: (text) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 120,
      align: 'center'
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      align: 'center',
      render: (progress) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      align: 'center',
      render: getPriorityTag
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: getTodoStatusTag
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size={8}>
          <Button type="link" icon={<EyeOutlined />} size="small">
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
        </Space>
      )
    }
  ];

  // 统计数据
  const getTaskStats = () => {
    const reviewStats = {
      total: pendingReviewTasks.length,
      pending: pendingReviewTasks.filter(t => t.status === 'pending').length,
      reviewing: pendingReviewTasks.filter(t => t.status === 'reviewing').length,
      approved: pendingReviewTasks.filter(t => t.status === 'approved').length
    };

    const todoStats = {
      total: pendingTodoTasks.length,
      todo: pendingTodoTasks.filter(t => t.status === 'todo').length,
      doing: pendingTodoTasks.filter(t => t.status === 'doing').length,
      done: pendingTodoTasks.filter(t => t.status === 'done').length
    };

    return { reviewStats, todoStats };
  };

  const { reviewStats, todoStats } = getTaskStats();

  return (
    <div style={{ background: 'transparent' }}>
      {/* 页面标题和统计 */}
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
              任务管理中心
            </h2>
            <p style={{ margin: 0, color: '#8c8c8c' }}>
              统一管理待审任务和待办任务，提升工作效率
            </p>
          </Col>
          <Col>
            <Row gutter={24}>
              <Col>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {reviewStats.pending}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>待审任务</div>
                </div>
              </Col>
              <Col>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {todoStats.doing}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>进行中</div>
                </div>
              </Col>
              <Col>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {todoStats.done}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>已完成</div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 任务管理主体 */}
      <Card 
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0'
        }}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'review',
              label: (
                <span>
                  <AuditOutlined />
                  <Badge count={reviewStats.pending} size="small" offset={[10, -5]}>
                    待审任务
                  </Badge>
                </span>
              ),
              children: (
                <div>
                  {/* 筛选工具栏 */}
                  <Row gutter={16} style={{ marginBottom: '16px' }}>
                    <Col flex="auto">
                      <Space>
                        <Search
                          placeholder="搜索任务标题或提交人..."
                          style={{ width: 250 }}
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                          value={filterStatus}
                          onChange={setFilterStatus}
                          style={{ width: 120 }}
                        >
                          <Option value="all">全部状态</Option>
                          <Option value="pending">待审核</Option>
                          <Option value="reviewing">审核中</Option>
                          <Option value="approved">已通过</Option>
                          <Option value="rejected">已拒绝</Option>
                        </Select>
                        <Select
                          value={filterPriority}
                          onChange={setFilterPriority}
                          style={{ width: 120 }}
                        >
                          <Option value="all">全部优先级</Option>
                          <Option value="high">高优先级</Option>
                          <Option value="medium">中优先级</Option>
                          <Option value="low">低优先级</Option>
                        </Select>
                      </Space>
                    </Col>
                  </Row>

                  {/* 待审任务表格 */}
                  <Table
                    columns={reviewColumns}
                    dataSource={pendingReviewTasks}
                    rowKey="id"
                    pagination={{
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
                    }}
                    scroll={{ x: 'max-content' }}
                  />
                </div>
              )
            },
            {
              key: 'todo',
              label: (
                <span>
                  <ClockCircleOutlined />
                  <Badge count={todoStats.todo + todoStats.doing} size="small" offset={[10, -5]}>
                    待办任务
                  </Badge>
                </span>
              ),
              children: (
                <div>
                  {/* 筛选工具栏 */}
                  <Row gutter={16} style={{ marginBottom: '16px' }}>
                    <Col flex="auto">
                      <Space>
                        <Search
                          placeholder="搜索任务标题或负责人..."
                          style={{ width: 250 }}
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                          value={filterStatus}
                          onChange={setFilterStatus}
                          style={{ width: 120 }}
                        >
                          <Option value="all">全部状态</Option>
                          <Option value="todo">待开始</Option>
                          <Option value="doing">进行中</Option>
                          <Option value="done">已完成</Option>
                        </Select>
                        <Select
                          value={filterPriority}
                          onChange={setFilterPriority}
                          style={{ width: 120 }}
                        >
                          <Option value="all">全部优先级</Option>
                          <Option value="high">高优先级</Option>
                          <Option value="medium">中优先级</Option>
                          <Option value="low">低优先级</Option>
                        </Select>
                      </Space>
                    </Col>
                  </Row>

                  {/* 待办任务表格 */}
                  <Table
                    columns={todoColumns}
                    dataSource={pendingTodoTasks}
                    rowKey="id"
                    pagination={{
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
                    }}
                    scroll={{ x: 'max-content' }}
                  />
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default TaskManagement;