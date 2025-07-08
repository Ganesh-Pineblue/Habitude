import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Reply,
  Archive,
  Flag
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface FeedbackTicket {
  id: number;
  user: string;
  email: string;
  subject: string;
  message: string;
  type: 'bug_report' | 'feature_request' | 'general_feedback';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    admin: string;
    message: string;
    timestamp: string;
  }>;
}

export const FeedbackSystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<FeedbackTicket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [feedbackTickets, setFeedbackTickets] = useState<FeedbackTicket[]>([
    {
      id: 1,
      user: 'John Doe',
      email: 'john.doe@email.com',
      subject: 'Feature Request: Dark Mode',
      message: 'Would love to see a dark mode option for the app. It would be great for evening use.',
      type: 'feature_request',
      priority: 'medium',
      status: 'open',
      sentiment: 'positive',
      createdAt: '2024-01-15 10:30',
      updatedAt: '2024-01-15 10:30',
      responses: []
    },
    {
      id: 2,
      user: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      subject: 'Bug Report: Habit Streak Reset',
      message: 'My 30-day meditation streak was reset without me missing a day. This is very frustrating.',
      type: 'bug_report',
      priority: 'high',
      status: 'in_progress',
      sentiment: 'negative',
      createdAt: '2024-01-14 15:45',
      updatedAt: '2024-01-15 09:20',
      responses: [
        {
          admin: 'Support Team',
          message: 'Thank you for reporting this issue. We are investigating the streak calculation bug.',
          timestamp: '2024-01-15 09:20'
        }
      ]
    },
    {
      id: 3,
      user: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      subject: 'Great App!',
      message: 'Just wanted to say thank you for creating such a helpful habit tracking app. It has really changed my life!',
      type: 'general_feedback',
      priority: 'low',
      status: 'resolved',
      sentiment: 'positive',
      createdAt: '2024-01-13 12:15',
      updatedAt: '2024-01-14 08:30',
      responses: [
        {
          admin: 'Customer Success',
          message: 'Thank you so much for your kind words! We are thrilled to hear about your positive experience.',
          timestamp: '2024-01-14 08:30'
        }
      ]
    },
    {
      id: 4,
      user: 'Emily Brown',
      email: 'emily.brown@email.com',
      subject: 'Suggestion: Weekly Reports',
      message: 'It would be amazing if we could get weekly progress reports sent to our email. This would help with accountability.',
      type: 'feature_request',
      priority: 'medium',
      status: 'open',
      sentiment: 'positive',
      createdAt: '2024-01-12 16:20',
      updatedAt: '2024-01-12 16:20',
      responses: []
    }
  ]);

  const stats = {
    total: feedbackTickets.length,
    open: feedbackTickets.filter(t => t.status === 'open').length,
    inProgress: feedbackTickets.filter(t => t.status === 'in_progress').length,
    resolved: feedbackTickets.filter(t => t.status === 'resolved').length,
    positive: feedbackTickets.filter(t => t.sentiment === 'positive').length,
    negative: feedbackTickets.filter(t => t.sentiment === 'negative').length
  };

  const getFilteredTickets = () => {
    let filtered = feedbackTickets;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.user.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.message.toLowerCase().includes(searchLower) ||
        ticket.email.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === selectedStatus);
    }

    return filtered;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'Open', variant: 'destructive' as const },
      in_progress: { label: 'In Progress', variant: 'default' as const },
      resolved: { label: 'Resolved', variant: 'secondary' as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config?.variant || 'outline'}>{config?.label || status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Low', className: 'bg-[#DAF7A6] text-gray-700' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'High', className: 'bg-red-100 text-red-800' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge className={config?.className}>{config?.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const typeIcons = {
      bug_report: <AlertCircle className="w-4 h-4 text-red-600" />,
      feature_request: <Star className="w-4 h-4 text-blue-600" />,
      general_feedback: <MessageSquare className="w-4 h-4 text-gray-700" />
    };
    return typeIcons[type as keyof typeof typeIcons] || <MessageSquare className="w-4 h-4" />;
  };

  const handleArchiveTicket = (id: number) => {
    setFeedbackTickets(prev => prev.filter(ticket => ticket.id !== id));
    toast({
      title: "Ticket Archived",
      description: "The feedback ticket has been archived.",
    });
  };

  const handleFlagTicket = (id: number) => {
    toast({
      title: "Ticket Flagged",
      description: "The feedback ticket has been flagged for review.",
    });
  };

  const TicketDetail = ({ ticket }: { ticket: FeedbackTicket }) => {
    const [replyText, setReplyText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(ticket.status);

    const handleReply = () => {
      if (!replyText.trim()) {
        toast({
          title: "Error",
          description: "Please enter a reply message.",
          variant: "destructive",
        });
        return;
      }

      const newResponse = {
        admin: 'Admin User',
        message: replyText,
        timestamp: new Date().toLocaleString()
      };

      const updatedTicket = {
        ...ticket,
        responses: [...ticket.responses, newResponse],
        updatedAt: new Date().toLocaleString()
      };

      setFeedbackTickets(prev => 
        prev.map(t => t.id === ticket.id ? updatedTicket : t)
      );

      setReplyText('');
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent to the user.",
      });
    };

    const handleStatusChange = (newStatus: string) => {
      const updatedTicket = {
        ...ticket,
        status: newStatus as 'open' | 'in_progress' | 'resolved',
        updatedAt: new Date().toLocaleString()
      };

      setFeedbackTickets(prev => 
        prev.map(t => t.id === ticket.id ? updatedTicket : t)
      );

      setSelectedStatus(newStatus as 'open' | 'in_progress' | 'resolved');
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${newStatus}.`,
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2">{ticket.subject}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{ticket.user} ({ticket.email})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{ticket.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {getStatusBadge(ticket.status)}
            {getPriorityBadge(ticket.priority)}
          </div>
        </div>

        {/* Original Message */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {getTypeIcon(ticket.type)}
              <div className="flex-1">
                <p className="text-gray-700">{ticket.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response History */}
        {ticket.responses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Response History</h4>
            {ticket.responses.map((response, index) => (
              <Card key={index} className="border-l-4 border-l-[#DAF7A6]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-700">{response.admin}</span>
                    <span className="text-sm text-gray-500">{response.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{response.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reply Form */}
        <div className="space-y-4">
          <Label htmlFor="reply">Send Reply</Label>
          <Textarea
            id="reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your response..."
            rows={4}
          />
          <div className="flex justify-between items-center">
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleReply} className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900">
              <Reply className="w-4 h-4 mr-2" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback & Support</h1>
        <p className="text-gray-600">Manage user feedback, bug reports, and feature requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Tickets</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
            <p className="text-sm text-gray-600">Open</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-700">{stats.resolved}</div>
            <p className="text-sm text-gray-600">Resolved</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-700">{stats.positive}</div>
            <p className="text-sm text-gray-600">Positive</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
            <p className="text-sm text-gray-600">Negative</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search feedback by user, subject, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {getFilteredTickets().map((ticket) => (
              <Card key={ticket.id} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTypeIcon(ticket.type)}
                        <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{ticket.message}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{ticket.user}</span>
                          <span>{ticket.createdAt}</span>
                          {ticket.responses.length > 0 && (
                            <span className="flex items-center space-x-1">
                              <Reply className="w-3 h-3" />
                              <span>{ticket.responses.length} replies</span>
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Dialog open={isDialogOpen && selectedTicket?.id === ticket.id} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Ticket Details</DialogTitle>
                              </DialogHeader>
                              {selectedTicket && <TicketDetail ticket={selectedTicket} />}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleArchiveTicket(ticket.id)}
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleFlagTicket(ticket.id)}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};