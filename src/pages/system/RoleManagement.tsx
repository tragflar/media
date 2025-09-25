import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, Form, Tree, message, Row, Col, Select } from 'antd';
import { SafetyOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

interface Role {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: 'active' | 'inactive';
  createTime: string;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form] = Form.useForm();
  
  // 模拟角色数据
  const mockRoles: Role[] = [
    {
      id: '1',
      roleName: '管理员',
      roleCode: 'ADMIN',
      description: '系统管理员，拥有所有权限',
      userCount: 2,
      permissions: ['user:read', 'user:write', 'role:read', 'role:write', 'permission:read', 'permission:write'],
      status: 'active',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: '2',
      roleName: '编辑员',
      roleCode: 'EDITOR',
      description: '内容编辑员，可以管理内容',
      userCount: 5,
      permissions: ['user:read', 'content:read', 'content:write'],
      status: 'active',
      createTime: '2024-01-15 10:30:00'
    },
    {
      id: '3',
      roleName: '普通用户',
      roleCode: 'USER',
      description: '普通用户，只有基础查看权限',
      userCount: 20,
      permissions: ['user:read'],
      status: 'active',
      createTime: '2024-02-01 14:20:00'
    }
  ];
  
  // 权限树数据
  const permissionTreeData: DataNode[] = [
    {
      title: '用户管理',
      key: 'user',
      children: [
        { title: '查看用户', key: 'user:read' },
        { title: '编辑用户', key: 'user:write' },
        { title: '删除用户', key: 'user:delete' }
      ]
    },
    {
      title: '角色管理',
      key: 'role',
      children: [
        { title: '查看角色', key: 'role:read' },
        { title: '编辑角色', key: 'role:write' },
        { title: '删除角色', key: 'role:delete' }
      ]
    },
    {
      title: '权限管理',
      key: 'permission',
      children: [
        { title: '查看权限', key: 'permission:read' },
        { title: '编辑权限', key: 'permission:write' },
        { title: '删除权限', key: 'permission:delete' }
      ]
    },
    {
      title: '内容管理',
      key: 'content',
      children: [
        { title: '查看内容', key: 'content:read' },
        { title: '编辑内容', key: 'content:write' },
        { title: '删除内容', key: 'content:delete' }
      ]
    }
  ];
  
  useEffect(() => {
    loadRoles();
  }, []);
  
  const loadRoles = async () => {
    setLoading(true);
    setTimeout(() => {
      setRoles(mockRoles);
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
  
  const handleEdit = (record: Role) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };
  
  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  const handleDelete = (record: Role) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 "${record.roleName}" 吗？`,
      onOk: () => {
        setRoles(roles.filter(role => role.id !== record.id));
        message.success('删除成功');
      }
    });
  };
  
  const handleViewDetail = (record: Role) => {
    Modal.info({
      title: '角色详情',
      width: 600,
      content: (
        <div style={{ padding: '16px 0' }}>
          <Row gutter={[16, 16]}>
            <Col span={12}><strong>角色名称:</strong> {record.roleName}</Col>
            <Col span={12}><strong>角色代码:</strong> {record.roleCode}</Col>
            <Col span={12}><strong>用户数量:</strong> {record.userCount}</Col>
            <Col span={12}><strong>状态:</strong> {getStatusTag(record.status)}</Col>
            <Col span={24}><strong>描述:</strong> {record.description}</Col>
            <Col span={24}><strong>创建时间:</strong> {record.createTime}</Col>
            <Col span={24}>
              <strong>权限列表:</strong>
              <div style={{ marginTop: '8px' }}>
                {record.permissions.map(permission => (
                  <Tag key={permission} style={{ margin: '2px' }}>{permission}</Tag>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      )
    });
  };
  
  const handlePermissionConfig = (record: Role) => {
    setEditingRole(record);
    setSelectedPermissions(record.permissions);
    setPermissionModalVisible(true);
  };
  
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingRole) {
        setRoles(roles.map(role => 
          role.id === editingRole.id ? { ...role, ...values } : role
        ));
        message.success('角色信息更新成功');
      } else {
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
          userCount: 0,
          permissions: [],
          createTime: new Date().toLocaleString()
        };
        setRoles([...roles, newRole]);
        message.success('角色添加成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  const handlePermissionOk = () => {
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id ? { ...role, permissions: selectedPermissions } : role
      ));
      message.success('权限配置更新成功');
    }
    setPermissionModalVisible(false);
  };
  
  const columns: ColumnsType<Role> = [
    {
      title: '角色信息',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 180,
      align: 'center',
      render: (text: string, record: Role) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          <SafetyOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
          <Tag style={{ margin: 0, fontSize: '11px', padding: '0 4px' }}>
            {record.roleCode}
          </Tag>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      align: 'center'
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      align: 'center',
      render: (count: number) => (
        <Tag color="blue">{count}</Tag>
      )
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 100,
      align: 'center',
      render: (permissions: string[]) => (
        <Tag color="purple">{permissions.length}</Tag>
      )
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
      title: '操作',
      key: 'action',
      width: 280,
      align: 'center',
      render: (_: any, record: Role) => (
        <Space size={8}>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} size="small">
            详情
          </Button>
          <Button type="link" onClick={() => handlePermissionConfig(record)} size="small">
            权限配置
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
  
  const filteredRoles = roles.filter(role => 
    role.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
    role.roleCode.toLowerCase().includes(searchText.toLowerCase())
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
              placeholder="搜索角色名称或代码..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 300 }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增角色
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
          dataSource={filteredRoles}
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
      
      {/* 角色表单模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
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
                name="roleName"
                label="角色名称"
                rules={[{ required: true, message: '请输入角色名称' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleCode"
                label="角色代码"
                rules={[{ required: true, message: '请输入角色代码' }]}
              >
                <Input placeholder="请输入角色代码" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
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
        </Form>
      </Modal>
      
      {/* 权限配置模态框 */}
      <Modal
        title={`配置角色权限 - ${editingRole?.roleName}`}
        open={permissionModalVisible}
        onOk={handlePermissionOk}
        onCancel={() => setPermissionModalVisible(false)}
        width={600}
      >
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: '#666' }}>请选择该角色拥有的权限：</span>
        </div>
        <Tree
          checkable
          checkedKeys={selectedPermissions}
          onCheck={(checkedKeys) => {
            setSelectedPermissions(checkedKeys as string[]);
          }}
          treeData={permissionTreeData}
          style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px' }}
        />
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
          已选择 {selectedPermissions.length} 个权限
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;