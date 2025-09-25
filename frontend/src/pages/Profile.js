import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
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
  Edit,
  Save,
  X,
  MapPin,
  Calendar,
  Users,
  FileText,
  Heart,
  MessageCircle,
  Plus,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe
} from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const { toast } = useToast();

  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      let profileData;
      if (isOwnProfile) {
        profileData = user;
      } else {
        const response = await axios.get(`/users/${userId}`);
        profileData = response.data;
      }
      setProfile(profileData);
      
      // Fetch user's posts
      const postsResponse = await axios.get('/posts?limit=50');
      const filteredPosts = postsResponse.data.filter(post => post.author_id === profileData.id);
      setUserPosts(filteredPosts);
    } catch (error) {
      toast({
        title: "Error loading profile",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('/users/me', profile);
      setProfile(response.data);
      setUser(response.data);
      setIsEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'website': return Globe;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'github': return Github;
      default: return ExternalLink;
    }
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

  if (!profile) {
    return (
      <div className="page-wrapper">
        <div className="content-wrapper">
          <div className="container-custom">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="heading-3 mb-2">User not found</h3>
                <p className="text-muted">The profile you're looking for doesn't exist.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  {/* Avatar and Basic Info */}
                  <div className="text-center mb-6">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl">
                        {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={profile.full_name}
                          onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                          placeholder="Full Name"
                          data-testid="profile-name-input"
                        />
                        <Select 
                          value={profile.role} 
                          onValueChange={(value) => setProfile({...profile, role: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Community Member</SelectItem>
                            <SelectItem value="mentor">Mentor</SelectItem>
                            <SelectItem value="mentee">Mentee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-2xl font-bold mb-2">{profile.full_name}</h1>
                        <Badge variant="secondary" className="mb-2 capitalize">
                          {profile.role}
                        </Badge>
                        {profile.is_verified && (
                          <Badge variant="default" className="bg-emerald-600 mb-2">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-xl font-bold">{profile.posts_count || 0}</p>
                      <p className="text-sm text-muted">Posts</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{profile.followers_count || 0}</p>
                      <p className="text-sm text-muted">Followers</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{profile.following_count || 0}</p>
                      <p className="text-sm text-muted">Following</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">About</h3>
                    {isEditing ? (
                      <Textarea
                        value={profile.bio || ''}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                        data-testid="profile-bio-input"
                      />
                    ) : (
                      <p className="text-sm text-muted">
                        {profile.bio || 'No bio added yet.'}
                      </p>
                    )}
                  </div>

                  {/* Location and Details */}
                  <div className="space-y-3 mb-6">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={profile.country || ''}
                          onChange={(e) => setProfile({...profile, country: e.target.value})}
                          placeholder="Country"
                          data-testid="profile-country-input"
                        />
                        <Select 
                          value={profile.gender || ''} 
                          onValueChange={(value) => setProfile({...profile, gender: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="date"
                          value={profile.date_of_birth ? profile.date_of_birth.split('T')[0] : ''}
                          onChange={(e) => setProfile({...profile, date_of_birth: e.target.value ? new Date(e.target.value) : null})}
                          data-testid="profile-birthday-input"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {profile.country && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted" />
                            {profile.country}
                          </div>
                        )}
                        {profile.date_of_birth && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted" />
                            {calculateAge(profile.date_of_birth)} years old
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted" />
                          Joined {formatDate(profile.created_at)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {isOwnProfile ? (
                      <>
                        {isEditing ? (
                          <div className="flex space-x-2">
                            <Button 
                              onClick={handleSaveProfile}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              data-testid="save-profile-button"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button 
                              onClick={() => {setIsEditing(false); fetchProfile();}}
                              variant="outline"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => setIsEditing(true)}
                            className="w-full"
                            variant="outline"
                            data-testid="edit-profile-button"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Follow
                        </Button>
                        <Button className="w-full" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Interests */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Skills & Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Skills</h4>
                    {isEditing && (
                      <div className="flex space-x-2 mb-3">
                        <Input
                          placeholder="Add a skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        />
                        <Button onClick={handleAddSkill} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          {isEditing && (
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => handleRemoveSkill(skill)}
                            />
                          )}
                        </Badge>
                      ))}
                      {(!profile.skills || profile.skills.length === 0) && (
                        <p className="text-sm text-muted">No skills added yet</p>
                      )}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h4 className="font-medium mb-3">Interests</h4>
                    {isEditing && (
                      <div className="flex space-x-2 mb-3">
                        <Input
                          placeholder="Add an interest"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                        />
                        <Button onClick={handleAddInterest} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {profile.interests?.map((interest, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {interest}
                          {isEditing && (
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => handleRemoveInterest(interest)}
                            />
                          )}
                        </Badge>
                      ))}
                      {(!profile.interests || profile.interests.length === 0) && (
                        <p className="text-sm text-muted">No interests added yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              {(profile.social_links && Object.keys(profile.social_links).length > 0) && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(profile.social_links).map(([platform, url]) => {
                        const Icon = getSocialIcon(platform);
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </a>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Posts */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Posts by {isOwnProfile ? 'You' : profile.full_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userPosts.length > 0 ? (
                    <div className="space-y-6">
                      {userPosts.map((post) => (
                        <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={`text-xs ${
                              post.post_type === 'General Feed' ? 'bg-blue-100 text-blue-800' :
                              post.post_type === 'Opportunity' ? 'bg-green-100 text-green-800' :
                              post.post_type === 'Question' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {post.post_type}
                            </Badge>
                            <span className="text-sm text-muted">
                              {formatDate(post.created_at)}
                            </span>
                          </div>
                          
                          <p className="text-gray-800 dark:text-gray-200 mb-3">
                            {post.content}
                          </p>
                          
                          {post.image_url && (
                            <img 
                              src={post.image_url} 
                              alt="Post image" 
                              className="mb-3 rounded-lg max-w-full h-auto"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-muted">
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {post.likes_count} likes
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments_count} comments
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="heading-3 mb-2">No posts yet</h3>
                      <p className="text-muted">
                        {isOwnProfile 
                          ? "Share your first post with the community!" 
                          : `${profile.full_name} hasn't posted anything yet.`
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;