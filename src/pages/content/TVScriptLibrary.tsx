import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, Select, DatePicker, message } from 'antd';
import { EditOutlined, PlusOutlined, FileTextOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface TVScriptItem {
  id: string;
  title: string;
  program: string; // 节目名称
  status: 'draft' | 'review' | 'approved' | 'archived';
  editor: string;
  createTime: string;
  updateTime: string;
}

const TVScriptLibrary: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState<TVScriptItem[]>([
    { id: '1', title: '晚间新闻-导语与要闻', program: '晚间新闻', status: 'approved', editor: '张编辑', createTime: '2024-01-10 10:00', updateTime: '2024-01-10 18:00' },
    { id: '2', title: '城市故事-第12期脚本', program: '城市故事', status: 'review', editor: '李编导', createTime: '2024-01-11 09:20', updateTime: '2024-01-11 15:40' },
  ]);

  const getStatusTag = (s: TVScriptItem['status']) => {
    const map = {
      draft: { color: 'default', text: '草稿' },
      review: { color: 'processing', text: '审核中' },
      approved: { color: 'success', text: '已通过' },
      archived: { color: 'warning', text: '已归档' },
    };
    const c = map[s];
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const columns: ColumnsType<TVScriptItem> = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 240, render: (t) => (<Space><FileTextOutlined />{t}</Space>) },
    { title: '节目', dataIndex: 'program', key: 'program', width: 160 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: getStatusTag },
    { title: '编辑', dataIndex: 'editor', key: 'editor', width: 120, render: (t) => (<Space><UserOutlined />{t}</Space>) },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 160 },
  ];

  const onAdd = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toLocaleString('zh-CN', { hour12: false });
      const item: TVScriptItem = {
        id: String(Date.now()),
        title: values.title,
        program: values.program,
        status: values.status,
        editor: values.editor,
        createTime: now,
        updateTime: now,
      };
      setData(prev => [item, ...prev]);
      message.success('已新增电视文稿');
      setModalVisible(false);
      form.resetFields();
    } catch {}
  };

  return (
    <div>
      <Card
        title={<Space><EditOutlined />电视文稿库</Space>}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>新增文稿</Button>}
        style={{ marginBottom: 16 }}
      >
        <Space style={{ marginBottom: 12 }}>
          <Input.Search placeholder="搜索标题/节目" style={{ width: 300 }} allowClear />
        </Space>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
      </Card>

      <Modal
        open={modalVisible}
        title="新增电视文稿"
        onCancel={() => setModalVisible(false)}
        onOk={onAdd}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="文稿标题" rules={[{ required: true, message: '请输入文稿标题' }]}>
            <Input placeholder="例如：晚间新闻-导语" />
          </Form.Item>
          <Form.Item name="program" label="所属节目" rules={[{ required: true, message: '请输入节目名称' }]}>
            <Input placeholder="例如：晚间新闻" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="draft" rules={[{ required: true }] }>
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="review">审核中</Option>
              <Option value="approved">已通过</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>
          <Form.Item name="editor" label="编辑/编导" rules={[{ required: true, message: '请输入编辑姓名' }]}>
            <Input placeholder="例如：张编辑" />
          </Form.Item>
          <Form.Item name="schedule" label="计划播出时间">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TVScriptLibrary;