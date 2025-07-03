import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Crown, Star, Sparkles, Lock, Check, Trophy, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'theme' | 'feature' | 'badge' | 'special';
  icon: React.ElementType;
  unlocked: boolean;
  claimed: boolean;
  streakRequired?: number;
}

interface RewardSystemProps {
  userPoints: number;
  totalStreak: number;
}

export const RewardSystem = ({ userPoints, totalStreak }: RewardSystemProps) => {
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Golden Theme',
      description: 'Unlock premium golden color scheme',
      cost: 100,
      category: 'theme',
      icon: Crown,
      unlocked: totalStreak >= 7,
      claimed: false,
      streakRequired: 7
    },
    {
      id: '2',
      title: 'Habit Master Badge',
      description: 'Show off your dedication with this special badge',
      cost: 150,
      category: 'badge',
      icon: Star,
      unlocked: totalStreak >= 14,
      claimed: false,
      streakRequired: 14
    },
    {
      id: '3',
      title: 'Advanced Analytics',
      description: 'Unlock detailed habit insights and trends',
      cost: 200,
      category: 'feature',
      icon: Sparkles,
      unlocked: totalStreak >= 30,
      claimed: false,
      streakRequired: 30
    },
    {
      id: '4',
      title: 'Custom Habit Categories',
      description: 'Create your own personalized habit categories',
      cost: 250,
      category: 'feature',
      icon: Gift,
      unlocked: totalStreak >= 50,
      claimed: false,
      streakRequired: 50
    }
  ]);

  const claimReward = (rewardId: string) => {
    setRewards(rewards.map(reward => 
      reward.id === rewardId 
        ? { ...reward, claimed: true }
        : reward
    ));
  };

  const categoryColors = {
    theme: 'bg-green-100 text-green-800 border-green-200',
    feature: 'bg-green-100 text-green-800 border-green-200',
    badge: 'bg-green-100 text-green-800 border-green-200',
    special: 'bg-green-100 text-green-800 border-green-200'
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    cost: 0,
    category: 'theme',
    icon: Crown,
    unlocked: false,
    claimed: false,
    streakRequired: 0
  });

  const addReward = () => {
    // Implementation of adding a new reward
  };

  const updateReward = (reward: Reward) => {
    // Implementation of updating an existing reward
  };

  return (
    <div className="space-y-6">
      {/* Reward Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{userPoints}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rewards Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {rewards.filter(r => r.claimed).length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Available Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {userPoints - rewards.filter(r => r.claimed).reduce((sum, r) => sum + r.cost, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Reward Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Your Rewards</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Reward
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingReward) && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              {editingReward ? 'Edit Reward' : 'Add New Reward'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Reward title"
              value={editingReward ? editingReward.title : newReward.title}
              onChange={(e) => editingReward 
                ? setEditingReward({...editingReward, title: e.target.value})
                : setNewReward({...newReward, title: e.target.value})
              }
              className="border-gray-200"
            />
            <Input
              placeholder="Description"
              value={editingReward ? editingReward.description : newReward.description}
              onChange={(e) => editingReward 
                ? setEditingReward({...editingReward, description: e.target.value})
                : setNewReward({...newReward, description: e.target.value})
              }
              className="border-gray-200"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Points required"
                value={editingReward ? editingReward.cost : newReward.cost}
                onChange={(e) => editingReward 
                  ? setEditingReward({...editingReward, cost: Number(e.target.value)})
                  : setNewReward({...newReward, cost: Number(e.target.value)})
                }
                className="border-gray-200"
              />
              <select
                value={editingReward ? editingReward.category : newReward.category}
                onChange={(e) => editingReward 
                  ? setEditingReward({...editingReward, category: e.target.value as Reward['category']})
                  : setNewReward({...newReward, category: e.target.value as Reward['category']})
                }
                className="p-2 border border-gray-200 rounded-md text-gray-600"
              >
                <option value="theme">Theme</option>
                <option value="feature">Feature</option>
                <option value="badge">Badge</option>
                <option value="special">Special</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              onClick={editingReward ? () => updateReward(editingReward) : addReward}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {editingReward ? 'Update' : 'Add'} Reward
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setEditingReward(null);
              }}
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <reward.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{reward.title}</CardTitle>
                </div>
                {reward.claimed && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Claimed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-sm mb-4 ${
                reward.claimed 
                  ? 'text-green-700' 
                  : reward.unlocked 
                    ? 'text-gray-600' 
                    : 'text-gray-400'
              }`}>
                {reward.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <Badge className={categoryColors[reward.category]}>
                  {reward.category}
                </Badge>
                <div className={`text-lg font-bold ${
                  reward.claimed 
                    ? 'text-green-600' 
                    : reward.unlocked 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                }`}>
                  {reward.cost} pts
                </div>
              </div>

              {!reward.unlocked && reward.streakRequired && (
                <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Unlock at {reward.streakRequired} day streak
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.max(0, reward.streakRequired - totalStreak)} days to go
                  </p>
                </div>
              )}

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!reward.unlocked || reward.claimed}
                onClick={() => claimReward(reward.id)}
              >
                {reward.claimed ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Claimed
                  </>
                ) : !reward.unlocked ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Locked
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Claim Reward
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
