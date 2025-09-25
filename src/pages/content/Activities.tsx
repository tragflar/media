import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, DatePicker, Select, message } from 'antd';
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface ActivityItem {
  id: string;
  title: string;
  type: '线下活动' | '线上活动' | '征集活动';
  status: 'planning' | 'ongoing' | 'finished';
  organizer: string;
  date?: string;
}

const Activities: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState<ActivityItem[]>([
    { id: '1', title: '春节文化展演', type: '线下活动', status: 'finished', organizer: '文化局', date: '2024-01-15' },
    { id: '2', title: '市民摄影作品征集', type: '征集活动', status: 'ongoing', organizer: '融媒体中心', date: '2024-01-01 ~ 2024-01-31' },
  ]);

  const getStatusTag = (s: ActivityItem['status']) => {
    const map = { planning: { color: 'processing', text: '筹备中' }, ongoing: { color: 'success', text: '进行中' }, finished: { color: 'default', text: '已结束' } };
    const c = map[s];
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const columns: ColumnsType<ActivityItem> = [
    { title: '活动标题', dataIndex: 'title', key: 'title', width: 240 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: getStatusTag },
    { title: '主办方', dataIndex: 'organizer', key: 'organizer', width: 140 },
    { title: '日期', dataIndex: 'date', key: 'date', width: 180 },
  ];

  const onAdd = async () => {
    try {
      const v = await form.validateFields();
      const item: ActivityItem = { id: String(Date.now()), title: v.title, type: v.type, status: v.status, organizer: v.organizer, date: v.date?.format('YYYY-MM-DD') };
      setData(prev => [item, ...prev]);
      message.success('已创建活动');
      setModalVisible(false);
      form.resetFields();
    } catch {}
  };

  return (
    <div>
      <Card title={<Space><CalendarOutlined />活动管理</Space>} extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>创建活动</Button>} style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 12 }}>
          <Input.Search placeholder="搜索活动" style={{ width: 300 }} allowClear />
        </Space>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
      </Card>

      <Modal open={modalVisible} title="创建活动" onCancel={() => setModalVisible(false)} onOk={onAdd} destroyOnHidden>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="活动标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="类型" initialValue="线下活动" rules={[{ required: true }] }>
            <Select>
              <Option value="线下活动">线下活动</Option>
              <Option value="线上活动">线上活动</Option>
              <Option value="征集活动">征集活动</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="planning" rules={[{ required: true }]}>
            <Select>
              <Option value="planning">筹备中</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="finished">已结束</Option>
            </Select>
          </Form.Item>
          <Form.Item name="organizer" label="主办方" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Activities;