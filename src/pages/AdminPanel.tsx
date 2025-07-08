import { useState } from 'react';
import { AdminDashboard } from '@/admin/AdminDashboard';
import { UserManagement } from '@/admin/UserManagement';
import { SystemAnalytics } from '@/admin/SystemAnalytics';
import { AdminSettings } from '@/admin/AdminSettings';
import { AdminNavigation } from '@/admin/AdminNavigation';
import { HabitManagement } from '@/admin/HabitManagement';
import { GoalManagement } from '@/admin/GoalManagement';
import { ContentManagement } from '@/admin/ContentManagement';
import { FeedbackSystem } from '@/admin/FeedbackSystem';
import { NotificationCenter } from '@/admin/NotificationCenter';

export const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'habits':
        return <HabitManagement />;
      case 'goals':
        return <GoalManagement />;
      case 'content':
        return <ContentManagement />;
      case 'analytics':
        return <SystemAnalytics />;
      case 'feedback':
        return <FeedbackSystem />;
      case 'notifications':
        return <NotificationCenter />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onCollapseChange={handleSidebarToggle}
      />
      <main className={`p-8 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;