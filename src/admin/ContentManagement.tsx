import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Calendar, 
  Edit, 
  Trash2, 
  FileText,
  Quote,
  BookOpen,
  Image,
  Eye,
  EyeOff
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: number;
  title?: string;
  content?: string;
  text?: string;
  excerpt?: string;
  author?: string;
  category: string;
  scheduledDate: string;
  status: 'draft' | 'scheduled' | 'published';
  views?: number;
  readTime?: string;
  publishDate?: string;
  image?: string | null;
}

export const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<ContentItem[]>([
    {
      id: 1,
      title: 'Start Small with Morning Routines',
      content: 'Begin your day with just 5 minutes of mindful breathing. Small starts lead to big changes.',
      category: 'Mindfulness',
      scheduledDate: '2024-01-15',
      status: 'published',
      views: 1247
    },
    {
      id: 2,
      title: 'Hydration Reminder',
      content: 'Remember to drink a glass of water when you wake up. Your body has been fasting for hours!',
      category: 'Health & Fitness',
      scheduledDate: '2024-01-16',
      status: 'scheduled',
      views: 0
    }
  ]);

  const [quotes, setQuotes] = useState<ContentItem[]>([
    {
      id: 1,
      text: 'The secret of change is to focus all of your energy not on fighting the old, but on building the new.',
      author: 'Socrates',
      category: 'Motivation',
      scheduledDate: '2024-01-15',
      status: 'published',
      image: '/images/socrates.jpg'
    },
    {
      id: 2,
      text: 'Success is the sum of small efforts repeated day in and day out.',
      author: 'Robert Collier',
      category: 'Success',
      scheduledDate: '2024-01-16',
      status: 'draft',
      image: null
    }
  ]);

  const [articles, setArticles] = useState<ContentItem[]>([
    {
      id: 1,
      title: 'The Science Behind Habit Formation',
      excerpt: 'Understanding the neurological basis of how habits form can help you build better ones...',
      content: 'Full article content would go here...',
      category: 'Education',
      readTime: '5 min',
      publishDate: '2024-01-10',
      status: 'published',
      author: 'Dr. Sarah Johnson',
      scheduledDate: '2024-01-10'
    },
    {
      id: 2,
      title: 'Mindful Eating: A Path to Better Health',
      excerpt: 'Learn how to develop a healthier relationship with food through mindful eating practices...',
      content: 'Full article content would go here...',
      category: 'Health & Wellness',
      readTime: '8 min',
      publishDate: '2024-01-12',
      status: 'draft',
      author: 'Mike Chen',
      scheduledDate: '2024-01-12'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [dialogType, setDialogType] = useState<'suggestion' | 'quote' | 'article'>('suggestion');
  const { toast } = useToast();

  const getCurrentData = () => {
    switch (activeTab) {
      case 'suggestions': return suggestions;
      case 'quotes': return quotes;
      case 'articles': return articles;
      default: return suggestions;
    }
  };

  const setCurrentData = (data: ContentItem[]) => {
    switch (activeTab) {
      case 'suggestions':
        setSuggestions(data);
        break;
      case 'quotes':
        setQuotes(data);
        break;
      case 'articles':
        setArticles(data);
        break;
    }
  };

  const getFilteredData = () => {
    const data = getCurrentData();
    if (!searchTerm) return data;
    
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.title?.toLowerCase().includes(searchLower)) ||
        (item.content?.toLowerCase().includes(searchLower)) ||
        (item.text?.toLowerCase().includes(searchLower)) ||
        (item.excerpt?.toLowerCase().includes(searchLower)) ||
        (item.author?.toLowerCase().includes(searchLower)) ||
        (item.category.toLowerCase().includes(searchLower))
      );
    });
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const data = getCurrentData();
    const updatedData = data.filter(item => item.id !== id);
    setCurrentData(updatedData);
    toast({
      title: "Content Deleted",
      description: "The content has been successfully deleted.",
    });
  };

  const handleSave = (formData: any) => {
    const data = getCurrentData();
    
    if (editingItem) {
      // Update existing item
      const updatedData = data.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      setCurrentData(updatedData);
      toast({
        title: "Content Updated",
        description: "The content has been successfully updated.",
      });
    } else {
      // Add new item
      const newItem: ContentItem = {
        id: Math.max(...data.map(item => item.id), 0) + 1,
        ...formData,
        views: 0
      };
      setCurrentData([...data, newItem]);
      toast({
        title: "Content Created",
        description: "New content has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const ContentForm = ({ type, item, onSave, onClose }: any) => {
    const [formData, setFormData] = useState(item || {
      title: '',
      content: '',
      category: '',
      scheduledDate: '',
      status: 'draft' as const,
      author: type === 'article' ? '' : undefined,
      text: type === 'quote' ? '' : undefined,
      readTime: type === 'article' ? '' : undefined,
      excerpt: type === 'article' ? '' : undefined
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[600px] overflow-y-auto">
        {type === 'suggestion' && (
          <>
            <div>
              <Label htmlFor="title">Suggestion Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter suggestion title"
                required
              />
            </div>
            <div>
              <Label htmlFor="content">Suggestions</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your daily suggestion..."
                rows={4}
                required
              />
            </div>
          </>
        )}

        {type === 'quote' && (
          <>
            <div>
              <Label htmlFor="text">Quote Text</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter inspirational quote..."
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Quote author"
                required
              />
            </div>
          </>
        )}

        {type === 'article' && (
          <>
            <div>
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter article title"
                required
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief article summary..."
                rows={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="content">Full Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write the full article content..."
                rows={8}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                  placeholder="e.g., 5 min"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Motivation">Motivation</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="scheduledDate">Schedule Date</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                      <Button type="submit" className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]">
              {editingItem ? 'Update Content' : 'Save Content'}
            </Button>
        </div>
      </form>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Published', variant: 'default' as const },
      scheduled: { label: 'Scheduled', variant: 'secondary' as const },
      draft: { label: 'Draft', variant: 'outline' as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderContentCards = () => {
    const filteredData = getFilteredData();
    
    if (activeTab === 'suggestions') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((suggestion) => (
            <Card key={suggestion.id} className="border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                  {getStatusBadge(suggestion.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{suggestion.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{suggestion.category}</span>
                  <span>{suggestion.scheduledDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{suggestion.views} views</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(suggestion)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => handleDelete(suggestion.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (activeTab === 'quotes') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((quote) => (
            <Card key={quote.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  {getStatusBadge(quote.status)}
                </div>
                <blockquote className="text-lg italic mb-4">"{quote.text}"</blockquote>
                <div className="text-right text-gray-600 mb-4">— {quote.author}</div>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{quote.category}</span>
                  <span>{quote.scheduledDate}</span>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(quote)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600"
                    onClick={() => handleDelete(quote.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (activeTab === 'articles') {
      return (
        <div className="space-y-4">
          {filteredData.map((article) => (
            <Card key={article.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-3">{article.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {article.author}</span>
                      <span>{article.readTime} read</span>
                      <span>{article.publishDate}</span>
                      <Badge variant="secondary">{article.category}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(article.status)}
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage daily suggestions, quotes, and educational content</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Daily Suggestions</span>
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center space-x-2">
            <Quote className="w-4 h-4" />
            <span>Motivational Quotes</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Educational Articles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search suggestions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={isDialogOpen && dialogType === 'suggestion'} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]"
                  onClick={() => {
                    setDialogType('suggestion');
                    handleAddNew();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Suggestion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Daily Suggestion' : 'Create Daily Suggestion'}
                  </DialogTitle>
                </DialogHeader>
                <ContentForm 
                  type="suggestion"
                  item={editingItem}
                  onSave={handleSave} 
                  onClose={() => setIsDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
          {renderContentCards()}
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search quotes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={isDialogOpen && dialogType === 'quote'} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]"
                  onClick={() => {
                    setDialogType('quote');
                    handleAddNew();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Motivational Quote' : 'Add Motivational Quote'}
                  </DialogTitle>
                </DialogHeader>
                <ContentForm 
                  type="quote"
                  item={editingItem}
                  onSave={handleSave} 
                  onClose={() => setIsDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
          {renderContentCards()}
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={isDialogOpen && dialogType === 'article'} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]"
                  onClick={() => {
                    setDialogType('article');
                    handleAddNew();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Educational Article' : 'Create Educational Article'}
                  </DialogTitle>
                </DialogHeader>
                <ContentForm 
                  type="article"
                  item={editingItem}
                  onSave={handleSave} 
                  onClose={() => setIsDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
          {renderContentCards()}
        </TabsContent>
      </Tabs>
    </div>
  );
};