import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  MessageSquare, 
  Plus, 
  Users, 
  Clock, 
  Pin,
  Lock,
  TrendingUp,
  MessageCircle,
  Search
} from 'lucide-react';

const Forum = () => {
  const { user } = useContext(AuthContext);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    category: ''
  });

  const categories = [
    'Quran & Tafsir', 'Hadith Studies', 'Fiqh & Islamic Law', 'Islamic History',
    'Seerah', 'Islamic Finance', 'Community Events', 'General Discussion',
    'New Muslim Support', 'Islamic Education', 'Marriage & Family', 'Youth Corner'
  ];

  // Mock forum topics
  const mockTopics = [
    {
      id: '1',
      title: 'Understanding Surah Al-Baqarah - Verse by Verse Study',
      description: 'Join our weekly discussion on the meanings and lessons from Surah Al-Baqarah. We explore each verse with authentic tafsir.',
      category: 'Quran & Tafsir',
      creator_id: 'user1',
      creator_name: 'Sheikh Ahmad Hassan',
      posts_count: 45,
      last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      is_pinned: true,
      is_locked: false,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Halal Investment Options in 2024',
      description: 'Discuss Shariah-compliant investment opportunities, Islamic banking, and ethical finance options available this year.',
      category: 'Islamic Finance',
      creator_id: 'user2',
      creator_name: 'Dr. Fatima Al-Zahra',
      posts_count: 28,
      last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      is_pinned: false,
      is_locked: false,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'New Muslim Resources and Support',
      description: 'A dedicated space for new Muslims to ask questions, share experiences, and get support from the community.',
      category: 'New Muslim Support',
      creator_id: 'user3',
      creator_name: 'Sister Aisha Mohammed',
      posts_count: 67,
      last_activity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      is_pinned: true,
      is_locked: false,
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      title: 'Youth Islamic Programs and Activities',
      description: 'Organizing and discussing Islamic activities for young Muslims. Share ideas for engaging youth in Islamic learning.',
      category: 'Youth Corner',
      creator_id: 'user4',
      creator_name: 'Brother Omar Suleiman',
      posts_count: 23,
      last_activity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      is_pinned: false,
      is_locked: false,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      title: 'Marriage and Family in Islam - Q&A',
      description: 'Discussion about Islamic guidance on marriage, raising children, and family relationships according to Quran and Sunnah.',
      category: 'Marriage & Family',
      creator_id: 'user5',
      creator_name: 'Imam Abdullah Rahman',
      posts_count: 52,
      last_activity: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      is_pinned: false,
      is_locked: false,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      // In real implementation: const response = await axios.get('/forum/topics');
      setTopics(mockTopics);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    try {
      // In real implementation: const response = await axios.post('/forum/topics', newTopic);
      const topic = {
        id: Date.now().toString(),
        ...newTopic,
        creator_id: user.id,
        creator_name: user.full_name,
        posts_count: 0,
        last_activity: new Date().toISOString(),
        is_pinned: false,
        is_locked: false,
        created_at: new Date().toISOString()
      };
      
      setTopics([topic, ...topics]);
      setNewTopic({ title: '', description: '', category: '' });
      setShowCreateTopic(false);
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTopics = filteredTopics.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.last_activity) - new Date(a.last_activity);
  });

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Quran & Tafsir': 'bg-green-100 text-green-800',
      'Hadith Studies': 'bg-blue-100 text-blue-800',
      'Fiqh & Islamic Law': 'bg-purple-100 text-purple-800',
      'Islamic History': 'bg-orange-100 text-orange-800',
      'Seerah': 'bg-teal-100 text-teal-800',
      'Islamic Finance': 'bg-emerald-100 text-emerald-800',
      'Community Events': 'bg-pink-100 text-pink-800',
      'General Discussion': 'bg-gray-100 text-gray-800',
      'New Muslim Support': 'bg-yellow-100 text-yellow-800',
      'Islamic Education': 'bg-indigo-100 text-indigo-800',
      'Marriage & Family': 'bg-rose-100 text-rose-800',
      'Youth Corner': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content-wrapper">
          <div className="container-custom">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-1 mb-2">Community Forum</h1>
            <p className="text-muted">
              Engage in meaningful discussions about Islam, community, and life
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-emerald-100 rounded-lg dark:bg-emerald-900 mr-4">
                  <MessageSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Total Topics</p>
                  <p className="text-2xl font-bold">{topics.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900 mr-4">
                  <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Total Posts</p>
                  <p className="text-2xl font-bold">{topics.reduce((sum, topic) => sum + topic.posts_count, 0)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900 mr-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900 mr-4">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Active Today</p>
                  <p className="text-2xl font-bold">
                    {topics.filter(t => new Date(t.last_activity) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={showCreateTopic} onOpenChange={setShowCreateTopic}>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Topic
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Topic</DialogTitle>
                      <DialogDescription>
                        Start a new discussion in the community forum
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          placeholder="Enter topic title..."
                          value={newTopic.title}
                          onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Select 
                          value={newTopic.category} 
                          onValueChange={(value) => setNewTopic({...newTopic, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          placeholder="Describe what this topic is about..."
                          value={newTopic.description}
                          onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                          rows={4}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowCreateTopic(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateTopic}
                          disabled={!newTopic.title || !newTopic.category || !newTopic.description}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Create Topic
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Topics List */}
          {sortedTopics.length > 0 ? (
            <div className="space-y-4">
              {sortedTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {topic.creator_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg cursor-pointer hover:text-emerald-600">
                              {topic.title}
                            </h3>
                            {topic.is_pinned && (
                              <Pin className="h-4 w-4 text-emerald-600" />
                            )}
                            {topic.is_locked && (
                              <Lock className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </div>

                        <p className="text-muted text-sm mb-3 line-clamp-2">
                          {topic.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted">
                            <Badge className={getCategoryColor(topic.category)}>
                              {topic.category}
                            </Badge>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              By {topic.creator_name}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {topic.posts_count} posts
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatTimeAgo(topic.last_activity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="heading-3 mb-2">No topics found</h3>
                <p className="text-muted mb-4">
                  {searchQuery || selectedCategory 
                    ? "No topics match your search criteria"
                    : "Be the first to start a discussion in the forum"
                  }
                </p>
                <Button 
                  onClick={() => setShowCreateTopic(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Topic
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Forum Guidelines */}
          <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Forum Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">✅ Do:</h4>
                  <ul className="space-y-1">
                    <li>• Be respectful and kind</li>
                    <li>• Provide authentic Islamic sources</li>
                    <li>• Stay on topic</li>
                    <li>• Help and support others</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">❌ Don't:</h4>
                  <ul className="space-y-1">
                    <li>• Post inappropriate content</li>
                    <li>• Argue without evidence</li>
                    <li>• Share unverified information</li>
                    <li>• Discriminate or harass</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Forum;