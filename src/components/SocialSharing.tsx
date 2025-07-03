import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Share2, MessageCircle, Heart, Star, Trophy, Users, 
  TrendingUp, Target, Calendar, Zap, Crown, Award,
  Facebook, Twitter, Instagram, Linkedin, Copy, Check,
  ExternalLink, Download, Camera, Video, Image as ImageIcon, Sparkles
} from 'lucide-react';

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: 'achievement' | 'milestone' | 'streak' | 'challenge' | 'motivation';
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  hashtags: string[];
  image?: string;
  habitData?: {
    habitName: string;
    streak: number;
    completionRate: number;
  };
  socialShares?: {
    facebook?: boolean;
    twitter?: boolean;
    instagram?: boolean;
    linkedin?: boolean;
  };
}

interface SocialSharingProps {
  habits: any[];
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const defaultPosts: SocialPost[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Chen',
    userAvatar: '/images/Einstein.webp',
    content: 'Just completed my 7-day meditation challenge! 🧘‍♀️ Feeling so much more centered and focused. Consistency really is the key!',
    type: 'achievement',
    likes: 24,
    comments: 8,
    shares: 3,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#meditation', '#mindfulness', '#consistency', '#habits'],
    habitData: {
      habitName: 'Morning Meditation',
      streak: 7,
      completionRate: 100
    },
    socialShares: {
      facebook: true,
      twitter: false,
      instagram: true,
      linkedin: false
    }
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Alex Johnson',
    userAvatar: '/images/steve.webp',
    content: 'Day 21 of my fitness journey! 💪 The habit is finally sticking. Remember, it gets easier every day!',
    type: 'milestone',
    likes: 18,
    comments: 5,
    shares: 2,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#fitness', '#21days', '#habits', '#motivation'],
    habitData: {
      habitName: 'Daily Exercise',
      streak: 21,
      completionRate: 95
    },
    socialShares: {
      facebook: false,
      twitter: true,
      instagram: false,
      linkedin: true
    }
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Maria Rodriguez',
    userAvatar: '/images/oprah.webp',
    content: 'Just hit 100 days of reading! 📚 Knowledge is power, and consistency is the key to unlocking it.',
    type: 'milestone',
    likes: 32,
    comments: 12,
    shares: 8,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#reading', '#knowledge', '#consistency', '#growth'],
    habitData: {
      habitName: 'Daily Reading',
      streak: 100,
      completionRate: 98
    },
    socialShares: {
      facebook: true,
      twitter: true,
      instagram: true,
      linkedin: true
    }
  }
];

export const SocialSharing: React.FC<SocialSharingProps> = ({ habits, currentUser }) => {
  const [posts, setPosts] = useState<SocialPost[]>(defaultPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'motivation' as 'achievement' | 'milestone' | 'streak' | 'challenge' | 'motivation',
    hashtags: [] as string[],
    selectedHabit: '',
    image: '',
    socialPlatforms: {
      facebook: false,
      twitter: false,
      instagram: false,
      linkedin: false
    }
  });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showSocialShareModal, setShowSocialShareModal] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'milestone': return <Target className="w-4 h-4 text-blue-500" />;
      case 'streak': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'challenge': return <Crown className="w-4 h-4 text-purple-500" />;
      case 'motivation': return <Star className="w-4 h-4 text-green-500" />;
      default: return <Share2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800';
      case 'milestone': return 'bg-blue-100 text-blue-800';
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'challenge': return 'bg-purple-100 text-purple-800';
      case 'motivation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const createPost = () => {
    const post: SocialPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newPost.content,
      type: newPost.type,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date().toISOString(),
      hashtags: newPost.hashtags,
      image: newPost.image || undefined,
      habitData: newPost.selectedHabit ? {
        habitName: newPost.selectedHabit,
        streak: habits.find(h => h.title === newPost.selectedHabit)?.streak || 0,
        completionRate: habits.find(h => h.title === newPost.selectedHabit)?.completionRate || 0
      } : undefined,
      socialShares: newPost.socialPlatforms
    };
    
    setPosts([post, ...posts]);
    setNewPost({
      content: '',
      type: 'motivation',
      hashtags: [],
      selectedHabit: '',
      image: '',
      socialPlatforms: {
        facebook: false,
        twitter: false,
        instagram: false,
        linkedin: false
      }
    });
    setShowCreatePost(false);
  };

  const likePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const sharePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const generateShareText = (post: SocialPost) => {
    const baseText = `${post.userName}: ${post.content}`;
    const hashtags = post.hashtags.map(tag => tag).join(' ');
    return `${baseText} ${hashtags}`;
  };

  const shareToSocialMedia = (platform: string, post: SocialPost) => {
    const shareText = generateShareText(post);
    const shareUrl = encodeURIComponent(window.location.href);
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we copy to clipboard
        copyToClipboard(shareText);
        alert('Content copied! You can now paste it into Instagram.');
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const generateSocialMediaPreview = (post: SocialPost) => {
    return {
      title: `${post.userName} - Habit Progress`,
      description: post.content,
      image: post.image || '/public/images/placeholder.svg',
      url: window.location.href
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Social Feed</h2>
          <p className="text-gray-600">Share your progress and get inspired by others</p>
        </div>
        <Button 
          onClick={() => setShowCreatePost(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Progress
        </Button>
      </div>

      {/* Social Media Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Social Media Reach</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <Facebook className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">
                {posts.filter(p => p.socialShares?.facebook).length}
              </div>
              <div className="text-sm text-blue-600">Facebook Shares</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-400">
              <Twitter className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-400">
                {posts.filter(p => p.socialShares?.twitter).length}
              </div>
              <div className="text-sm text-blue-400">Twitter Shares</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-pink-300">
              <Instagram className="w-6 h-6 text-pink-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-pink-500">
                {posts.filter(p => p.socialShares?.instagram).length}
              </div>
              <div className="text-sm text-pink-500">Instagram Shares</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-700">
              <Linkedin className="w-6 h-6 text-blue-700 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-700">
                {posts.filter(p => p.socialShares?.linkedin).length}
              </div>
              <div className="text-sm text-blue-700">LinkedIn Shares</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Share Suggestions */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            <span>Quick Share Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {habits.filter(h => h.streak > 0).slice(0, 3).map((habit) => (
              <div key={habit.id} className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-900">{habit.title}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {habit.streak} day streak • {habit.completionRate}% completion
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setNewPost({
                      content: `Just completed ${habit.title} for ${habit.streak} days in a row! 💪`,
                      type: 'streak',
                      hashtags: ['#habits', '#consistency', '#progress'],
                      selectedHabit: habit.title,
                      image: '',
                      socialPlatforms: {
                        facebook: false,
                        twitter: false,
                        instagram: false,
                        linkedin: false
                      }
                    });
                    setShowCreatePost(true);
                  }}
                  className="w-full border-green-200 text-green-600 hover:bg-green-50"
                >
                  Share This
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.userAvatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {post.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{post.userName}</span>
                      <Badge className={getTypeColor(post.type)}>
                        {getTypeIcon(post.type)}
                        <span className="ml-1 capitalize">{post.type}</span>
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700">{post.content}</p>
                  
                  {post.image && (
                    <div className="relative">
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {post.habitData && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{post.habitData.habitName}</div>
                          <div className="text-sm text-gray-600">
                            {post.habitData.streak} day streak • {post.habitData.completionRate}% completion
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl">🔥</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => likePost(post.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button 
                        onClick={() => sharePost(post.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">{post.shares}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(generateShareText(post))}
                        className="text-gray-500 hover:text-blue-600"
                        title="Copy to clipboard"
                      >
                        {copiedLink === generateShareText(post) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => shareToSocialMedia('facebook', post)}
                        className="text-gray-500 hover:text-blue-600"
                        title="Share on Facebook"
                      >
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => shareToSocialMedia('twitter', post)}
                        className="text-gray-500 hover:text-blue-400"
                        title="Share on Twitter"
                      >
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => shareToSocialMedia('instagram', post)}
                        className="text-gray-500 hover:text-pink-500"
                        title="Share on Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => shareToSocialMedia('linkedin', post)}
                        className="text-gray-500 hover:text-blue-700"
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Share Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>What would you like to share?</Label>
                <Input
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share your achievement, milestone, or motivation..."
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Post Type</Label>
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({...newPost, type: e.target.value as any})}
                    className="w-full p-2 border border-gray-200 rounded-md mt-2"
                  >
                    <option value="motivation">Motivation</option>
                    <option value="achievement">Achievement</option>
                    <option value="milestone">Milestone</option>
                    <option value="streak">Streak</option>
                    <option value="challenge">Challenge</option>
                  </select>
                </div>
                
                <div>
                  <Label>Related Habit (Optional)</Label>
                  <select
                    value={newPost.selectedHabit}
                    onChange={(e) => setNewPost({...newPost, selectedHabit: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-md mt-2"
                  >
                    <option value="">Select a habit</option>
                    {habits.map((habit) => (
                      <option key={habit.id} value={habit.title}>{habit.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label>Image URL (Optional)</Label>
                <Input
                  value={newPost.image}
                  onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Hashtags (comma separated)</Label>
                <Input
                  value={newPost.hashtags.join(', ')}
                  onChange={(e) => setNewPost({...newPost, hashtags: e.target.value.split(',').map(t => t.trim())})}
                  placeholder="#habits, #consistency, #progress"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Share to Social Media</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPost.socialPlatforms.facebook}
                      onChange={(e) => setNewPost({
                        ...newPost, 
                        socialPlatforms: {
                          ...newPost.socialPlatforms,
                          facebook: e.target.checked
                        }
                      })}
                    />
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Facebook</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPost.socialPlatforms.twitter}
                      onChange={(e) => setNewPost({
                        ...newPost, 
                        socialPlatforms: {
                          ...newPost.socialPlatforms,
                          twitter: e.target.checked
                        }
                      })}
                    />
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Twitter</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPost.socialPlatforms.instagram}
                      onChange={(e) => setNewPost({
                        ...newPost, 
                        socialPlatforms: {
                          ...newPost.socialPlatforms,
                          instagram: e.target.checked
                        }
                      })}
                    />
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">Instagram</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPost.socialPlatforms.linkedin}
                      onChange={(e) => setNewPost({
                        ...newPost, 
                        socialPlatforms: {
                          ...newPost.socialPlatforms,
                          linkedin: e.target.checked
                        }
                      })}
                    />
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    <span className="text-sm">LinkedIn</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={createPost} className="bg-green-600 hover:bg-green-700 text-white">
                  Share Post
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreatePost(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 