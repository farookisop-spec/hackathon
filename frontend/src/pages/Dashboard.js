import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
  Users, 
  GraduationCap, 
  MessageCircle, 
  FileText, 
  Plus,
  Search,
  BookOpen,
  Calculator,
  Bot,
  TrendingUp,
  Calendar,
  Heart
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, postsResponse] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/posts?limit=5')
      ]);
      
      setStats(statsResponse.data);
      setRecentPosts(postsResponse.data);
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Share a Post",
      description: "Share your thoughts with the community",
      icon: Plus,
      href: "/feed",
      color: "bg-emerald-500",
    },
    {
      title: "Find Connections", 
      description: "Connect with other community members",
      icon: Search,
      href: "/search",
      color: "bg-blue-500",
    },
    {
      title: "Start Learning",
      description: "Explore Islamic knowledge and courses",
      icon: BookOpen,
      href: "/learning", 
      color: "bg-purple-500",
    },
    {
      title: "Ask our AI",
      description: "Get Islamic guidance from our AI assistant",
      icon: Bot,
      href: "/bot",
      color: "bg-orange-500",
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="heading-1 mb-2">
              Assalamu Alaikum, {user?.full_name?.split(' ')[0] || 'Brother/Sister'}! 👋
            </h1>
            <p className="text-muted">
              Welcome back to the Islamic Community. May your day be blessed.
            </p>
            
            {/* Profile Completion Prompt */}
            {(!user?.bio || !user?.country) && (
              <Card className="mt-4 border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-emerald-700 dark:text-emerald-300">
                        Complete Your Profile
                      </h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Add your bio and location for a better community experience
                      </p>
                    </div>
                    <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Link to="/profile">Complete Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow" data-testid="stats-total-members">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-emerald-100 rounded-lg dark:bg-emerald-900">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted">Total Members</p>
                  <p className="text-2xl font-bold">{stats?.total_members?.toLocaleString() || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow" data-testid="stats-mentors">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted">Mentors</p>
                  <p className="text-2xl font-bold">{stats?.mentors?.toLocaleString() || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow" data-testid="stats-mentees">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted">Mentees</p>
                  <p className="text-2xl font-bold">{stats?.mentees?.toLocaleString() || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow" data-testid="stats-total-posts">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                  <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted">Total Posts</p>
                  <p className="text-2xl font-bold">{stats?.total_posts?.toLocaleString() || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Get started with these popular community features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          asChild
                          variant="ghost"
                          className="h-auto p-4 justify-start hover:bg-gray-50 dark:hover:bg-gray-800"
                          data-testid={`quick-action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link to={action.href}>
                            <div className={`p-2 rounded-lg ${action.color} mr-4`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">{action.title}</p>
                              <p className="text-sm text-muted">{action.description}</p>
                            </div>
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Feed */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Recent Community Activity
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/feed">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentPosts.length > 0 ? (
                    <div className="space-y-4">
                      {recentPosts.map((post) => (
                        <div key={post.id} className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                              {post.author_name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium">{post.author_name}</p>
                              <Badge variant="secondary" className="text-xs">
                                {post.author_role}
                              </Badge>
                              <span className="text-xs text-muted">
                                {formatDate(post.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-muted line-clamp-2 mt-1">
                              {post.content}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-muted flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                {post.likes_count}
                              </span>
                              <span className="text-xs text-muted flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {post.comments_count}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted">No recent posts yet</p>
                      <Button asChild className="mt-4" size="sm">
                        <Link to="/feed">Be the first to post!</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                        {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{user?.full_name}</h3>
                    <Badge variant="secondary" className="mt-1 capitalize">
                      {user?.role}
                    </Badge>
                    {user?.country && (
                      <p className="text-sm text-muted mt-2">{user.country}</p>
                    )}
                    {user?.bio && (
                      <p className="text-sm text-muted mt-2 line-clamp-3">{user.bio}</p>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 w-full mt-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">{user?.posts_count || 0}</p>
                        <p className="text-xs text-muted">Posts</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{user?.followers_count || 0}</p>
                        <p className="text-xs text-muted">Followers</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{user?.following_count || 0}</p>
                        <p className="text-xs text-muted">Following</p>
                      </div>
                    </div>

                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link to="/profile">Edit Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Islamic Tools Quick Access */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Islamic Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                      <Link to="/tools">
                        <Calculator className="h-4 w-4 mr-2" />
                        Zakat Calculator
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                      <Link to="/quran">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read Quran
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                      <Link to="/hadith">
                        <Heart className="h-4 w-4 mr-2" />
                        Browse Hadith
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                      <Link to="/duas">
                        <Heart className="h-4 w-4 mr-2" />
                        Daily Duas
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;