import { useState } from 'react';
import { User, Trophy, Save, X, Edit, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  name: string;
  email: string;
  streak?: number;
  joinDate?: string;
  totalHabits?: number;
  completedHabits?: number;
}

interface ProfileProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export const Profile = ({ user, onClose, onSave }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    onSave(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-green-600 to-green-800">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              {user.streak && (
                <p className="text-sm text-green-600 flex items-center">
                  <Trophy className="w-4 h-4 mr-1" />
                  {user.streak} day streak
                </p>
              )}
            </div>
          </div>



          {/* Edit Form */}
          {isEditing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Account Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Member since: {user.joinDate || 'January 2024'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Account type: Free</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 