import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Send, 
  Mail, 
  Bell, 
  Calendar,
  Edit,
  Trash2,
  Play,
  Search
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'push' | 'email' | 'both';
  recipients: number;
  sentAt?: string;
  scheduledFor?: string;
  opened?: number;
  clicked?: number;
  status: 'sent' | 'scheduled' | 'sending' | 'draft';
}

export const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('compose');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [sentNotifications, setSentNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Weekly Progress Update',
      message: 'Great job this week! You completed 85% of your habits.',
      type: 'push',
      recipients: 2847,
      sentAt: '2024-01-15 09:00',
      opened: 1823,
      clicked: 456,
      status: 'sent'
    },
    {
      id: 2,
      title: 'New Feature: Dark Mode',
      message: 'Try our new dark mode feature for a better evening experience.',
      type: 'email',
      recipients: 1234,
      sentAt: '2024-01-14 14:30',
      opened: 892,
      clicked: 234,
      status: 'sent'
    },
    {
      id: 3,
      title: 'Motivational Monday',
      message: '"Success is the sum of small efforts repeated day in and day out." - Robert Collier',
      type: 'push',
      recipients: 3456,
      sentAt: '2024-01-13 08:00',
      opened: 2187,
      clicked: 567,
      status: 'sent'
    }
  ]);

  const [scheduledNotifications, setScheduledNotifications] = useState<Notification[]>([
    {
      id: 4,
      title: 'Monthly Habit Review',
      message: 'Time to review your monthly progress and set new goals!',
      type: 'email',
      recipients: 2500,
      scheduledFor: '2024-02-01 10:00',
      status: 'scheduled'
    },
    {
      id: 5,
      title: 'Weekend Motivation',
      message: 'Keep your momentum going through the weekend!',
      type: 'push',
      recipients: 3200,
      scheduledFor: '2024-01-20 09:00',
      status: 'scheduled'
    }
  ]);

  const getFilteredNotifications = (notifications: Notification[]) => {
    if (!searchTerm) return notifications;
    
    const searchLower = searchTerm.toLowerCase();
    return notifications.filter(notification => 
      notification.title.toLowerCase().includes(searchLower) ||
      notification.message.toLowerCase().includes(searchLower)
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { label: 'Sent', variant: 'default' as const },
      scheduled: { label: 'Scheduled', variant: 'secondary' as const },
      sending: { label: 'Sending', variant: 'outline' as const },
      draft: { label: 'Draft', variant: 'outline' as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const typeIcons = {
      push: <Bell className="w-4 h-4 text-blue-600" />,
      email: <Mail className="w-4 h-4 text-gray-700" />,
      both: <div className="flex space-x-1"><Bell className="w-3 h-3 text-blue-600" /><Mail className="w-3 h-3 text-gray-700" /></div>
    };
    return typeIcons[type as keyof typeof typeIcons] || <Bell className="w-4 h-4" />;
  };

  const handleDeleteNotification = (id: number, type: 'sent' | 'scheduled') => {
    if (type === 'sent') {
      setSentNotifications(prev => prev.filter(n => n.id !== id));
    } else {
      setScheduledNotifications(prev => prev.filter(n => n.id !== id));
    }
    toast({
      title: "Notification Deleted",
      description: "The notification has been deleted.",
    });
  };

  const handleEditNotification = () => {
    toast({
      title: "Notification Edited",
      description: "The notification has been edited.",
    });
  };

  const handleRescheduleNotification = () => {
    toast({
      title: "Notification Rescheduled",
      description: "The notification has been rescheduled.",
    });
  };

  const ComposeNotification = () => {
    const [notificationData, setNotificationData] = useState({
      title: '',
      message: '',
      type: 'push' as 'push' | 'email' | 'both',
      audience: 'all',
      habitFilter: 'all',
      roleFilter: 'all',
      scheduleNow: true,
      scheduledDate: '',
      scheduledTime: '',
      includeImage: false,
      imageUrl: ''
    });

    const handleSend = async () => {
      if (!notificationData.title.trim() || !notificationData.message.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      try {
        const newNotification: Notification = {
          id: Date.now(),
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          recipients: notificationData.audience === 'all' ? 2847 : 1234,
          sentAt: new Date().toLocaleString(),
          opened: 0,
          clicked: 0,
          status: 'sent'
        };
        
        setSentNotifications(prev => [newNotification, ...prev]);
        
        // Reset form
        setNotificationData({
          title: '',
          message: '',
          type: 'push',
          audience: 'all',
          habitFilter: 'all',
          roleFilter: 'all',
          scheduleNow: true,
          scheduledDate: '',
          scheduledTime: '',
          includeImage: false,
          imageUrl: ''
        });
        
        toast({
          title: "Notification Sent",
          description: "Notification has been sent successfully!",
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
        toast({
          title: "Error",
          description: "Failed to send notification. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleSchedule = () => {
      if (!notificationData.title.trim() || !notificationData.message.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      if (!notificationData.scheduledDate || !notificationData.scheduledTime) {
        toast({
          title: "Error",
          description: "Please select a date and time for scheduling.",
          variant: "destructive",
        });
        return;
      }

      const newNotification: Notification = {
        id: Date.now(),
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        recipients: notificationData.audience === 'all' ? 2847 : 1234,
        scheduledFor: `${notificationData.scheduledDate} ${notificationData.scheduledTime}`,
        status: 'scheduled'
      };
      
      setScheduledNotifications(prev => [newNotification, ...prev]);
      
      // Reset form
      setNotificationData({
        title: '',
        message: '',
        type: 'push',
        audience: 'all',
        habitFilter: 'all',
        roleFilter: 'all',
        scheduleNow: true,
        scheduledDate: '',
        scheduledTime: '',
        includeImage: false,
        imageUrl: ''
      });
      
      toast({
        title: "Notification Scheduled",
        description: "Notification has been scheduled successfully!",
      });
    };

    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Compose Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Notification Title *</Label>
                <Input
                  id="title"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Notification Type</Label>
                <Select value={notificationData.type} onValueChange={(value) => setNotificationData(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message Content *</Label>
              <Textarea
                id="message"
                value={notificationData.message}
                onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Write your notification message..."
                rows={4}
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {notificationData.message.length}/200 characters
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Select value={notificationData.audience} onValueChange={(value) => setNotificationData(prev => ({ ...prev, audience: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active Users Only</SelectItem>
                    <SelectItem value="inactive">Inactive Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="habitFilter">Habit Filter</Label>
                <Select value={notificationData.habitFilter} onValueChange={(value) => setNotificationData(prev => ({ ...prev, habitFilter: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Habits</SelectItem>
                    <SelectItem value="fitness">Fitness Users</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roleFilter">Role Filter</Label>
                <Select value={notificationData.roleFilter} onValueChange={(value) => setNotificationData(prev => ({ ...prev, roleFilter: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="professionals">Professionals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="scheduleNow"
                checked={notificationData.scheduleNow}
                onCheckedChange={(checked) => setNotificationData(prev => ({ ...prev, scheduleNow: checked }))}
              />
              <Label htmlFor="scheduleNow">Send immediately</Label>
            </div>

            {!notificationData.scheduleNow && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={notificationData.scheduledDate}
                    onChange={(e) => setNotificationData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledTime">Scheduled Time</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={notificationData.scheduledTime}
                    onChange={(e) => setNotificationData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="includeImage"
                checked={notificationData.includeImage}
                onCheckedChange={(checked) => setNotificationData(prev => ({ ...prev, includeImage: checked }))}
              />
              <Label htmlFor="includeImage">Include image</Label>
            </div>

            {notificationData.includeImage && (
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={notificationData.imageUrl}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              {notificationData.scheduleNow ? (
                <Button onClick={handleSend} className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900">
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </Button>
              ) : (
                <Button onClick={handleSchedule} className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderNotificationList = (notifications: Notification[], type: 'sent' | 'scheduled') => {
    const filteredNotifications = getFilteredNotifications(notifications);
    
    return (
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getTypeIcon(notification.type)}
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    {getStatusBadge(notification.status)}
                  </div>
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{notification.recipients.toLocaleString()} recipients</span>
                      {notification.sentAt && (
                        <span>Sent: {notification.sentAt}</span>
                      )}
                      {notification.scheduledFor && (
                        <span>Scheduled: {notification.scheduledFor}</span>
                      )}
                      {notification.opened !== undefined && (
                        <span>{notification.opened} opened</span>
                      )}
                      {notification.clicked !== undefined && (
                        <span>{notification.clicked} clicked</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditNotification(notification)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {type === 'scheduled' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRescheduleNotification(notification.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => handleDeleteNotification(notification.id, type)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Center</h1>
        <p className="text-gray-600">Manage push notifications and email campaigns</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{sentNotifications.length}</div>
            <p className="text-sm text-gray-600">Sent Notifications</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{scheduledNotifications.length}</div>
            <p className="text-sm text-gray-600">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-700">
              {sentNotifications.reduce((sum, n) => sum + (n.opened || 0), 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Opens</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {sentNotifications.reduce((sum, n) => sum + (n.clicked || 0), 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Clicks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <ComposeNotification />
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sent notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          {renderNotificationList(sentNotifications, 'sent')}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search scheduled notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          {renderNotificationList(scheduledNotifications, 'scheduled')}
        </TabsContent>
      </Tabs>
    </div>
  );
};