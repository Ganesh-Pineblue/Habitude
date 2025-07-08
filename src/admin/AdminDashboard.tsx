import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertCircle,
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Award
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'New Users',
      value: '156',
      change: '+24%',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Habits and Goals Completion Rate',
      value: '78.5%',
      change: '+3.2%',
      icon: CheckCircle,
      color: 'purple'
    }
  ];

  const platformData = [
    { platform: 'Web', users: 1423, percentage: 50 },
    { platform: 'Android', users: 854, percentage: 30 },
    { platform: 'iOS', users: 570, percentage: 20 }
  ];

  const topPerformers = [
    { username: 'sarah_fitness', habitsCompleted: 284, goalStreaks: 45, platform: 'iOS', completionRate: 94 },
    { username: 'mike_productivity', habitsCompleted: 267, goalStreaks: 38, platform: 'Web', completionRate: 91 },
    { username: 'emma_wellness', habitsCompleted: 245, goalStreaks: 42, platform: 'Android', completionRate: 89 },
    { username: 'alex_mindful', habitsCompleted: 234, goalStreaks: 35, platform: 'Web', completionRate: 87 },
    { username: 'julia_health', habitsCompleted: 223, goalStreaks: 33, platform: 'iOS', completionRate: 85 }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Completed morning routine', time: '2 min ago' },
    { user: 'Sarah Smith', action: 'Created new habit goal', time: '5 min ago' },
    { user: 'Mike Johnson', action: 'Achieved 30-day streak', time: '12 min ago' },
    { user: 'Emily Brown', action: 'Updated profile settings', time: '18 min ago' },
    { user: 'David Wilson', action: 'Joined accountability group', time: '25 min ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor system performance and user activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-700 font-medium">{stat.change} from last month</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Platform Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformData.map((platform, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    platform.platform === 'Web' ? 'bg-blue-500' : 
                    platform.platform === 'Android' ? 'bg-[#DAF7A6]' : 'bg-purple-500'
                  }`} />
                  <span className="font-medium">{platform.platform}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{platform.users.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{platform.percentage}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span>Top Performers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold">Username</th>
                  <th className="text-left py-3 px-4 font-semibold">Habits Completed</th>
                  <th className="text-left py-3 px-4 font-semibold">Goal Streaks</th>
                  <th className="text-left py-3 px-4 font-semibold">Platform</th>
                  <th className="text-left py-3 px-4 font-semibold">Habits and Goals Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((performer, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        {index < 3 && (
                          <span className="text-yellow-500">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{performer.username}</td>
                    <td className="py-3 px-4">{performer.habitsCompleted}</td>
                    <td className="py-3 px-4">{performer.goalStreaks}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{performer.platform}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">{performer.completionRate}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#DAF7A6] h-2 rounded-full" 
                            style={{ width: `${performer.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <AlertCircle className="w-8 h-8 text-yellow-600 mb-2" />
              <h3 className="font-medium mb-1">System Alerts</h3>
              <p className="text-sm text-gray-600">Check system notifications</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <TrendingUp className="w-8 h-8 text-gray-700 mb-2" />
              <h3 className="font-medium mb-1">Analytics</h3>
              <p className="text-sm text-gray-600">View detailed reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};