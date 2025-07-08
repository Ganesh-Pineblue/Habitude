import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  UserPlus,
  Mail,
  Edit,
  Trash2,
  Ban,
  Shield
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  habits: number;
  streak: number;
  joinDate: string;
  lastLogin: string;
}

interface UserFormData {
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
}

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    status: 'active'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      status: 'active',
      habits: 12,
      streak: 45,
      joinDate: '2024-01-15',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      status: 'active',
      habits: 8,
      streak: 23,
      joinDate: '2024-02-01',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      status: 'inactive',
      habits: 5,
      streak: 0,
      joinDate: '2024-01-20',
      lastLogin: '1 week ago'
    },
    {
      id: 4,
      name: 'Emily Brown',
      email: 'emily.brown@email.com',
      status: 'active',
      habits: 15,
      streak: 67,
      joinDate: '2023-12-10',
      lastLogin: '5 minutes ago'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      status: 'suspended',
      habits: 3,
      streak: 0,
      joinDate: '2024-03-01',
      lastLogin: '2 weeks ago'
    }
  ]);

  const getFilteredUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    return filtered;
  };

  const getStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const suspended = users.filter(u => u.status === 'suspended').length;

    return { total, active, inactive, suspended };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const },
      inactive: { label: 'Inactive', variant: 'secondary' as const },
      suspended: { label: 'Suspended', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = () => {
    if (validateForm()) {
      if (isEditing && editingUserId) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === editingUserId 
            ? { ...user, ...formData }
            : user
        ));
        toast({
          title: "User Updated",
          description: "User information has been successfully updated.",
        });
      } else {
        // Add new user
        const newUser: User = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...formData,
          habits: 0,
          streak: 0,
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: 'Never'
        };
        setUsers([...users, newUser]);
        toast({
          title: "User Added",
          description: "New user has been successfully added.",
        });
      }

      setFormData({ name: '', email: '', status: 'active' });
      setErrors({});
      setShowAddUserModal(false);
      setIsEditing(false);
      setEditingUserId(null);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOpenAddUserModal = () => {
    setFormData({ name: '', email: '', status: 'active' });
    setErrors({});
    setIsEditing(false);
    setEditingUserId(null);
    setShowAddUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      status: user.status
    });
    setErrors({});
    setIsEditing(true);
    setEditingUserId(user.id);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been successfully deleted.",
    });
  };

  const handleToggleUserStatus = (id: number, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
    toast({
      title: "Status Updated",
      description: `User status changed to ${newStatus}.`,
    });
  };

  const handleSendEmail = (user: User) => {
    toast({
      title: "Email Sent",
      description: `Email sent to ${user.email}`,
    });
  };

  const stats = getStats();
  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Button className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]" onClick={handleOpenAddUserModal}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Users</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-700">{stats.active}</div>
            <p className="text-sm text-gray-600">Active Users</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.inactive}</div>
            <p className="text-sm text-gray-600">Inactive Users</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <p className="text-sm text-gray-600">Suspended Users</p>
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
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Habits</TableHead>
                <TableHead>Streak</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.habits}</TableCell>
                  <TableCell>
                    <span className="font-medium">{user.streak} days</span>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendEmail(user)}
                        title="Send email"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                        title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter user's full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter user's email address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value as 'active' | 'inactive' | 'suspended')}
              >
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setShowAddUserModal(false);
              setIsEditing(false);
              setEditingUserId(null);
              setFormData({ name: '', email: '', status: 'active' });
              setErrors({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]">
              {isEditing ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};