import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, Select, message, Tabs } from 'antd';
import { AppstoreOutlined, SettingOutlined, BulbOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';

const { Option } = Select;

// 投票相关类型和组件
interface VoteItem {
  id: string;
  title: string;
  status: 'draft' | 'ongoing' | 'finished';
  options: number;
}

const VotingTab: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState<VoteItem[]>([
    { id: '1', title: '最受欢迎栏目投票', status: 'finished', options: 5 },
    { id: '2', title: '城市地标评选', status: 'ongoing', options: 8 },
  ]);

  const getStatusTag = (s: VoteItem['status']) => {
    const map = { draft: { color: 'default', text: '草稿' }, ongoing: { color: 'processing', text: '进行中' }, finished: { color: 'success', text: '已结束' } };
    const c = map[s];
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const columns: ColumnsType<VoteItem> = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 260 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: getStatusTag },
    { title: '选项数', dataIndex: 'options', key: 'options', width: 120 },
  ];

  const onAdd = async () => {
    try {
      const v = await form.validateFields();
      const item: VoteItem = { id: String(Date.now()), title: v.title, status: v.status, options: Number(v.options) };
      setData(prev => [item, ...prev]);
      message.success('已创建投票');
      setModalVisible(false);
      form.resetFields();
    } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Input.Search placeholder="搜索投票" style={{ width: 300 }} allowClear />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>创建投票</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />

      <Modal open={modalVisible} title="创建投票" onCancel={() => setModalVisible(false)} onOk={onAdd} destroyOnHidden>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="draft" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="finished">已结束</Option>
            </Select>
          </Form.Item>
          <Form.Item name="options" label="选项数" rules={[{ required: true }]}>
            <Input type="number" placeholder="如：5" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 抽奖相关类型和组件
interface LotteryItem {
  id: string;
  title: string;
  status: 'draft' | 'ongoing' | 'finished';
  prizeCount: number;
}

const LotteryTab: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState<LotteryItem[]>([
    { id: '1', title: '春节新春抽奖', status: 'finished', prizeCount: 100 },
    { id: '2', title: '用户反馈抽奖', status: 'ongoing', prizeCount: 20 },
  ]);

  const getStatusTag = (s: LotteryItem['status']) => {
    const map = { draft: { color: 'default', text: '草稿' }, ongoing: { color: 'processing', text: '进行中' }, finished: { color: 'success', text: '已结束' } };
    const c = map[s];
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const columns: ColumnsType<LotteryItem> = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 260 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: getStatusTag },
    { title: '奖品数量', dataIndex: 'prizeCount', key: 'prizeCount', width: 140 },
  ];

  const onAdd = async () => {
    try {
      const v = await form.validateFields();
      const item: LotteryItem = { id: String(Date.now()), title: v.title, status: v.status, prizeCount: Number(v.prizeCount) };
      setData(prev => [item, ...prev]);
      message.success('已创建抽奖活动');
      setModalVisible(false);
      form.resetFields();
    } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Input.Search placeholder="搜索抽奖活动" style={{ width: 300 }} allowClear />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>创建抽奖</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />

      <Modal open={modalVisible} title="创建抽奖" onCancel={() => setModalVisible(false)} onOk={onAdd} destroyOnHidden>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="draft" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="finished">已结束</Option>
            </Select>
          </Form.Item>
          <Form.Item name="prizeCount" label="奖品数量" rules={[{ required: true }]}>
            <Input type="number" placeholder="如：20" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 答题相关类型和组件
interface QuizItem {
  id: string;
  title: string;
  status: 'draft' | 'ongoing' | 'finished';
  questionCount: number;
}

const QuizTab: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [data, setData] = useState<QuizItem[]>([
    { id: '1', title: '城市文明知识问答', status: 'finished', questionCount: 10 },
    { id: '2', title: '冬季安全知识答题', status: 'ongoing', questionCount: 8 },
  ]);

  const getStatusTag = (s: QuizItem['status']) => {
    const map = { draft: { color: 'default', text: '草稿' }, ongoing: { color: 'processing', text: '进行中' }, finished: { color: 'success', text: '已结束' } };
    const c = map[s];
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const columns: ColumnsType<QuizItem> = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 260 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: getStatusTag },
    { title: '题目数量', dataIndex: 'questionCount', key: 'questionCount', width: 120 },
  ];

  const onAdd = async () => {
    try {
      const v = await form.validateFields();
      const item: QuizItem = { id: String(Date.now()), title: v.title, status: v.status, questionCount: Number(v.questionCount) };
      setData(prev => [item, ...prev]);
      message.success('已创建答题活动');
      setModalVisible(false);
      form.resetFields();
    } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Input.Search placeholder="搜索答题活动" style={{ width: 300 }} allowClear />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>创建答题</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />

      <Modal open={modalVisible} title="创建答题" onCancel={() => setModalVisible(false)} onOk={onAdd} destroyOnHidden>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="draft" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="finished">已结束</Option>
            </Select>
          </Form.Item>
          <Form.Item name="questionCount" label="题目数量" rules={[{ required: true }]}>
            <Input type="number" placeholder="如：10" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 主组件
const InteractiveManagement: React.FC = () => {
  const tabItems: TabsProps['items'] = [
    {
      key: 'voting',
      label: <Space><AppstoreOutlined />投票</Space>,
      children: <VotingTab />,
    },
    {
      key: 'lottery',
      label: <Space><SettingOutlined />抽奖</Space>,
      children: <LotteryTab />,
    },
    {
      key: 'quiz',
      label: <Space><BulbOutlined />答题</Space>,
      children: <QuizTab />,
    },
  ];

  return (
    <Card title="互动功能管理" style={{ minHeight: '100%' }}>
      <Tabs defaultActiveKey="voting" type="card" items={tabItems} />
    </Card>
  );
};

export default InteractiveManagement;