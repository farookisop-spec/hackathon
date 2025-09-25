import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Megaphone, 
  Calendar, 
  AlertTriangle, 
  Info, 
  Heart, 
  Users,
  MapPin,
  Clock
} from 'lucide-react';

const Announcements = () => {
  const { user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock announcements data
  const mockAnnouncements = [
    {
      id: '1',
      title: 'Janazah Prayer - Brother Ahmad Hassan',
      content: 'Inna lillahi wa inna ilayhi raji\'un. We inform the community about the passing of our beloved brother Ahmad Hassan. Janazah prayer will be held after Maghrib at the Central Mosque.\n\nPlease keep the family in your duas during this difficult time.',
      author_id: 'admin1',
      author_name: 'Imam Abdullah',
      announcement_type: 'Janazah',
      priority: 'Urgent',
      is_active: true,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    },
    {
      id: '2', 
      title: 'Monthly Charity Drive - Support Palestine',
      content: 'Assalamu alaikum brothers and sisters,\n\nOur monthly charity drive is now underway to support our Palestinian brothers and sisters. This month we aim to raise $10,000 for medical supplies and food.\n\nDonation boxes are available at the mosque, or you can donate online through our secure portal.\n\nMay Allah reward all contributors. Barakallahu feekum!',
      author_id: 'admin2',
      author_name: 'Sister Fatima Ahmed',
      announcement_type: 'Charity',
      priority: 'High',
      is_active: true,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    },
    {
      id: '3',
      title: 'Islamic Finance Workshop - This Saturday',
      content: 'Join us for an enlightening workshop on Islamic Banking and Finance principles.\n\n📅 Date: Saturday, March 30th, 2024\n🕐 Time: 2:00 PM - 6:00 PM\n📍 Location: Community Center Hall A\n\nTopics covered:\n- Riba and its alternatives\n- Islamic investment principles\n- Halal business practices\n- Q&A session with Islamic scholars\n\nRefreshments will be provided. Please register by Thursday.',
      author_id: 'admin1',
      author_name: 'Dr. Omar Suleiman',
      announcement_type: 'Event',
      priority: 'Normal',
      is_active: true,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    },
    {
      id: '4',
      title: 'Ramadan Preparation - Community Iftar Planning',
      content: 'As Ramadan approaches, we are organizing community Iftars every Friday during the blessed month.\n\nWe need volunteers for:\n- Food preparation\n- Setup and cleanup\n- Children\'s activities\n- Transportation assistance\n\nPlease sign up with Sister Aisha at the registration desk or contact the mosque office.\n\nJazakallahu khairan for your service to the community!',
      author_id: 'admin3',
      author_name: 'Community Coordinator',
      announcement_type: 'General',
      priority: 'Normal',
      is_active: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days from now
    },
    {
      id: '5',
      title: 'Youth Islamic Quiz Competition',
      content: 'Exciting news for our young community members!\n\nWe are organizing an Islamic Knowledge Quiz Competition for ages 12-18.\n\n🏆 Prizes:\n1st Place: $200 + Islamic book collection\n2nd Place: $150 + Islamic book set\n3rd Place: $100 + Quran with translation\n\nRegistration deadline: April 15th\nCompetition date: April 22nd, 2024\n\nTopics: Quran, Hadith, Seerah, Islamic History, and General Islamic Knowledge.\n\nContact the youth coordinator for registration.',
      author_id: 'admin4',
      author_name: 'Youth Coordinator',
      announcement_type: 'Event',
      priority: 'Normal',
      is_active: true,
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
      expires_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() // 21 days from now
    }
  ];

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      // In real implementation, this would fetch from API
      // const response = await axios.get('/announcements');
      // setAnnouncements(response.data);
      
      // Using mock data for now
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case 'Janazah': return AlertTriangle;
      case 'Charity': return Heart;
      case 'Event': return Calendar;
      default: return Info;
    }
  };

  const getAnnouncementColor = (type, priority) => {
    if (priority === 'Urgent') return 'border-red-500 bg-red-50';
    if (priority === 'High') return 'border-orange-500 bg-orange-50';
    
    switch (type) {
      case 'Janazah': return 'border-gray-500 bg-gray-50';
      case 'Charity': return 'border-green-500 bg-green-50';
      case 'Event': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Janazah': return 'bg-gray-100 text-gray-800';
      case 'Charity': return 'bg-green-100 text-green-800';
      case 'Event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
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
            <h1 className="heading-1 mb-2">Community Announcements</h1>
            <p className="text-muted">
              Stay updated with important community news, events, and announcements
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900 mr-4">
                  <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Total</p>
                  <p className="text-2xl font-bold">{announcements.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900 mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Urgent</p>
                  <p className="text-2xl font-bold">
                    {announcements.filter(a => a.priority === 'Urgent').length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900 mr-4">
                  <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Charity</p>
                  <p className="text-2xl font-bold">
                    {announcements.filter(a => a.announcement_type === 'Charity').length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900 mr-4">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Events</p>
                  <p className="text-2xl font-bold">
                    {announcements.filter(a => a.announcement_type === 'Event').length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Announcements List */}
          {announcements.length > 0 ? (
            <div className="space-y-6">
              {announcements.map((announcement) => {
                const Icon = getAnnouncementIcon(announcement.announcement_type);
                const cardColor = getAnnouncementColor(announcement.announcement_type, announcement.priority);
                
                return (
                  <Card key={announcement.id} className={`border-l-4 ${cardColor} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted mb-2">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                    {announcement.author_name?.split(' ').map(n => n[0]).join('') || 'A'}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{announcement.author_name}</span>
                              </div>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {getTimeAgo(announcement.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority}
                          </Badge>
                          <Badge className={getTypeColor(announcement.announcement_type)}>
                            {announcement.announcement_type}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <div className="prose prose-sm max-w-none">
                          {announcement.content.split('\n').map((paragraph, index) => {
                            if (paragraph.trim() === '') return <br key={index} />;
                            
                            return (
                              <p key={index} className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                                {paragraph}
                              </p>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-muted">
                          <span>Posted: {formatDate(announcement.created_at)}</span>
                          {announcement.expires_at && (
                            <span className="ml-4">
                              Expires: {formatDate(announcement.expires_at)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {announcement.announcement_type === 'Charity' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Heart className="h-4 w-4 mr-1" />
                              Donate Now
                            </Button>
                          )}
                          {announcement.announcement_type === 'Event' && (
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4 mr-1" />
                              Register
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Users className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="heading-3 mb-2">No announcements yet</h3>
                <p className="text-muted">
                  Check back later for community announcements and updates
                </p>
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          {user?.role === 'admin' && (
            <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Admin Actions</h3>
                    <p className="text-sm text-muted">Manage community announcements</p>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Megaphone className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;