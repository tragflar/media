import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, Form, Select, message, Row, Col } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createTime: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  
  // 模拟用户数据
  const mockUsers: User[] = [
    {
      id: '1',
      userId: 'U001',
      userName: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: 'active',
      createTime: '2024-01-15 10:30:00',
      lastLogin: '2024-07-30 09:15:00'
    },
    {
      id: '2',
      userId: 'U002',
      userName: '李四',
      email: 'lisi@example.com',
      role: '编辑员',
      status: 'active',
      createTime: '2024-02-20 14:20:00',
      lastLogin: '2024-07-29 16:45:00'
    },
    {
      id: '3',
      userId: 'U003',
      userName: '王五',
      email: 'wangwu@example.com',
      role: '普通用户',
      status: 'inactive',
      createTime: '2024-03-10 09:15:00',
      lastLogin: '2024-07-25 14:30:00'
    }
  ];
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  };
  
  const getStatusTag = (status: string) => {
    const statusMap = {
      'active': { color: 'success', text: '启用' },
      'inactive': { color: 'error', text: '禁用' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: '未知' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };
  
  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };
  
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  const handleDelete = (record: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 "${record.userName}" 吗？`,
      onOk: () => {
        setUsers(users.filter(user => user.id !== record.id));
        message.success('删除成功');
      }
    });
  };
  
  const handleViewDetail = (record: User) => {
    Modal.info({
      title: '用户详情',
      width: 600,
      content: (
        <div style={{ padding: '16px 0' }}>
          <Row gutter={[16, 16]}>
            <Col span={12}><strong>用户ID:</strong> {record.userId}</Col>
            <Col span={12}><strong>用户名:</strong> {record.userName}</Col>
            <Col span={12}><strong>邮箱:</strong> {record.email}</Col>
            <Col span={12}><strong>角色:</strong> {record.role}</Col>
            <Col span={12}><strong>状态:</strong> {getStatusTag(record.status)}</Col>
            <Col span={12}><strong>创建时间:</strong> {record.createTime}</Col>
            <Col span={24}><strong>最后登录:</strong> {record.lastLogin}</Col>
          </Row>
        </div>
      )
    });
  };
  
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 编辑用户
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('用户信息更新成功');
      } else {
        // 新增用户
        const newUser: User = {
          id: Date.now().toString(),
          userId: `U${String(users.length + 1).padStart(3, '0')}`,
          ...values,
          createTime: new Date().toLocaleString(),
          lastLogin: '-'
        };
        setUsers([...users, newUser]);
        message.success('用户添加成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  const columns: ColumnsType<User> = [
    {
      title: '用户信息',
      dataIndex: 'userName',
      key: 'userName',
      width: 180,
      align: 'center',
      render: (text: string, record: User) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          <UserOutlined style={{ color: '#1890ff', fontSize: '14px' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
          <Tag style={{ margin: 0, fontSize: '11px', padding: '0 4px' }}>
            {record.userId}
          </Tag>
        </Space>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      align: 'center'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      align: 'center',
      sorter: true
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 160,
      align: 'center',
      sorter: true
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_: any, record: User) => (
        <Space size={8}>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} size="small">
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} size="small">
            删除
          </Button>
        </Space>
      )
    }
  ];
  
  const filteredUsers = users.filter(user => 
    user.userName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );
  
  return (
    <div style={{ background: 'transparent' }}>
      {/* 搜索操作区 */}
      <Card 
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}
      >
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="搜索用户名或邮箱..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 300 }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增用户
            </Button>
          </Col>
        </Row>
      </Card>
      
      {/* 数据列表区 */}
      <Card 
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0'
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
      
      {/* 用户表单模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userName"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  <Select.Option value="管理员">管理员</Select.Option>
                  <Select.Option value="编辑员">编辑员</Select.Option>
                  <Select.Option value="普通用户">普通用户</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Select.Option value="active">启用</Select.Option>
                  <Select.Option value="inactive">禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;