import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Space, Table, Tag, Button } from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  EyeOutlined,
  LikeOutlined,
  ShareAltOutlined,
  MessageOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ContentRankItem {
  id: string;
  title: string;
  type: string;
  author: string;
  publishTime: string;
  readCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  trend: 'up' | 'down' | 'stable';
}

const DataDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [contentType, setContentType] = useState('all');

  // 传播效果统计数据
  const propagationStats = [
    {
      title: '总阅读量',
      value: 1234567,
      prefix: <EyeOutlined style={{ color: '#1890ff' }} />,
      suffix: <ArrowUpOutlined style={{ color: '#52c41a' }} />,
      valueStyle: { color: '#1890ff' },
      change: '+12.5%'
    },
    {
      title: '总点赞数',
      value: 45678,
      prefix: <LikeOutlined style={{ color: '#eb2f96' }} />,
      suffix: <ArrowUpOutlined style={{ color: '#52c41a' }} />,
      valueStyle: { color: '#eb2f96' },
      change: '+8.3%'
    },
    {
      title: '总分享数',
      value: 12345,
      prefix: <ShareAltOutlined style={{ color: '#52c41a' }} />,
      suffix: <ArrowUpOutlined style={{ color: '#52c41a' }} />,
      valueStyle: { color: '#52c41a' },
      change: '+15.7%'
    },
    {
      title: '总评论数',
      value: 8901,
      prefix: <MessageOutlined style={{ color: '#fa8c16' }} />,
      suffix: <ArrowDownOutlined style={{ color: '#ff4d4f' }} />,
      valueStyle: { color: '#fa8c16' },
      change: '-2.1%'
    }
  ];

  // 稿件传播TOP榜数据
  const contentRankData: ContentRankItem[] = [
    {
      id: '1',
      title: '市政府召开重要新闻发布会',
      type: '新闻稿件',
      author: '张记者',
      publishTime: '2024-01-20',
      readCount: 156789,
      likeCount: 2345,
      shareCount: 567,
      commentCount: 123,
      trend: 'up'
    },
    {
      id: '2',
      title: '春节文化活动精彩纷呈',
      type: '文化报道',
      author: '李编辑',
      publishTime: '2024-01-19',
      readCount: 134567,
      likeCount: 1987,
      shareCount: 432,
      commentCount: 98,
      trend: 'up'
    },
    {
      id: '3',
      title: '城市夜景美如画',
      type: '短视频',
      author: '王摄像',
      publishTime: '2024-01-18',
      readCount: 98765,
      likeCount: 3456,
      shareCount: 789,
      commentCount: 234,
      trend: 'stable'
    },
    {
      id: '4',
      title: '环保政策实施效果显著',
      type: '深度报道',
      author: '赵记者',
      publishTime: '2024-01-17',
      readCount: 87654,
      likeCount: 1234,
      shareCount: 345,
      commentCount: 67,
      trend: 'down'
    },
    {
      id: '5',
      title: '新春特别节目预告',
      type: '视频直播',
      author: '钱导演',
      publishTime: '2024-01-16',
      readCount: 76543,
      likeCount: 2109,
      shareCount: 456,
      commentCount: 89,
      trend: 'up'
    }
  ];

  // 阅读量趋势图配置
  const getReadTrendOption = () => {
    return {
      title: {
        text: '近7天阅读量趋势',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['01-14', '01-15', '01-16', '01-17', '01-18', '01-19', '01-20']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '阅读量',
          type: 'line',
          smooth: true,
          data: [45000, 52000, 48000, 61000, 58000, 67000, 72000],
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
              ]
            }
          }
        }
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };
  };

  // 内容类型分布饼图配置
  const getContentTypeOption = () => {
    return {
      title: {
        text: '内容类型分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '内容类型',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          data: [
            { value: 35, name: '新闻稿件', itemStyle: { color: '#1890ff' } },
            { value: 25, name: '短视频', itemStyle: { color: '#52c41a' } },
            { value: 20, name: '图片报道', itemStyle: { color: '#fa8c16' } },
            { value: 12, name: '直播活动', itemStyle: { color: '#eb2f96' } },
            { value: 8, name: '其他', itemStyle: { color: '#722ed1' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // 平台传播对比柱状图配置
  const getPlatformCompareOption = () => {
    return {
      title: {
        text: '各平台传播效果对比',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: 30,
        data: ['阅读量', '点赞数', '分享数']
      },
      xAxis: {
        type: 'category',
        data: ['微信公众号', '微博', '抖音', '今日头条', '官方网站']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '阅读量',
          type: 'bar',
          data: [45000, 38000, 52000, 41000, 28000],
          itemStyle: { color: '#1890ff' }
        },
        {
          name: '点赞数',
          type: 'bar',
          data: [2800, 3200, 4100, 2900, 1800],
          itemStyle: { color: '#52c41a' }
        },
        {
          name: '分享数',
          type: 'bar',
          data: [1200, 1500, 1800, 1300, 800],
          itemStyle: { color: '#fa8c16' }
        }
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };
  };

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'down':
        return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <span style={{ color: '#8c8c8c' }}>-</span>;
    }
  };

  // 内容排行榜表格列配置
  const rankColumns: ColumnsType<ContentRankItem> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      align: 'center',
      render: (_, __, index) => {
        const rank = index + 1;
        return (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: rank <= 3 ? '#fa8c16' : '#f0f0f0',
            color: rank <= 3 ? 'white' : '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {rank}
          </div>
        );
      }
    },
    {
      title: '内容标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
          <Space size={4}>
            <Tag>{record.type}</Tag>
            <span style={{ color: '#8c8c8c', fontSize: '12px' }}>by {record.author}</span>
          </Space>
        </div>
      )
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 100,
      align: 'center'
    },
    {
      title: '阅读量',
      dataIndex: 'readCount',
      key: 'readCount',
      width: 100,
      align: 'center',
      render: (count) => count.toLocaleString()
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
      align: 'center',
      render: (count) => count.toLocaleString()
    },
    {
      title: '分享数',
      dataIndex: 'shareCount',
      key: 'shareCount',
      width: 80,
      align: 'center',
      render: (count) => count.toLocaleString()
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 80,
      align: 'center',
      render: (count) => count.toLocaleString()
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 60,
      align: 'center',
      render: getTrendIcon
    }
  ];

  return (
    <div style={{ background: 'transparent' }}>
      {/* 页面标题和筛选 */}
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
              关注数据看板
            </h2>
            <p style={{ margin: 0, color: '#8c8c8c' }}>
              实时监控内容传播效果，分析用户互动数据
            </p>
          </Col>
          <Col>
            <Space>
              <Select
                value={timeRange}
                onChange={setTimeRange}
                style={{ width: 120 }}
              >
                <Option value="day">今日</Option>
                <Option value="week">近7天</Option>
                <Option value="month">近30天</Option>
                <Option value="quarter">近3个月</Option>
              </Select>
              <Select
                value={contentType}
                onChange={setContentType}
                style={{ width: 120 }}
              >
                <Option value="all">全部类型</Option>
                <Option value="news">新闻稿件</Option>
                <Option value="video">短视频</Option>
                <Option value="live">直播活动</Option>
              </Select>
              <RangePicker size="middle" />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 传播效果统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        {propagationStats.map((stat, index) => (
          <Col xs={12} sm={6} key={`stat-${index}`}>
            <Card 
              style={{
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                border: '1px solid #f0f0f0'
              }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={stat.valueStyle}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                较昨日 <span style={{ color: stat.change.startsWith('+') ? '#52c41a' : '#ff4d4f' }}>
                  {stat.change}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 数据图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        {/* 阅读量趋势图 */}
        <Col xs={24} lg={12}>
          <Card 
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0',
              height: '400px'
            }}
          >
            <ReactECharts 
              option={getReadTrendOption()} 
              style={{ height: '350px' }}
            />
          </Card>
        </Col>

        {/* 内容类型分布 */}
        <Col xs={24} lg={12}>
          <Card 
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0',
              height: '400px'
            }}
          >
            <ReactECharts 
              option={getContentTypeOption()} 
              style={{ height: '350px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 平台传播对比 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col span={24}>
          <Card 
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              border: '1px solid #f0f0f0',
              height: '400px'
            }}
          >
            <ReactECharts 
              option={getPlatformCompareOption()} 
              style={{ height: '350px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 内容传播排行榜 */}
      <Card 
        title={
          <Space>
            <TrophyOutlined style={{ color: '#fa8c16' }} />
            <span>内容传播TOP榜</span>
          </Space>
        }
        extra={
          <Button type="link" icon={<EyeOutlined />}>
            查看更多
          </Button>
        }
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          border: '1px solid #f0f0f0'
        }}
      >
        <Table
          columns={rankColumns}
          dataSource={contentRankData}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default DataDashboard;