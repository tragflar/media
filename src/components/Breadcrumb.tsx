import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  FileTextOutlined, 
  CheckSquareOutlined, 
  BarChartOutlined, 
  ToolOutlined,
  BulbOutlined,
  BookOutlined,
  PictureOutlined,
  EditOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  HeartOutlined,
  AuditOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons';

// 融媒体工作台路由配置映射
const routeConfig: Record<string, { title: string; icon?: React.ReactNode }> = {
  '/': { title: '工作台首页', icon: <HomeOutlined /> },
  
  // 内容版块
  '/content': { title: '内容版块', icon: <FileTextOutlined /> },
  '/content/clues': { title: '线索库', icon: <BulbOutlined /> },
  '/content/topics': { title: '选题库', icon: <BookOutlined /> },
  '/content/media': { title: '媒资库', icon: <PictureOutlined /> },
  '/content/articles': { title: '稿件库', icon: <EditOutlined /> },
  '/content/tv-scripts': { title: '电视文稿库', icon: <VideoCameraOutlined /> },
  '/content/short-videos': { title: '短视频发布', icon: <PlayCircleOutlined /> },
  '/content/live': { title: '视频直播', icon: <VideoCameraOutlined /> },
  '/content/activities': { title: '活动管理', icon: <CalendarOutlined /> },
  '/content/interactive': { title: '互动功能', icon: <HeartOutlined /> },
  
  // 任务管理
  '/tasks': { title: '任务管理', icon: <CheckSquareOutlined /> },
  
  // 数据分析
  '/data': { title: '数据分析', icon: <BarChartOutlined /> },
  '/data/overview': { title: '概要数据', icon: <DashboardOutlined /> },
  '/data/dashboard': { title: '关注数据看板', icon: <DashboardOutlined /> },
  
  // 快捷入口
  '/tools': { title: '快捷入口', icon: <ToolOutlined /> },
  '/tools/business': { title: '业务系统', icon: <AppstoreOutlined /> },
  '/tools/media': { title: '媒体工具', icon: <SettingOutlined /> },
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 生成面包屑路径
  const generateBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [];
    
    // 添加首页
    items.push({
      title: (
        <span 
          style={{ cursor: location.pathname === '/' ? 'default' : 'pointer' }}
          onClick={() => location.pathname !== '/' && navigate('/')}
        >
          {routeConfig['/'].icon}
          <span style={{ marginLeft: 4 }}>{routeConfig['/'].title}</span>
        </span>
      ),
    });
    
    // 添加其他路径
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const config = routeConfig[currentPath];
      
      if (config) {
        const isLast = index === pathSegments.length - 1;
        items.push({
          title: (
            <span 
              style={{ cursor: isLast ? 'default' : 'pointer' }}
              onClick={() => !isLast && navigate(currentPath)}
            >
              {config.icon}
              <span style={{ marginLeft: 4 }}>{config.title}</span>
            </span>
          ),
        });
      }
    });
    
    return items;
  };
  
  return (
    <div style={{ 
      borderBottom: '1px solid #f0f0f0', 
      marginBottom: '16px' 
    }}>
      <AntBreadcrumb 
        items={generateBreadcrumbItems()}
        style={{ fontSize: '14px' }}
      />
    </div>
  );
};

export default Breadcrumb;