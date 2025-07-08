
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, Target, Calendar } from 'lucide-react';

export const SystemAnalytics = () => {
  const userGrowthData = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1450 },
    { month: 'Mar', users: 1800 },
    { month: 'Apr', users: 2100 },
    { month: 'May', users: 2400 },
    { month: 'Jun', users: 2847 },
  ];

  const habitCompletionData = [
    { day: 'Mon', completion: 78 },
    { day: 'Tue', completion: 82 },
    { day: 'Wed', completion: 75 },
    { day: 'Thu', completion: 88 },
    { day: 'Fri', completion: 92 },
    { day: 'Sat', completion: 85 },
    { day: 'Sun', completion: 79 },
  ];

  const habitCategoriesData = [
    { name: 'Health & Fitness', value: 35, color: '#22c55e' },
    { name: 'Productivity', value: 28, color: '#3b82f6' },
    { name: 'Learning', value: 20, color: '#f59e0b' },
    { name: 'Mindfulness', value: 12, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into user behavior and system performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-gray-700">+5.2% from yesterday</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">82.5%</p>
                <p className="text-sm text-gray-700">+2.1% this week</p>
              </div>
              <Target className="w-8 h-8 text-gray-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Habits Created</p>
                <p className="text-2xl font-bold text-gray-900">15,632</p>
                <p className="text-sm text-gray-700">+312 this week</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Retention</p>
                <p className="text-2xl font-bold text-gray-900">89.2%</p>
                <p className="text-sm text-gray-700">+1.8% this month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Habit Categories */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Habit Categories Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={habitCategoriesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {habitCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Completion Rates */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Weekly Habit Completion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={habitCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completion" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent System Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium">Weekly User Engagement Report</h3>
                <p className="text-sm text-gray-600">Generated automatically every Monday</p>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium">System Performance Analysis</h3>
                <p className="text-sm text-gray-600">Monthly performance and optimization report</p>
              </div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium">User Feedback Summary</h3>
                <p className="text-sm text-gray-600">Compilation of user reviews and suggestions</p>
              </div>
              <div className="text-sm text-gray-500">3 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};