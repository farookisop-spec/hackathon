import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Settings, 
  Users, 
  FileText, 
  MessageSquare, 
  Megaphone,
  Building,
  BarChart3,
  Shield,
  Database,
  Activity,
  UserCheck,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsResponse, usersResponse, postsResponse] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/users?limit=10'),
        axios.get('/posts?limit=10')
      ]);
      
      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="page-wrapper">
        <div className="content-wrapper">
          <div className="container-custom">
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Access Denied
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You need administrator privileges to access this page
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="heading-1 mb-2">Admin Panel</h1>
            <p className="text-muted">
              Manage users, content, and community settings
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900 mr-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Total Users</p>
                  <p className="text-2xl font-bold">{stats.total_members || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900 mr-4">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Total Posts</p>
                  <p className="text-2xl font-bold">{stats.total_posts || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900 mr-4">
                  <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Active Today</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900 mr-4">
                  <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Reports</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="businesses">Businesses</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Users Management */}
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      User Management
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Add User
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar_url} alt={user.full_name} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                              {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{user.full_name}</h4>
                            <p className="text-sm text-muted">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="capitalize">
                                {user.role}
                              </Badge>
                              {user.is_verified && (
                                <Badge className="bg-green-100 text-green-800">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posts Management */}
            <TabsContent value="posts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Posts Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                {post.author_name?.split(' ').map(n => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{post.author_name}</p>
                              <p className="text-xs text-muted">
                                {new Date(post.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {post.post_type}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              Moderate
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted">
                          <span>{post.likes_count} likes</span>
                          <span>{post.comments_count} comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Announcements Management */}
            <TabsContent value="announcements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Megaphone className="h-5 w-5 mr-2" />
                      Announcements
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Create Announcement
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted">No announcements yet</p>
                    <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                      Create First Announcement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Businesses Management */}
            <TabsContent value="businesses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Business Directory
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Add Business
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted">No businesses pending approval</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Management */}
            <TabsContent value="reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Reports & Moderation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-800">Inappropriate Content Report</h4>
                          <p className="text-sm text-red-600">Post reported for violating community guidelines</p>
                          <p className="text-xs text-red-500 mt-1">Reported 2 hours ago by Sister Fatima</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-red-300">
                            Review
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg border-yellow-200 bg-yellow-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-yellow-800">Spam Report</h4>
                          <p className="text-sm text-yellow-600">User posting excessive promotional content</p>
                          <p className="text-xs text-yellow-500 mt-1">Reported 5 hours ago by Brother Ahmed</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-yellow-300">
                            Review
                          </Button>
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      General Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Community Name</label>
                      <Input defaultValue="Islamic Community" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Community Description</label>
                      <Input defaultValue="Connect, Learn, and Grow Together" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Email</label>
                      <Input defaultValue="admin@islamiccommunity.com" />
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Database Status:</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">API Status:</span>
                        <Badge className="bg-green-100 text-green-800">Operational</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Last Backup:</span>
                        <span>2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Server Load:</span>
                        <span>32%</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline" className="w-full">
                        View System Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;