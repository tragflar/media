import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, Select, Upload, message } from 'antd';
import { PlayCircleOutlined, PlusOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface ShortVideoTask {
  id: string;
  title: string;
  platform: '抖音' | '快手' | '视频号' | 'B站';
  status: 'draft' | 'scheduled' | 'published';
  owner: string;
  publishTime?: string;
}

const ShortVideoTasks: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState<ShortVideoTask[]>([
    { id: '1', title: '城市夜景VLOG', platform: '抖音', status: 'published', owner: '新媒体组', publishTime: '2024-01-12 20:00' },
    { id: '2', title: '早新闻60秒', platform: '视频号', status: 'scheduled', owner: '新媒体组', publishTime: '2024-01-16 08:00' },
  ]);

  const getStatusTag = (s: ShortVideoTask['status']) => {
    const map = { draft: { color: 'default', text: '草稿' }, scheduled: { color: 'processing', text: '已排期' }, published: { color: 'success', text: '已发布' } };
    const c = map[s];
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const columns: ColumnsType<ShortVideoTask> = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 240, render: (t) => (<Space><PlayCircleOutlined />{t}</Space>) },
    { title: '平台', dataIndex: 'platform', key: 'platform', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: getStatusTag },
    { title: '负责人', dataIndex: 'owner', key: 'owner', width: 120, render: (t) => (<Space><UserOutlined />{t}</Space>) },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', width: 160 },
  ];

  const onAdd = async () => {
    try {
      const v = await form.validateFields();
      const item: ShortVideoTask = {
        id: String(Date.now()),
        title: v.title,
        platform: v.platform,
        status: v.status,
        owner: v.owner,
        publishTime: v.publishTime,
      };
      setData(prev => [item, ...prev]);
      message.success('已新增短视频任务');
      setModalVisible(false);
      form.resetFields();
    } catch {}
  };

  return (
    <div>
      <Card
        title={<Space><PlayCircleOutlined />短视频发布任务</Space>}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>新增任务</Button>}
        style={{ marginBottom: 16 }}
      >
        <Space style={{ marginBottom: 12 }}>
          <Input.Search placeholder="搜索标题/平台" style={{ width: 300 }} allowClear />
          <Upload showUploadList={false} beforeUpload={() => { message.info('模拟上传视频'); return false; }}>
            <Button icon={<UploadOutlined />}>上传视频</Button>
          </Upload>
        </Space>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
      </Card>

      <Modal open={modalVisible} title="新增短视频任务" onCancel={() => setModalVisible(false)} onOk={onAdd} destroyOnHidden>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="如：早新闻60秒" />
          </Form.Item>
          <Form.Item name="platform" label="平台" initialValue="抖音" rules={[{ required: true }] }>
            <Select>
              <Option value="抖音">抖音</Option>
              <Option value="视频号">视频号</Option>
              <Option value="快手">快手</Option>
              <Option value="B站">B站</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="draft" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="scheduled">已排期</Option>
              <Option value="published">已发布</Option>
            </Select>
          </Form.Item>
          <Form.Item name="owner" label="负责人" rules={[{ required: true }]}>
            <Input placeholder="部门/人员" />
          </Form.Item>
          <Form.Item name="publishTime" label="发布时间">
            <Input placeholder="例如：2024-01-16 08:00" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShortVideoTasks;