import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 用户信息接口
interface UserInfo {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  department: string;
  permissions: string[];
}

// 统计数据接口
interface Statistics {
  todayArticles: number;
  pendingReviews: number;
  mediaAssets: number;
  totalViews: number;
  onlineUsers: number;
  systemStatus: 'normal' | 'warning' | 'error';
}

// 最近活动接口
interface RecentActivity {
  id: string;
  type: 'create' | 'edit' | 'review' | 'publish' | 'upload';
  title: string;
  user: string;
  time: string;
  status: 'success' | 'pending' | 'failed';
}

// 通知接口
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  content: string;
  time: string;
  read: boolean;
}

// 应用状态接口
interface AppState {
  // 用户相关
  user: UserInfo | null;
  isAuthenticated: boolean;
  
  // 统计数据
  statistics: Statistics;
  
  // 最近活动
  recentActivities: RecentActivity[];
  
  // 通知
  notifications: Notification[];
  unreadCount: number;
  
  // UI状态
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  
  // 操作方法
  setUser: (user: UserInfo | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  updateStatistics: (stats: Partial<Statistics>) => void;
  addActivity: (activity: Omit<RecentActivity, 'id'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  initializeApp: () => void;
}

// 创建store
export const useAppStore = create<AppState>()(devtools(
  (set, get) => ({
    // 初始状态
    user: null,
    isAuthenticated: false,
    statistics: {
      todayArticles: 0,
      pendingReviews: 0,
      mediaAssets: 0,
      totalViews: 0,
      onlineUsers: 0,
      systemStatus: 'normal'
    },
    recentActivities: [],
    notifications: [],
    unreadCount: 0,
    sidebarCollapsed: false,
    theme: 'light',
    loading: false,

    // 操作方法
    setUser: (user) => set({ user }),
    
    setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
    
    updateStatistics: (stats) => set((state) => ({
      statistics: { ...state.statistics, ...stats }
    })),
    
    addActivity: (activity) => set((state) => {
      const newActivity: RecentActivity = {
        ...activity,
        id: Date.now().toString(),
      };
      return {
        recentActivities: [newActivity, ...state.recentActivities].slice(0, 20) // 只保留最近20条
      };
    }),
    
    addNotification: (notification) => set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        time: new Date().toISOString(),
        read: false
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    }),
    
    markNotificationRead: (id) => set((state) => {
      const notifications = state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter(n => !n.read).length;
      return { notifications, unreadCount };
    }),
    
    markAllNotificationsRead: () => set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    })),
    
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    
    setTheme: (theme) => set({ theme }),
    
    setLoading: (loading) => set({ loading }),
    
    // 初始化应用数据
    initializeApp: () => {
      // 检查localStorage中的登录状态
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const savedUser = localStorage.getItem('currentUser');
      
      if (isLoggedIn && savedUser) {
        try {
          const userInfo = JSON.parse(savedUser);
          set({ user: userInfo, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to parse saved user info:', error);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('currentUser');
        }
      }
      
      // 模拟用户登录（如果没有保存的用户信息）
      const mockUser: UserInfo = {
        id: '1',
        name: '张编辑',
        role: '主编',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20editor%20avatar%20portrait&image_size=square',
        department: '新闻编辑部',
        permissions: ['content:read', 'content:write', 'content:review', 'media:read', 'media:write']
      };
      
      // 模拟统计数据
      const mockStatistics: Statistics = {
        todayArticles: 28,
        pendingReviews: 12,
        mediaAssets: 1456,
        totalViews: 89234,
        onlineUsers: 45,
        systemStatus: 'normal'
      };
      
      // 模拟最近活动
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'publish',
          title: '市政府召开新闻发布会 介绍最新民生政策',
          user: '李记者',
          time: '2024-01-15 16:30:00',
          status: 'success'
        },
        {
          id: '2',
          type: 'review',
          title: '本地科技企业获国家科技进步奖',
          user: '王编辑',
          time: '2024-01-15 15:45:00',
          status: 'pending'
        },
        {
          id: '3',
          type: 'upload',
          title: '科技企业采访视频',
          user: '赵记者',
          time: '2024-01-15 14:20:00',
          status: 'success'
        },
        {
          id: '4',
          type: 'create',
          title: '学校食堂食品安全调查报告',
          user: '刘记者',
          time: '2024-01-15 13:15:00',
          status: 'success'
        },
        {
          id: '5',
          type: 'edit',
          title: '退休教师义务辅导学生专题',
          user: '陈记者',
          time: '2024-01-15 11:30:00',
          status: 'success'
        }
      ];
      
      // 模拟通知
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          title: '稿件截止提醒',
          content: '《学校食堂食品安全调查》稿件将在2小时后截止，请及时完成审核。',
          time: '2024-01-15 16:00:00',
          read: false
        },
        {
          id: '2',
          type: 'success',
          title: '稿件发布成功',
          content: '《市政府召开新闻发布会》已成功发布到官网和微信公众号。',
          time: '2024-01-15 15:30:00',
          read: false
        },
        {
          id: '3',
          type: 'info',
          title: '系统维护通知',
          content: '系统将于今晚22:00-24:00进行例行维护，请提前保存工作内容。',
          time: '2024-01-15 14:00:00',
          read: true
        }
      ];
      
      set({
        user: mockUser,
        isAuthenticated: true,
        statistics: mockStatistics,
        recentActivities: mockActivities,
        notifications: mockNotifications,
        unreadCount: mockNotifications.filter(n => !n.read).length
      });
    }
  }),
  {
    name: 'media-workspace-store'
  }
));

// 导出类型
export type { UserInfo, Statistics, RecentActivity, Notification, AppState };