import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
  Search as SearchIcon, 
  Users, 
  MessageCircle, 
  UserPlus, 
  MapPin,
  Calendar,
  Star,
  Filter
} from 'lucide-react';

const Search = () => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { toast } = useToast();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
        setSearchPerformed(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchPerformed(true);

    try {
      const response = await axios.get(`/users?search=${encodeURIComponent(searchQuery)}&limit=20`);
      setSearchResults(response.data.filter(result => result.id !== user?.id));
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUser = (userId) => {
    // In real implementation, this would call follow API
    toast({
      title: "User followed!",
      description: "You are now following this user.",
    });
  };

  const handleMessageUser = (userId) => {
    // In real implementation, this would redirect to messages with this user
    toast({
      title: "Feature coming soon",
      description: "Direct messaging will be available soon.",
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'mentor': return 'bg-blue-100 text-blue-800';
      case 'mentee': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-1 mb-2">Community Search</h1>
            <p className="text-muted">
              Find and connect with community members based on skills, interests, location, and more
            </p>
          </div>

          {/* Search Box */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SearchIcon className="h-5 w-5 mr-2" />
                Search Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, skills, interests, bio, or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="member-search-input"
                  />
                </div>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Search Suggestions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted">Try searching for:</span>
                {['mentor', 'quran', 'pakistan', 'software', 'islamic finance', 'teacher'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {/* Search Results */}
          {searchPerformed && !loading && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Search Results {searchResults.length > 0 && `(${searchResults.length})`}
                </h2>
                {searchQuery && (
                  <p className="text-muted">
                    Searching for "{searchQuery}"
                  </p>
                )}
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((member) => (
                    <Card key={member.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        {/* Profile Header */}
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={member.avatar_url} alt={member.full_name} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                              {member.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{member.full_name}</h3>
                            <Badge className={`${getRoleColor(member.role)} text-xs capitalize`}>
                              {member.role}
                            </Badge>
                            {member.is_verified && (
                              <Badge variant="default" className="bg-emerald-600 text-xs ml-1">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        {member.bio && (
                          <p className="text-sm text-muted mb-3 line-clamp-2">
                            {member.bio}
                          </p>
                        )}

                        {/* Location & Date */}
                        <div className="space-y-1 mb-4 text-xs text-muted">
                          {member.country && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {member.country}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {new Date(member.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>

                        {/* Skills */}
                        {member.skills && member.skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-muted mb-2">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {member.skills.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{member.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Interests */}
                        {member.interests && member.interests.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-muted mb-2">Interests:</p>
                            <div className="flex flex-wrap gap-1">
                              {member.interests.slice(0, 3).map((interest, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                              {member.interests.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{member.interests.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4 py-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <p className="font-semibold">{member.posts_count || 0}</p>
                            <p className="text-muted">Posts</p>
                          </div>
                          <div>
                            <p className="font-semibold">{member.followers_count || 0}</p>
                            <p className="text-muted">Followers</p>
                          </div>
                          <div>
                            <p className="font-semibold">{member.following_count || 0}</p>
                            <p className="text-muted">Following</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleFollowUser(member.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            size="sm"
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Follow
                          </Button>
                          <Button
                            onClick={() => handleMessageUser(member.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="heading-3 mb-2">No members found</h3>
                    <p className="text-muted mb-4">
                      No community members match your search criteria. Try different keywords or check your spelling.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={() => setSearchQuery('')}
                        variant="outline"
                      >
                        Clear Search
                      </Button>
                      <Button 
                        onClick={() => setSearchQuery('mentor')}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Browse Mentors
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Welcome State */}
          {!searchPerformed && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Search Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SearchIcon className="h-5 w-5 mr-2" />
                    Search Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-1">Find by Skills</h4>
                      <p className="text-muted">Search for "programming", "design", "teaching", etc.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Find by Interests</h4>
                      <p className="text-muted">Search for "quran", "hadith", "islamic finance", etc.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Find by Location</h4>
                      <p className="text-muted">Search for country names like "Pakistan", "USA", etc.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Find by Role</h4>
                      <p className="text-muted">Search for "mentor", "mentee", or "member"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Searches */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Popular Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { term: 'Islamic Finance Mentors', count: '24 members' },
                      { term: 'Quran Teachers', count: '18 members' },
                      { term: 'Software Engineers', count: '32 members' },
                      { term: 'Community Leaders', count: '15 members' },
                      { term: 'Students', count: '45 members' },
                      { term: 'Entrepreneurs', count: '28 members' }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        onClick={() => setSearchQuery(item.term.toLowerCase())}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <span className="font-medium">{item.term}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;