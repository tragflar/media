import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, Form, Select, Tree, message, Row, Col } from 'antd';
import { KeyOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined, MenuOutlined, ApiOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

interface Permission {
  id: string;
  permissionName: string;
  permissionCode: string;
  permissionType: 'menu' | 'button' | 'api';
  parentId: string | null;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
}

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [form] = Form.useForm();
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  
  // 模拟权限数据
  const mockPermissions: Permission[] = [
    {
      id: '1',
      permissionName: '系统管理',
      permissionCode: 'system',
      permissionType: 'menu',
      parentId: null,
      description: '系统管理模块',
      status: 'active',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: '2',
      permissionName: '用户管理',
      permissionCode: 'user:read',
      permissionType: 'menu',
      parentId: '1',
      description: '用户信息查看',
      status: 'active',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: '3',
      permissionName: '新增用户',
      permissionCode: 'user:write',
      permissionType: 'button',
      parentId: '2',
      description: '新增用户按钮权限',
      status: 'active',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: '4',
      permissionName: '删除用户',
      permissionCode: 'user:delete',
      permissionType: 'button',
      parentId: '2',
      description: '删除用户按钮权限',
      status: 'active',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: '5',
      permissionName: '用户列表API',
      permissionCode: 'api:user:list',
      permissionType: 'api',
      parentId: '2',
      description: '获取用户列表API权限',
      status: 'active',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: '6',
      permissionName: '角色管理',
      permissionCode: 'role:read',
      permissionType: 'menu',
      parentId: '1',
      description: '角色信息查看',
      status: 'active',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: '7',
      permissionName: '权限管理',
      permissionCode: 'permission:read',
      permissionType: 'menu',
      parentId: '1',
      description: '权限信息查看',
      status: 'active',
      createTime: '2024-01-01 00:00:00'
    }
  ];
  
  useEffect(() => {
    loadPermissions();
  }, []);
  
  const loadPermissions = async () => {
    setLoading(true);
    setTimeout(() => {
      setPermissions(mockPermissions);
      setExpandedKeys(['1', '2', '6', '7']); // 默认展开一些节点
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
  
  const getTypeTag = (type: string) => {
    const typeMap = {
      'menu': { color: 'blue', text: '菜单', icon: <MenuOutlined /> },
      'button': { color: 'green', text: '按钮', icon: <KeyOutlined /> },
      'api': { color: 'orange', text: 'API', icon: <ApiOutlined /> }
    };
    const config = typeMap[type as keyof typeof typeMap] || { color: 'default', text: '未知', icon: null };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };
  
  const buildTreeData = (permissions: Permission[]): DataNode[] => {
    const permissionMap = new Map<string, Permission>();
    permissions.forEach(permission => {
      permissionMap.set(permission.id, permission);
    });
    
    const buildNode = (permission: Permission): DataNode => {
      const children = permissions
        .filter(p => p.parentId === permission.id)
        .map(child => buildNode(child));
      
      return {
        key: permission.id,
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{permission.permissionName}</span>
            {getTypeTag(permission.permissionType)}
            <Tag>{permission.permissionCode}</Tag>
          </div>
        ),
        children: children.length > 0 ? children : undefined
      };
    };
    
    return permissions
      .filter(permission => permission.parentId === null)
      .map(rootPermission => buildNode(rootPermission));
  };
  
  const handleEdit = (record: Permission) => {
    setEditingPermission(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };
  
  const handleAdd = () => {
    setEditingPermission(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  const handleDelete = (record: Permission) => {
    // 检查是否有子权限
    const hasChildren = permissions.some(p => p.parentId === record.id);
    if (hasChildren) {
      message.error('该权限下还有子权限，无法删除');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除权限 "${record.permissionName}" 吗？`,
      onOk: () => {
        setPermissions(permissions.filter(permission => permission.id !== record.id));
        message.success('删除成功');
      }
    });
  };
  
  const handleViewDetail = (record: Permission) => {
    const parentPermission = permissions.find(p => p.id === record.parentId);
    
    Modal.info({
      title: '权限详情',
      width: 600,
      content: (
        <div style={{ padding: '16px 0' }}>
          <Row gutter={[16, 16]}>
            <Col span={12}><strong>权限名称:</strong> {record.permissionName}</Col>
            <Col span={12}><strong>权限代码:</strong> {record.permissionCode}</Col>
            <Col span={12}><strong>权限类型:</strong> {getTypeTag(record.permissionType)}</Col>
            <Col span={12}><strong>状态:</strong> {getStatusTag(record.status)}</Col>
            <Col span={24}><strong>父级权限:</strong> {parentPermission ? parentPermission.permissionName : '无'}</Col>
            <Col span={24}><strong>描述:</strong> {record.description}</Col>
            <Col span={24}><strong>创建时间:</strong> {record.createTime}</Col>
          </Row>
        </div>
      )
    });
  };
  
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 检查权限代码唯一性
      const existingPermission = permissions.find(p => 
        p.permissionCode === values.permissionCode && 
        (!editingPermission || p.id !== editingPermission.id)
      );
      
      if (existingPermission) {
        message.error('权限代码已存在，请使用其他代码');
        return;
      }
      
      if (editingPermission) {
        setPermissions(permissions.map(permission => 
          permission.id === editingPermission.id ? { ...permission, ...values } : permission
        ));
        message.success('权限信息更新成功');
      } else {
        const newPermission: Permission = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toLocaleString()
        };
        setPermissions([...permissions, newPermission]);
        message.success('权限添加成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  const columns: ColumnsType<Permission> = [
    {
      title: '权限信息',
      dataIndex: 'permissionName',
      key: 'permissionName',
      width: 200,
      align: 'center',
      render: (text: string, record: Permission) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          <KeyOutlined style={{ color: '#faad14', fontSize: '14px' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      )
    },
    {
      title: '权限代码',
      dataIndex: 'permissionCode',
      key: 'permissionCode',
      width: 180,
      align: 'center',
      render: (code: string) => (
        <Tag style={{ fontFamily: 'monospace' }}>{code}</Tag>
      )
    },
    {
      title: '权限类型',
      dataIndex: 'permissionType',
      key: 'permissionType',
      width: 120,
      align: 'center',
      render: (type: string) => getTypeTag(type)
    },
    {
      title: '父级权限',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 150,
      align: 'center',
      render: (parentId: string | null) => {
        if (!parentId) return <Tag color="default">根权限</Tag>;
        const parent = permissions.find(p => p.id === parentId);
        return parent ? parent.permissionName : '-';
      }
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
      width: 200,
      align: 'center',
      render: (_: any, record: Permission) => (
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
  
  const filteredPermissions = permissions.filter(permission => 
    permission.permissionName.toLowerCase().includes(searchText.toLowerCase()) ||
    permission.permissionCode.toLowerCase().includes(searchText.toLowerCase())
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
              placeholder="搜索权限名称或代码..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 300 }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增权限
            </Button>
          </Col>
        </Row>
      </Card>
      
      <Row gutter={16}>
        {/* 权限树形结构 */}
        <Col xs={24} lg={10}>
          <Card 
            title="权限树形结构"
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0'
            }}
          >
            <Tree
              treeData={buildTreeData(permissions)}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              style={{ background: '#f9f9f9', padding: '16px', borderRadius: '6px' }}
            />
          </Card>
        </Col>
        
        {/* 权限列表 */}
        <Col xs={24} lg={14}>
          <Card 
            title="权限列表"
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0'
            }}
          >
            <Table
              columns={columns}
              dataSource={filteredPermissions}
              rowKey="id"
              loading={loading}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 'max-content' }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
      
      {/* 权限表单模态框 */}
      <Modal
        title={editingPermission ? '编辑权限' : '新增权限'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', parentId: null }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="permissionName"
                label="权限名称"
                rules={[{ required: true, message: '请输入权限名称' }]}
              >
                <Input placeholder="请输入权限名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="permissionCode"
                label="权限代码"
                rules={[{ required: true, message: '请输入权限代码' }]}
              >
                <Input placeholder="请输入权限代码" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="permissionType"
                label="权限类型"
                rules={[{ required: true, message: '请选择权限类型' }]}
              >
                <Select placeholder="请选择权限类型">
                  <Select.Option value="menu">菜单</Select.Option>
                  <Select.Option value="button">按钮</Select.Option>
                  <Select.Option value="api">API</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parentId"
                label="父级权限"
              >
                <Select placeholder="请选择父级权限" allowClear>
                  <Select.Option value={null}>无（根权限）</Select.Option>
                  {permissions
                    .filter(p => !editingPermission || p.id !== editingPermission.id)
                    .map(permission => (
                      <Select.Option key={permission.id} value={permission.id}>
                        {permission.permissionName}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="权限描述"
            rules={[{ required: true, message: '请输入权限描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入权限描述" />
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
    </div>
  );
};

export default PermissionManagement;