import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, DatePicker, Select, message } from 'antd';
import { VideoCameraOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface LiveStream {
  id: string;
  title: string;
  status: 'planned' | 'live' | 'ended';
  platform: '自有平台' | '视频号' | '抖音';
  startTime?: string;
}

const LiveStreaming: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState<LiveStream[]>([
    { id: '1', title: '市政府新闻发布会直播', status: 'ended', platform: '自有平台', startTime: '2024-01-12 15:00' },
    { id: '2', title: '城市马拉松赛事直播', status: 'planned', platform: '视频号', startTime: '2024-01-20 08:00' },
  ]);

  const getStatusTag = (s: LiveStream['status']) => {
    const map = { planned: { color: 'processing', text: '已排期' }, live: { color: 'success', text: '直播中' }, ended: { color: 'default', text: '已结束' } };
    const c = map[s];
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const columns: ColumnsType<LiveStream> = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 260 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: getStatusTag },
    { title: '平台', dataIndex: 'platform', key: 'platform', width: 120 },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 160 },
  ];

  const onAdd = async () => {
    try {
      const v = await form.validateFields();
      const item: LiveStream = { id: String(Date.now()), title: v.title, status: v.status, platform: v.platform, startTime: v.startTime?.format('YYYY-MM-DD HH:mm') };
      setData(prev => [item, ...prev]);
      message.success('已创建直播排期');
      setModalVisible(false);
      form.resetFields();
    } catch {}
  };

  return (
    <div>
      <Card title={<Space><VideoCameraOutlined />视频直播</Space>} extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>创建直播</Button>} style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 12 }}>
          <Input.Search placeholder="搜索直播主题" style={{ width: 300 }} allowClear />
        </Space>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
      </Card>

      <Modal open={modalVisible} title="创建直播" onCancel={() => setModalVisible(false)} onOk={onAdd} destroyOnHidden>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="直播标题" rules={[{ required: true }]}>
            <Input placeholder="如：市政府新闻发布会直播" />
          </Form.Item>
          <Form.Item name="platform" label="平台" initialValue="自有平台" rules={[{ required: true }]}>
            <Select>
              <Option value="自有平台">自有平台</Option>
              <Option value="视频号">视频号</Option>
              <Option value="抖音">抖音</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="planned" rules={[{ required: true }]}>
            <Select>
              <Option value="planned">已排期</Option>
              <Option value="live">直播中</Option>
              <Option value="ended">已结束</Option>
            </Select>
          </Form.Item>
          <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LiveStreaming;