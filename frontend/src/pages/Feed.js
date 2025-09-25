import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { 
  Plus,
  Heart,
  MessageCircle,
  Share,
  Image as ImageIcon,
  Hash,
  Send,
  X,
  TrendingUp,
  Users
} from 'lucide-react';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    post_type: 'General Feed',
    image_url: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      setPosts(response.data);
    } catch (error) {
      toast({
        title: "Error loading posts",
        description: "Failed to load community posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPost.content.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post('/posts', newPost);
      setPosts([response.data, ...posts]);
      setNewPost({
        content: '',
        post_type: 'General Feed',
        image_url: '',
        tags: []
      });
      setShowCreatePost(false);
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community",
      });
    } catch (error) {
      toast({
        title: "Error creating post",
        description: "Failed to create your post",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newPost.tags.includes(newTag.trim())) {
      setNewPost({
        ...newPost,
        tags: [...newPost.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewPost({
      ...newPost,
      tags: newPost.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const fetchComments = async (postId) => {
    if (comments[postId]) {
      return; // Already loaded
    }
    
    try {
      const response = await axios.get(`/posts/${postId}/comments`);
      setComments(prev => ({
        ...prev,
        [postId]: response.data
      }));
    } catch (error) {
      toast({
        title: "Error loading comments",
        description: "Failed to load comments",
        variant: "destructive",
      });
    }
  };

  const handleCreateComment = async (postId) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    try {
      const response = await axios.post(`/posts/${postId}/comments`, {
        content: commentText
      });
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));
      
      setNewComment(prev => ({
        ...prev,
        [postId]: ''
      }));
      
      // Update post comment count
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ));
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    } catch (error) {
      toast({
        title: "Error posting comment",
        description: "Failed to post your comment",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPostTypeColor = (type) => {
    const colors = {
      'General Feed': 'bg-blue-100 text-blue-800',
      'Opportunity': 'bg-green-100 text-green-800',
      'Question': 'bg-yellow-100 text-yellow-800',
      'Announcement': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || colors['General Feed'];
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="heading-1">Community Feed</h1>
                  <p className="text-muted">Share and discover Islamic content</p>
                </div>
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-testid="create-post-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </div>

              {/* Create Post Form */}
              {showCreatePost && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Share with the Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreatePost} className="space-y-4">
                      <Textarea
                        placeholder="What's on your mind? Share Islamic knowledge, ask questions, or connect with the community..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        className="min-h-[100px]"
                        data-testid="post-content-input"
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select 
                          value={newPost.post_type} 
                          onValueChange={(value) => setNewPost({...newPost, post_type: value})}
                        >
                          <SelectTrigger data-testid="post-type-select">
                            <SelectValue placeholder="Post Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Feed">General Feed</SelectItem>
                            <SelectItem value="Opportunity">Opportunity</SelectItem>
                            <SelectItem value="Question">Question</SelectItem>
                            <SelectItem value="Announcement">Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input
                          placeholder="Image URL (optional)"
                          value={newPost.image_url}
                          onChange={(e) => setNewPost({...newPost, image_url: e.target.value})}
                          data-testid="post-image-input"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <div className="flex space-x-2 mb-2">
                          <Input
                            placeholder="Add tags (e.g., #quran, #hadith)"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            className="flex-1"
                          />
                          <Button type="button" onClick={handleAddTag} variant="outline">
                            <Hash className="h-4 w-4" />
                          </Button>
                        </div>
                        {newPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {newPost.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                #{tag}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => handleRemoveTag(tag)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                          <Send className="h-4 w-4 mr-2" />
                          Share Post
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCreatePost(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Posts */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar>
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {post.author_name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{post.author_name}</h3>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {post.author_role}
                            </Badge>
                            {post.author_country && (
                              <span className="text-xs text-muted">• {post.author_country}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-xs ${getPostTypeColor(post.post_type)}`}>
                              {post.post_type}
                            </Badge>
                            <span className="text-xs text-muted">{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {post.content}
                        </p>
                        
                        {post.image_url && (
                          <img 
                            src={post.image_url} 
                            alt="Post image" 
                            className="mt-3 rounded-lg max-w-full h-auto"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-muted hover:text-red-500">
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes_count}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted hover:text-emerald-600"
                            onClick={() => fetchComments(post.id)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments_count}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted hover:text-blue-600">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>

                      {/* Comments Section */}
                      {comments[post.id] && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3 mb-4">
                            {comments[post.id].map((comment) => (
                              <div key={comment.id} className="flex space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                    {comment.author_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-sm">{comment.author_name}</span>
                                    <span className="text-xs text-muted">
                                      {formatDate(comment.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Add Comment */}
                          <div className="flex space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex space-x-2">
                              <Input
                                placeholder="Write a comment..."
                                value={newComment[post.id] || ''}
                                onChange={(e) => setNewComment(prev => ({
                                  ...prev,
                                  [post.id]: e.target.value
                                }))}
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(post.id)}
                                className="flex-1"
                              />
                              <Button 
                                onClick={() => handleCreateComment(post.id)}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {posts.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="heading-3 mb-2">No posts yet</h3>
                      <p className="text-muted mb-4">Be the first to share something with the community!</p>
                      <Button 
                        onClick={() => setShowCreatePost(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Create First Post
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Trending Hashtags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Trending Hashtags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['#quran', '#hadith', '#islam', '#dua', '#sunnah', '#ramadan'].map((tag) => (
                        <div key={tag} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                          <span className="text-sm font-medium text-emerald-600">{tag}</span>
                          <span className="text-xs text-muted">24 posts</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Who to Follow */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Users className="h-5 w-5 mr-2" />
                      Who to Follow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                              M{i}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Community Member {i}</p>
                            <p className="text-xs text-muted">Islamic Scholar</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;