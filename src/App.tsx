import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Badge } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  HomeOutlined, 
  FileTextOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  DashboardOutlined,
  ToolOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
  AppstoreOutlined,
  BulbOutlined,
  BookOutlined,
  PictureOutlined,
  EditOutlined,
  CalendarOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAppStore } from './store';

// 导入页面组件
import Home from './pages/Home';
import Login from './pages/Login';
import Breadcrumb from './components/Breadcrumb';

// 导入融媒体工作台页面组件
import ContentManagement from './pages/content/ContentManagement';
import ClueLibrary from './pages/content/ClueLibrary';
import TopicLibrary from './pages/content/TopicLibrary';
import MediaLibrary from './pages/content/MediaLibrary';
import ArticleLibrary from './pages/content/ArticleLibrary';
import TaskManagement from './pages/tasks/TaskManagement';
import DataDashboard from './pages/data/DataDashboard';
import QuickTools from './pages/tools/QuickTools';
import TVScriptLibrary from './pages/content/TVScriptLibrary';
import ShortVideoTasks from './pages/content/ShortVideoTasks';
import LiveStreaming from './pages/content/LiveStreaming';
import Activities from './pages/content/Activities';
import InteractiveManagement from './pages/content/InteractiveManagement';

const { Header, Sider, Content } = Layout;

// 主布局组件
const MainLayout: React.FC = () => {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    user, 
    unreadCount, 
    initializeApp 
  } = useAppStore();
  
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);
  
  const navigate = useNavigate();
  const location = useLocation();

  // 管理 Menu 的展开项（openKeys）为受控状态，确保点击一级菜单可以展开/收起
  const [openKeysState, setOpenKeysState] = useState<string[]>([]);
  useEffect(() => {
    // 折叠时不展开任何子菜单
    if (sidebarCollapsed) {
      setOpenKeysState([]);
      return;
    }
    // 根据当前路由同步展开的菜单
    const path = location.pathname;
    const nextOpen: string[] = [];
    if (path.startsWith('/content')) {
      nextOpen.push('/content');
    }
    if (path.startsWith('/tasks')) nextOpen.push('/tasks');
    if (path.startsWith('/data')) nextOpen.push('/data');
    if (path.startsWith('/tools')) nextOpen.push('/tools');
    setOpenKeysState(nextOpen);
  }, [location.pathname, sidebarCollapsed]);
  
  // 融媒体工作台菜单配置
  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '工作台首页',
    },
    {
      key: '/content',
      icon: <FileTextOutlined />,
      label: '内容版块',
      children: [
        { key: '/content/clues', label: '线索库' },
        { key: '/content/topics', label: '选题库' },
        { key: '/content/media', label: '媒资库' },
        { key: '/content/articles', label: '稿件库' },
        { key: '/content/tv-scripts', label: '电视文稿库' },
        { key: '/content/short-videos', label: '短视频发布' },
        { key: '/content/live', label: '视频直播' },
        { key: '/content/activities', label: '活动管理' },
        { key: '/content/interactive', label: '互动功能' },
      ],
    },
    {
      key: '/tasks',
      icon: <CheckSquareOutlined />,
      label: '任务管理',
    },
    {
      key: '/data',
      icon: <BarChartOutlined />,
      label: '数据分析',
      children: [
        { key: '/data/overview', label: '概要数据' },
        { key: '/data/dashboard', label: '关注数据看板' },
      ],
    },
    {
      key: '/tools',
      icon: <ToolOutlined />,
      label: '快捷入口',
      children: [
        { key: '/tools/business', label: '业务系统' },
        { key: '/tools/media', label: '媒体工具' },
      ],
    },
  ];
  
  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        navigate('/login');
      }
    },
  ];
  
  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    return [path];
  };
  
  // 获取当前展开的菜单项
  const getOpenKeys = () => {
    // 在折叠状态下不展开子菜单
    if (sidebarCollapsed) {
      return [];
    }
    
    const path = location.pathname;
    if (path.startsWith('/content')) {
      return ['/content'];
    }
    if (path.startsWith('/tasks')) {
      return ['/tasks'];
    }
    if (path.startsWith('/data')) {
      return ['/data'];
    }
    if (path.startsWith('/tools')) {
      return ['/tools'];
    }
    return [];
  };
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={sidebarCollapsed}
        style={{
          background: '#001529',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        {/* Logo区域 */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          padding: sidebarCollapsed ? '0' : '0 24px',
          background: '#002140',
          borderBottom: '1px solid #1f1f1f'
        }}>
          <h2 style={{ 
            color: '#fff', 
            margin: 0, 
            fontSize: sidebarCollapsed ? '16px' : '18px',
            fontWeight: 'bold'
          }}>
            {sidebarCollapsed ? '融媒' : '融通新版工作台'}
          </h2>
        </div>
        
        {/* 菜单组件 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          openKeys={openKeysState}
          onOpenChange={(keys) => {
            // 处理子菜单的展开/收起（受控）
            console.log('Menu openChange:', keys);
            if (!sidebarCollapsed) {
              setOpenKeysState(keys as string[]);
            }
          }}
          items={menuItems}
          onClick={({ key, keyPath }) => {
            console.log('Menu clicked:', key, 'keyPath:', keyPath);
            try {
              // 如果点击的是一级菜单项，交给默认展开/收起行为处理，不进行导航
              if (typeof key === 'string' && ['/content', '/tasks', '/data', '/tools'].includes(key)) {
                console.log('Top-level menu clicked, toggle expand/collapse');
                return;
              }
              
              // 对于子菜单项或没有children的菜单项，进行导航
              if (key && typeof key === 'string') {
                navigate(key);
              }
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }}
          onSelect={({ key, keyPath }) => {
            // 处理子菜单项选择进行导航
            console.log('Menu selected:', key, 'keyPath:', keyPath);
            if (key && typeof key === 'string') {
              navigate(key);
            }
          }}
          // 在折叠状态下，子菜单以弹出形式显示
          inlineCollapsed={sidebarCollapsed}
          // 允许选择有子菜单的父级菜单项
          selectable={true}
          style={{ 
            background: '#001529',
            border: 'none',
            // 确保菜单项可以点击
            pointerEvents: 'auto'
          }}
        />
      </Sider>
      
      <Layout>
        {/* 顶部标题栏 */}
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#001529'
            }}
          />
          
          <Space size="middle">
            <Badge count={unreadCount} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                style={{ fontSize: '16px' }}
              />
            </Badge>
            
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: '个人资料'
                  },
                  {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: '系统设置'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    danger: true,
                    onClick: () => {
                      // 清除localStorage
                      localStorage.removeItem('isLoggedIn');
                      localStorage.removeItem('currentUser');
                      // 清除store状态
                      useAppStore.getState().setUser(null);
                      useAppStore.getState().setAuthenticated(false);
                      // 跳转到登录页
                      navigate('/login');
                    }
                  }
                ]
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  size="small" 
                  src={user?.avatar}
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff' }}
                />
                <span style={{ color: '#001529' }}>
                  {user?.name || '用户'} ({user?.role || '角色'})
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        {/* 主内容区域 */}
        <Content style={{ 
          margin: '16px', 
          padding: '24px',
          background: '#f0f2f5',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)',
          overflow: 'auto'
        }}>
          <Breadcrumb />
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* 内容版块路由 */}
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/content/clues" element={<ClueLibrary />} />
            <Route path="/content/topics" element={<TopicLibrary />} />
            <Route path="/content/media" element={<MediaLibrary />} />
            <Route path="/content/articles" element={<ArticleLibrary />} />
            <Route path="/content/tv-scripts" element={<TVScriptLibrary />} />
            <Route path="/content/short-videos" element={<ShortVideoTasks />} />
            <Route path="/content/live" element={<LiveStreaming />} />
            <Route path="/content/activities" element={<Activities />} />
            <Route path="/content/interactive" element={<InteractiveManagement />} />
            
            {/* 任务管理路由 */}
            <Route path="/tasks" element={<TaskManagement />} />
            
            {/* 数据分析路由 */}
            <Route path="/data" element={<DataDashboard />} />
            <Route path="/data/overview" element={<DataDashboard />} />
            <Route path="/data/dashboard" element={<DataDashboard />} />
            
            {/* 快捷入口路由 */}
            <Route path="/tools" element={<QuickTools />} />
            <Route path="/tools/business" element={<QuickTools />} />
            <Route path="/tools/media" element={<QuickTools />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

// 路由守卫组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// 主应用组件
const App: React.FC = () => {
  const { isAuthenticated, initializeApp } = useAppStore();
  
  // 初始化应用
  React.useEffect(() => {
    initializeApp();
  }, [initializeApp]);
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
};

export default App;
