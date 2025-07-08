import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Shield,
  LogOut,
  Target,
  FileText,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const AdminNavigation = ({ activeSection, onSectionChange, onCollapseChange }: AdminNavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
    },
    {
      id: 'habits',
      label: 'Habit Management',
      icon: Target,
    },
    {
      id: 'goals',
      label: 'Goal Management',
      icon: TrendingUp,
    },
    {
      id: 'content',
      label: 'Suggestions',
      icon: FileText,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className={`${isCollapsed ? 'p-2' : 'p-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-8`}>
          <div className="p-2 bg-[#DAF7A6] rounded-lg flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">Admin Panel</h1>
              <p className="text-sm text-gray-500 truncate">Habitude Management</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className={`flex-shrink-0 ${isCollapsed ? 'absolute top-2 right-2' : 'ml-auto'}`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${
                  isCollapsed ? 'px-3 h-10' : 'px-4 h-10'
                }`}
                onClick={() => onSectionChange(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        <div className={`absolute bottom-6 space-y-2 ${isCollapsed ? 'left-2 right-2' : 'left-6 right-6'}`}>
          <Button
            variant="ghost"
            className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 ${
              isCollapsed ? 'px-3 h-10' : 'px-4 h-10'
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
            {!isCollapsed && <span className="truncate">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};